import React, { Component } from 'react';
//This is the popup components that shows info about the movie you clicked on it.
import InfoPopup from './components/infoPopup';
//Axios is a Javascript library used to make HTTP requests from node.js or XMLHttpRequests from the browser.
import axios from 'axios';
//This is the pic we show when there's no poster for the movie.
import unknownpic from './unknown.png'
//FortAwesome is the FontAwesome for React, these are the icons I used on this page.
import { faSearch, faFilm, faStepForward, faStepBackward, faForward, faBackward, faFrown } from "@fortawesome/free-solid-svg-icons";
//This is the main library call for FortAwesome.
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//This is the stylesheet used for this page.
import './App.css';
//Variables I called from apidata.js to use in the getMovies() function.
import { API_URL, API_KEY, API_IMAGE } from './apidata';

class App extends Component {

  //You should declare your variables here
  state = {
    movies: [],
    page: 0,
    results: 0,
    allPage: 0,
    actualPage: 1,
    search: null,
    showPopup: false,
    gotMovies: false,
    movieTitle: "titlecucc",
    movieDesc: "desccucc",
    voteAvg: "",
    releaseDate: "",
    poster: "",
    error: false,
    errorData: "",
    loading: false
  }

  //You call this function from the "movie-card" div to open the popup with the movie data
  togglePopup(title, desc, vote, date, poster) {
   this.setState({
     showPopup: !this.state.showPopup,
     movieTitle: title,
     movieDesc: desc,
     voteAvg: vote,
     releaseDate: date,
     poster: poster
    });
  }

  //This is the api call function where you get the movies data.
  getMovies(title, page) {
    this.setState({ loading: true })
    if (title.length > 0) {
      //this is the api url constructed for apidata variables.
      //Through the axios call you get variables you can display on the page.
      //You can also console.log this if you want to see what you get from this api.
      //Or use the ReactDev tools addon in your browser!
      const url = `${API_URL}/search/movie?api_key=${API_KEY}&query=${title}&page=${page}`;
      axios.get(url).then(response => response.data)
      .then((data) => {
        this.setState({ movies: data.results })
        this.setState({ page: data.page })
        this.setState({ results: data.total_results })
        this.setState({ allPage: data.total_pages })
        this.setState({ search: title })
        this.setState({ gotMovies: true })
        this.setState({ error: false })
        this.setState({ loading: false })
      })
      .catch(error => {
        this.setState({ errorData: error.message })
        this.setState({ error: true })
        this.setState({ loading: false })
      })
    }
  }

  //These four functions are the nav buttons, these are making an api call everytime they used because the api returns movies by pages.
  nextPage() {
    if (this.state.actualPage < this.state.allPage) {
      this.state.actualPage += 1;
    }
    this.getMovies(document.getElementById("titleinput").value, this.state.actualPage);
  }

  prevPage() {
    if (this.state.actualPage > 1) {
      this.state.actualPage -= 1;
    }
    this.getMovies(document.getElementById("titleinput").value, this.state.actualPage);
  }

  firstPage() {
    this.state.actualPage = 1;
    this.getMovies(document.getElementById("titleinput").value, 1);
  }

  lastPage() {
    this.state.actualPage = this.state.allPage;
    this.getMovies(document.getElementById("titleinput").value, this.state.allPage);
  }

  //This is where the magic happens really. You construct your HTML site in this function you want to see.
  //On the top of this function you declare the InfoPopup to use it later in the code.
  render() {
    return (
      <div className="App">
        {this.state.showPopup ?
          <InfoPopup
            title={this.state.movieTitle}
            desc={this.state.movieDesc}
            vote={this.state.voteAvg}
            date={this.state.releaseDate}
            poster={this.state.poster}
            closePopup={this.togglePopup.bind(this)}
          />
          : null
        }
        {/* This div is the main container that stores everything */}
        <div hidden={this.state.showPopup} className={this.state.movies.length > 0 ? "" : "center-container"}>
          {/* This is the first thing you see on the site, this is the search where you first call the API. */}
          <div className="center-search">
            <h1 className="big-title">Find your movie <FontAwesomeIcon icon={faFilm} /></h1>
            <form onSubmit={() => this.getMovies(document.getElementById("titleinput").value)} className="search-container" action="javascript:void(0);">
              <input className="search-input" type="text" id="titleinput"/>
              <button className="search-button"><FontAwesomeIcon icon={faSearch} /></button>
            </form>
            <p className="error-text" hidden={!this.state.error}>{this.state.errorData}</p>
            <p hidden={this.state.gotMovies && this.state.movies.length == 0 ? false : true} className="no-results-text">Sorry, no results for "{this.state.search}" <FontAwesomeIcon icon={faFrown} /></p>
            <div className={this.state.movies.length > 0 ? "loading-container hidden" : "loading-container" }>
              <div className={this.state.loading ? "loading-circle" : "loading-circle hidden" }></div>
            </div>
          </div>
          <div>
            {/* This div is hidden until you get data back from api */}
            <div hidden={this.state.movies.length > 0 ? false : true}>
              <p className="results-text">{this.state.results} results for "{this.state.search}"</p>
              <div className="page-step-container">
                <button className="first-button" onClick={() => this.firstPage()}><FontAwesomeIcon icon={faStepBackward} /></button>
                <button className="prev-button" onClick={() => this.prevPage()}><FontAwesomeIcon icon={faBackward} /></button>
                <p>Page {this.state.page}/{this.state.allPage}</p>
                <button className="next-button" onClick={() => this.nextPage()}><FontAwesomeIcon icon={faForward} /></button>
                <button className="last-button" onClick={() => this.lastPage()}><FontAwesomeIcon icon={faStepForward} /></button>
              </div>
            </div>
            {/* This is the card div for all the movies you got */}          
            <div className="movie-container">
              {/* And this is where you call the popup component with the variables passed on to it */}
              {this.state.movies.map((movie) => (
                <div className="movie-card" onClick={this.togglePopup.bind(this, movie.title, movie.overview, movie.vote_average, movie.release_date, movie.poster_path)}>
                  {movie.poster_path == null ?
                    <img className="movie-pic" src={unknownpic} alt="no poster"/> : <img className="movie-pic" src={API_IMAGE+movie.poster_path} alt={movie.title}/>
                  }
                  <h3 className="movie-title">{movie.title}</h3>
                  <p className="movie-desc">{movie.overview.substr(0, 95) + " [...]"}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;