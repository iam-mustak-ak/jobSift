import { useRef, useState } from "react";

const useCountdown = (initialTime: number) => {
    const [timer, setTimer] = useState(initialTime);
    const [canResend, setCanResend] = useState(true);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const startTimer = () => {
        if (timerRef.current) clearInterval(timerRef.current);

        setCanResend(false);
        setTimer(initialTime);

        timerRef.current = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    if (timerRef.current) {
                        clearInterval(timerRef.current);
                        timerRef.current = null;
                    }
                    setCanResend(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    return { timer, canResend, startTimer };
};

export default useCountdown;
