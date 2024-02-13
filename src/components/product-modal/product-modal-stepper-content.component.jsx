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

const ProductModalStepperContent = ({ attribute, onSelectAttributeItem }) => {

  const handleChangeAttributeItemQuantity = (element) => {
      
    onSelectAttributeItem(attribute, element);
  } 


  return (
    <Grid container rowSpacing={4} columnSpacing={{ xs: 1, sm: 2, md: 1 }}
    sx={{backgroundColor: '#fff'}}>
      {attribute.list.map((element) => (
        <Grid key={element.id} xs={12} sm={6} md={6} lg={4} xl={3}>
            <ProductModalStepperContentItem  element={element} attributeParent={attribute} onChangeAttributeItemQuantity={handleChangeAttributeItemQuantity}/>
        </Grid>
      ))}
        </Grid>
        );

  {/* return (
    attribute.list.map((element) => (<Card sx={{ maxWidth: 345 }} key={element.id}>
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
              <Typography variant="body2" color="text.secondary">
                Lizards are a widespread group of squamate reptiles, with over 6,000
                species, ranging across all continents except Antarctica
              </Typography>
              <Typography variant="body2" color="text.secondary">
                { element.price > 0 && '+' + element.price + '€' }
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small"
                onClick={() => onSelectAttributeItem(attribute, element)}>
                  Choisir
              </Button>
              <QuantityInput handleChange={handleChange} />
            </CardActions>
          </Card>
          )
          )
  ) */}
}

export default ProductModalStepperContent