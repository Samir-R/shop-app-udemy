import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';

import Home from './routes/home/home.component';
import Navigation from './routes/navigation/navigation.component';
import Authentication from './routes/authentication/authentication.component';
import Shop from './routes/shop/shop.component';
import Checkout from './routes/checkout/checkout.component';

let theme = createTheme({
  typography: {
    fontFamily: [
      'Ubuntu',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
  palette: {
    primary: {
      main: '#2ecc71',
    },
    secondary: {
      main: '#e74c3c',
    },
  },
});

const App = () => {
  // const theme = useRef(0);
  const [themeObj, setThemeObj] = useState(null);
useEffect(() => {
  setTimeout(() => {
    // main: '#34495e',
    setThemeObj({
      palette: {
        primary: {
          main: '#9b59b6',
        },
      },
    });
  }, 500);

}, [])

if(themeObj !== null) {
console.log('on meege themeObj');
console.log(themeObj);
console.log(theme.palette.primary);
theme = createTheme(theme, themeObj);
console.log(theme.palette.primary);
}


  return (
    <ThemeProvider theme={theme}>
    {themeObj !== null ? <Routes>
      <Route path='/' element={<Navigation />}>
        <Route index element={<Home />} />
        <Route path='shop/*' element={<Shop />} />
        <Route path='auth' element={<Authentication />} />
        <Route path='checkout' element={<Checkout />} />
      </Route>
    </Routes> : (<><Skeleton variant="text" sx={{ fontSize: '1rem' }} />
    <img src="https://static.observatoiredelafranchise.fr/images/logos/gladalle-8f8508.jpg" />
    <Skeleton variant="circular" width={40} height={40} />
<Skeleton variant="rectangular" width={210} height={60} />
<Skeleton variant="rounded" width={210} height={60} /></>)}
    </ThemeProvider>
  );
};

export default App;
