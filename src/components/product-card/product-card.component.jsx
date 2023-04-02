import { useContext } from 'react';
import CardMedia from '@mui/material/CardMedia';

import { CartContext } from '../../contexts/cart.context';

// import Button, { BUTTON_TYPE_CLASSES } from '../button/button.component';

import {
  ProductCartContainer,
  Footer,
  Name,
  Price,
} from './product-card.styles';
import { Button, Card, CardContent, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import ShoppingCart from '@mui/icons-material/ShoppingCart';


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


const ProductCard = ({ product }) => {
  const { name, price, imageUrl } = product;
  const { addItemToCart } = useContext(CartContext);

  const addProductToCart = () => addItemToCart(product);

  return (
    <Card sx={{ boxShadow: 10, borderRadius: 3 }}>
      {/* <img src={imageUrl} alt={`${name}`} /> */}
      <CardMedia
        component="img"
        image={imageUrl}
        alt={`${name}`}
        sx={{ objectFit: "contain" }}
      />
       <CardContent>
        <Typography gutterBottom variant="h5" component="div" align='center' sx={{ fontWeight: 'bold'}}> 
          {name}
        </Typography>
        <Typography variant="body1" align='center'>
        {/* color="text.secondary" */}
          {price} €
        </Typography>
      </CardContent>
      {/* <Footer>
        <Name>{name} ({categories})</Name>
        <Price>{price}</Price>
      </Footer> */}
      <CustomOrderButton variant="contained" endIcon={<ShoppingCart />}
        size='large'
        sx={{ width: '100%', padding: 2}}
        onClick={addProductToCart}
      >
        Ajouter au panier
      </CustomOrderButton>
    </Card>
  );
};

export default ProductCard;
