import React, { useEffect, useRef } from 'react';
import useLocalStorage from '../useLocalStorage';

export default function ParallaxBlobs() {
    const [enabled] = useLocalStorage('start.modes.blobs', false);
    const ref = useRef(null);

    useEffect(() => {
        if (!enabled) return;
        const onMove = (e) => {
            const root = ref.current;
            if (!root) return;
            const { innerWidth, innerHeight } = window;
            const mx = (e.clientX / innerWidth - 0.5) * 20;
            const my = (e.clientY / innerHeight - 0.5) * 20;
            Array.from(root.children).forEach((el, i) => {
                const depth = (i + 1) * 0.6;
                el.style.transform = `translate(${mx / depth}px, ${my / depth}px)`;
            });
        };
        window.addEventListener('mousemove', onMove);
        return () => window.removeEventListener('mousemove', onMove);
    }, [enabled]);

    if (!enabled) return null;

    return (
        <div className="blobs" ref={ref} aria-hidden>
            <div className="blob blob--pink" />
            <div className="blob blob--yellow" />
            <div className="blob blob--blue" />
        </div>
    );
}


