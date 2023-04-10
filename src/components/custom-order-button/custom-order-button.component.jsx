import { Button } from "@mui/material";
import { styled } from '@mui/material/styles';

const CustomOrderButton = styled(Button)(({ theme }) => ({
    backgroundColor: theme.palette.OrderButton.main,
    fontWeight: 'bold',
    color: theme.palette.OrderButton.contrastText,
    ":hover": {
      backgroundColor: theme.palette.OrderHoverButton.main,
      fontWeight: 'bold',
      color: theme.palette.OrderHoverButton.contrastText,
    }
}));

export default CustomOrderButton;