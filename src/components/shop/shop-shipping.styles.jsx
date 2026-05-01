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
    padding: theme.spacing(1.5, 2),
    // backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    borderBottom: `1px solid ${theme.palette.divider}`,
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
    // backgroundColor: 'rgba(255, 255, 255, 0.15)',
    '&:hover': {
        // backgroundColor: 'rgba(255, 255, 255, 0.25)',
    },
}));

export const SearchInput = styled(InputBase)(({ theme }) => ({
    flex: 1,
    // color: theme.palette.primary.contrastText,
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        '&::placeholder': {
            // color: 'rgba(255, 255, 255, 0.7)',
            // opacity: 1,
        },
    },
}));

export const RestaurantList = styled(Box)(({ theme }) => ({
    padding: theme.spacing(1, 2),
    overflowY: 'auto',
    height: 200,
    flexShrink: 0,
}));

export const RestaurantCard = styled(Box)(({ theme, selected }) => ({
    display: 'flex',
    padding: '5px 8px',
    borderRadius: 8,
    marginBottom: '7px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: `2px solid ${selected ? 'transparent' : theme.palette.divider}`,
    ...(!selected && {
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        '&:hover': {
            backgroundColor: theme.palette.action.hover,
        },
    }),
    ...(selected && {
        borderColor: '#555',//theme.palette.primary.main,
        // backgroundColor: '#555',//theme.palette.primary.main,
        // color: '#fff',//theme.palette.primary.contrastText,
    }),
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
    padding: theme.spacing(4),
    textAlign: 'center',
}));

export const ShopAndShippingFooter = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3),
    paddingTop: '2px',
    [theme.breakpoints.down('sm')]: {
        paddingLeft: '6px',
        paddingRight: '6px',
    },
    borderTop: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
    overflowY: 'auto',
    flex: 1,
    minHeight: 0,
}));

export const DeliveryOptionButton = styled(Button)(({ theme, selected }) => ({
    flex: 1,
    padding: theme.spacing(1.5),
    border: `2px solid ${selected ? 'transparent' : theme.palette.divider}`,
    ...(!selected && {
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        '&:hover': {
            backgroundColor: theme.palette.action.hover,
        },
    }),
}));

export const DateToggleButton = styled(Button)(({ theme, selected }) => ({
    padding: theme.spacing(1, 2),
    borderRadius: 8,
    border: `2px solid ${selected ? 'transparent' : theme.palette.divider}`,
    // Quand non sélectionné : fond blanc + texte gris forcés
    // Quand sélectionné ou hover : on ne surcharge rien → MUI applique ses couleurs par défaut
    ...(!selected && {
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        '&:hover': {
            backgroundColor: theme.palette.action.hover,
        },
    }),
    minWidth: 100,
    height: 40,
}));

export const TimeSelect = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
    borderRadius: 8,
}));