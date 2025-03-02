import { Button, Dialog, DialogContent, DialogTitle, IconButton, List, ListItem, StepContent, StepLabel, Stepper, styled } from "@mui/material";

/**
 * Dialog Custom
 */

export const ProductModalDialogCustom = styled(Dialog)(({ theme }) => ({
  // width: '100%'
  [`@media screen and (max-width: ${theme.breakpoints.values.sm}px)`]: {
    "& .MuiDialogContent-root": {
      paddingRight: 0,
      paddingLeft: '7px'
    }
 },
}));

export const ProductModalDialogTitleCustom = styled(DialogTitle)(({ theme }) => ({
  textAlign: 'center',
  paddingTop: '33px',
  borderBottom: '1px solid #ecf0f1',
  fontSize: '1.15rem',
  fontWeight: 'bold',
  paddingBottom: '6px'
}));

export const ProductModalDialogButtonCloseCustom = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  left: 0,
  top: 8,
  fontSize: '14px',
  // color: (theme) => theme.palette.grey[500],
  color: '#535c68',
}));


export const ProductModalDialogContentCustom = styled(DialogContent)(({ theme }) => ({
  paddingTop: '6px',
}));


/**
 * Stepper Custom
 */


export const ProductModalStepperCustom = styled(Stepper)(({ theme }) => ({
  // width: '100%'
  [`@media screen and (max-width: ${theme.breakpoints.values.sm}px)`]: {
    "& .MuiStepContent-root": {
      // paddingRight: 0,
      paddingLeft: '5px',
      "&.MuiStepContent-last": {
        paddingLeft: '0px',
        marginLeft: '0px',
      }
    }
 },
}));


export const ProductModalStepLabelCustom = styled(StepLabel)(({ theme }) => ({
  "& .MuiStepLabel-label": {
    "&.Mui-active": {
      fontWeight: 'bold',
      color: "#555"
      // color: "red"
    },
    "&.Mui-disabled": {
      fontWeight: 'bold',
      color: "#bdc3c7"
    },
    "&.Mui-completed": {
      fontWeight: 'bold',
      color: theme.palette.primary.main,
    }
  },
  /*flexDirection: 'column',
  gap: '12px',
  "& .MuiStepLabel-labelContainer": {
      "& .MuiStepLabel-label": {
          fontWeight: '500',
          color: '#555'
      },
      "& .MuiStepLabel-label.Mui-active": {
          fontWeight: 'bold'
      },
      "& .MuiStepLabel-label.Mui-disabled": {
          color: '#bdc3c7'
      }
  },
  "& .MuiStepLabel-iconContainer": {
    padding: '9px',
    backgroundColor: '#ecf0f1',
  //   color: '#fff',
    color: theme.palette.primary.main,
    borderRadius: '50%',
    "& svg" : {
      fontSize: '20px',
    }
  },
  "& .MuiStepLabel-iconContainer.Mui-completed": {
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
  },
  "& .MuiStepLabel-iconContainer.Mui-active": {
    backgroundColor: '#ff8518',
    color: '#fff',
  },*/
}));



export const ProductModalStepContentCustom = styled(StepContent)(({ theme }) => ({
  // width: '100%'
  // [`@media screen and (max-width: ${theme.breakpoints.values.sm}px)`]: {
    "& .Last-Step-Footer": {
      position: 'absolute',
      backgroundColor: '#fff',
      bottom: 0,
      margin: 0,
      left: 0,
      width: '100%',
      padding: '7px',
      paddingLeft: '20px',
      borderTop: '1px solid #ecf0f1',
      "& .base-NumberInput-root": {
        float: 'left',
        marginTop: '4px'
      }
    }
//  },
}));



export const ProductModalStepButtonCustom = styled(Button)(({ theme }) => ({
  backgroundColor: '#444',
  color: '#fff',
  fontSize: '12px',
  fontWeight: 'bold',
  padding: '6px 13px',
  marginRight: '20px',
  marginTop: '6px',
  border: '1px solid #444',
  "&.Back-Button": {
    // color: '#333',
    // color: '#fff',
    // backgroundColor: '#bdc3c7',
    // backgroundColor: '#aaa',
    // border: '1px solid #bdc3c7',
    // border: '1px solid #aaa',
    color: '#444',
    backgroundColor: '#fff',
    border: '1px solid #555',
    "&:hover": {
      // backgroundColor: '#b2bec3',
      backgroundColor: '#fff',
      color: '#777',
      border: '1px solid #bdc3c7'
    }
  },
  "&.Mui-disabled": {
    color: 'rgba(0, 0, 0, 0.26)',
    backgroundColor: '#ecf0f1',
    borderColor: '#ecf0f1',
  },
  "&:hover": {
    backgroundColor: '#777',
  }
}));




/**
 * List Custom
 */


export const ProductModalListCustom = styled(List)(({ theme }) => ({
  width: '100%'
}));


export const ProductModalListItemCustom = styled(ListItem)(({ theme }) => ({
  border: '1px solid #ecf0f1',
  borderBottom: 'none',
  padding: '6px 11px',
  "&.FirstElement-Item": {
    borderRadius: '6px 6px 0px 0px'
  },
  "&.LastElement-Item": {
    borderRadius: '0px 0px 6px 6px',
    borderBottom: '1px solid #ecf0f1',
  },
  "& .MuiTypography-root": {
    fontSize: '0.7rem',
    fontWeight: 'bold'
  },
  "& .MuiAvatar-root": {
    width: '50px',
    height: '50px'
  },
  "&.Action-Type-input": {
    "& .MuiListItemSecondaryAction-root": {
      right: '5px',
    },
    "& .MuiListItemText-root": {
      paddingRight: '101px'
    }
  },
  "&.Action-Type-checkbox": {
    "& .MuiListItemText-root": {
      paddingRight: '25px'
    }
  },
  "& .MuiListItemText-root": {
    paddingLeft: '10px'
  }
}));
