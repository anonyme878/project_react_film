import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  Chip,
  CircularProgress,
  Rating,
  Divider,
  Button
} from '@mui/material';
import axios from 'axios';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        console.log('ID reçu:', id);
        const movieId = parseInt(id);
        console.log('ID converti:', movieId);

        // Vérifier d'abord si c'est un film ajouté manuellement
        const customMovies = JSON.parse(localStorage.getItem('customMovies') || '[]');
        console.log('Films personnalisés:', customMovies);
        
        const customMovie = customMovies.find(m => m.id === movieId);
        console.log('Film personnalisé trouvé:', customMovie);

        if (customMovie) {
          // Si c'est un film personnalisé, utiliser directement ses données
          setMovie({
            ...customMovie,
            overview: customMovie.description,
            release_date: customMovie.releaseDate
          });
          setLoading(false);
          return;
        }

        // Si ce n'est pas un film personnalisé, chercher dans l'API TMDb
        console.log('Recherche dans l\'API TMDb...');
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=${import.meta.env.VITE_TMDB_API_KEY}`
        );
        console.log('Réponse de l\'API:', response.data);
        setMovie(response.data);
      } catch (err) {
        console.error('Erreur détaillée:', err);
        setError('Erreur lors du chargement des détails du film');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !movie) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Typography color="error">{error || 'Film non trouvé'}</Typography>
      </Box>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Non spécifiée';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (err) {
      console.error('Erreur de formatage de date:', err);
      return 'Date invalide';
    }
  };

  return (
    <Container maxWidth={false} sx={{ flexGrow: 1, width: '100%' }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 3 }}
        >
          Retour
        </Button>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            {movie.poster_path ? (
              <Box
                component="img"
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                sx={{
                  width: '100%',
                  borderRadius: 1,
                  boxShadow: 3
                }}
              />
            ) : (
              <Box
                sx={{
                  width: '100%',
                  height: 500,
                  bgcolor: 'grey.800',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 1,
                  color: 'grey.500'
                }}
              >
                <Typography variant="h6">Pas d'image disponible</Typography>
              </Box>
            )}
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography variant="h3" component="h1" gutterBottom>
              {movie.title}
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Rating
                value={movie.vote_average / 2}
                precision={0.5}
                readOnly
                sx={{ mr: 1 }}
              />
              <Typography variant="body2" color="text.secondary" component="span">
                ({movie.vote_average.toFixed(1)}/10)
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography variant="body1" paragraph>
              {movie.overview || movie.description || 'Aucune description disponible'}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Informations
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Date de sortie : {formatDate(movie.release_date || movie.releaseDate)}
              </Typography>
              {movie.isCustom && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Film ajouté manuellement
                </Typography>
              )}
            </Box>

            <Box sx={{ my: 2 }}>
              {movie.genres.map((genre) => (
                <Chip
                  key={genre.id}
                  label={genre.name}
                  sx={{ mr: 1, mb: 1 }}
                />
              ))}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>
              Synopsis
            </Typography>
            <Typography variant="body1" paragraph>
              {movie.overview}
            </Typography>

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Budget: {movie.budget.toLocaleString('fr-FR')} €
              </Typography>
              <Typography variant="subtitle2">
                Revenus: {movie.revenue.toLocaleString('fr-FR')} €
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default MovieDetails; 