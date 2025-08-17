import React, { useEffect, useRef, useState } from 'react';
import useLocalStorage from '../useLocalStorage';

export default function PetBuddy() {
    const [enabled] = useLocalStorage('start.modes.pet', false);
    const [pos, setPos] = useState({ x: 40, y: 80 });
    const [target, setTarget] = useState({ x: 40, y: 80 });
    const [sleeping, setSleeping] = useState(false);
    const rafRef = useRef();

    useEffect(() => {
        if (!enabled) return;
        const onMove = (e) => {
            setTarget({ x: (e.clientX / window.innerWidth) * 100, y: (e.clientY / window.innerHeight) * 100 });
            setSleeping(false);
        };
        window.addEventListener('mousemove', onMove);
        const onNap = () => setSleeping(true);
        window.addEventListener('ui:petNap', onNap);
        return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('ui:petNap', onNap); };
    }, [enabled]);

    useEffect(() => {
        if (!enabled) return;
        const tick = () => {
            setPos(prev => ({ x: prev.x + (target.x - prev.x) * 0.06, y: prev.y + (target.y - prev.y) * 0.06 }));
            rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafRef.current);
    }, [enabled, target.x, target.y]);

    if (!enabled) return null;

    return (
        <div className="pet-buddy" style={{ left: `${pos.x}vw`, top: `${pos.y}vh` }} title={sleeping ? 'napping' : 'following'}>
            <span className="pet-emoji" role="img" aria-label="pet">{sleeping ? '😴' : '🐥'}</span>
        </div>
    );
}


