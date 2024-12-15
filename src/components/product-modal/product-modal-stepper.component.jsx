import * as React from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import MobileStepper from '@mui/material/MobileStepper';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import ProductModalStepperContent from './product-modal-stepper-content.component';
import { Step, StepContent, StepLabel, Stepper, useMediaQuery } from '@mui/material';
import { CartContext } from '../../contexts/cart.context';
import ProductModalFinalStepperContent from './product-modal-final-stepper-content.component';
import { ShoppingCart, ShoppingCartRounded } from '@mui/icons-material';
import { IoChevronDownOutline, IoChevronUpOutline } from "react-icons/io5";
import { v4 as uuidv4 } from 'uuid';
import { ProductModalStepButtonCustom, ProductModalStepContentCustom, ProductModalStepLabelCustom, ProductModalStepperCustom } from './product-modal-stepper-style.component';
import QuantityInput from '../number-input/number-input';
import { useState } from 'react';
import { CustomOrderButton } from '../product-card/product-card-column.component';

export default function ProductModalStepper({ product, refDialogTitle, handleClose }) {
  const theme = useTheme();
  const [quantityToAdd, setQuantityToAdd] = useState(1);
  const isMobileFormat = useMediaQuery(theme.breakpoints.down('md'));
  const { setProductToCompose, productToCompose, addItemToCart } = React.useContext(CartContext);
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const [attributesSelected, setAttributesSelected] = React.useState([]);
  // const maxSteps = steps.length;
  const maxSteps = (product?.attributes?.length+1) || 0;
  const steps = maxSteps > 0 ? [
    ...product?.attributes,
    {
      id: uuidv4(),
      title: 'Recap',
    }
  ] : [];
  const stepperRef = React.useRef(null);
  const stepperTitleRef = React.useRef(null);

  const [stepperHeight, setStepperHeight] = React.useState(0);
  const heightTitleStepperMobile = 50;


  React.useLayoutEffect(() => {
    const stepperHeightValue = (stepperRef.current?.offsetHeight +15) || 65;
    setStepperHeight(stepperHeightValue);
  }, []);

  React.useEffect(() => {

    setProductToAdd();
  }, [attributesSelected])

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const isStepOptional = (step) => {
    return step === 2;
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const isLastStep = () => {
    return activeStep === maxSteps - 1;
  };

  const nextButtonIsDisabled = () => {
    console.log('on fait le nextButtonIsDisabled');
    const minimumToAllowNextStep = product.attributes[activeStep]?.min || 0;
    const attributeActiveStepId = product.attributes[activeStep]?.id;
    if (attributeActiveStepId) {
      const currentQty = productToCompose?.attributesSelected?.find((item) => item.id === attributeActiveStepId)?.listSelected?.reduce((acc, obj) => acc + obj.quantity, 0) || 0;
        if (currentQty >= minimumToAllowNextStep) {
          return true;
        }
    }
    return false;
  }

  const handleSelectAttributes = (attribute, item) => {
    const newAttributesSelected = [...attributesSelected];
    let attributeSelectedIndex = newAttributesSelected.findIndex((element) => element.id === attribute.id);
    if(attributeSelectedIndex === -1) {
      const { list, ...attributeSelected} = attribute;
      attributeSelected['listSelected'] = [];
      newAttributesSelected.push(attributeSelected);
      attributeSelectedIndex = newAttributesSelected.length - 1;
    }
    const attributeItemIndex = newAttributesSelected[attributeSelectedIndex].listSelected.findIndex((ele) => ele.id === item.id);
    if (attributeItemIndex !== -1) {
      newAttributesSelected[attributeSelectedIndex].listSelected.splice(attributeItemIndex, 1)
    }
    if (item.quantity > 0) {
      newAttributesSelected[attributeSelectedIndex].listSelected.push(item);
    }
    setAttributesSelected(newAttributesSelected);
  };

  const setProductToAdd = () => {
    const { attributes, ...productToAdd } = product;
    productToAdd['attributesSelected'] = [...attributesSelected];
    setProductToCompose({...productToAdd});
  }


  const addProductToCart = () => {
    // addItemToCart(productToAdd);
    const productToComposeWithQuantity = {
      ...productToCompose,
      quantityToAdd: quantityToAdd,
    }
    console.log('productToComposeWithQuantity');
    console.log(productToComposeWithQuantity);
    // addItemToCart(productToCompose);
    addItemToCart(productToComposeWithQuantity);
    handleClose();
};

const handleChangeQuantityToAdd = (quantity) => {
  // console.log('on fait le change qty ' + element.name);
  setQuantityToAdd(quantity);
}

  return (
    // <Box sx={{ maxWidth: 400 }}>
    <Box sx={{  }}>
    <ProductModalStepperCustom activeStep={activeStep} orientation="vertical">
      {/* {product.attributes.map((attribute, index) => ( */}
      {steps.map((attribute, index) => (
        <Step key={attribute.id}>
          <ProductModalStepLabelCustom
            // optional={
            //   index === 2 ? (
            //     <Typography variant="caption">Last step</Typography>
            //   ) : null
            // }
          >
            {attribute.title}
          </ProductModalStepLabelCustom>
          <ProductModalStepContentCustom>
            {/* <Typography>{attribute.title}</Typography> */}
            {isLastStep() ?
        (<ProductModalFinalStepperContent productReadyToAdd={productToCompose} handleBack={handleBack}/>)
        : (<ProductModalStepperContent attribute={product.attributes[activeStep]}
          onSelectAttributeItem={handleSelectAttributes} />)}
            <Box sx={{ mb: 0 }} className={isLastStep() && 'Last-Step-Footer'}>
              <div>{isLastStep()
              ? <>
                  <QuantityInput 
              handleChange={handleChangeQuantityToAdd} 
              // initValue={currentQtyOfElement}
              initValue={quantityToAdd}
              min={1}
              max={99}/>
                  <CustomOrderButton
                   variant="contained" endIcon={<ShoppingCart />}
                  sx={{
                      marginLeft: '15px',
                     }}
                     onClick={addProductToCart} disabled={productToCompose === null}>
                    Ajouter au panier
                  </CustomOrderButton>
                </>
                : <ProductModalStepButtonCustom
                  color="inherit"
                  // variant="contained"
                  onClick={handleNext}
                  disabled={!nextButtonIsDisabled()}
                  endIcon={<IoChevronDownOutline />}
                  // sx={{ mt: 1, mr: 1 }}
                >
                  {/* {index === steps.length - 1 ? 'Finish' : 'Continue'} */}
                   Next
                </ProductModalStepButtonCustom>}
                {!isLastStep() && <ProductModalStepButtonCustom
                  color="inherit"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  endIcon={<IoChevronUpOutline />}
                  className='Back-Button'
                  // sx={{
                  //   mt: 0,
                  //   mr: 0
                  // }}
                >
                  Back
                </ProductModalStepButtonCustom>}
              </div>
            </Box>
          </ProductModalStepContentCustom>
        </Step>
      ))}
    </ProductModalStepperCustom>
    {/* {activeStep === product.attributes.length && (
      <Paper square elevation={0} sx={{ p: 3 }}>
        <Typography>All steps completed - you&apos;re finished</Typography>
        <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
          Reset
        </Button>
      </Paper>
    )} */}
  </Box>
  );
}