import jwt from "jsonwebtoken";

const isTokenExpires = (token: string): boolean => {
    try {
        const decodedToken: any = jwt.decode(token);
        if (!decodedToken) return true;
        const currentTime = Math.floor(Date.now() / 1000);
        return decodedToken.exp < currentTime;
    } catch (error) {
        return true;
    }
};

export default isTokenExpires;
