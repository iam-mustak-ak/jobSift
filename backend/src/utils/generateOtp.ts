const generateOtp = (): string => {
    const otp = Math.floor(100000 + Math.random() * 999999);
    return otp.toString();
};

export default generateOtp;
