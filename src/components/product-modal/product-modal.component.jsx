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

export default function ProductModal() {
  const [open, setOpen] = React.useState(false);
  const { setProductWithAttributesToDisplay, productWithAttributesToDisplay } = useContext(ProductContext);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));


  const handleClose = () => {
    setProductWithAttributesToDisplay(null);
  };

  return (
    <Dialog
        open={productWithAttributesToDisplay !== null}
        onClose={handleClose}
        fullScreen={fullScreen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
            Use Google's location service?
        </DialogTitle>
        <DialogContent>
            {/* <DialogContentText id="alert-dialog-description">
            Let Google help apps determine location. This means sending anonymous
            location data to Google, even when no apps are running.
            </DialogContentText> */}
            { productWithAttributesToDisplay &&
                <ProductModalStepper product={productWithAttributesToDisplay}/>}
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>Disagree</Button>
            <Button onClick={handleClose} autoFocus>
            Agree
            </Button>
        </DialogActions>
    </Dialog>
  );
}
