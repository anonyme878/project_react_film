import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import MovieIcon from '@mui/icons-material/Movie';

const Navbar = () => {
  return (
    <AppBar position="static" sx={{ width: '100%' }}>
      <Toolbar sx={{ width: '100%', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <MovieIcon />
          <Typography variant="h6" component="div">
            Gestionnaire de Films
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button color="inherit" component={RouterLink} to="/">
            Accueil
          </Button>
          <Button color="inherit" component={RouterLink} to="/search">
            Recherche
          </Button>
          <Button color="inherit" component={RouterLink} to="/add">
            Ajouter un film
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 