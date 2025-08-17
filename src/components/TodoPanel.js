import React, { useState } from 'react';
import useLocalStorage from '../useLocalStorage';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/AddCircleOutline';

function createTodo(text) {
    return { id: Date.now().toString(36), text, done: false };
}

export default function TodoPanel({ open, onClose }) {
    const [todos, setTodos] = useLocalStorage('start.todos', []);
    const [text, setText] = useState('');

    const addTodo = () => {
        const trimmed = text.trim();
        if (!trimmed) return;
        setTodos([createTodo(trimmed), ...todos]);
        setText('');
    };

    const toggleTodo = (id) => {
        setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t));
    };

    const removeTodo = (id) => {
        setTodos(todos.filter(t => t.id !== id));
    };

    const onKeyDown = (e) => {
        if (e.key === 'Enter') addTodo();
    };

    return (
        <div className={`todo-overlay ${open ? 'open' : ''}`} onClick={onClose}>
            <aside className={`todo-panel ${open ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
                <div className="todo-panel__header">
                    <div className="todo-panel__title">To‑do</div>
                    <button className="icon-btn" aria-label="Close" onClick={onClose}><CloseIcon /></button>
                </div>
                <div className="todo-panel__input">
                    <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={onKeyDown} placeholder="Add a task and press Enter" />
                    <button className="icon-btn" aria-label="Add" onClick={addTodo}><AddIcon /></button>
                </div>
                <div className="todo-panel__list">
                    {todos.length === 0 && <div className="todo-empty">Nothing yet — add your first task ✨</div>}
                    {todos.map(t => (
                        <label key={t.id} className={`todo-item ${t.done ? 'done' : ''}`}>
                            <input type="checkbox" checked={t.done} onChange={() => toggleTodo(t.id)} />
                            <span className="todo-item__text">{t.text}</span>
                            <button className="todo-remove" onClick={() => removeTodo(t.id)} aria-label="Remove">×</button>
                        </label>
                    ))}
                </div>
            </aside>
        </div>
    );
}


