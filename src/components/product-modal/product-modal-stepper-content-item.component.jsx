import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import QuantityInput from '../number-input/number-input';
import { CartContext } from '../../contexts/cart.context';
import { Avatar, Checkbox, ListItem, ListItemAvatar, ListItemButton, ListItemText, Radio } from '@mui/material';
import { ProductModalListItemCustom } from './product-modal-stepper-style.component';

const ProductModalStepperContentItem = ({ element, onChangeAttributeItemQuantity, attributeParent, elementActionType, classCustomName }) => {

  const maxAttributeQuantity = attributeParent.max || 1;
  const { productToCompose } = React.useContext(CartContext);
  

  // const [checked, setChecked] = React.useState([1]);
  const [radio, setRadio] = React.useState(null);

  // const handleToggle = (value) => () => {
  //   const currentIndex = checked.indexOf(value);
  //   const newChecked = [...checked];

  //   if (currentIndex === -1) {
  //     newChecked.push(value);
  //   } else {
  //     newChecked.splice(currentIndex, 1);
  //   }

  //   setChecked(newChecked);
  // };

  // const [checked, setChecked] = useState(false);

  const handleToggle = (event) => {
    // setChecked(event.target.checked);
    const quantity = event.target.checked ? 1 : 0;
    onChangeAttributeItemQuantity({ ...element, quantity });
  };


  const handleChange = (quantity) => {
      console.log('on fait le change qty ' + element.name);
    onChangeAttributeItemQuantity({ ...element, quantity });
  } 

  let maxOfElement = element.max || maxAttributeQuantity;
  let currentQtyOfElement = 0;
  // Fonction qui marche mais continuer de tester 
  const initMaxQuantity = () => {
    console.log('maxAttributeQuantity ' + maxAttributeQuantity);
    // const attributeParentSelected = productToCompose?.attributesSelected?.find(attributeSelected => attributeSelected.listSelected.some(item => item.id === element.id));
    const attributeParentSelected = productToCompose?.attributesSelected?.find(attributeSelected => attributeSelected.id === attributeParent.id);
    if (attributeParentSelected) {

        const totalQuantity = attributeParentSelected.listSelected?.reduce((acc, obj) => acc + obj.quantity, 0) || 0;
        const restToMax = maxAttributeQuantity - totalQuantity;
        const ele = attributeParentSelected.listSelected?.find((item) => item.id === element.id);
        currentQtyOfElement = ele?.quantity || 0;
        if (elementActionType === 'checkbox' && currentQtyOfElement>0) {
          // setChecked(true);
        }
        if(totalQuantity >= maxAttributeQuantity) {
          maxOfElement = currentQtyOfElement;
        } else {
          if (restToMax < maxOfElement) {
            maxOfElement = restToMax + currentQtyOfElement;
          }

          // SUPPRIMER CODE COMMENTAIRE CI DESSOUS

          // if (totalQuantity >= maxOfElement) {
          //   maxOfElement = currentQtyOfElement;
          // } else {

          //   //  CORRIGER CE ELSE
          //   const newMaxQty = maxOfElement - totalQuantity;
          //   maxOfElement = maxOfElement > newMaxQty ? newMaxQty : maxOfElement;
          // }
        }
        // const newMaxQty = maxAttributeQuantity - totalQuantity;
        // return maxOfElement > newMaxQty ? newMaxQty : maxOfElement
    }
    
    console.log(element.name);
    console.log(maxOfElement);
    // return maxOfElement;
  }

  initMaxQuantity();


  const labelId = `checkbox-list-secondary-label-${element.id}`;
    // console.log(element.name);
    // console.log(getMaxQuantity());
  let toto = null;
  if (elementActionType === 'radio') {
    toto = <Radio checked={radio === element.id}
    // value={value}
    onChange={() => setRadio(element.id)}
    />
    // <Checkbox
    //   edge="end"
    //   onChange={handleToggle(element.id)}
    //   checked={checked.indexOf(element.id) !== -1}
    //   inputProps={{ 'aria-labelledby': labelId }}
    // />
  } else if (elementActionType === 'checkbox') {
    // toto = <Checkbox
    //   edge="end"
    //   onChange={handleToggle(element.id)}
    //   checked={checked.indexOf(element.id) !== -1}
    //   inputProps={{ 'aria-labelledby': labelId }}
    // />
    toto = <Checkbox
      edge="end"
      checked={currentQtyOfElement>0}
      disabled={maxOfElement===0}
      onChange={handleToggle}
      inputProps={{ 'aria-label': 'controlled' }}
    />
  } else {
    toto = <QuantityInput 
              handleChange={handleChange} 
              initValue={currentQtyOfElement} 
              max={maxOfElement}/>
  }

  return (
    <ProductModalListItemCustom
    className={`${classCustomName} Action-Type-${elementActionType}`}
            secondaryAction={toto
              // elementActionType === 'radio'
              // ? ( <Checkbox
              //   edge="end"
              //   onChange={handleToggle(value)}
              //   checked={checked.indexOf(value) !== -1}
              //   inputProps={{ 'aria-labelledby': labelId }}
              // />)
              // : (elementActionType === 'checkbox'
              //   ? ( <Checkbox
              //     edge="end"
              //     onChange={handleToggle(value)}
              //     checked={checked.indexOf(value) !== -1}
              //     inputProps={{ 'aria-labelledby': labelId }}
              //   />)
              //   : (<QuantityInput 
              // handleChange={handleChange} 
              // initValue={currentQtyOfElement} 
              // max={maxOfElement}/>)
              // )
              // <Checkbox
              //   edge="end"
              //   onChange={handleToggle(value)}
              //   checked={checked.indexOf(value) !== -1}
              //   inputProps={{ 'aria-labelledby': labelId }}
              // />
            }
            disablePadding
          >
            {/* <ListItemButton> */}
              <ListItemAvatar>
                <Avatar
                  alt={element.name}
                  src={element.imageUrl}
                />
              </ListItemAvatar>
              <ListItemText id={labelId} primary={element.name} />
            {/* </ListItemButton> */}
          </ProductModalListItemCustom>
  )
}

export default ProductModalStepperContentItem