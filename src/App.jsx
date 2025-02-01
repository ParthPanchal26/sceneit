import { useEffect, useState } from 'react'
import './App.css'
import Search from './components/Search'
import Loader from './components/Loader';

const API_BASE_URL = "https://api.themoviedb.org/3";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

function App() {

  const [searchTerm, setSearchTerm] = useState('')
  const [errorMsg, setErrorMsg] = useState(null);
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMovies = async () => {
    setIsLoading(true);
    setErrorMsg('');

    try {
      const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);

      if (!response) {
        throw new Error("Failed to fetch movies");
      }

      const data = await response.json()

      if (data.Response === 'False') {
        setErrorMsg(data.Error || 'Failed to fetch movies');
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);

    } catch (error) {
      console.log(`${error}`);
      setErrorMsg(`Error while fetching movies!`);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchMovies();
  }, [])

  return (
    <main>

      <div className='pattern' />

      <div className='wrapper'>
        <header className='sm:-mt-18'>
          <img src="./hero.png" alt="" />
          <h1>Find <span className="text-gradient">Movies</span> You Enjoy Without The Hassle</h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        <section className='all-movies'>
          <h2 className='mt-[20px]'>All Movies</h2>

          {isLoading ? (
            <Loader />
          ) : errorMsg ? (
            <p className='text-red-500'>{errorMsg}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <p key={movie.id} className='text-white'>{movie.title}</p>
              ))}
            </ul>
          )}

        </section>

      </div>

    </main>
  )

}

export default App
