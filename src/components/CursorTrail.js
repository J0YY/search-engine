import React, { useEffect, useState } from 'react';
import useLocalStorage from '../useLocalStorage';

export default function CursorTrail() {
    const [enabled] = useLocalStorage('start.modes.trail', false);
    const [bits, setBits] = useState([]);

    useEffect(() => {
        if (!enabled) return;
        const onMove = (e) => {
            const id = Math.random().toString(36).slice(2);
            const emojis = ['✨','💖','⭐','🫧','💫'];
            const emoji = emojis[Math.floor(Math.random() * emojis.length)];
            setBits(prev => [...prev.slice(-80), { id, x: e.clientX, y: e.clientY, emoji }]);
            setTimeout(() => setBits(prev => prev.filter(b => b.id !== id)), 800);
        };
        window.addEventListener('mousemove', onMove);
        return () => window.removeEventListener('mousemove', onMove);
    }, [enabled]);

    if (!enabled) return null;

    return (
        <div className="cursor-trail" aria-hidden>
            {bits.map(b => (
                <span key={b.id} className="trail-bit" style={{ left: b.x + 'px', top: b.y + 'px' }}>{b.emoji}</span>
            ))}
        </div>
    );
}


