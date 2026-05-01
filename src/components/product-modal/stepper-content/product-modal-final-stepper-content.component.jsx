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
import { Alert, Avatar, Chip, List, ListItem, ListItemAvatar, ListItemText, ListSubheader } from '@mui/material';
import { ProductModalStepButtonCustom } from '../styles/product-modal-stepper-style.component';
import { IoChevronUpOutline } from 'react-icons/io5';

const ProductModalFinalStepperContent = ({ productReadyToAdd, handleBack }) => {

  const hasNoSelection = !productReadyToAdd?.attributesSelected?.length ||
    productReadyToAdd.attributesSelected.every(attr => !attr.listSelected?.length);

  const attributeTitles = (productReadyToAdd?.attributes || [])
    .map(attr => attr.title)
    .filter(Boolean);

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
        Précédent
    </ProductModalStepButtonCustom>
      </Typography>
            {hasNoSelection
              ? <Alert severity="info" sx={{ mt: '25px', mb: 1 }}>
                  Vous êtes sur le point d'ajouter <strong>{productReadyToAdd.name}</strong> sans personnalisation
                  {attributeTitles.length > 0 && <> (aucune option sélectionnée parmi : <em>{attributeTitles.length > 1 ? attributeTitles.slice(0, -1).join(', ') + ' et ' + attributeTitles.at(-1) : attributeTitles[0]}</em>)</>}.
                  {' '}Pour confirmer, cliquez sur <strong>Ajouter</strong> ci-dessous. Pour personnaliser votre {productReadyToAdd.name}, vous pouvez toujours cliquer sur <strong>Précédent</strong> et sélectionnez vos options.
                </Alert>
              : <List
              sx={{
                width: '100%',
                bgcolor: 'background.paper',
                position: 'relative',
                overflow: 'auto',
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
                              label={'+'+item.priceToDisplay+'€'} size="small" />}
                          </Typography>
                        </ListItemText>
                      </ListItem>
                    ))}
                      {!attributeSelected.listSelected?.length && <Typography variant="caption"
                      sx={{ display: 'block', color: '#bdc3c7', marginLeft: '25px' }}>
                          Aucun choix
                      </Typography>}
                  </ul>
                </li>
              ))}
            </List>}
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