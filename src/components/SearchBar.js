import React, { useState } from 'react'
import "./SearchBar.css";
import SearchIcon from "@material-ui/icons/Search"
import { Button } from "@material-ui/core";
import { useHistory } from 'react-router-dom';
import { useStateValue } from "../StateProvider";
import { actionTypes } from "../reducer";

function SearchBar({ name }) {

    const [{ }, dispatch] = useStateValue();
    const [input, setInput] = useState("");
    const history = useHistory();

    const search = (e) => {
        e.preventDefault();
        history.push('/search');
        dispatch({
            type: actionTypes.SET_SEARCH_TERM,
            term: input
        })
    }

    return (
        <div className="search">
            <form className="search__input">
                <SearchIcon className="search__inputIcon" />
                <input value={input} type="text" placeholder={name} onChange={e => setInput(e.target.value)} />
                <button className="searchButton__hidden" type="submit" onClick={search} value={input}></button>
            </form>

        </div>
    )
}

export default SearchBar;
