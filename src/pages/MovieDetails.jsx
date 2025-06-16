import axios from 'axios';
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './MovieDetails.css'

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

const API_DETAILS = "https://api.themoviedb.org/3/movie";
const API_POSTER_IMG = "https://image.tmdb.org/t/p/w500";
const API_WATCH_PROVIDERS = `watch/providers`;
const API_VIDEOS = "videos?language=en-US";
const API_VIDEO_TRAILER = "https://www.youtube.com/embed" // ?v=${key}

const MovieDetails = () => {

  const [movieDetails, setMovieDetails] = useState({});
  const [genres, setGenres] = useState([]);
  const [originCountry, setOriginCountry] = useState([]);
  const [productionCompanies, setProductionCompanies] = useState([]);
  const [spokenLanguages, setSpokenLanguages] = useState([]);
  const [movieTrailerKey, setMovieTrailerKey] = useState('')
  const [providersAds, setProviders_ads] = useState('')
  const [providersBuy, setProviders_buy] = useState('')
  const [providersFlatRate, setProviders_FlatRate] = useState('')
  const [providersRent, setProviders_rent] = useState('')
  const [isVideoEnable, setIsVideoEnable] = useState(false)
  const [teaserKeys, setTeaserKeys] = useState([])

  const { id } = useParams();

  const fetchMovieDetails = async () => {
    try {
      const response = await axios(`${API_DETAILS}/${id}`, API_OPTIONS);
      setMovieDetails(response.data)
      setGenres(response.data.genres)
      setOriginCountry(response.data.origin_country)
      setProductionCompanies(response.data.production_companies)
      setSpokenLanguages(response.data.spoken_languages)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchMovieTrailer = async () => {
    try {
      const response = await axios(`${API_DETAILS}/${id}/${API_VIDEOS}`, API_OPTIONS)
      let videos = response.data.results;
      const { key } = videos.find(video => video.type === "Trailer");
      setMovieTrailerKey(key)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchMovieTeaser = async () => {
    try {
      const response = await axios(`${API_DETAILS}/${id}/${API_VIDEOS}`, API_OPTIONS)
      let teasers = response.data.results;
      const teaser_keys = teasers.filter(teaser => teaser.type === "Teaser");
      setTeaserKeys(teaser_keys)
      console.log(teaser_keys);
    } catch (error) {
      console.log(error)
    }
  }

  const fetchMovieProviders = async () => {
    try {
      const response = await axios(`${API_DETAILS}/${id}/${API_WATCH_PROVIDERS}`, API_OPTIONS);
      let providers = response.data.results
      const provider = providers["IN"];
      setProviders_ads(provider?.ads || '');
      setProviders_buy(provider?.buy || '');
      setProviders_rent(provider?.rent || '');
      setProviders_FlatRate(provider?.flatrate || '')
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchMovieDetails();
    fetchMovieTrailer();
    fetchMovieTeaser();
    fetchMovieProviders();
  }, [])

  useEffect(() => {
    console.log(movieTrailerKey)
  }, [movieTrailerKey])

  const handleRevert = () => {
    setIsVideoEnable(false)
    console.log(isVideoEnable)
  }

  return (
    <>
      <img src={movieDetails?.poster_path ? `${API_POSTER_IMG}${movieDetails?.poster_path}` : './No-movie.png'} alt={movieDetails?.title} className='invisible md:visible absolute right-10 object-cover w-[1000px] blur-3xl h-[95vh]' />
      <div className="absolute inset-5 bg-black/10 invisible"></div>
      <div className='flex flex-col md:flex-row md:gap-4 lg:gap-10 md:relative text-wrap'>

        <div className={`md:hidden`}>
          {
            isVideoEnable
              ? <div>
                <iframe src={`${API_VIDEO_TRAILER}/${movieTrailerKey}?controls=1`} className='w-full h-[300px]'>
                </iframe>
                <div className='font-extrabold text-4xl text-white text-right mr-3' onClick={handleRevert}>&larr;</div>
              </div>
              : <img onClick={() => setIsVideoEnable(true)} src={movieDetails?.poster_path ? `${API_POSTER_IMG}${movieDetails?.poster_path}` : './No-movie.png'} alt={movieDetails} className='block m-auto' />
          }
        </div>

        <div className='flex flex-col'>
          <img src={movieDetails?.poster_path ? `${API_POSTER_IMG}${movieDetails?.poster_path}` : './No-movie.png'} alt={movieDetails} className='hidden md:block md:h-[90vh] md:pt-20 md:pl-20' />
          <div className='hidden md:block'>
            <p className='text-3xl text-white pl-20 mt-10'>{teaserKeys.length > 1 ? "Teasers" : "Teaser"}</p>
            {
              teaserKeys.map((key) => <iframe key={key.id} src={`${API_VIDEO_TRAILER}/${key.key}?controls=1`} className='w-auto h-[45vh] pl-20 py-5'>
              </iframe>)
              // console.log(teaserKeys)
            }
          </div>
        </div>

        <div className='py-6 px-6 md:py-20'>
          <section id="heading" className='md:align-middle flex flex-col md:flex-col gap-3 md:gap-6 overflow-x-auto'>

            <div className='flex gap-3'>
              <p className='text-xs md:text-xl text-white font-extrabold'>{movieDetails?.original_language}</p>
              <h2 className='text-4xl md:text-7xl bg-gradient-to-r from-[#d6c7ff] to-[#ab8bff] bg-clip-text text-transparent'>{movieDetails?.title}</h2>
            </div>

            <div className='flex flex-col'>
              <p className='text-white text-xs md:text-[14px]'><span className='font-medium'>Original Title:</span> {movieDetails?.original_title}</p>
              <p className='text-white text-xs md:text-[14px]'><span className='font-medium'>Vote Average:</span> {movieDetails?.vote_average != null ? movieDetails.vote_average.toFixed(1) : "N/A"}</p>
            </div>

          </section>

          <section id='genres' className='text-white mt-2 md:text-[14px] flex'>
            <p className='overflow-x-auto font-medium'>Genres&nbsp;:&nbsp;</p>
            <span>
              {
                genres.map((genre) => genre.name).join(', ')
              }
            </span>
          </section>

          {
            movieDetails?.homepage &&
            <section id='homepage' className='text-white mt-2 md:text-[14px]'>
              Homepage: <a className='text-blue-500 underline underline-offset-3' href={`${movieDetails.homepage}`}>click here</a>
            </section>
          }

          <section id='origin_country' className='text-white mt-2 md:text-[14px] flex'>
            <p className='overflow-x-auto font-semibold'>Origin Country&nbsp;:&nbsp;</p>
            <span>{
              originCountry.map((country) => country).join(', ')
            }
            </span>
          </section>

          <section id='production_companies' className={productionCompanies.length > 1 ? "flex flex-col md:flex-row text-white mt-2 md:text-[14px] gap-2" : "text-white mt-2 md:text-[14px] flex gap-2"}>
            <p className='overflow-x-auto font-semibold'>Production Companies&nbsp;:&nbsp;</p>
            <span>
              {
                // console.log("productionCompanies", productionCompanies)
                productionCompanies.map((company) => company?.name).join(', ')
              }
            </span>
          </section>

          <section id='release_date' className='text-white mt-2 md:text-[14px] flex'>
            <p className='overflow-x-auto font-semibold'>Release Date&nbsp;:&nbsp;</p>
            <span>{
              movieDetails?.release_date
            }
            </span>
          </section>

          {
            movieDetails?.revenue > 0 &&
            <section id='revenue' className='text-white mt-2 md:text-[14px] flex'>
              <p className='overflow-x-auto font-semibold'>Revenue&nbsp;:&nbsp;</p>
              <span>
                {
                  movieDetails?.revenue
                }&nbsp;USD
              </span>
            </section>
          }

          <section id='languages' className='text-white mt-2 md:text-[14px] flex'>
            <p className='overflow-x-auto font-semibold'>Spoken Languages&nbsp;:&nbsp;</p>
            <span>
              {
                spokenLanguages.map((language) => language?.english_name).join(', ')
              }
            </span>
          </section>

          <section id='overview' className='text-white mt-2'>
            <p className='overflow-x-auto text-justify md:pr-10'>
              <span className='text-2xl font-bold bg-gradient-to-r from-[#d6c7ff] to-[#ab8bff] bg-clip-text text-transparent'>Overview</span>
              <br />
              {
                movieDetails?.overview
              }
              <br />
              {
                movieDetails?.tagline && <span className='text-[13px]'><span className='font-medium'>Tagline:</span>&nbsp;{movieDetails?.tagline}</span>
              }
            </p>
          </section>

          <section id="watch_options" className='text-white mt-2'>
            <p className='text-2xl font-semibold'>Watch Options</p>
            <div className="flex flex-col gap-6">
              {
                providersAds &&
                <div>
                  <div>Ads</div>
                  <div className="flex flex-row gap-3">
                    {
                      providersAds && providersAds.map((provider_ads) => (<div key={provider_ads?.provider_id}>
                        <img src={`${API_POSTER_IMG}/${provider_ads?.logo_path}`} alt={`${provider_ads?.provider_name}`} className='w-10 md:w-15 rounded-sm' title={`${provider_ads?.provider_name}`} />
                      </div>
                      ))
                    }
                  </div>
                </div>
              }

              {
                providersBuy &&
                <div>
                  <div>Buy</div>
                  <div className="flex flex-row gap-3">
                    {
                      providersBuy && providersBuy.map((provider_buy) => (<div key={provider_buy?.provider_id}>
                        <img src={`${API_POSTER_IMG}/${provider_buy?.logo_path}`} alt={`${provider_buy?.provider_name}`} className='w-10 md:w-15 rounded-sm' title={`${provider_buy?.provider_name}`} />
                      </div>
                      ))
                    }
                  </div>
                </div>
              }

              {
                providersRent &&
                <div>
                  <div>Rent</div>
                  <div className="flex flex-row gap-3">
                    {
                      providersRent && providersRent.map((provider_rent) => (<div key={provider_rent?.provider_id}>
                        <img src={`${API_POSTER_IMG}/${provider_rent?.logo_path}`} alt={`${provider_rent?.provider_name}`} className='w-10 md:w-15 rounded-sm' title={`${provider_rent?.provider_name}`} />
                      </div>
                      ))
                    }
                  </div>
                </div>
              }

              {
                providersFlatRate &&
                <div>
                  <div>Flatrate</div>
                  <div className="flex flex-row gap-3">
                    {
                      providersFlatRate && providersFlatRate.map((provider_flatrate) => (<div key={provider_flatrate?.provider_id}>
                        <img src={`${API_POSTER_IMG}/${provider_flatrate?.logo_path}`} alt={`${provider_flatrate?.provider_name}`} className='w-10 md:w-15 rounded-sm' title={`${provider_flatrate?.provider_name}`} />
                      </div>
                      ))
                    }
                  </div>
                </div>
              }

            </div>
          </section>

          <section id='trailer' className='text-white mt-4 hidden md:block'>
            <p className='text-4xl font-medium'>Trailer</p>
            <iframe src={`${API_VIDEO_TRAILER}/${movieTrailerKey}?controls=1`} className='w-[380px] h-[220px] md:w-[470px] md:h-[330px] rounded-md lg:min-w-[700px] lg:min-h-[400px]'>
            </iframe>
          </section>

          

        </div>
      </div >
    </>
  )
}

export default MovieDetails