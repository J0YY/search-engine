import React from 'react';
import './SearchPage.css';
import { useStateValue } from '../StateProvider';
import SearchBar from '../components/SearchBar';
import useGoogleSerch from "../useGoogleSearch"
import Response from "../response";
import { Link } from "react-router-dom";
import SearchIcon from "@material-ui/icons/Search";
import DescriptionIcon from "@material-ui/icons/Description";
import ImageIcon from "@material-ui/icons/Image";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import RoomIcon from "@material-ui/icons/Room";
import MoreVertIcon from "@material-ui/icons/MoreVert";

function SearchPage() {
    const [{ term }] = useStateValue();
    const { data } = useGoogleSerch(term);

    const imageURL = "https://www.google.com/search?tbm=isch&q=" + term;

    const openInNewTab = (url) => {
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
    }

    const notFound = (what) => {
        if (alert("oop sorry i was too lazy to figure out all these individual elements so here's google's result for ya, that okay?")) {
            if (what == "all")
                window.location.href = ("https://google.com/search?q=" + term);
            if (what == "images")
                window.location.href(imageURL)
        }
    }

    return (
        <div className='searchPage'>
            <div className='header'>
                <Link to="/">
                    <img className="headerLogo" src="https://i.ibb.co/VYYyCtg/1-A27-B58-A-F715-4-F5-F-A1-C0-3-F9-B7404-C457.jpg" alt="" />
                </Link>
                <SearchBar name={term} />
                <div className='options'>
                    <div className='optionsLeft'>
                        <div className="spOptions">
                            <SearchIcon id="lcn">All</SearchIcon>
                        </div>
                        <div className="spOptions">
                            <DescriptionIcon id="lcn">News</DescriptionIcon>
                        </div>
                        <div className="spOptions">
                            <ImageIcon id="lcn" >Images</ImageIcon>
                        </div>
                        <div className="spOptions">
                            <LocalOfferIcon id="lcn" >Shopping</LocalOfferIcon>
                        </div>
                        <div className="spOptions">
                            <RoomIcon id="lcn" >Maps</RoomIcon>
                        </div>
                        <div className="spOptions">
                            <MoreVertIcon id="lcn" >More</MoreVertIcon>
                        </div>
                    </div>
                </div>
            </div>

            {term && (
                <div className='results'>
                    <p className="searchPage_count">
                        The program found about {data?.searchInformation.formattedTotalResults} results in ~{data?.searchInformation.formattedSearchTime} seconds for "{term}" and here are the most relevant results
                    </p>
                    {data?.items.map(item => (
                        <div className="searchPage_result">
                            <a href={item.link} className='links'>
                                {item.displayLink}
                            </a>
                            <a className="searchPage_title" href={item.link}>
                                <h3>{item.title}</h3>
                            </a>
                            <p className="searchPage_snippet">
                                {item.snippet}
                            </p>
                        </div>
                    )

                    )}
                </div>
            )}
        </div>
    );
}

export default SearchPage;