import React from 'react';
import useLocalStorage from '../useLocalStorage';

const DEFAULT_LINKS = [
    { title: 'Gmail', url: 'https://mail.google.com', emoji: '📧' },
    { title: 'YouTube', url: 'https://youtube.com', emoji: '📺' },
    { title: 'Drive', url: 'https://drive.google.com', emoji: '🗂️' },
    { title: 'Calendar', url: 'https://calendar.google.com', emoji: '📆' },
    { title: 'GitHub', url: 'https://github.com', emoji: '🐙' },
    { title: 'Notion', url: 'https://www.notion.so', emoji: '🗒️' },
    { title: 'LinkedIn', url: 'https://linkedin.com', emoji: '💼' },
    { title: 'Twitter/X', url: 'https://twitter.com', emoji: '🕊️' }
];

export default function QuickLinks() {
    const [links, setLinks] = useLocalStorage('start.quickLinks', DEFAULT_LINKS);

    const addLink = () => {
        const url = window.prompt('Enter URL');
        if (!url) return;
        const title = window.prompt('Enter title');
        const emoji = window.prompt('Enter emoji (optional)') || '🔗';
        setLinks([...links, { title: title || url, url, emoji }]);
    };

    const removeLink = (index) => {
        if (!window.confirm('Remove this shortcut?')) return;
        setLinks(links.filter((_, i) => i !== index));
    };

    return (
        <div className="quicklinks">
            {links.map((link, idx) => (
                <a key={idx} className="quicklink" href={link.url} target="_blank" rel="noreferrer noopener">
                    <span className="quicklink__emoji" title={link.title} onContextMenu={(e) => { e.preventDefault(); removeLink(idx); }}>{link.emoji}</span>
                    <span className="quicklink__title">{link.title}</span>
                </a>
            ))}
            <button className="quicklink quicklink--add" onClick={addLink}>＋ Add</button>
        </div>
    );
}


