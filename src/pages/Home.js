import React, { useState } from 'react'
import "./Home.css";
import Search from "../components/Search";
import Clock from "../components/Clock";
import QuickLinks from "../components/QuickLinks";
import Weather from "../components/Weather";
import SettingsModal from "../components/SettingsModal";
import TodoPanel from "../components/TodoPanel";
import ChaosLayer from "../components/ChaosLayer";
import PetBuddy from "../components/PetBuddy";
import RainLayer from "../components/RainLayer";
import CursorTrail from "../components/CursorTrail";
import ParallaxBlobs from "../components/ParallaxBlobs";
import useLocalStorage from "../useLocalStorage";
import SettingsIcon from "@material-ui/icons/Settings";
import AssignmentTurnedInOutlinedIcon from "@material-ui/icons/AssignmentTurnedInOutlined";
import WhatshotIcon from "@material-ui/icons/Whatshot";
import { useEffect, useMemo, useState as useStateReact } from 'react';

function Home() {
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [todoOpen, setTodoOpen] = useState(false);
    const [name] = useLocalStorage('start.name', '');
    const [use24h] = useLocalStorage('start.clock24h', false);
    const [chaosEnabled] = useLocalStorage('start.chaos', true);
    const [reactiveGradient] = useLocalStorage('start.modes.reactiveGradient', true);
    const [trail] = useLocalStorage('start.modes.trail', false);
    const [blobs] = useLocalStorage('start.modes.blobs', false);
    const [warpMode] = useLocalStorage('start.modes.warp', true);
    const [warp, setWarp] = useState(false);
    const [hue, setHue] = useStateReact(210);
    const [party, setParty] = useState(false);

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

    useEffect(() => {
        if (!reactiveGradient) return;
        const handler = (e) => {
            const text = (e.detail || '').toString().toLowerCase();
            const pos = ['love','great','wow','yay','nice','good','happy'];
            const neg = ['bad','sad','angry','hate','ugh','nope'];
            let score = 0;
            pos.forEach(w => { if (text.includes(w)) score += 1; });
            neg.forEach(w => { if (text.includes(w)) score -= 1; });
            score = Math.max(-3, Math.min(3, score));
            const newHue = 210 + score * 30; // shift blue->pinkish on positive
            setHue(newHue);
        };
        window.addEventListener('ui:queryChanged', handler);
        return () => window.removeEventListener('ui:queryChanged', handler);
    }, [reactiveGradient]);

    useEffect(() => {
        const warpHandler = () => {
            if (!warpMode) return;
            setWarp(true);
            setTimeout(() => setWarp(false), 1100);
        };
        window.addEventListener('ui:warp', warpHandler);
        return () => window.removeEventListener('ui:warp', warpHandler);
    }, [warpMode]);

    return (
        <div className="home home--startpage" style={reactiveGradient ? { background: `linear-gradient(120deg, hsl(${hue}, 100%, 94%), #ffffff, hsl(${(hue+80)%360}, 100%, 94%))`, backgroundSize: '200% 200%', animation: 'gradientShift 15s ease infinite' } : undefined}>
            {blobs && <ParallaxBlobs />}
            <ChaosLayer enabled={chaosEnabled} intensity={party ? 2.2 : 1} />
            <PetBuddy />
            {trail && <CursorTrail />}
            <RainLayer />
            {warp && <div className="warp-overlay" />}
            <div className="home__top">
                <Weather />
                {chaosEnabled && (
                    <button className={`party-button ${party ? 'on' : ''}`} aria-label="Party mode" title="Party mode" onClick={() => setParty(!party)}>
                        <WhatshotIcon />
                    </button>
                )}
                <button className="settings-button" aria-label="Settings" onClick={() => setSettingsOpen(true)}>
                    <SettingsIcon />
                </button>
                <button className="notes-button" aria-label="To‑do" onClick={() => setTodoOpen(true)}>
                    <AssignmentTurnedInOutlinedIcon />
                </button>
            </div>
            <div className="home__center glass-card">
                <div className="greeting">{greeting}{name ? `, ${name}` : ''}</div>
                <Clock use24h={use24h} />
                <Search enhanced />
                <QuickLinks />
            </div>
            <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
            <TodoPanel open={todoOpen} onClose={() => setTodoOpen(false)} />
        </div>
    )
}

export default Home;
