import React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import QuantityInput from '../number-input/number-input';
import Grid from "@mui/material/Unstable_Grid2";
import ProductModalStepperContentItem from './product-modal-stepper-content-item.component';
import { Avatar, Checkbox, List, ListItem, ListItemAvatar, ListItemButton, ListItemText } from '@mui/material';
import { ProductModalListCustom } from './product-modal-stepper-style.component';

const ProductModalStepperContent = ({ attribute, onSelectAttributeItem }) => {

  const handleChangeAttributeItemQuantity = (element) => {
    onSelectAttributeItem(attribute, element);
  }
  
  // let elementActionType = 'input';
  // if (!attribute.max || attribute.max < 2) {
  //   elementActionType = 'radio';
  // } else {
  //     const listMaxGreatherThanOne = attribute.list.filter((ele) => ele.max !== 1);
  //     if (listMaxGreatherThanOne.length === 0) {
  //       elementActionType = 'checkbox';
  //     }
  // }
  
  const listMaxGreatherThanOne = attribute.list.filter((ele) => ele.max !== 1);
  let elementActionType = 'input';
  if (!attribute.max || attribute.max < 2 || listMaxGreatherThanOne.length === 0) {
    elementActionType = 'checkbox';
  }

  return (
    // <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
    <ProductModalListCustom>
      {attribute.list.map((element, index) => {
        return (
          <ProductModalStepperContentItem
          key={element.id}
          element={element}
          elementActionType={elementActionType}
          attributeParent={attribute}
          onChangeAttributeItemQuantity={handleChangeAttributeItemQuantity}
          classCustomName={index===0 ? 'FirstElement-Item' : (index === attribute.list.length-1 ? 'LastElement-Item' : '')}
          />
        );
      })}
    </ProductModalListCustom>
        );

}

export default ProductModalStepperContent