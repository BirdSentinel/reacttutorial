import React, { Component } from 'react';
import InfoPopup from './components/infoPopup';
import axios from 'axios';
import unknownpic from './unknown.png'
import { faSearch, faFilm, faStepForward, faStepBackward, faForward, faBackward, faFrown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './App.css';
import { API_URL, API_KEY, API_IMAGE } from './apidata';

class App extends Component {

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

  getMovies(title, page) {
    this.setState({ loading: true })
    if (title.length > 0) {
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
        <div hidden={this.state.showPopup} className={this.state.movies.length > 0 ? "" : "center-container"}>
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
            <div className="movie-container">
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