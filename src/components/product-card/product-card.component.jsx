import { useContext } from 'react';
import CardMedia from '@mui/material/CardMedia';

import { CartContext } from '../../contexts/cart.context';

import Button, { BUTTON_TYPE_CLASSES } from '../button/button.component';

import {
  ProductCartContainer,
  Footer,
  Name,
  Price,
} from './product-card.styles';
import { Card } from '@mui/material';

const ProductCard = ({ product }) => {
  const { name, price, imageUrl, categories } = product;
  const { addItemToCart } = useContext(CartContext);

  const addProductToCart = () => addItemToCart(product);

  return (
    <Card sx={{ boxShadow: 10, borderRadius: 5 }}>
      {/* <img src={imageUrl} alt={`${name}`} /> */}
      <CardMedia
        component="img"
        image={imageUrl}
        alt={`${name}`}
        sx={{ objectFit: "contain" }}
      />
      <Footer>
        <Name>{name} ({categories})</Name>
        <Price>{price}</Price>
      </Footer>
      <Button
        buttonType={BUTTON_TYPE_CLASSES.inverted}
        onClick={addProductToCart}
      >
        Add to card
      </Button>
    </Card>
  );
};

export default ProductCard;
