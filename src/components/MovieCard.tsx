import { useReducer } from "react";

interface MovieToWatch {
  movie_id: number;
  movie_name: string;
  release_date: string;
  is_watched: boolean;
  created_at: string;
}

interface MovieCardProps {
  movie: MovieToWatch;
  deleteMovie?: (id: number) => void;
  toggleWatched?: (id: number, newStatus: boolean) => void;
}

type State = {
  isWatched: boolean;
  loading: boolean;
};

type Action =
  | { type: "TOGGLE_WATCHED_START" }
  | { type: "TOGGLE_WATCHED_SUCCESS"; payload: boolean }
  | { type: "TOGGLE_WATCHED_END" };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "TOGGLE_WATCHED_START":
      return { ...state, loading: true };
    case "TOGGLE_WATCHED_SUCCESS":
      return { ...state, isWatched: action.payload };
    case "TOGGLE_WATCHED_END":
      return { ...state, loading: false };
    default:
      return state;
  }
};

const MovieCard = ({ movie, deleteMovie, toggleWatched }: MovieCardProps) => {
  const [state, dispatch] = useReducer(reducer, {
    isWatched: movie.is_watched,
    loading: false,
  });

  const handleToggleWatched = async () => {
    dispatch({ type: "TOGGLE_WATCHED_START" });
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const newStatus = !state.isWatched;
    dispatch({ type: "TOGGLE_WATCHED_SUCCESS", payload: newStatus });
    if (toggleWatched) toggleWatched(movie.movie_id, newStatus);
    dispatch({ type: "TOGGLE_WATCHED_END" });
  };

  return (
    <div
      style={{
        background: "white",
        borderRadius: "15px",
        padding: "20px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        border: "3px solid #f6b93b",
        transition: "transform 0.3s ease",
      }}
    >
      <div
        style={{
          position: "relative",
          textAlign: "left",
        }}
      >
        {/* Status Badge */}
        <span
          style={{
            position: "absolute",
            top: "-15px",
            right: "0",
            background: state.isWatched ? "#00b894" : "#fdcb6e",
            color: "#fff",
            padding: "6px 12px",
            borderRadius: "12px",
            fontWeight: "bold",
            fontSize: "0.85rem",
          }}
        >
          {state.isWatched ? "✅ Watched" : "🎯 To Watch"}
        </span>

        <h3
          style={{
            color: "#2d3436",
            fontSize: "1.4rem",
            marginBottom: "10px",
            fontWeight: "bold",
          }}
        >
          {movie.movie_name}
        </h3>

        <p
          style={{
            margin: "5px 0",
            fontSize: "0.95rem",
            color: "#636e72",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          📅 <strong>Release:</strong>{" "}
          {new Date(movie.release_date).toLocaleDateString()}
        </p>

        <p
          style={{
            margin: "5px 0 15px 0",
            fontSize: "0.95rem",
            color: "#636e72",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          📘 <strong>Added:</strong>{" "}
          {new Date(movie.created_at).toLocaleDateString()}
        </p>

        <div
          style={{
            background: state.isWatched ? "#d1f2eb" : "#fff3cd",
            color: state.isWatched ? "#00b894" : "#e17055",
            padding: "10px",
            borderRadius: "10px",
            textAlign: "center",
            fontWeight: "bold",
            marginBottom: "15px",
          }}
        >
          {state.isWatched
            ? "🍿 Already enjoyed this movie!"
            : "🎯 Ready to watch next!"}
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={handleToggleWatched}
            disabled={state.loading}
            style={{
              flex: "1",
              background: state.isWatched
                ? "#00b894"
                : state.loading
                ? "#ffeaa7"
                : "#fdcb6e",
              color: "white",
              border: "none",
              padding: "10px",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: state.loading ? "wait" : "pointer",
              transition: "0.3s ease",
            }}
          >
            {state.loading
              ? "⏳ Updating..."
              : state.isWatched
              ? "↩️ Mark Unwatched"
              : "✅ Mark Watched"}
          </button>

          <button
            onClick={() => deleteMovie && deleteMovie(movie.movie_id)}
            style={{
              background: "#e17055",
              color: "white",
              border: "none",
              padding: "10px",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
              flex: "1",
            }}
          >
            🗑️ Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
