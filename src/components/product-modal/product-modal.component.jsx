import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useContext } from 'react';
import { ProductContext } from '../../contexts/product.context';
import { useMediaQuery, useTheme } from '@mui/material';
import ProductModalStepper from './product-modal-stepper.component';
import { CartContext } from '../../contexts/cart.context';
import { useState } from 'react';

export default function ProductModal() {
  const [open, setOpen] = React.useState(false);
  // const [productToAdd, setProductToAdd] = React.useState(null);
  const { productToCompose, setProductToCompose } = React.useContext(CartContext);
  const { setProductWithAttributesToDisplay, productWithAttributesToDisplay } = useContext(ProductContext);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const { addItemToCart } = useContext(CartContext);
  const dialogTitleRef = React.useRef(null);

  const addProductToCart = () => {
      // addItemToCart(productToAdd);
      addItemToCart(productToCompose);
      handleClose();
  };


  const handleClose = () => {
    // setProductToAdd(null);
    setProductToCompose(null);
    setProductWithAttributesToDisplay(null);
  };

  return (
    <Dialog
        open={productWithAttributesToDisplay !== null}
        onClose={handleClose}
        fullScreen={fullScreen}
        maxWidth={"lg"}
        fullWidth={true}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          '& .MuiDialog-paper': !fullScreen && {
            height:  '85%',
          },
        }}
      >
        <DialogTitle id="alert-dialog-title" ref={dialogTitleRef} sx={{
          textAlign: 'center',
          }}>
            Use Google's location service ???
        </DialogTitle>
        <DialogContent>
            {/* <DialogContentText id="alert-dialog-description">
            Let Google help apps determine location. This means sending anonymous
            location data to Google, even when no apps are running.
            </DialogContentText> */}
            { productWithAttributesToDisplay &&
                <ProductModalStepper product={productWithAttributesToDisplay}
                refDialogTitle={dialogTitleRef} />}
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>Disagree</Button>
            <Button onClick={addProductToCart} disabled={productToCompose === null}>
            Ajouter au panier
            </Button>
        </DialogActions>
    </Dialog>
  );
}
