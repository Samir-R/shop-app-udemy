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
import { Avatar, Chip, List, ListItem, ListItemAvatar, ListItemText, ListSubheader } from '@mui/material';

const ProductModalFinalStepperContent = ({ productReadyToAdd }) => {


  
  return (
    
    <Grid container rowSpacing={4} columnSpacing={{ xs: 1, sm: 2, md: 1 }}
    sx={{ height: '100%'}}>
      {/* <Grid xs={12} sm={12} md={6} lg={4} xl={4}> */}
      <Grid xs={12}>
            
          {/* <Card sx={{ maxWidth: 345 }}> */}
          <Card  sx={{ 
            height: '100%',
            display: "flex",
            flexDirection: "column",
            boxShadow: 0,
            borderRadius: 3 }}>
          <CardMedia
            component="img"
            sx={{ 
              // height: 140,
              objectFit: "contain",
              width: "auto",
            }}
            image={productReadyToAdd.imageUrl}
            title={productReadyToAdd.name}
          />
          <CardContent>
            <Typography gutterBottom variant="body2" component="div"
            align='center' sx={{ fontWeight: 'bold'}}>
              {productReadyToAdd.name}
            </Typography>
            <List
              sx={{
                width: '100%',
                maxWidth: 360,
                bgcolor: 'background.paper',
                position: 'relative',
                overflow: 'auto',
                maxHeight: 300,
                zIndex: 0,
                '& ul': { padding: 0 },
              }}
              subheader={<li />}
            >
              {productReadyToAdd.attributesSelected.map((attributeSelected) => (
                <li key={`section-${attributeSelected.id}`}>
                  <ul>
                    <ListSubheader>{attributeSelected.title}</ListSubheader>
                    {attributeSelected.listSelected.map((item) => (
                      <ListItem key={`item-${attributeSelected.id}-${item.id}`}>
                        <ListItemAvatar>
                          <Avatar alt={item.name} src={item.imageUrl} />
                        </ListItemAvatar>
                        <ListItemText>
                          <Typography sx={{fontSize: '12px', fontWeight: 'bold'}}>
                            {item.quantity} <span style={{fontSize: '8px'}}>x</span> {item.name}
                            {item.price > 0 && <Chip
                              sx={{
                                marginLeft: '4px',
                                height: '16px',
                                '& .MuiChip-label': {
                                  fontSize: '10px',
                                  paddingLeft: '4px',
                                  paddingRight: '4px',                             
                                }
                              }}
                              label={'+'+item.price+'€'} size="small" />}
                          </Typography>
                        </ListItemText>
                      </ListItem>
                    ))}
                  </ul>
                </li>
              ))}
            </List>
          </CardContent>
          {/* <CardActions>
            <Button size="small">Share</Button>
            <Button size="small">Learn More</Button>
          </CardActions> */}
        </Card>
      </Grid>
      {/* <Grid xs={12} sm={12} md={6} lg={8} xl={8}>
        TOTO
      </Grid> */}
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

export default ProductModalFinalStepperContent