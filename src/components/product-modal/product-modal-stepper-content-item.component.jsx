import React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import QuantityInput from '../number-input/number-input';

const ProductModalStepperContentItem = ({ element, onChangeAttributeItemQuantity, maxAttributeQuantity = 1 }) => {

  const handleChange = (quantity) => {
      
    onChangeAttributeItemQuantity({ ...element, quantity });
  } 


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
              <QuantityInput handleChange={handleChange} max={element.max || maxAttributeQuantity}/>
              {/* <Button size="small">Learn More</Button> */}
            </CardActions>
          </Card>
  )
}

export default ProductModalStepperContentItem