import { styled } from '@mui/material/styles';
import { Box, Typography, IconButton, Button } from '@mui/material';

export const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2, 3),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
}));

export const CartItemContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  '&:last-child': {
    borderBottom: 'none',
  },
}));

export const ItemImage = styled('img')({
  width: 70,
  height: 70,
  objectFit: 'cover',
  borderRadius: 8,
});

export const ItemDetails = styled(Box)({
  flex: 1,
  marginLeft: 16,
});

export const QuantityControl = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 4,
  marginTop: 8,
}));

export const QuantityButton = styled(IconButton)(({ theme }) => ({
  padding: theme.spacing(0.5),
  borderRadius: 0,
}));

export const QuantityText = styled(Typography)({
  padding: '0 8px',
  minWidth: 30,
  textAlign: 'center',
});

export const CartFooter = styled(Box)(({ theme }) => ({
  position: 'sticky',
  bottom: 0,
  backgroundColor: theme.palette.background.paper,
  boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)',
  padding: theme.spacing(2, 3),
}));

export const TotalRow = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: 8,
});

export const CheckoutButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(1.5),
  borderRadius: 8,
}));

export const EmptyCartContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(6),
  textAlign: 'center',
  height: '50vh',
}));