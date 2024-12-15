import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useContext } from 'react';
import { ProductContext } from '../../contexts/product.context';
import { IconButton, useMediaQuery, useTheme } from '@mui/material';
import ProductModalStepper from './product-modal-stepper.component';
import { CartContext } from '../../contexts/cart.context';
import { useState } from 'react';
import { ProductModalDialogButtonCloseCustom, ProductModalDialogContentCustom, ProductModalDialogCustom, ProductModalDialogTitleCustom } from './product-modal-stepper-style.component';
import { IoChevronBackOutline } from "react-icons/io5";

export default function ProductModal() {
  const [open, setOpen] = React.useState(false);
  // const [productToAdd, setProductToAdd] = React.useState(null);
  const { productToCompose, setProductToCompose } = React.useContext(CartContext);
  const { setProductWithAttributesToDisplay, productWithAttributesToDisplay } = useContext(ProductContext);
  const theme = useTheme();
  // const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
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
    <ProductModalDialogCustom
        open={productWithAttributesToDisplay !== null}
        onClose={handleClose}
        fullScreen={fullScreen}
        // maxWidth={"lg"}
        maxWidth={"sm"}
        fullWidth={true}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          '& .MuiDialog-paper': !fullScreen && {
            height:  '90%',
          },
        }}
      >
        <ProductModalDialogTitleCustom id="alert-dialog-title" ref={dialogTitleRef}
        // sx={{
        //   textAlign: 'center',
        //   }}
          >
            { productWithAttributesToDisplay?.name }
        </ProductModalDialogTitleCustom>
        <ProductModalDialogButtonCloseCustom
          aria-label="close"
          onClick={handleClose}
          // sx={{
          //   position: 'absolute',
          //   left: 0,
          //   top: 8,
          //   color: (theme) => theme.palette.grey[500],
          // }}
        >
          {/* <CloseIcon /> */}
          <IoChevronBackOutline /> Annuler
        </ProductModalDialogButtonCloseCustom>
        <ProductModalDialogContentCustom>
            {/* <DialogContentText id="alert-dialog-description">
            Let Google help apps determine location. This means sending anonymous
            location data to Google, even when no apps are running.
            </DialogContentText> */}
            { productWithAttributesToDisplay &&
                <ProductModalStepper product={productWithAttributesToDisplay}
                refDialogTitle={dialogTitleRef}
                handleClose={handleClose} />}
        </ProductModalDialogContentCustom>
        {/* <DialogActions>
            <Button onClick={handleClose}>Disagree</Button>
            <Button onClick={addProductToCart} disabled={productToCompose === null}>
            Ajouter au panier
            </Button>
        </DialogActions> */}
    </ProductModalDialogCustom>
  );
}
