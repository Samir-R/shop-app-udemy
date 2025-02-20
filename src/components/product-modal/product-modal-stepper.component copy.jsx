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
import { Step, StepLabel, Stepper, useMediaQuery } from '@mui/material';
import { CartContext } from '../../contexts/cart.context';
import ProductModalFinalStepperContent from './product-modal-final-stepper-content.component';
import { ShoppingCartRounded } from '@mui/icons-material';

export default function ProductModalStepper({ product, refDialogTitle }) {
  const theme = useTheme();
  const isMobileFormat = useMediaQuery(theme.breakpoints.down('md'));
  const { setProductToCompose, productToCompose } = React.useContext(CartContext);
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const [attributesSelected, setAttributesSelected] = React.useState([]);
  // const maxSteps = steps.length;
  const maxSteps = (product?.attributes?.length+1) || 0;
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

  return (
    <Box sx={{  }}>
     {isMobileFormat && <Paper
        square
        elevation={0}
        sx={{
          display: 'flex',
          alignItems: 'center',
          height: heightTitleStepperMobile,
          bgcolor: 'background.default',
          position: 'absolute',
          width: '100%',
          left: 0,
          top: (refDialogTitle?.current?.offsetHeight ? (refDialogTitle.current.offsetHeight-2) + 'px' : 'initial'),
        }}
      >
        {/* <Typography>{steps[activeStep].label}</Typography> */}
        <Typography sx={{ width: '100%', textAlign: 'center'}}>
        {isLastStep() ? 'Recap' : product.attributes[activeStep].title}
        </Typography>
      </Paper>}
      {!isMobileFormat &&
    (<Stepper activeStep={activeStep} alternativeLabel
      ref={stepperRef}
    sx={{
      position: 'absolute',
      bgcolor: 'background.default',
      width: '100%'
    }}>
      {product.attributes.map((attribute) => (
        <Step key={attribute.id}>
          <StepLabel>{attribute.title}</StepLabel>
        </Step>
      ))}
      <Step>
        <StepLabel><ShoppingCartRounded /></StepLabel>
      </Step>
    </Stepper>)
    }
    {/* ((stepperRef?.current?.offsetHeight + 10) || 80) + 'px' */}
      {/* <Box sx={{ height: 255, maxWidth: 400, width: '100%', p: 2 }}> */}
      <Box sx={{ 
        overflow: 'auto',
        p: 3,
        paddingTop: (isMobileFormat ? (heightTitleStepperMobile+10) : stepperHeight) + 'px',
        paddingBottom: '50px',
        }}>
          {/* {isLastStep() ? 'vari' : 'faux'}
          {activeStep}
          {maxSteps} */}
          {/* { stepperRef?.current?.offsetHeight } */}
        {/* {steps[activeStep].description} */}
        {/* {product.attributes[activeStep].name} */}
        {isLastStep() ?
        (<ProductModalFinalStepperContent productReadyToAdd={productToCompose} />)
        : (<ProductModalStepperContent attribute={product.attributes[activeStep]}
          onSelectAttributeItem={handleSelectAttributes} />)} 
      </Box>
      {isMobileFormat ? (<MobileStepper sx={{ 
            display: 'flex',
            flexDirection: 'row',
            position: 'absolute',
            bgcolor: 'background.default',
            bottom: '50px',
            left: 0,
            width: '100%'
            }}
        variant="text"
        steps={maxSteps}
        position="static"
        activeStep={activeStep}
        nextButton={
          <Button
            size="small"
            onClick={handleNext}
            disabled={!nextButtonIsDisabled()}
          >
            Next
            {theme.direction === 'rtl' ? (
              <KeyboardArrowLeft />
            ) : (
              <KeyboardArrowRight />
            )}
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            {theme.direction === 'rtl' ? (
              <KeyboardArrowRight />
            ) : (
              <KeyboardArrowLeft />
            )}
            Back
          </Button>
        }
      />) : (
        <>
          {/* <Typography sx={{ mt: 2, mb: 1 }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            Step {activeStep + 1}</Typography> */}
          <Box sx={{ 
            display: 'flex',
            flexDirection: 'row',
            position: 'absolute',
            bgcolor: 'background.default',
            bottom: '50px',
            left: 0,
            width: '100%'
            }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            {isStepOptional(activeStep) && (
              <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                Skip
              </Button>
            )}

            <Button onClick={handleNext} disabled={!nextButtonIsDisabled()}>
              Next
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}