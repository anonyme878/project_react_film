import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert
} from '@mui/material';

const AddMovie = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    releaseDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Validation des champs requis
      if (!formData.title.trim()) {
        throw new Error('Le titre est requis');
      }
      if (!formData.description.trim()) {
        throw new Error('La description est requise');
      }

      // Récupérer les films existants
      const existingMovies = JSON.parse(localStorage.getItem('customMovies') || '[]');
      console.log('Films existants:', existingMovies);

      // Créer un nouveau film avec un ID unique
      const newMovie = {
        id: Date.now(), // Utiliser timestamp comme ID unique
        title: formData.title,
        description: formData.description,
        releaseDate: formData.releaseDate || null,
        isCustom: true
      };
      console.log('Nouveau film à ajouter:', newMovie);

      // Ajouter le nouveau film
      const updatedMovies = [...existingMovies, newMovie];
      console.log('Liste mise à jour:', updatedMovies);

      // Sauvegarder dans localStorage
      localStorage.setItem('customMovies', JSON.stringify(updatedMovies));

      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      console.error('Erreur lors de l\'ajout du film:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth={false} sx={{ flexGrow: 1, width: '100%' }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Ajouter un Film
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Film ajouté avec succès !
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="title"
            label="Titre"
            name="title"
            value={formData.title}
            onChange={handleChange}
            error={error && !formData.title}
            helperText={error && !formData.title ? 'Le titre est requis' : ''}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            id="description"
            label="Description"
            name="description"
            multiline
            rows={4}
            value={formData.description}
            onChange={handleChange}
            error={error && !formData.description}
            helperText={error && !formData.description ? 'La description est requise' : ''}
          />

          <TextField
            margin="normal"
            fullWidth
            id="releaseDate"
            label="Date de sortie"
            name="releaseDate"
            type="date"
            value={formData.releaseDate}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? 'Ajout en cours...' : 'Ajouter le film'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default AddMovie; 