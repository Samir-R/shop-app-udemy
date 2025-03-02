import React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import QuantityInput from '../../number-input/number-input';
import Grid from "@mui/material/Unstable_Grid2";
import ProductModalStepperContentItem from './item/product-modal-stepper-content-item.component';
import { Avatar, Chip, List, ListItem, ListItemAvatar, ListItemText, ListSubheader } from '@mui/material';
import { ProductModalStepButtonCustom } from '../styles/product-modal-stepper-style.component';
import { IoChevronUpOutline } from 'react-icons/io5';

const ProductModalFinalStepperContent = ({ productReadyToAdd, handleBack }) => {


  
  return (
      productReadyToAdd === null ? <span>Chargement du resultat !!! ....</span> : (<>
      <Typography variant='subtitle2'
      sx={{
        fontWeight: 'bold',
        padding: '5px 10px 5px 12px',
        color: '#bdc3c7',
      }}
      >
        Resultat final :

    <ProductModalStepButtonCustom
      color="inherit"
      onClick={handleBack}
      endIcon={<IoChevronUpOutline />}
      className='Back-Button'
      sx={{ 
        mt: 0,
        mr: 0,
        float: 'right',
      }}
    >
      Back
    </ProductModalStepButtonCustom>
      </Typography>
            <List
              sx={{
                width: '100%',
                // maxWidth: 360,
                bgcolor: 'background.paper',
                position: 'relative',
                overflow: 'auto',
                // maxHeight: 300,
                zIndex: 0,
                paddingBottom: '50px',
                '& ul': { padding: 0 },
              }}
              subheader={<li />}
            >
              {productReadyToAdd.attributesSelected.map((attributeSelected, index) => (
                <li key={`section-${attributeSelected.id}`}>
                  <ul>
                      {(attributeSelected.title && !attributeSelected.isMainProduct) && <ListSubheader
                          sx={{
                              fontStyle: 'italic',
                              fontSize: '0.75rem'
                          }}
                      >
                          {attributeSelected.title}
                      </ListSubheader>}
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
            </>)
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