import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Select, InputLabel, FormControl, FormControlLabel, Switch, Slider, FormGroup } from '@material-ui/core';
import useLocalStorage from '../useLocalStorage';

const ENGINES = [
    { id: 'internal', label: 'Internal (Google API)' },
    { id: 'google', label: 'Google.com' },
    { id: 'duckduckgo', label: 'DuckDuckGo' },
    { id: 'bing', label: 'Bing' }
];

export default function SettingsModal({ open, onClose }) {
    const [name, setName] = useLocalStorage('start.name', '');
    const [engine, setEngine] = useLocalStorage('start.engine', 'internal');
    const [use24h, setUse24h] = useLocalStorage('start.clock24h', false);
    const [chaosEnabled, setChaosEnabled] = useLocalStorage('start.chaos', true);
    const [weightAnchor, setWeightAnchor] = useLocalStorage('start.weightAnchor', 'caret');
    const [spinOnDrop, setSpinOnDrop] = useLocalStorage('start.spinOnDrop', true);
    const [gravity, setGravity] = useLocalStorage('start.gravity', 1);
    const [magnetic, setMagnetic] = useLocalStorage('start.modes.magnetic', false);
    const [jiggle, setJiggle] = useLocalStorage('start.modes.jiggle', true);
    const [stickers, setStickers] = useLocalStorage('start.modes.stickers', true);
    const [reactiveGradient, setReactiveGradient] = useLocalStorage('start.modes.reactiveGradient', true);
    const [warp, setWarp] = useLocalStorage('start.modes.warp', true);
    const [pet, setPet] = useLocalStorage('start.modes.pet', false);
    const [rain, setRain] = useLocalStorage('start.modes.rain', false);
    const [sounds, setSounds] = useLocalStorage('start.modes.sounds', false);

    const handleSave = () => {
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} aria-labelledby="settings-title">
            <DialogTitle id="settings-title">Settings</DialogTitle>
            <DialogContent>
                <TextField fullWidth margin="dense" label="Your name (for greeting)" value={name} onChange={(e) => setName(e.target.value)} />
                <FormControl fullWidth margin="dense">
                    <InputLabel id="engine-label">Default search</InputLabel>
                    <Select labelId="engine-label" value={engine} onChange={(e) => setEngine(e.target.value)}>
                        {ENGINES.map(e => (
                            <MenuItem value={e.id} key={e.id}>{e.label}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="dense">
                    <InputLabel id="clock-label">Clock format</InputLabel>
                    <Select labelId="clock-label" value={use24h ? '24' : '12'} onChange={(e) => setUse24h(e.target.value === '24')}>
                        <MenuItem value={'12'}>12‑hour</MenuItem>
                        <MenuItem value={'24'}>24‑hour</MenuItem>
                    </Select>
                </FormControl>
                <FormControlLabel style={{ marginTop: 8 }} control={<Switch color="primary" checked={!!chaosEnabled} onChange={(e) => setChaosEnabled(e.target.checked)} />} label="Chaos mode (cute characters & floating stickers)" />
                <FormControl fullWidth margin="dense">
                    <InputLabel id="weight-label">Search weight anchor</InputLabel>
                    <Select labelId="weight-label" value={weightAnchor} onChange={(e) => setWeightAnchor(e.target.value)}>
                        <MenuItem value={'left'}>Left</MenuItem>
                        <MenuItem value={'center'}>Center</MenuItem>
                        <MenuItem value={'right'}>Right</MenuItem>
                        <MenuItem value={'caret'}>Caret position</MenuItem>
                    </Select>
                </FormControl>
                <FormControlLabel control={<Switch color="primary" checked={!!spinOnDrop} onChange={(e) => setSpinOnDrop(e.target.checked)} />} label="Spin on drop" />
                <div style={{ marginTop: 12 }}>
                    <div style={{ fontSize: 12, marginBottom: 6 }}>Gravity (fall intensity)</div>
                    <Slider value={gravity} onChange={(_, v) => setGravity(Array.isArray(v) ? v[0] : v)} min={0.6} max={2.5} step={0.1} valueLabelDisplay="auto" />
                </div>
                <div style={{ marginTop: 12 }}>
                    <div style={{ fontSize: 12, marginBottom: 6 }}>Playground modes</div>
                    <FormGroup>
                        <FormControlLabel control={<Switch color="primary" checked={!!magnetic} onChange={(e) => setMagnetic(e.target.checked)} />} label="Magnetic search (runs away until you catch it)" />
                        <FormControlLabel control={<Switch color="primary" checked={!!jiggle} onChange={(e) => setJiggle(e.target.checked)} />} label="Jiggle feedback (enter/backspace)" />
                        <FormControlLabel control={<Switch color="primary" checked={!!stickers} onChange={(e) => setStickers(e.target.checked)} />} label="Sticker bombs (keyword bursts)" />
                        <FormControlLabel control={<Switch color="primary" checked={!!reactiveGradient} onChange={(e) => setReactiveGradient(e.target.checked)} />} label="Reactive gradient (sentiment hue)" />
                        <FormControlLabel control={<Switch color="primary" checked={!!warp} onChange={(e) => setWarp(e.target.checked)} />} label="Warp speed (starfield on search)" />
                        <FormControlLabel control={<Switch color="primary" checked={!!pet} onChange={(e) => setPet(e.target.checked)} />} label="Pet buddy (chases cursor, naps on bar)" />
                        <FormControlLabel control={<Switch color="primary" checked={!!rain} onChange={(e) => setRain(e.target.checked)} />} label="Rain mode (letters fall when idle)" />
                        <FormControlLabel control={<Switch color="primary" checked={!!sounds} onChange={(e) => setSounds(e.target.checked)} />} label="Sound sprinkles (subtle blips)" />
                    </FormGroup>
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button color="primary" variant="contained" onClick={handleSave}>Save</Button>
            </DialogActions>
        </Dialog>
    );
}


