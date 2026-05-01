import { Fragment, useContext, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import { useTheme, useMediaQuery } from '@mui/material';

import CartIcon from '../../components/cart-icon/cart-icon.component';
import CartFooter from '../../components/cart-footer/cart-footer.component';

import { UserContext } from '../../contexts/user.context';
import { ThemeCustomContext } from '../../contexts/theme-custom.context';

import { NavLink } from './navigation.styles';
import CartDrawer from '../../components/cart-drawer/cart-drawer.component';
import ShopModal from "../../components/shop-modal/shop-modal.component";
import { LuMapPin } from "react-icons/lu";
import useAuth from "../../hooks/use-auth.hook";
import { useCheckout } from '../../contexts/checkout.context';
import { ShopShippingContext } from '../../contexts/shop-shipping.context';
import {IoStorefrontOutline} from "react-icons/io5";


const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { logout } = useAuth();
  const { currentUser } = useContext(UserContext);
  const { setHeaderHeight } = useContext(ThemeCustomContext);
  const { shopsList } = useCheckout();
  const { shop } = useContext(ShopShippingContext);

  const [anchorEl, setAnchorEl] = useState(null);
  const [restaurantModalOpen, setRestaurantModalOpen] = useState(false);

  const ref = useRef(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleGoToMyAccount = () => {
    navigate('/my-account');
    handleClose();
  };

  const handleLogout = () => {
    logout();
    if (location.pathname.startsWith('/my-account')) {
      navigate('/auth');
    }
    handleClose();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleSetHeaderHeight = (height) => {
    if (height) {
      setHeaderHeight(height);
    }
  };

  const isCheckoutPage = location.pathname.startsWith('/checkout');
  const showRestaurantButton = shopsList && shopsList.length > 0 && !isCheckoutPage;

  return (
    <Fragment>
      <CssBaseline />

      {/* Header AppBar */}
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        ref={el => { ref.current = el; handleSetHeaderHeight(ref.current?.clientHeight) }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 1, sm: 2 },
            px: { xs: 1, sm: 2 },
          }}
        >
          {/* Logo - Cliquable */}
          <Box
            onClick={handleGoHome}
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              '&:hover': { opacity: 0.8 },
              transition: 'opacity 0.2s',
            }}
          >
            <img
              src="https://gladalle-bonneuil.com/wp-content/uploads/2021/09/Logo-Gladalle.png"
              alt="logo"
              style={{ height: '50px', width: 'auto' }}
            />
          </Box>

          {/* Nom de l'entreprise - Cliquable */}
          <Typography
            variant="h6"
            component="div"
            onClick={handleGoHome}
            sx={{
              flexGrow: 1,
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: { xs: '1rem', sm: '1.25rem' },
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: { xs: '150px', sm: 'none' },
              '&:hover': { opacity: 0.8 },
              transition: 'opacity 0.2s',
            }}
          >
            {process.env.REACT_APP_COMPANY_NAME}
          </Typography>

          {/* Spacer pour pousser les icônes à droite sur mobile */}
          <Box sx={{ flexGrow: { xs: 1, md: 0 }, display: { xs: 'block', md: 'none' } }} />

          {/* Bouton Restaurant - Affiché seulement si plusieurs shops */}
          {showRestaurantButton && (
            isMobile ? (
              // Version mobile : icône seulement
              <IconButton
                color="inherit"
                onClick={() => setRestaurantModalOpen(true)}
                aria-label="Choisir un restaurant"
                sx={{ p: 1 }}
              >
                <IoStorefrontOutline size={24} />
              </IconButton>
            ) : (
              // Version desktop : bouton avec texte
              <Button
                // variant="outlined"
                // color="inherit"
                startIcon={<IoStorefrontOutline size={20} />}
                onClick={() => setRestaurantModalOpen(true)}
                sx={{
                  // borderColor: 'rgba(255, 255, 255, 0.5)',
                  textTransform: 'none',
                  // whiteSpace: 'nowrap',
                  px: 2,
                  // '&:hover': {
                  //   borderColor: 'white',
                  //   backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  // },
                }}
              >
                {shop ? shop.name : 'Choisir un restaurant'}
              </Button>
            )
          )}

          {/* Icône Compte utilisateur */}
          {currentUser ? (
            <Box>
              <IconButton
                aria-label="Compte utilisateur"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
                sx={{ p: 1 }}
              >
                <AccountCircle sx={{ fontSize: 28 }} />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleGoToMyAccount}>Mon compte</MenuItem>
                <MenuItem onClick={handleLogout}>Déconnexion</MenuItem>
              </Menu>
            </Box>
          ) : (
            <IconButton
              component={NavLink}
              to="/auth"
              color="inherit"
              aria-label="Se connecter"
              sx={{ p: 1 }}
            >
              <AccountCircle sx={{ fontSize: 28 }} />
            </IconButton>
          )}

          {/* Icône Panier - Visible seulement sur desktop */}
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <CartIcon />
          </Box>
        </Toolbar>
      </AppBar>

      {/* Contenu principal */}
      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        <Outlet />
      </Box>

      {/* Drawer du panier */}
      <CartDrawer />

      {/* Pied de page du panier (mobile seulement) */}
      <CartFooter />

      {/* Modal de sélection de restaurant */}
      <ShopModal
        open={restaurantModalOpen}
        onClose={() => setRestaurantModalOpen(false)}
        onSelectRestaurant={() => {}}
      />
    </Fragment>
  );
};

export default Navigation;
