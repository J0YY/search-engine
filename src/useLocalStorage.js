import { useState, useEffect } from 'react';

function getInitialValue(key, initialValue) {
    try {
        const item = window.localStorage.getItem(key);
        return item !== null ? JSON.parse(item) : initialValue;
    } catch (err) {
        return initialValue;
    }
}

export default function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => getInitialValue(key, initialValue));

    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(storedValue));
        } catch (err) {
            // ignore write errors
        }
    }, [key, storedValue]);

    return [storedValue, setStoredValue];
}


