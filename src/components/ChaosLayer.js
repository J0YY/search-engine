import React, { useMemo } from 'react';

const RUNNERS = ['🦄','🐱‍👤','🐸','🐻','🦊','🐈‍⬛','🐙','🚀','🍩','🦕'];
const STICKERS = ['⭐','💖','🌈','🍓','🍭','✨','🌼','🪩','🫧','🧁'];

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

export default function ChaosLayer({ enabled, intensity = 1 }) {
    const runnerCount = Math.round(8 * intensity);
    const stickerCount = Math.round(12 * intensity);
    const runners = useMemo(() => new Array(runnerCount).fill(0).map((_, i) => ({
        id: `runner-${i}-${Math.random().toString(36).slice(2)}`,
        emoji: pick(RUNNERS),
        top: random(5, 80),
        duration: random(10, 24),
        delay: random(0, 8),
        direction: Math.random() > 0.5 ? 'left' : 'right',
        scale: random(1, 1.6)
    })), [runnerCount]);

    const stickers = useMemo(() => new Array(stickerCount).fill(0).map((_, i) => ({
        id: `sticker-${i}-${Math.random().toString(36).slice(2)}`,
        emoji: pick(STICKERS),
        left: random(2, 96),
        top: random(8, 88),
        duration: random(6, 16),
        delay: random(0, 6),
        rotate: random(-12, 12)
    })), [stickerCount]);

    if (!enabled) return null;

    return (
        <div className="chaos-layer" aria-hidden>
            {stickers.map(s => (
                <div
                    key={s.id}
                    className="chaos-sticker"
                    style={{ left: `${s.left}%`, top: `${s.top}%`, animationDuration: `${s.duration}s`, animationDelay: `${s.delay}s`, transform: `rotate(${s.rotate}deg)` }}
                >{s.emoji}</div>
            ))}
            {runners.map(r => (
                <div
                    key={r.id}
                    className={`chaos-runner chaos-runner--${r.direction}`}
                    style={{ top: `${r.top}%`, animationDuration: `${r.duration}s`, animationDelay: `${r.delay}s`, fontSize: `${r.scale}rem` }}
                >
                    <span className="runner-emoji">{r.emoji}</span>
                </div>
            ))}
        </div>
    );
}


