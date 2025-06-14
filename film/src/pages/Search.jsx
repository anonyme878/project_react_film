import React, { useState } from 'react';
import { 
  Container, 
  TextField, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Typography,
  Box,
  CircularProgress,
  Paper
} from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Search = () => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=${import.meta.env.VITE_TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=fr-FR`
      );
      setMovies(response.data.results);
    } catch (err) {
      setError('Erreur lors de la recherche des films');
      console.error('Erreur de recherche:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth={false} sx={{ 
      flexGrow: 1, 
      display: 'flex', 
      flexDirection: 'column',
      width: '100%',
      px: { xs: 2, sm: 3, md: 4 }
    }}>
      <Paper elevation={3} sx={{ 
        p: 4, 
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column',
        width: '100%'
      }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
          Rechercher un film
        </Typography>

        <Box component="form" onSubmit={handleSearch} sx={{ mb: 4 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Rechercher un film"
                variant="outlined"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                size="large"
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
                disabled={loading}
                sx={{ 
                  height: '56px',
                  fontSize: '1.1rem'
                }}
              >
                {loading ? <CircularProgress size={24} /> : 'Rechercher'}
              </Button>
            </Grid>
          </Grid>
        </Box>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
          <Grid container spacing={3}>
            {movies.map((movie) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
                <Card 
                  component={Link} 
                  to={`/movie/${movie.id}`}
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    textDecoration: 'none',
                    '&:hover': {
                      transform: 'scale(1.02)',
                      transition: 'transform 0.2s ease-in-out'
                    }
                  }}
                >
                  <CardMedia
                    component="img"
                    height="400"
                    image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div" noWrap>
                      {movie.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(movie.release_date).toLocaleDateString('fr-FR')}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default Search; 