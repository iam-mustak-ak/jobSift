import { Request } from "express";

const getUserAgent = (req: Request) => {
    const userAgent = req.useragent;
    const browser = userAgent?.browser;
    const version = userAgent?.version;
    const os = userAgent?.os;
    const platform = userAgent?.platform;

    let device = "";
    if (userAgent?.isDesktop) {
        device = "Desktop";
    } else if (userAgent?.isMobile) {
        device = "Mobile";
    } else if (userAgent?.isTablet) {
        device = "Tablet";
    } else if (userAgent?.isBot) {
        device = "Bot";
    } else {
        device = "unknown";
    }

    return {
        browser,
        version,
        os,
        platform,
        device,
    };
};

export default getUserAgent;
