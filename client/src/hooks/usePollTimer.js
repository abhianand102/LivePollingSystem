import { useState, useEffect } from 'react';

export const usePollTimer = (startTime, duration) => {
    const [timeLeft, setTimeLeft] = useState(0);
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        if (!startTime || !duration) {
            setTimeLeft(0);
            return;
        }

        const start = new Date(startTime).getTime(); // Server time in ms
        const end = start + duration * 1000;

        const tick = () => {
            // We assume client clock and server clock are relatively synced or rely on relative time.
            // Ideally server sends "serverTime" on sync, but for this simpler scope,
            // we assume Date.now() is close enough or startTime was generated recently.
            // To be truly robust, we'd need NTP-like offset, but prompt implies simpler sync.
            // Resilience requirement: "If student joins 10 seconds late... 50s."
            // Since startTime is absolute server time (UTC), Date.now() (system time) difference works 
            // if system clocks are correct. 

            const now = Date.now();
            const difference = Math.ceil((end - now) / 1000);

            if (difference <= 0) {
                setTimeLeft(0);
                setIsExpired(true);
            } else {
                setTimeLeft(difference);
                setIsExpired(false);
            }
        };

        tick(); // Initial check
        const interval = setInterval(tick, 1000);

        return () => clearInterval(interval);
    }, [startTime, duration]);

    return { timeLeft, isExpired };
};
