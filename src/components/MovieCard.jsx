import { Link } from "react-router-dom"

const MovieCard = ({ movie: { id, title, vote_average, release_date, poster_path, original_language } }) => {

    return (
        <div className='movie-card'>
            <Link to={`/sceneit/movie-details/${id}`}>
                <img src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : './No-movie.png'} alt={title} />
            </Link>

            <div className="mt-4">
                <h3>{title}</h3>

                <div className="content">
                    <div className="rating">
                        <img src="star.svg" alt="Star Icon" />
                        <p>{vote_average ? vote_average.toFixed(1) : 'N/A'}</p>
                    </div>
                    <span className='text-purple-800'>•</span>
                    <p className='lang'>{original_language ? original_language : 'N/A'}</p>
                    <span className='text-purple-800'>•</span>
                    <p className="year">
                        {release_date ? release_date.split('-')[0] : 'N/A'}
                    </p>
                </div>
            </div>

        </div>
    )
}

export default MovieCard