import React, { useEffect, useRef, useState } from 'react'
import "./Search.css";
import SearchIcon from "@material-ui/icons/Search"
import { useHistory } from 'react-router-dom';
import { useStateValue } from "../StateProvider";
import { actionTypes } from "../reducer";
import useLocalStorage from "../useLocalStorage";

function Search({ enhanced = false }) {

    const [{ }, dispatch] = useStateValue();
    const [input, setInput] = useState("");
    const history = useHistory();
    const inputRef = useRef(null);
    const [engine, setEngine] = useLocalStorage('start.engine', 'internal');
    const [chaosEnabled] = useLocalStorage('start.chaos', true);
    const [weightAnchor] = useLocalStorage('start.weightAnchor', 'caret'); // 'left' | 'center' | 'right' | 'caret'
    const [spinOnDrop] = useLocalStorage('start.spinOnDrop', true);
    const [dragging, setDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [falling, setFalling] = useState(false);
    const [confetti, setConfetti] = useState([]);
    const [tiltAngle, setTiltAngle] = useState(0);
    const [targetTiltAngle, setTargetTiltAngle] = useState(0);
    const [dropY, setDropY] = useState(0);
    const [spinDeg, setSpinDeg] = useState(0);
    const [gravity] = useLocalStorage('start.gravity', 1);
    const [magnetic] = useLocalStorage('start.modes.magnetic', false);
    const [jiggle] = useLocalStorage('start.modes.jiggle', true);
    const [stickers] = useLocalStorage('start.modes.stickers', true);
    const [warp] = useLocalStorage('start.modes.warp', true);
    const [rain] = useLocalStorage('start.modes.rain', false);
    const [sounds] = useLocalStorage('start.modes.sounds', false);
    const [caught, setCaught] = useState(false);
    const magnetRef = useRef({ x: 0, y: 0 });
    const idleRef = useRef(0);

    const search = (e) => {
        e.preventDefault();
        console.log("You searched up " + input);
        if (chaosEnabled) {
            burstConfetti();
        }
        if (warp) {
            window.dispatchEvent(new Event('ui:warp'));
        }
        if (jiggle) {
            jiggleOnce();
        }
        if (sounds) {
            playBlip(660);
        }
        if (engine === 'internal') {
            history.push('/search');
            dispatch({
                type: actionTypes.SET_SEARCH_TERM,
                term: input
            })
        } else {
            const q = encodeURIComponent(input);
            let url = `https://www.google.com/search?q=${q}`;
            if (engine === 'duckduckgo') url = `https://duckduckgo.com/?q=${q}`;
            if (engine === 'bing') url = `https://www.bing.com/search?q=${q}`;
            window.open(url, '_blank', 'noopener,noreferrer');
            dispatch({ type: actionTypes.SET_SEARCH_TERM, term: input });
        }
    }

    

    useEffect(() => {
        if (!enhanced) return;
        const handler = (e) => {
            const active = document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA');
            if (!active && e.key === '/') {
                e.preventDefault();
                if (inputRef.current) inputRef.current.focus();
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [enhanced]);

    const clamp = (val, min, max) => Math.min(max, Math.max(min, val));

    const updateTiltFromCaret = () => {
        if (!enhanced || !chaosEnabled) return;
        const el = inputRef.current;
        if (!el) return;
        const len = el.value.length || 1;
        let anchorPos = 0.5;
        if (weightAnchor === 'left') anchorPos = 0;
        else if (weightAnchor === 'right') anchorPos = 1;
        else if (weightAnchor === 'center') anchorPos = 0.5;
        else if (weightAnchor === 'caret') anchorPos = clamp((el.selectionStart || 0) / len, 0, 1);
        const bias = anchorPos - 0.5; // -0.5 .. 0.5
        const maxTilt = 8; // more subtle
        const target = clamp(-bias * (maxTilt * 2), -maxTilt, maxTilt); // invert to tilt toward weight visually
        setTargetTiltAngle(target);
    };

    const onPointerDown = (e) => {
        if (!enhanced || !chaosEnabled) return;
        setDragging(true);
        setFalling(false);
        setDragOffset({ x: 0, y: 0 });
        if (e.target.setPointerCapture) {
            try { e.target.setPointerCapture(e.pointerId); } catch (_) {}
        }
        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp, { once: true });
    };

    const onPointerMove = (e) => {
        setDragOffset(prev => ({ x: prev.x + e.movementX, y: prev.y + e.movementY }));
    };

    const onPointerUp = () => {
        window.removeEventListener('pointermove', onPointerMove);
        setDragging(false);
        if (!chaosEnabled) { setDragOffset({ x: 0, y: 0 }); return; }
        const drop = Math.random() > 0.4 || dragOffset.y > 40;
        if (drop) {
            setDragOffset({ x: 0, y: 0 });
            animateFall(spinOnDrop);
        } else {
            // spring back
            setDragOffset({ x: 0, y: 0 });
        }
    };

    const burstConfetti = () => {
        const bits = Array.from({ length: 22 }, (_, i) => ({ id: i, angle: (Math.random() * 360), distance: 30 + Math.random() * 70, emoji: ['✨','💥','🦄','💫','🎉','🍬'][Math.floor(Math.random()*6)] }));
        setConfetti(bits);
        setTimeout(() => setConfetti([]), 900);
    };

    const animateFall = (spin) => {
        setFalling(true);
        const start = performance.now();
        const duration = 1200; // ms
        const startSpin = spinDeg;
        const extraSpin = spin ? (360 + Math.random() * 180) * (Math.random() > 0.5 ? 1 : -1) : 0;
        const bounce = (t) => {
            // ease + bounce using simple piecewise
            if (t < 0.8) {
                return 0.8 * (t / 0.8);
            } else if (t < 0.9) {
                return 0.8 - (t - 0.8) * 6;
            } else if (t < 1) {
                return 0.74 + (t - 0.9) * 2.6;
            }
            return 1;
        };
        const tick = (now) => {
            const t = clamp((now - start) / duration, 0, 1);
            const y = bounce(t) * (window.innerHeight * 0.6) * gravity;
            setDropY(y);
            setSpinDeg(startSpin + extraSpin * t);
            if (t < 1) requestAnimationFrame(tick);
            else {
                setTimeout(() => {
                    setDropY(0);
                    setSpinDeg(0);
                    setFalling(false);
                }, 80);
            }
        };
        requestAnimationFrame(tick);
    };

    // Magnetic search avoidance
    useEffect(() => {
        if (!enhanced || !chaosEnabled || !magnetic) return;
        const move = (e) => {
            if (caught) return;
            const el = inputRef.current?.closest('.search');
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const dx = (rect.left + rect.width / 2) - e.clientX;
            const dy = (rect.top + rect.height / 2) - e.clientY;
            const dist = Math.hypot(dx, dy);
            const radius = 180;
            if (dist < radius) {
                const force = (radius - dist) / radius;
                magnetRef.current = { x: (dx / dist) * force * 18, y: (dy / dist) * force * 14 };
                setDragOffset(prev => ({ x: clamp(prev.x + magnetRef.current.x, -120, 120), y: clamp(prev.y + magnetRef.current.y, -90, 120) }));
            }
        };
        window.addEventListener('mousemove', move);
        return () => window.removeEventListener('mousemove', move);
    }, [enhanced, chaosEnabled, magnetic, caught]);

    const jiggleOnce = () => {
        const el = inputRef.current?.closest('.search');
        if (!el) return;
        el.classList.add('search--jiggle');
        setTimeout(() => el.classList.remove('search--jiggle'), 180);
    };

    const playBlip = (freq) => {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.type = 'sine';
            o.frequency.value = freq;
            g.gain.value = 0.03;
            o.connect(g).connect(ctx.destination);
            o.start();
            o.stop(ctx.currentTime + 0.08);
        } catch (_) {}
    };

    useEffect(() => {
        if (!enhanced || !chaosEnabled) return;
        const onKey = (e) => {
            if (!jiggle) return;
            if (e.key === 'Enter' || e.key === 'Backspace') {
                jiggleOnce();
                if (sounds) playBlip(e.key === 'Enter' ? 550 : 320);
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [enhanced, chaosEnabled, jiggle, sounds]);

    // Sticker bombs for keywords
    const keywordStickers = ['✨','💖','🌈','⭐','🍓','😺','🪩'];
    const maybeStickerBomb = (value) => {
        if (!stickers || !chaosEnabled) return;
        const lowered = value.toLowerCase();
        const triggers = ['love','star','cat','kitten','wow','yay','party','glitter','shine','spark'];
        if (triggers.some(t => lowered.includes(t))) {
            const el = inputRef.current;
            if (!el) return;
            const ratio = (el.selectionStart || 0) / ((el.value.length || 1));
            const bits = Array.from({ length: 18 }, (_, i) => ({ id: i, angle: (Math.random() * 360), distance: 20 + Math.random() * 80, emoji: keywordStickers[Math.floor(Math.random()*keywordStickers.length)] }));
            setConfetti(bits.map(b => ({ ...b, offsetRatio: ratio })));
            setTimeout(() => setConfetti([]), 900);
        }
    };

    // Smoothly interpolate current tilt toward target for subtle motion
    useEffect(() => {
        if (!enhanced || !chaosEnabled) { setTiltAngle(0); return; }
        let raf;
        const tick = () => {
            const delta = targetTiltAngle - tiltAngle;
            const step = delta * 0.12; // smoothing factor
            if (Math.abs(delta) > 0.02) {
                setTiltAngle(prev => prev + step);
                raf = requestAnimationFrame(tick);
            } else {
                setTiltAngle(targetTiltAngle);
            }
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [targetTiltAngle, enhanced, chaosEnabled, tiltAngle]);

    return (
        <div className={`search ${dragging ? 'search--dragging' : ''} ${falling ? 'search--fall' : ''}`}>
            <div className="search__transform" style={{ transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) translateY(${dropY}px) rotate(${(tiltAngle + spinDeg)}deg)` }}>
            <form className="search__input" onPointerDown={onPointerDown}>
                <SearchIcon className="search__inputIcon" />
                <input ref={inputRef} value={input} type="text" placeholder="Search something here :)" onChange={e => { setInput(e.target.value); updateTiltFromCaret(); maybeStickerBomb(e.target.value); window.dispatchEvent(new CustomEvent('ui:queryChanged', { detail: e.target.value })); }} onKeyUp={updateTiltFromCaret} onClick={updateTiltFromCaret} onMouseDown={() => { setCaught(true); setTimeout(() => setCaught(false), 1500); window.dispatchEvent(new Event('ui:petNap')); }} />
                <button className="searchButton__hidden" type="submit" onClick={search} value={input}></button>
            </form>
            {enhanced && (
                <div className="search__engines">
                    <label className="engine-label">Search with:</label>
                    <select className="engine-select" value={engine} onChange={(e) => setEngine(e.target.value)}>
                        <option value="internal">Internal (Google API)</option>
                        <option value="google">Google</option>
                        <option value="duckduckgo">DuckDuckGo</option>
                        <option value="bing">Bing</option>
                    </select>
                </div>
            )}
            {chaosEnabled && confetti.length > 0 && (
                <div className="confetti">
                    {confetti.map(bit => (
                        <span key={bit.id} className="confetti__bit" style={{
                            left: `${(bit.offsetRatio ?? 0.5) * 100}%`,
                            transform: `rotate(${bit.angle}deg) translate(${bit.distance}px)`
                        }}>{bit.emoji}</span>
                    ))}
                </div>
            )}
            </div>

        </div>
    )
}

export default Search;
