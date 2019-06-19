import React, {Component} from 'react';
import MovieDbServices from './MovieDbServices'
import './App.css';

const movieDb = new MovieDbServices();
let idx = 100;
const movies = ['/discover/movie', '/genre/878/movies', '/genre/35/movies'];
const movieClass = ['trend', 'sci-fi', 'camedy']; // сделано чтоб привязать кнопки и реализовать переход по страницам

function Item({id, name, vote, date, img, overview}) { // добавление елементов в блок
  return (
      <div className="wrapper-film"
           key={idx}>
        <div className="film-image">
            <img src={`https://image.tmdb.org/t/p/original/${img}`}
                 alt="image-film"
                 style={{width: '275px'}}
            />
        </div>
        <div className="film-data">
            <div className="film-name">
                {name}
            </div>
            <div className="film-vote">
                Score: {vote} / 10
            </div>
            <div className="overview">
                <details>
                  <summary>Overview</summary>
                    {overview}
                </details>
            </div>
        </div>

      </div>
  )
}

function Movies({movie, prev, next, index}) {  //Блок с темой фильмов

      return (
          <div className="films"
                key={idx++}>
              {movie.map( (film) =>
                <Item
                  name={film.title}
                  vote={film.vote_average}
                  date={film.release_date}
                  img={film.backdrop_path}
                  overview={film.overview}

                />
              )
            }
            <button  onClick={ (e)=> {prev(e)} }
                      className={`${movieClass[index]}`}>
                    Prev Page
            </button>

              <button onClick={ (e) => {}}>
                  Next 20 films
              </button>

            <button onClick={ (e)=> {next(e)} }
                    className={`${movieClass[index]}`}>
                    Next Page
            </button>
        </div>
      )
}


class App extends React.Component {
    state = {
      trandMovie: null,
      sciFiMovie: null,
      camedyMovie: null
    }

    findNextPage = (id) => {  //ищем  следующую страницу
      const {trandMovie, sciFiMovie, camedyMovie} = this.state;
        if(id === 0) { return trandMovie.page >= 1 ? trandMovie.page + 1 : 2}
        if(id === 1) { return sciFiMovie.page >= 1 ? sciFiMovie.page + 1 : 2}
        if(id === 2) { return camedyMovie.page >= 1 ? camedyMovie.page + 1 : 2}
    }

    findPrevPage = (id) => {
        const {trandMovie, sciFiMovie, camedyMovie} = this.state;
        if(id === 0) { return trandMovie.page > 1 ? trandMovie.page - 1 : 1}
        if(id === 1) { return sciFiMovie.page > 1 ? sciFiMovie.page - 1 : 1}
        if(id === 2) { return camedyMovie.page > 1 ? camedyMovie.page - 1 : 1}
    }



  async componentDidMount() {
      await movies.map( (item, index) => {

           return  movieDb.getResourse(item).then( (body) => {
                   index === 0 ? this.setState({trandMovie: body}) :
                   index === 1 ? this.setState({sciFiMovie: body}) :
                                 this.setState({camedyMovie: body})
           }
        );
    });
  }



  async nextPage (e)  {

      let index;
      movieClass.map( (item, id) =>
          e.currentTarget.className === item ? index = id : false //узнаем ИД класса
      )
      const page = this.findNextPage(index);

      await movieDb.getResourseNext(movies[index], page).then( (body)=> {

          index === 0 ? this.setState({trandMovie: body}) :
          index === 1 ? this.setState({sciFiMovie: body}) :
                        this.setState({camedyMovie: body})
      });
  }

  async prevtPage (e)  {

      let index;
      movieClass.map( (item, id) =>
          e.currentTarget.className === item ? index = id : false
      )
      const page = this.findPrevPage(index);

      await movieDb.getResourseNext(movies[index], page).then( (body)=> {
          index === 0 ? this.setState({trandMovie: body}) :
          index === 1 ? this.setState({sciFiMovie: body}) :
                        this.setState({camedyMovie: body})
      });


  }

    render() {
        if(!this.state.trandMovie || !this.state.sciFiMovie || !this.state.camedyMovie){
            return <div>
                is Loading....
            </div>
        }

        const trendMovies = this.state.trandMovie.results;
        const sciFiMovie = this.state.sciFiMovie.results;
        const camedyMovie = this.state.camedyMovie.results;

      return (
        <div className="App">
             <h2>Trending Now</h2>
             <Movies movie={trendMovies}
                    index={0}
                    next={ (e)=>{this.nextPage(e)}}
                    prev={ (e)=> {this.prevtPage(e)}}

             />
          <h2>Sci-Fi Movies</h2>
            <Movies movie={sciFiMovie}
                   index={1}
                   next={ (e)=>{this.nextPage(e)}}
                   prev={ (e)=> {this.prevtPage(e)}}

            />
            <h2>Camedy Movies</h2>
            <Movies movie={camedyMovie}
                    index={2}
                    next={ (e)=>{this.nextPage(e)}}
                    prev={ (e)=> {this.prevtPage(e)}}

            />
        </div>
      );
    }
  }

export default App;
