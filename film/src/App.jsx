import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Search from './pages/Search';
import AddMovie from './pages/AddMovie';
import MovieDetails from './pages/MovieDetails';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          padding: '24px',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          minHeight: '100vh',
          bgcolor: 'background.default'
        }}>
          <Navbar />
          <Box component="main" sx={{ 
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            p: 3
          }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/add" element={<AddMovie />} />
              <Route path="/movie/:id" element={<MovieDetails />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;