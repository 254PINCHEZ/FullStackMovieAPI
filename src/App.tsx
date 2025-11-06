
import { useEffect, useState } from 'react'
import MovieCard from './components/MovieCard'
import './App.css'
import axios from 'axios'
import { useForm, type SubmitHandler } from 'react-hook-form'

interface MovieToWatch {
  movie_id: number
  movie_name: string
  release_date: string
  is_watched: boolean
  created_at: string
}

type FormValues = {
  movie_name: string
  release_date: string
  is_watched: boolean
}

// const moviesToWatch: MovieToWatch[] = [
//   {
//     movie_id: 1,
//     movie_name: "Inception",
//     release_date: "2010-07-16",
//     is_watched: true,
//     created_at: "2023-10-01T10:00:00Z"
//   },
//   {
//     movie_id: 2,
//     movie_name: "The Matrix",
//     release_date: "1999-03-31",
//     is_watched: false,
//     created_at: "2023-10-02T11:30:00Z"
//   }
// ];

function App() {

  const [movies, setMovies] = useState<MovieToWatch[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [adding, setAdding] = useState<boolean>(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>();
  
  //add movie function
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      setAdding(true);
      const response = await axios.post('http://localhost:8080/api/movies', data);
      alert(response.data.message);
      fetchMovies(); // Refresh the movie list after adding a new movie
      reset(); // Clear the form
    } catch (error) {
      console.error('Error adding movie:', error);
    } finally {
      setAdding(false);
    }
  };


  //fetch movies from local data or API
  const fetchMovies = async () => {
    setLoading(true);
    try {
      const response = await axios.get<MovieToWatch[]>('http://localhost:8080/api/movies');
      // console.log("data:",response)
      setMovies(response.data);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  }

  // Delete movie function
  const deleteMovie = async (id: number) => {
    try {
      const response = await axios.delete(`http://localhost:8080/api/movies/${id}`);
      alert(response.data.message);
      fetchMovies(); // Refresh the movie list after deletion
    } catch (error) {
      console.error('Error deleting movie:', error);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchMovies();
  }, []);


  return (

    <div style={{
      padding: '5px',
      maxWidth: '1200px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '5px',
        color: 'white'
      }}>
        <h2 > Movies to Watch </h2>
      </div>
      {/* Add Movie Form */}
      <div style={{
        background: 'white',
        padding: '15px',
        maxWidth: '600px',
        margin: '0 auto 30px auto',
        borderRadius: '15px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
      }}>
        <h3
          style={{
            color: '#333',
            marginTop: '0',
            marginBottom: '2px',
            textAlign: 'center'
          }}>
          🎬 Add New Movie
        </h3>
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ display: 'flex', gap: '2px' }}>
            <input
              {...register("movie_name", { required: "Movie name is required!", minLength: { value: 2, message: "Movie name must be at least 2 characters!" } })}
              placeholder="🎭 Movie Name"
              style={{
                flex: '1',
                padding: '8px',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none'
              }}
            />
            {errors.movie_name && <span style={{ color: 'red' }}>{errors.movie_name.message}</span>}
            <input
              {...register("release_date", { required: "Release date is required!", pattern: { value: /^\d{4}-\d{2}-\d{2}$/, message: "Invalid date format. Use YYYY-MM-DD." } })}
              type="date"
              style={{
                flex: '1',
                padding: '12px',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none'
              }}
            />
            {errors.release_date && <span style={{ color: 'red' }}>{errors.release_date.message}</span>}
          </div>

          <button
            type="submit"
            style={{
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '8px',
              fontSize: '1.1rem',
              cursor: 'pointer',
              fontWeight: 'bold',
              marginTop: '2px'
            }}
          >
            {/* ➕ Add Movie */}
            {adding ? 'Adding...' : '➕ Add Movie'}
          </button>
        </form>
      </div>

      {/* Movies Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '25px',
          padding: '0 10px'
        }}>
        {/* {movies.map(movie => (
          <MovieCard key={movie.movie_id} movie={movie} />
        ))} */}

        {loading ? (
          <div style={{
            gridColumn: '1 / -1',
            background: 'rgba(255,255,255,0.9)',
            borderRadius: '15px',
            padding: '30px',
            color: '#667eea',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '15px' }}>⏳</div>
            <p style={{ margin: 0, fontSize: '1.0rem', fontWeight: '600' }}>Loading movies...</p>
          </div>
        ) : movies && movies.length === 0 ? (
          <div
            style={{
              gridColumn: '1 / -1',
              background: 'rgba(255,255,255,0.06)',
              borderRadius: '12px',
              padding: '28px',
              color: 'white',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>

            <p style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}> 🎬 No movies to display. 😏</p>
            <button onClick={fetchMovies} style={{
              marginTop: '10px',
              padding: '8px 14px',
              borderRadius: '8px',
              border: 'none',
              background: '#ffffff',
              color: '#5b21b6',
              fontWeight: 700,
              cursor: 'pointer'
            }}>Refresh</button>
          </div>
        ) : (
          movies.map(movie => (
            <MovieCard key={movie.movie_id} movie={movie} deleteMovie={deleteMovie}  />
          ))
        )}
      </div>
    </div>

  )
}

export default App
