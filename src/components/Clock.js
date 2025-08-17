import React, { useEffect, useState } from 'react';

function formatTime(date, use24h) {
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    if (use24h) {
        return `${hours.toString().padStart(2, '0')}:${minutes}`;
    }
    const period = hours >= 12 ? 'PM' : 'AM';
    const h12 = hours % 12 || 12;
    return `${h12}:${minutes} ${period}`;
}

export default function Clock({ use24h = false }) {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(id);
    }, []);

    return (
        <div className="start-clock">
            <div className="start-clock__time">{formatTime(now, use24h)}</div>
            <div className="start-clock__date">{now.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</div>
        </div>
    );
}


