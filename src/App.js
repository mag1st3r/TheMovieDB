import React, {Component} from 'react';
import MovieDbServices from './MovieDbServices'
import './App.css';

const movieDb = new MovieDbServices();
let idx = 100;
const movies = ['/discover/movie', '/genre/878/movies', '/genre/35/movies'];

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

function Movies({movie, prev, next, index, loadMore }) {  //Блок с темой фильмов

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
            
              <button onClick={ () => {loadMore(index)}}>
                  Next 20 films
              </button>

        </div>
      )
}


class App extends React.Component {
    state = {

        0: {
            loading: false
        },

        1: {
            loading: false
        },

        2 :{
            loading: false
        }

    }


   async loadMore (id)  {
        let nextPage = this.state[id].page + 1;


        await movieDb.getResourseNext(movies[id], nextPage).then( (body)=> {
            let {page, results} = body;

            this.setState({
                [id]: {page: page, res: [...this.state[id].res, ...results], loading: true}
            });


        });

    }


  async componentDidMount() {
      await movies.map( (item, index) => {

           return  movieDb.getResourse(item).then( (body) => {
               let {page, results} = body;
                   index === 0 ? this.setState({ 0: { page: page, res: results, loading: true } } ) :
                   index === 1 ? this.setState({ 1: { page: page, res: results, loading: true } } ) :
                                 this.setState({ 2: { page: page, res: results, loading: true } } )
           }
        );

    });
  }




    render() {
        console.log(this.state);
        if(!this.state[0].loading || !this.state[1].loading || !this.state[2].loading){
            return <div>
                is Loading....
            </div>
        }
        const trendMovies = this.state[0].res;
        const sciFiMovie = this.state[1].res;
        const camedyMovie = this.state[2].res;

      return (
        <div className="App">
             <h2>Trending Now</h2>
             <Movies movie={trendMovies}
                    index={0}
                    loadMore={ (e) => this.loadMore(e)}

             />
          <h2>Sci-Fi Movies</h2>
            <Movies movie={sciFiMovie}
                   index={1}
                   loadMore={ (e) => this.loadMore(e)}

            />
            <h2>Camedy Movies</h2>
            <Movies movie={camedyMovie}
                    index={2}
                    loadMore={ (e) => this.loadMore(e)}

            />
        </div>
      );
    }
  }

export default App;
