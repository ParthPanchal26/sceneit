import { useEffect, useState } from 'react'
import Search from '../components/Search'
import Loader from '../components/Loader';
import MovieCard from '../components/MovieCard';
import { useDebounce } from 'react-use';
import { getTrendingMovies, updateSearchCount } from '../appwrite'
import { Link } from 'react-router-dom';

const API_BASE_URL = "https://api.themoviedb.org/3";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

function Home() {

  const [searchTerm, setSearchTerm] = useState('')
  const [errorMsg, setErrorMsg] = useState(null);
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debounceSearchTerm, setDebounceSearchTerm] = useState('');
  const [trendingMovies, setTrendingMovies] = useState([]);
// console.log(movieList)
  useDebounce(() => setDebounceSearchTerm(searchTerm), 300, [searchTerm])

  const fetchMovies = async (query = '') => {
    setIsLoading(true);
    setErrorMsg('');

    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

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

      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }

    } catch (error) {
      console.log(`${error}`);
      setErrorMsg(`Error while fetching movies!`);
    } finally {
      setIsLoading(false);
    }
  }

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    loadTrendingMovies();
  }, [])

  useEffect(() => {
    fetchMovies(debounceSearchTerm);
  }, [debounceSearchTerm])

  return (
    <main>

      <div className='pattern' />

      <div className='wrapper'>
        <img src="./sceneit.png" alt="sceneIt_log" style={{ "height": '10%', "width": "180px", "objectFit": "contain" }} className='m-auto logo' />
        <header className='sm:-mt-10'>
          <img src="./hero.png" alt="" />
          <h1 className='sm:-mt-10'>Find <span className="text-gradient">Movies</span> You Enjoy Without The Hassle</h1>
        </header>
          {/* <div className="sticky-search"> */}
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          {/* </div> */}

        {trendingMovies.length > 0 && (
          <section className='trending'>
            <h2 className='underline'>Trending Movies</h2>

            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <Link to={`/sceneit/movie-details/${movie.movie_id}`}>
                    <img src={movie.poster_url} alt={movie.title} />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
        <hr className='text-white mb-12' />

        <section className='all-movies'>
          <h2 className='underline'>All Movies</h2>

          {isLoading ? (
            <Loader />
          ) : errorMsg ? (
            <p className='text-red-500'>{errorMsg}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}

        </section>

      </div>

    </main>
  )

}

export default Home;
