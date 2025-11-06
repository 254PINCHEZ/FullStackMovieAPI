interface MovieToWatch {
    movie_id: number
    movie_name: string
    release_date: string
    is_watched: boolean
    created_at: string
}

interface MovieCardProps {
    movie: MovieToWatch;
    deleteMovie?: (id: number) => void;
    toggleWatched?: (id: number) => void;
}

const MovieCard = ({ movie, deleteMovie, toggleWatched }: MovieCardProps) => {
    return (
        <div
            style={{
                background: 'white',
                borderRadius: '15px',
                padding: '20px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                border: `3px solid ${movie.is_watched ? '#00b894' : '#fdcb6e'}`,
                cursor: 'pointer',
                position: 'relative'
            }}>
            {/* Status Badge */}
            <div
                style={{
                    position: 'absolute',
                    top: '3px',
                    right: '15px',
                    background: movie.is_watched ? '#00b894' : '#fdcb6e',
                    color: 'white',
                    padding: '5px 12px',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    fontWeight: 'bold'
                }}>
                {movie.is_watched ? '✅ Watched' : '⏰ To Watch'}
            </div>


            {/* Movie Title */}
            <h2
                style={{
                    color: '#2d3436',
                    fontSize: '1.4rem',
                    marginBottom: '10px',
                    fontWeight: 'bold',
                    lineHeight: '1.3'
                }}>
                {movie.movie_name}
            </h2>

            {/* Movie Details */}
            <div style={{ marginBottom: '15px' }}>
                <p
                    style={{
                        margin: '8px 0',
                        color: '#636e72',
                        fontSize: '1.0rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                    <span>📅</span>
                    <strong>Release:</strong> {new Date(movie.release_date).toLocaleDateString()}
                </p>

                <p
                    style={{
                        margin: '8px 0',
                        color: '#636e72',
                        fontSize: '1.0rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                    <span>📝</span>
                    <strong>Added:</strong> {new Date(movie.created_at).toLocaleDateString()}
                </p>
            </div>

            {/* Status Indicator */}
            <div style={{
                padding: '12px',
                background: movie.is_watched ? '#d1f2eb' : '#fef9e7',
                borderRadius: '10px',
                textAlign: 'center',
                fontWeight: 'bold',
                color: movie.is_watched ? '#00b894' : '#e17055',
                fontSize: '0.9rem'
            }}>
                {movie.is_watched
                    ? '🍿 Already enjoyed this movie!'
                    : '🎯 Ready to watch next!'
                }
            </div>

                {/* Add btn later */}
            {/* Button to delete and mark as watched */}
            <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                <button
                    style={{
                        flex: '1',
                        background: movie.is_watched ? '#00b894' : '#fdcb6e',
                        color: 'white',
                        border: 'none',
                        padding: '10px 15px',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                    
                >
                    {movie.is_watched ? '↩️ Mark Unwatched' : '✅ Mark Watched'}
                </button>
                <button
                        onClick={() => deleteMovie && deleteMovie(movie.movie_id)}
                    style={{
                        background: '#e17055',
                        color: 'white',
                        border: 'none',
                        padding: '10px 15px',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                >
                    🗑️ Remove
                </button>
            </div>
        </div>
    )
}

export default MovieCard