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
import { Button, Card, CardActions, CardContent, Typography, useMediaQuery } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import ShoppingCart from '@mui/icons-material/ShoppingCart';
import PreviousPrice from '../previous-price/previous-price.component';


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


const ProductCardColumn = ({ product, addProductToCart }) => {

  const { name, price, discountPrice, imageUrl } = product;

  return (
  <Card  sx={{ height: '100%', display: "flex", flexDirection: "column", boxShadow: 10, borderRadius: 3 }}>
      {/* <img src={imageUrl} alt={`${name}`} /> */}
      <CardMedia
        component="img"
        image={imageUrl}
        alt={`${name}`}
        sx={{ objectFit: "contain", width: "auto" }}
      />
       {/* maxHeight: "281px", */}
       <CardContent sx={{ marginTop: "auto" }}>
        <Typography gutterBottom variant="body2" component="div" align='center' sx={{ fontWeight: 'bold'}}> 
          {name}
        </Typography>
        <Typography variant="body2" align='right' sx={{ fontWeight: "bold" }}>
        {/* color="text.secondary" */}
        {
            discountPrice ?
            (<>
              <PreviousPrice price={`${price} €`} />
              {discountPrice} €
            </>
            )
            :
            <>
              {price} €
            </>
        }
        </Typography>
      </CardContent>
      {/* <Footer>
        <Name>{name} ({categories})</Name>
        <Price>{price}</Price>
      </Footer> */}
      <CardActions sx={{ p: 0 }}>
        <CustomOrderButton variant="contained" endIcon={<ShoppingCart />}
          size='small'
          sx={{ width: '100%', padding: "10px 0px"}}
          onClick={addProductToCart}
          >
          Ajouter au panier
        </CustomOrderButton>
      </CardActions>
    </Card>);
};

export default ProductCardColumn;
