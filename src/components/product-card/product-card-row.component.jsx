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
import { Box, Button, Card, CardActions, CardContent, IconButton, Typography, useMediaQuery } from '@mui/material';
import ShoppingCart from '@mui/icons-material/ShoppingCart';
import PreviousPrice from '../previous-price/previous-price.component';
import CustomOrderButton from '../custom-order-button/custom-order-button.component';


const ProductCardRow = ({ product, addProductToCart, isLessThanSmall = false }) => {

  const { name, price, discountPrice, imageUrl } = product;

return (
  <Card sx={{ display: 'flex', boxShadow: 10, borderRadius: 3 }}>
  <CardMedia
    component="img"
    sx={{ objectFit: "contain", maxHeight: "155px", width: "auto" }}
    image={imageUrl}
    alt="Live from space album cover"
  />
    <Box sx={{ display: 'flex', flexDirection: 'column', width: "100%" }}>
      <CardContent sx={{ flex: '1 0 auto' }}>
        {/* <Typography gutterBottom variant={isLessThanSmall ? 'body1' : 'h5'} component="div" align='left' sx={{ fontWeight: 'bold'}}>  */}
        <Typography gutterBottom variant='body1' component="div" align='left' sx={{ fontWeight: 'bold'}}> 
           {name}
         </Typography>
         <Typography variant={isLessThanSmall ? 'body2' : 'body1'} align='right' sx={{ fontWeight: "bold" }}>
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
      <CardActions sx={{ p: 0, alignSelf: "flex-end" }}>
         <CustomOrderButton variant="contained" endIcon={<ShoppingCart />}
           size='small'
           sx={{ p: 1 }}
           onClick={addProductToCart}
           >
           { 
            !isLessThanSmall ?
            'Ajouter au panier'
            : '+1'
           }
         </CustomOrderButton>
       </CardActions>
      {/* <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
        <IconButton aria-label="previous">
          <ShoppingCart />
        </IconButton>
        <IconButton aria-label="play/pause">
          <ShoppingCart sx={{ height: 38, width: 38 }} />
        </IconButton>
        <IconButton aria-label="next">
          <ShoppingCart />
        </IconButton>
      </Box> */}
    </Box>
  </Card>
);



  // return (
  // <Card  style={{ height: '100%', display: "flex", flexDirection: "column" }} sx={{ boxShadow: 10, borderRadius: 3 }}>
  //     {/* <img src={imageUrl} alt={`${name}`} /> */}
  //     <CardMedia
  //       component="img"
  //       image={imageUrl}
  //       alt={`${name}`}
  //       sx={{ objectFit: "contain", maxHeight: "281px", width: "auto" }}
  //     />
  //      <CardContent sx={{ marginTop: "auto" }}>
  //       <Typography gutterBottom variant="h5" component="div" align='center' sx={{ fontWeight: 'bold'}}> 
  //         {name}
  //       </Typography>
  //       <Typography variant="body1" align='right' sx={{ fontWeight: "bold" }}>
  //       {/* color="text.secondary" */}
  //       {
  //           discountPrice ?
  //           (<>
  //             <PreviousPrice price={`${price} €`} />
  //             {discountPrice} €
  //           </>
  //           )
  //           :
  //           <>
  //             {price} €
  //           </>
  //       }
  //       </Typography>
  //     </CardContent>
  //     {/* <Footer>
  //       <Name>{name} ({categories})</Name>
  //       <Price>{price}</Price>
  //     </Footer> */}
  //     <CardActions sx={{ p: 0 }}>
  //       <CustomOrderButton variant="contained" endIcon={<ShoppingCart />}
  //         size='large'
  //         sx={{ width: '100%', padding: 2}}
  //         onClick={addProductToCart}
  //         >
  //         Ajouter au panier ???
  //       </CustomOrderButton>
  //     </CardActions>
  //   </Card>);
};

export default ProductCardRow;
