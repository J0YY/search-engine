import React, { useState } from 'react'
import "./Search.css";
import SearchIcon from "@material-ui/icons/Search"
import { Button } from "@material-ui/core";
import { useHistory } from 'react-router-dom';
import { useStateValue } from "../StateProvider";
import { actionTypes } from "../reducer";
import db from "../firebase";

function Search() {

    const [{ }, dispatch] = useStateValue();
    const [input, setInput] = useState("");
    const history = useHistory();

    const search = (e) => {
        e.preventDefault();
        console.log("You searched up " + input);
        history.push('/search');
        dispatch({
            type: actionTypes.SET_SEARCH_TERM,
            term: input
        })
    }

    const about = () => {
        alert("made by Joy Yang, coded in Reactjs and deployed using firebase\n\nHihi thank you for trying this thing out! This is a search engine, aka something that helps you search the web (e.g. google, yahoo, bing, baidu, naver, etc). This took wayy longer than I had hoped, but hopefully it's working! Anyway, feel free to leave feedback or ask me for specifics (dm me on IG!), thanks again for using it!");
    }
    const feedback = () => {
        var f = prompt("Leave your feedback here: ");
        if (!f)
            return;
        var n = prompt("Thanks! And just for reference, your name is?");
        if (n)
            alert("Your feedback was submitted. Thanks " + n + "!");
        else
            alert("Your feedback was submitted. Thanks, anonymous person!");

        db.collection("feedback").add({
            name: n,
            comments: f,
        });
    }

    const openInNewTab = (url) => {
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
    }

    return (
        <div className="search">
            <form className="search__input">
                <SearchIcon className="search__inputIcon" />
                <input value={input} type="text" placeholder="Search something here :)" onChange={e => setInput(e.target.value)} />
                <button className="searchButton__hidden" type="submit" onClick={search} value={input}></button>
            </form>
            <div className="search__buttons">
                <Button variant="outlined" onClick={about}>About</Button>
                <Button variant="outlined" onClick={feedback}>Feedback</Button>
                <div className="IG">
                    <Button onClick={() => openInNewTab("https://www.instagram.com/joyyang._/")}>IG</Button>
                </div>
            </div>

        </div>
    )
}

export default Search;
