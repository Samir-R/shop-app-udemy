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
import ProductCardColumn from './product-card-column.component';
import ProductCardRow from './product-card-row.component';
import { ProductContext } from '../../contexts/product.context';


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
  const theme = useTheme();
  // const greaterThanMid = useMediaQuery(theme.breakpoints.up("md"));
  const midToLarge = useMediaQuery(theme.breakpoints.between("md", "lg"));
  const smallToMid = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const lessThanSmall = useMediaQuery(theme.breakpoints.down("sm"));
  // https://stackoverflow.com/questions/72826309/get-current-material-ui-breakpoint-name

  const { name, price, discountPrice, imageUrl } = product;
  const { addItemToCart } = useContext(CartContext);
  const { setProductWithAttributesToDisplay } = useContext(ProductContext);

  const addProductToCart = () => {
    
    if (product.attributes.length) {
        setProductWithAttributesToDisplay(product);
    } else {
      addItemToCart(product);
    }
  };

  return <ProductCardColumn 
            product={product}
            addProductToCart={addProductToCart}
            isLessThanSmall={lessThanSmall}
            smallToMid={smallToMid}
            />
  /*
  UTILE POUR PLUS TARD SI ON VEUT FAIRE UN AFFICHAGE EN LIGNE ET PAS SEULEMENT EN COLONNES
  return (
    <>
    {
      midToLarge ? 
      (<ProductCardRow product={product} addProductToCart={addProductToCart} isLessThanSmall={lessThanSmall} />)
      :
      (<ProductCardColumn product={product} addProductToCart={addProductToCart} />)
}
    </>
  );
  */
};

export default ProductCard;
