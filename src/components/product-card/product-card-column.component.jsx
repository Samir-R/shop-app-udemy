import { useContext, useState } from 'react';
import ProductInformationsModal from './product-informations-modal.component';
import CardMedia from '@mui/material/CardMedia';

import { CartContext } from '../../contexts/cart.context';

// import Button, { BUTTON_TYPE_CLASSES } from '../button/button.component';

import {
  ProductCartContainer,
  Footer,
  Name,
  Price,
} from './product-card.styles';
import { Button, Card, CardActions, CardContent, IconButton, Typography, useMediaQuery } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { styled, useTheme } from '@mui/material/styles';
import ShoppingCart from '@mui/icons-material/ShoppingCart';
import PreviousPrice from '../previous-price/previous-price.component';
import {TbPaperBag} from "react-icons/tb";
import {IoFastFoodOutline} from "react-icons/io5";
import {MenuIconComponent} from "../custom-icon/menu-icon.component";


export const CustomOrderButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.OrderButton.main,
  fontWeight: 'bold',
  color: theme.palette.OrderButton.contrastText,
  ":hover": {
    backgroundColor: theme.palette.OrderHoverButton.main,
    fontWeight: 'bold',
    color: theme.palette.OrderHoverButton.contrastText,
  }
}));


const ProductCardColumn = ({ product, addProductToCart, isLessThanSmall, smallToMid }) => {

  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const { name, price, discountPrice, imageUrl } = product;
  let variantName = 'h6';
  let variantPrice = 'body1';//'h6';
  let sizeButton = 'large';
  if (isLessThanSmall) {
    variantName = 'body2';
    variantPrice = 'body2';
    sizeButton = 'small';
  }
  if (smallToMid) {
    variantName = 'h6';
    variantPrice = 'body1';
    sizeButton = 'medium';
  }
  const buttonWidth = product.productMenu ? '50%' : '100%';

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
        <Typography gutterBottom variant={variantName} component="div" align='center' sx={{ fontWeight: 'bold'}}> 
          {name}
        </Typography>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          {product.productInformations?.length > 0 && (
            <IconButton size="small" sx={{ p: '2px' }} onClick={() => setInfoModalOpen(true)}>
              <InfoOutlinedIcon fontSize="small" />
            </IconButton>
          )}
          <Typography variant={variantPrice} align='right' sx={{ fontWeight: "bold", flex: 1 }}>
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
        </div>
      </CardContent>
      {/* <Footer>
        <Name>{name} ({categories})</Name>
        <Price>{price}</Price>
      </Footer> */}
      <ProductInformationsModal
        open={infoModalOpen}
        onClose={() => setInfoModalOpen(false)}
        productInformations={product.productInformations}
      />
      <CardActions sx={{ p: '0px 6px 6px 6px' }}>
        {/*<CustomOrderButton variant="contained" endIcon={<ShoppingCart />}*/}
        <CustomOrderButton variant="contained" endIcon={<TbPaperBag size="27px" style={{ strokeWidth: '1.5px'}}/>}
          size={sizeButton}
          sx={{ width: buttonWidth, padding: "10px 0px"}}
          onClick={() => addProductToCart(false)}
          >
          {/*Ajouter au panier*/}
          Ajouter
        </CustomOrderButton>
          {!product.productMenu && (<CustomOrderButton variant="contained"
                                                      // endIcon={<IoFastFoodOutline size="28px"/>}
                                                      endIcon={<MenuIconComponent />}
                              size={sizeButton}
                              sx={{width: buttonWidth, padding: "10px 0px", marginLeft: '5px !important', backgroundColor: '#555'}}
                              onClick={() => addProductToCart(true)}
          >
              {/*Ajouter au panier*/}
              Menu
          </CustomOrderButton>)}
      </CardActions>
    </Card>);
};

export default ProductCardColumn;
