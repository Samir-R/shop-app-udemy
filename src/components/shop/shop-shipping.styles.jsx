import { styled } from '@mui/material/styles';
import { Box, Typography, Paper, InputBase, Dialog, Button } from '@mui/material';

export const ModalContainer = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        width: '100%',
        maxWidth: 600,
        maxHeight: '90vh',
        borderRadius: 12,
        overflow: 'hidden',
        margin: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
    },
}));

export const ShopAndShippingHeader = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3),
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    position: 'sticky',
    top: 0,
    zIndex: 10,
}));

export const SearchContainer = styled(Paper)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0.5, 2),
    marginTop: theme.spacing(2),
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
    },
}));

export const SearchInput = styled(InputBase)(({ theme }) => ({
    flex: 1,
    color: theme.palette.primary.contrastText,
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        '&::placeholder': {
            color: 'rgba(255, 255, 255, 0.7)',
            opacity: 1,
        },
    },
}));

export const RestaurantList = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    overflowY: 'auto',
    flex: 1,
    maxHeight: '50vh',
}));

export const RestaurantCard = styled(Box)(({ theme }) => ({
    display: 'flex',
    padding: theme.spacing(2),
    borderRadius: 8,
    marginBottom: theme.spacing(2),
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: `1px solid ${theme.palette.divider}`,
    '&:hover': {
        boxShadow: theme.shadows[3],
        transform: 'translateY(-2px)',
        borderColor: theme.palette.primary.main,
    },
}));

export const RestaurantImage = styled('img')({
    width: 80,
    height: 80,
    objectFit: 'cover',
    borderRadius: 8,
});

export const RestaurantInfo = styled(Box)({
    flex: 1,
    marginLeft: 16,
});

export const RestaurantTags = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
    marginTop: theme.spacing(1),
}));

export const RestaurantTag = styled(Box)(({ theme }) => ({
    padding: theme.spacing(0.5, 1),
    borderRadius: 4,
    fontSize: '0.75rem',
    backgroundColor: theme.palette.action.hover,
    color: theme.palette.text.secondary,
}));

export const StatusBadge = styled(Box)(({ theme, isOpen }) => ({
    padding: theme.spacing(0.5, 1),
    borderRadius: 4,
    fontSize: '0.75rem',
    backgroundColor: isOpen ? '#e6f7e9' : '#ffebee',
    color: isOpen ? '#2e7d32' : '#d32f2f',
    fontWeight: 500,
    display: 'inline-block',
}));

export const RatingBadge = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0.5, 1),
    borderRadius: 4,
    fontSize: '0.75rem',
    backgroundColor: '#fff9c4',
    color: '#f57c00',
    fontWeight: 500,
}));

export const EmptyResults = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(6),
    textAlign: 'center',
    height: '50vh',
}));

export const ShopAndShippingFooter = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3),
    borderTop: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
}));

export const DeliveryOptionButton = styled(Button)(({ theme, selected }) => ({
    flex: 1,
    padding: theme.spacing(1.5),
    border: `2px solid ${selected ? theme.palette.primary.main : theme.palette.divider}`,
    backgroundColor: selected ? theme.palette.primary.light : theme.palette.background.paper,
    color: selected ? theme.palette.primary.main : theme.palette.text.primary,
    '&:hover': {
        backgroundColor: selected ? theme.palette.primary.light : theme.palette.action.hover,
    },
}));

export const DateToggleButton = styled(Button)(({ theme, selected }) => ({
    padding: theme.spacing(1, 2),
    borderRadius: 8,
    border: `2px solid ${selected ? theme.palette.primary.main : theme.palette.divider}`,
    backgroundColor: selected ? theme.palette.primary.light : theme.palette.background.paper,
    color: selected ? theme.palette.primary.main : theme.palette.text.primary,
    '&:hover': {
        backgroundColor: selected ? theme.palette.primary.light : theme.palette.action.hover,
    },
    minWidth: 100,
    height: 40,
}));

export const TimeSelect = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
    borderRadius: 8,
}));