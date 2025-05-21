import jwt from "jsonwebtoken";

const isTokenExpires = (token: string): boolean => {
    try {
        const decodedToken = jwt.verify(
            token,
            process.env.JWT_SECRET!
        ) as jwt.JwtPayload;

        // Check for exp field
        if (!decodedToken.exp) return true;

        const currentTime = Math.floor(Date.now() / 1000);
        return decodedToken.exp < currentTime;
    } catch (error) {
        // If verification fails, token is treated as expired
        return true;
    }
};

export default isTokenExpires;
