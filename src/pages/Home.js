import React from 'react'
import "./Home.css";
import Search from "../components/Search";

function Home() {
    return (
        <div className="home">
            <div className="home__body">
                <img src="https://i.ibb.co/VYYyCtg/1-A27-B58-A-F715-4-F5-F-A1-C0-3-F9-B7404-C457.jpg" alt=""></img>
                <div className="home__inputContainer">
                    <Search />
                </div>
            </div>
        </div>
    )
}

export default Home;
