import React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import QuantityInput from '../number-input/number-input';
import { CartContext } from '../../contexts/cart.context';

const ProductModalStepperContentItem = ({ element, onChangeAttributeItemQuantity, attributeParent }) => {

  const maxAttributeQuantity = attributeParent.max || 1;
  const { productToCompose } = React.useContext(CartContext);
  
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

    // console.log(element.name);
    // console.log(getMaxQuantity());

  return (
    <Card sx={{ maxWidth: 345 }}>
            <CardMedia
              component="img"
              alt="green iguana"
              height="140"
              image={element.imageUrl}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
              {element.name}
              </Typography>
              {/* <Typography variant="body2" color="text.secondary">
                Lizards are a widespread group of squamate reptiles, with over 6,000
                species, ranging across all continents except Antarctica
              </Typography> */}
              <Typography variant="body2" color="text.secondary">
                { element.price > 0 && '+' + element.price + '€' }
              </Typography>
            </CardContent>
            <CardActions>
              {/* <Button size="small"
                onClick={() => onChangeAttributeItemQuantity(attribute, element)}>
                  Choisir
              </Button> */}
              <QuantityInput handleChange={handleChange} initValue={currentQtyOfElement} max={maxOfElement}/>
              {/* <Button size="small">Learn More</Button> */}
            </CardActions>
          </Card>
  )
}

export default ProductModalStepperContentItem