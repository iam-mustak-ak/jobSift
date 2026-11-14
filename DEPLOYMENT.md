# Production signup troubleshooting

## This deployment: Vercel frontend and Render backend

The backend URL is `https://jobsift-sffg.onrender.com`. Set both frontend URL
variables below to that value in Vercel.

Render free services block outbound SMTP ports, including the Gmail port 465
used by this project: https://render.com/docs/free#other-limitations.
To use Gmail SMTP, run the backend on a paid Render instance or a host that
permits outbound SMTP on port 465. Changing to port 587 does not bypass Render's
free-instance restriction. Configure these backend environment variables:

```dotenv
SMTP_SENDER=your-account@gmail.com
APP_PASSWORD=your-google-app-password
```

Use a Google App Password for the same account as `SMTP_SENDER`, with 2-Step
Verification enabled. Do not use your regular Google account password.
Google setup: https://support.google.com/accounts/answer/185833.
Redeploy the backend after changing its environment. Both OTP and password reset
emails use Gmail SMTP. SMTP waits are bounded and delivery failures return a
service error. Do not configure production with placeholder values.

Signup runs in a Next.js server action and calls the Express backend at
`/auth/create-user`. The backend sends the verification email, stores the OTP in
Redis, and saves the user in MongoDB before returning success.

## Frontend environment

All browser API calls now go through `/api/backend` on the frontend domain.
The gateway forwards requests to the configured backend and returns login and
refresh cookies as frontend HttpOnly cookies. Page guards and server-rendered
pages can therefore use the same session. Keep `SERVER_URL` set to the actual
backend origin, never to the frontend domain or `/api/backend`.

After deploying this change, sign in once to establish the frontend cookies.
Existing cookies stored on the previous backend domain cannot be read by the
frontend. Session refresh is forwarded to both the browser and the current
server-rendered page. Chat and notifications use authenticated HTTP polling
through the same gateway.

If Google sign-in is enabled, register the frontend callback
`https://YOUR-FRONTEND-DOMAIN/api/backend/auth/google/callback` in Google Cloud and
set the backend's `GOOGLE_REDIRECT_URL` to that value. This ensures OAuth also
sets cookies on the frontend domain.

The gateway is subject to the frontend host's request-size and execution limits.
On Vercel, keep uploads below its function request-body limit (including multipart
overhead), even though the backend allows files up to 5 MB.

Set these in the frontend hosting dashboard for the production environment:

```dotenv
SERVER_URL=https://your-backend.example.com
NEXT_PUBLIC_SERVER_URL=https://your-backend.example.com
```

Use your actual backend URL. Preserve any base path used by your deployment, but
do not append `/auth/create-user`. `SERVER_URL` overrides the public URL for
signup. The public URL is also used by other server actions and browser requests.
Do not use `http://localhost:3001` in a separately hosted frontend: it refers to
the frontend host, not your computer or the backend host.

Redeploy the frontend after changing these values. `NEXT_PUBLIC_SERVER_URL` is
embedded in browser assets during the build, so changing only the runtime value
does not update those assets.

## Diagnose a failed request

Check the frontend server logs for `[signup]`:

- `Invalid backend configuration`: the backend URL is missing, invalid, or points
  to localhost in production.
- `Backend request failed`: inspect `code` for DNS, connection, or TLS failures.
  `timedOut: true` means the backend did not respond within 60 seconds.
- `Backend rejected request`: the backend responded; inspect its logs and the
  recorded HTTP status.

Check `https://your-backend.example.com/health` for backend reachability. This
endpoint does not verify email delivery or Redis connectivity.

If the backend receives the signup request but never completes it, check MongoDB,
email delivery, and Redis. Email currently uses `smtp.gmail.com:465`; verify that
the backend host permits outbound SMTP and that `SMTP_SENDER` and `APP_PASSWORD`
are set. If the host blocks SMTP, move the backend to an instance or host that
allows SMTP. Also verify `MONGO_URI` and `REDIS_CONNECTION_URI` in the backend
environment. Do not paste secrets into logs or support messages.

Browser CORS errors require the frontend origin in the backend's `allowedOrigins`
list. The signup server-to-server request does not use browser CORS enforcement.
