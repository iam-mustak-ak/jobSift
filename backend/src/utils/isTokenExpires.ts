import jwt from "jsonwebtoken";

const isTokenExpires = (token: string): boolean => {
    const decoded: any = jwt.decode(token);
    if (!decoded || !decoded.exp) return true;
    return decoded.exp * 1000 < Date.now();
};
export default isTokenExpires;
