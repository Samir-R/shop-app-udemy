import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { deepmerge } from '@mui/utils';
import Skeleton from '@mui/material/Skeleton';
import "@fontsource/manrope";

import services from './services';
import Home from './routes/home/home.component';
import Navigation from './routes/navigation/navigation.component';
import Authentication from './routes/authentication/authentication.component';
import Shop from './routes/shop/shop.component';
import Checkout from './routes/checkout/checkout.component';
import ProductModal from './components/product-modal/product-modal.component';
import CheckoutStepper from "./components/checkout/CheckoutStepper";
import MyAccount from "./routes/account/account.component";
import ForgotPassword from "./components/sign-up-form/forgot-password.component";
import ResetPassword from "./components/sign-up-form/reset-password.component";
import VerifyEmail from "./components/sign-up-form/verify-email.component";
import VerifyEmailSent from "./components/sign-up-form/verify-email-sent.component";
import ProtectedRoute from "./components/protected-route/protected-route.component";

let theme = createTheme({
  typography: {
    fontFamily: [
      services.themeService.defaultFontFamily
      // 'Manrope',
      // 'Ubuntu',
      // '-apple-system',
      // 'BlinkMacSystemFont',
      // 'Roboto',
      // '"Segoe UI"',
      // '"Helvetica Neue"',
      // 'Arial',
      // 'sans-serif',
      // '"Apple Color Emoji"',
      // '"Segoe UI Emoji"',
      // '"Segoe UI Symbol"',
    ].join(','),
  },
  palette: {
    // primary -> Header, Footer
    primary: {
      main: '#fff',
      dark: '#333',
      light: '#fff',
      contrastText: '#333',
    },
    secondary: {
      main: '#fff',
      dark: '#333',
      light: '#fff',
      contrastText: '#333',
    },
    primaryButton: {
      main: "red",
      dark: '#333',
      light: '#fff',
      contrastText: "#616161"
    },
    OrderButton: {
      main: "#000",
      contrastText: "#fff"
    },
    OrderHoverButton: {
      main: "#333",
      // main: "#ecf0f1",
      contrastText: "#fff"
    },
    CategoryButton: {
      main: "#fff",
      contrastText: "#333"
    },
    CategoryHoverButton: {
      main: "#ecf0f1",
      contrastText: "#333"
    },
    CategorySelectedButton: {
      main: "#333",
      contrastText: "#fff"
    },
  }
});

const App = () => {
  // const theme = useRef(0);
  const [themeObj, setThemeObj] = useState(null);
useEffect(() => {

  const loadThemeObj = async () => {
    const themeObjLoaded = await services.themeService.getTheme();
    setThemeObj(themeObjLoaded);
  }

  loadThemeObj()
  // .catch(console.error)
  ;

  // setThemeObj({});
/*
  setTimeout(() => {
    // main: '#34495e',
    // setThemeObj({});
    setThemeObj({
      palette: {
        primary: {
          // main: '#9b59b6',
          main: '#E9530D',
          light: '#FFD600',
        },
        secondary: {
          main: '#802529',
        },
      },
    });
  }, 500);
  */

}, [])

if(themeObj !== null) {
console.log('on meege themeObj');
console.log(themeObj);
console.log(theme.typography.fontFamily);
theme = createTheme(deepmerge(theme, themeObj));
console.log(theme);
}

console.log('on relaod App.js ' + theme.typography.fontFamily);

  return (
    <ThemeProvider theme={theme}>
    {themeObj !== null ? (<><Routes>
      <Route path='/' element={<Navigation />}>
        <Route index element={<Home />} />
        <Route path='shop/*' element={<Shop />} />
        <Route path='auth' element={<Authentication />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/verify-email-sent" element={<VerifyEmailSent />} />
        {/*<Route path='checkout' element={<Checkout />} />*/}
        <Route path='checkout' element={<CheckoutStepper />} />
        <Route path='my-account' element={
          <ProtectedRoute>
            <MyAccount />
          </ProtectedRoute>} />
      </Route>
    </Routes>
    <ProductModal />
    </>) : (<><Skeleton variant="text" sx={{ fontSize: '1rem' }} />
    <img src="https://static.observatoiredelafranchise.fr/images/logos/gladalle-8f8508.jpg" />
    <Skeleton variant="circular" width={40} height={40} />
<Skeleton variant="rectangular" width={210} height={60} />
<Skeleton variant="rounded" width={210} height={60} /></>)}
    </ThemeProvider>
  );
};

export default App;
