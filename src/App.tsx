import { useEffect, useReducer } from "react";
import MovieCard from "./components/MovieCard";
import "./App.css";
import axios from "axios";
import { useForm, type SubmitHandler } from "react-hook-form";

interface MovieToWatch {
  movie_id: number;
  movie_name: string;
  release_date: string;
  is_watched: boolean;
  created_at: string;
}

type FormValues = {
  movie_name: string;
  release_date: string;
  is_watched: boolean;
};

type State = {
  movies: MovieToWatch[];
  loading: boolean;
  adding: boolean;
  error: string | null;
};

type Action =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: MovieToWatch[] }
  | { type: "FETCH_ERROR"; payload: string }
  | { type: "ADD_START" }
  | { type: "ADD_SUCCESS" }
  | { type: "ADD_END" };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, movies: action.payload };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "ADD_START":
      return { ...state, adding: true };
    case "ADD_SUCCESS":
      return { ...state, adding: false };
    case "ADD_END":
      return { ...state, adding: false };
    default:
      return state;
  }
};

function App() {
  const [state, dispatch] = useReducer(reducer, {
    movies: [],
    loading: false,
    adding: false,
    error: null,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const fetchMovies = async () => {
    dispatch({ type: "FETCH_START" });
    try {
      const response = await axios.get<MovieToWatch[]>(
        "http://localhost:8080/api/movies"
      );
      dispatch({ type: "FETCH_SUCCESS", payload: response.data });
    } catch (error) {
      dispatch({
        type: "FETCH_ERROR",
        payload: "Failed to fetch movies.",
      });
    }
  };

  const deleteMovie = async (id: number) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/movies/${id}`
      );
      alert(response.data.message);
      fetchMovies();
    } catch (error) {
      console.error("Error deleting movie:", error);
    }
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    dispatch({ type: "ADD_START" });
    try {
      const response = await axios.post(
        "http://localhost:8080/api/movies",
        data
      );
      alert(response.data.message);
      await fetchMovies();
      reset();
      dispatch({ type: "ADD_SUCCESS" });
    } catch (error) {
      console.error("Error adding movie:", error);
    } finally {
      dispatch({ type: "ADD_END" });
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const { movies, loading, adding, error } = state;

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "1200px",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        minHeight: "100vh",
      }}
    >
      <h2 style={{ color: "white", textAlign: "center", marginBottom: "30px" }}>
        Movies to Watch
      </h2>

      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "15px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          maxWidth: "600px",
          margin: "0 auto 40px auto",
        }}
      >
        <h3
          style={{
            textAlign: "center",
            marginBottom: "10px",
            color: "#2d3436",
          }}
        >
          🎬 Add New Movie
        </h3>

        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ display: "flex", gap: "10px", alignItems: "center" }}
        >
          <input
            {...register("movie_name", { required: "Movie name is required!" })}
            placeholder="🎭 Movie Name"
            style={{
              flex: "1",
              padding: "10px",
              border: "2px solid #e9ecef",
              borderRadius: "8px",
              fontSize: "1rem",
            }}
          />
          <input
            {...register("release_date", {
              required: "Release date is required!",
            })}
            type="date"
            style={{
              flex: "1",
              padding: "10px",
              border: "2px solid #e9ecef",
              borderRadius: "8px",
              fontSize: "1rem",
            }}
          />
          <button
            type="submit"
            style={{
              background: "linear-gradient(45deg, #667eea, #764ba2)",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            {adding ? "Adding..." : "➕ Add Movie"}
          </button>
        </form>

        {errors.movie_name && (
          <p style={{ color: "red", textAlign: "center", marginTop: "8px" }}>
            {errors.movie_name.message}
          </p>
        )}
        {errors.release_date && (
          <p style={{ color: "red", textAlign: "center", marginTop: "8px" }}>
            {errors.release_date.message}
          </p>
        )}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "25px",
        }}
      >
        {loading ? (
          <p
            style={{
              color: "white",
              textAlign: "center",
              gridColumn: "1 / -1",
            }}
          >
            Loading movies...
          </p>
        ) : error ? (
          <p
            style={{
              color: "red",
              textAlign: "center",
              gridColumn: "1 / -1",
            }}
          >
            {error}
          </p>
        ) : movies.length === 0 ? (
          <p
            style={{
              color: "white",
              textAlign: "center",
              gridColumn: "1 / -1",
            }}
          >
            🎬 No movies to display.
          </p>
        ) : (
          movies.map((movie) => (
            <MovieCard key={movie.movie_id} movie={movie} deleteMovie={deleteMovie} />
          ))
        )}
      </div>
    </div>
  );
}

export default App;
