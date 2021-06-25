import React from 'react';
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './style.css';
import unknownpic from '../unknown.png';
import { API_IMAGE } from '../apidata';

class infoPopup extends React.Component {
    render() {
        return (
            <div className="popup-window">
                <div className="popup-container">
                    <button className="back-name" onClick={this.props.closePopup}><FontAwesomeIcon icon={faChevronLeft} /><span>Back</span></button>
                    <div className="poster-container">
                    {this.props.poster == null ?
                        <img className="movie-pic" src={unknownpic} alt="no poster"/> : <img className="movie-pic" src={API_IMAGE+this.props.poster} alt={this.props.poster}/>
                    }
                    </div>
                    <div className="data-container">
                        <h1>{this.props.title}</h1>
                        <p className="rating-text">Rating: {this.props.vote}/10</p>
                        <p className="date-text">Release date: {this.props.date}</p>
                        <p className="desc-text">{this.props.desc}</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default infoPopup;