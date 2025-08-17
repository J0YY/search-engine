import React, { useEffect, useRef, useState } from 'react';
import useLocalStorage from '../useLocalStorage';

function getInputRect() {
    const el = document.querySelector('.search .search__input');
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    return rect;
}

export default function RainLayer() {
    const [enabled] = useLocalStorage('start.modes.rain', false);
    const [letters, setLetters] = useState([]);
    const textRef = useRef('search');
    const idleRef = useRef();

    useEffect(() => {
        if (!enabled) return;
        const onQuery = (e) => { textRef.current = (e.detail || '').toString() || 'search'; resetIdle(); };
        window.addEventListener('ui:queryChanged', onQuery);
        const resetIdle = () => {
            clearTimeout(idleRef.current);
            idleRef.current = setTimeout(spawn, 1500);
        };
        const spawn = () => {
            const rect = getInputRect();
            if (!rect) return;
            const baseX = rect.left;
            const width = rect.width;
            const baseY = rect.bottom;
            const text = textRef.current;
            const sample = text.length > 0 ? text : 'search';
            const items = Array.from({ length: 10 }, (_, i) => ({
                id: Date.now() + '-' + i,
                char: sample[Math.floor(Math.random() * sample.length)],
                x: baseX + Math.random() * width,
                y: baseY + Math.random() * 10,
                duration: 2 + Math.random() * 2,
                delay: Math.random() * 0.6,
                drift: (Math.random() - 0.5) * 40
            }));
            setLetters((prev) => [...prev, ...items]);
            // cleanup after animation
            setTimeout(() => {
                setLetters((prev) => prev.filter(l => !items.find(i => i.id === l.id)));
                resetIdle();
            }, 3000);
        };
        resetIdle();
        return () => { clearTimeout(idleRef.current); window.removeEventListener('ui:queryChanged', onQuery); };
    }, [enabled]);

    if (!enabled) return null;

    return (
        <div className="rain-layer" aria-hidden>
            {letters.map(l => (
                <span key={l.id} className="rain-letter" style={{ left: l.x + 'px', top: l.y + 'px', animationDuration: l.duration + 's', animationDelay: l.delay + 's', '--drift': l.drift + 'px' }}>
                    {l.char}
                </span>
            ))}
        </div>
    );
}


