import { useCallback, useEffect, useState } from "react";

const useCountdown = (initialTime: number) => {
    const [timer, setTimer] = useState(initialTime);
    const [deadline, setDeadline] = useState<number | null>(null);

    const startTimer = useCallback(() => {
        setTimer(initialTime);
        setDeadline(Date.now() + initialTime * 1000);
    }, [initialTime]);

    // The first OTP was sent immediately before this page opened, so its
    // resend cooldown should be visible from the start.
    useEffect(() => {
        startTimer();
    }, [startTimer]);

    useEffect(() => {
        if (deadline === null) return;

        const updateTimer = () => {
            const remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
            setTimer(remaining);
            if (remaining === 0) setDeadline(null);
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [deadline]);

    return { timer, canResend: timer === 0, startTimer };
};

export default useCountdown;
