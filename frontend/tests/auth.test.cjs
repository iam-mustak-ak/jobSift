/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const { test, afterEach } = require("node:test");
const ts = require("typescript");
const { NextRequest } = require("next/server");

const root = path.resolve(__dirname, "..");
function load(relative, mocks = {}) {
    const filename = path.join(root, relative);
    const instance = new Module(filename, module);
    instance.filename = filename;
    instance.paths = Module._nodeModulePaths(path.dirname(filename));
    const originalRequire = instance.require.bind(instance);
    instance.require = (name) => {
        if (name in mocks) return mocks[name];
        if (name.startsWith("@/")) return load(`${name.slice(2)}.ts`, mocks);
        if (name.startsWith(".")) {
            const target = path.resolve(path.dirname(filename), name) + ".ts";
            return load(path.relative(root, target), mocks);
        }
        return originalRequire(name);
    };
    const result = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
        compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true },
    });
    instance._compile(result.outputText, filename);
    return instance.exports;
}

const originalFetch = global.fetch;
const originalServerUrl = process.env.SERVER_URL;
afterEach(() => {
    global.fetch = originalFetch;
    if (originalServerUrl === undefined) delete process.env.SERVER_URL;
    else process.env.SERVER_URL = originalServerUrl;
});

function setup() {
    process.env.SERVER_URL = "https://backend.example.com/";
    return {
        gateway: load("app/api/backend/[...path]/route.ts"),
        guard: load("proxy.ts").default,
    };
}
function upstream(body, status = 200, cookies = []) {
    const headers = new Headers({ "Content-Type": "application/json" });
    for (const cookie of cookies) headers.append("Set-Cookie", cookie);
    return new Response(JSON.stringify(body), { status, headers });
}
function context(...segments) { return { params: Promise.resolve({ path: segments }) }; }
const user = { _id: "507f1f77bcf86cd799439011", name: "Test User", role: "candidate" };
const access = "accessToken=valid-access; Path=/; HttpOnly; Secure; SameSite=None";
const refresh = "refreshToken=valid-refresh; Path=/; HttpOnly; Secure; SameSite=None";
const cookieHeader = "accessToken=valid-access; refreshToken=valid-refresh";

test("login sets frontend cookies accepted by every protected page", async () => {
    const { gateway, guard } = setup();
    global.fetch = async (url, options) => {
        if (String(url).endsWith("/auth/login")) {
            assert.equal(options.method, "POST");
            assert.equal(JSON.parse(Buffer.from(options.body).toString()).email, "test@example.com");
            return upstream({ success: true, data: user }, 200, [access, refresh]);
        }
        assert.equal(String(url), "https://backend.example.com/auth/check-auth");
        assert.equal(new Headers(options.headers).get("cookie"), cookieHeader);
        assert.equal(options.cache, "no-store");
        return upstream({ success: true, data: user });
    };
    const result = await gateway.POST(new NextRequest("https://app.example.com/api/backend/auth/login", {
        method: "POST", headers: { Origin: "https://app.example.com", "Content-Type": "application/json" },
        body: JSON.stringify({ email: "test@example.com", password: "test-password" }),
    }), context("auth", "login"));
    assert.equal(result.status, 200);
    const cookies = result.headers.getSetCookie();
    assert.equal(cookies.length, 2);
    for (const cookie of cookies) {
        assert.match(cookie, /HttpOnly/);
        assert.match(cookie, /Secure/);
        assert.match(cookie, /SameSite=Lax/);
        assert.doesNotMatch(cookie, /Domain=/i);
    }
    for (const route of ["/build-resume", "/suggested-jobs", `/profile/${user._id}`,
        `/profile/${user._id}/saved-jobs`, `/profile/${user._id}/edit-profile`, "/analyze-resume", "/apply/job-id"]) {
        const response = await guard(new NextRequest(`https://app.example.com${route}`, { headers: { Cookie: cookieHeader } }));
        assert.equal(response.status, 200, route);
        assert.equal(response.headers.get("location"), null, route);
    }
});

test("session refresh updates the browser and the current server-rendered request", async () => {
    const { guard } = setup();
    global.fetch = async () => upstream({ success: true, data: user }, 200, [
        "accessToken=new-access; Path=/; HttpOnly; Secure",
        "refreshToken=new-refresh; Path=/; HttpOnly; Secure",
    ]);
    const result = await guard(new NextRequest("https://app.example.com/suggested-jobs", {
        headers: { Cookie: "accessToken=expired; refreshToken=old-refresh; preference=light" },
    }));
    assert.equal(result.status, 200);
    assert.equal(result.headers.getSetCookie().length, 2);
    const forwarded = result.headers.get("x-middleware-request-cookie");
    assert.match(forwarded, /accessToken=new-access/);
    assert.match(forwarded, /refreshToken=new-refresh/);
    assert.match(forwarded, /preference=light/);
    const { fetcherSever } = load("utils/fetcherSever.ts", {
        "next/headers": { cookies: async () => ({ toString: () => forwarded }) },
    });
    global.fetch = async (url, options) => {
        assert.equal(url, "https://backend.example.com/match-job");
        assert.equal(options.headers.Cookie, forwarded);
        assert.equal(options.cache, "no-store");
        return upstream({ success: true, data: [{ title: "Developer" }] });
    };
    assert.equal((await fetcherSever("/match-job")).data[0].title, "Developer");
});

test("anonymous and expired sessions redirect to login with a return path", async () => {
    const { guard } = setup();
    let calls = 0;
    global.fetch = async () => { calls++; return upstream({ success: false }, 401); };
    const anonymous = await guard(new NextRequest("https://app.example.com/build-resume?template=modern"));
    assert.equal(calls, 0);
    const location = new URL(anonymous.headers.get("location"));
    assert.equal(location.pathname, "/login");
    assert.equal(location.searchParams.get("next"), "/build-resume?template=modern");
    const expired = await guard(new NextRequest("https://app.example.com/profile/id/settings", { headers: { Cookie: cookieHeader } }));
    assert.equal(new URL(expired.headers.get("location")).pathname, "/login");
});

test("an auth service outage does not pretend the user has logged out", async () => {
    const { guard } = setup();
    for (const fetcher of [async () => upstream({ success: false }, 500), async () => { throw new Error("Network unavailable"); }]) {
        global.fetch = fetcher;
        const result = await guard(new NextRequest("https://app.example.com/build-resume", { headers: { Cookie: cookieHeader } }));
        assert.equal(result.status, 503);
        assert.equal(result.headers.get("location"), null);
    }
});

test("role restrictions and login-page redirects remain enforced", async () => {
    const { guard } = setup();
    global.fetch = async () => upstream({ success: true, data: user });
    for (const route of ["/post-job", "/edit-job/job-id", "/login", "/signup"]) {
        const result = await guard(new NextRequest(`https://app.example.com${route}`, { headers: { Cookie: cookieHeader } }));
        assert.equal(new URL(result.headers.get("location")).pathname, "/");
    }
    global.fetch = async () => upstream({ success: true, data: { ...user, role: "recruiter" } });
    const post = await guard(new NextRequest("https://app.example.com/post-job", { headers: { Cookie: cookieHeader } }));
    assert.equal(post.status, 200);
    const apply = await guard(new NextRequest("https://app.example.com/apply/job-id", { headers: { Cookie: cookieHeader } }));
    assert.equal(new URL(apply.headers.get("location")).pathname, "/find-jobs");
});

test("gateway preserves multipart uploads and backend error status", async () => {
    const { gateway } = setup();
    const form = new FormData();
    form.append("image", new Blob(["image-bytes"], { type: "image/png" }), "photo.png");
    global.fetch = async (url, options) => {
        assert.equal(String(url), "https://backend.example.com/image?type=profile");
        assert.match(options.headers.get("content-type"), /^multipart\/form-data; boundary=/);
        assert.equal(options.headers.get("cookie"), cookieHeader);
        assert.match(Buffer.from(options.body).toString(), /image-bytes/);
        return upstream({ success: false, message: "Image storage rejected upload" }, 502);
    };
    const result = await gateway.POST(new NextRequest("https://app.example.com/api/backend/image?type=profile", {
        method: "POST", headers: { Cookie: cookieHeader }, body: form,
    }), context("image"));
    assert.equal(result.status, 502);
    assert.equal((await result.json()).message, "Image storage rejected upload");
});

test("Socket.IO polling retains its trailing slash, query and cookies", async () => {
    const { gateway } = setup();
    global.fetch = async (url, options) => {
        assert.equal(String(url), "https://backend.example.com/socket.io/?EIO=4&transport=polling");
        assert.equal(options.headers.get("cookie"), cookieHeader);
        return new Response("0{\"sid\":\"test\"}", { headers: { "Content-Type": "text/plain" } });
    };
    const result = await gateway.GET(new NextRequest("https://app.example.com/api/backend/socket.io?EIO=4&transport=polling", {
        headers: { Cookie: cookieHeader },
    }), context("socket.io"));
    assert.match(await result.text(), /sid/);
});

test("logout clears frontend cookies", async () => {
    const { gateway } = setup();
    global.fetch = async () => upstream({ success: true }, 200, [
        "accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT",
        "refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT",
    ]);
    const result = await gateway.GET(new NextRequest("https://app.example.com/api/backend/auth/logout", {
        headers: { Cookie: cookieHeader },
    }), context("auth", "logout"));
    assert.equal(result.headers.getSetCookie().length, 2);
    assert.match(result.headers.getSetCookie()[0], /Expires=Thu, 01 Jan 1970/);
});

test("gateway rejects foreign mutation origins before contacting the API", async () => {
    const { gateway } = setup();
    global.fetch = async () => { throw new Error("Must not reach backend"); };
    const result = await gateway.POST(new NextRequest("https://app.example.com/api/backend/auth/login", {
        method: "POST", headers: { Origin: "https://foreign.example.com" }, body: "{}",
    }), context("auth", "login"));
    assert.equal(result.status, 403);
});

test("server actions persist refreshed credentials as frontend HttpOnly cookies", async () => {
    setup();
    const stored = [];
    const { persistBackendCookies } = load("lib/serverSession.ts", {
        "next/headers": { cookies: async () => ({ set: (...args) => stored.push(args) }) },
    });
    const headers = new Headers();
    headers.append("Set-Cookie", `${access}; Max-Age=300`);
    headers.append("Set-Cookie", `${refresh}; Max-Age=432000`);
    await persistBackendCookies(headers);
    assert.equal(stored.length, 2);
    assert.equal(stored[0][0], "accessToken");
    assert.equal(stored[0][1], "valid-access");
    assert.equal(stored[0][2].httpOnly, true);
    assert.equal(stored[0][2].sameSite, "lax");
    assert.equal(stored[0][2].maxAge, 300);
});
