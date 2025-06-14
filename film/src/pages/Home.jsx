import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  CircularProgress,
  Paper
} from '@mui/material';
import axios from 'axios';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // Récupérer les films populaires de l'API TMDb
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/popular?api_key=${import.meta.env.VITE_TMDB_API_KEY}`
        );

        // Récupérer les films ajoutés manuellement
        const customMovies = JSON.parse(localStorage.getItem('customMovies') || '[]');
        console.log('Films personnalisés récupérés:', customMovies);

        // Combiner les deux listes
        const allMovies = [...response.data.results, ...customMovies];
        console.log('Tous les films combinés:', allMovies);
        
        setMovies(allMovies);
      } catch (err) {
        console.error('Erreur lors du chargement des films:', err);
        setError('Erreur lors du chargement des films');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const handleMovieClick = (movieId) => {
    console.log('Clic sur le film avec ID:', movieId);
    navigate(`/movie/${movieId}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth={false} sx={{ flexGrow: 1, width: '100%' }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Films Populaires
        </Typography>
        <Grid container spacing={3}>
          {movies.map((movie) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    transition: 'transform 0.2s ease-in-out'
                  }
                }}
                onClick={() => handleMovieClick(movie.id)}
              >
                {movie.poster_path ? (
                  <CardMedia
                    component="img"
                    height="400"
                    image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                  />
                ) : (
                  <Box
                    sx={{
                      height: 400,
                      bgcolor: 'grey.800',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'grey.500'
                    }}
                  >
                    <Typography variant="h6">Pas d'image</Typography>
                  </Box>
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="h2" noWrap>
                    {movie.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {movie.release_date ? new Date(movie.release_date).getFullYear() : 'Date inconnue'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
};

export default Home; 