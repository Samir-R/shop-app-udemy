import { useContext, useState, useEffect, Fragment } from 'react';

import ProductCard from '../../components/product-card/product-card.component';
import { ProductContext } from '../../contexts/product.context';


import { CategoryContainer, Title } from './category.styles';
import Grid from "@mui/material/Unstable_Grid2";
import { styled } from '@mui/material/styles';
import {Alert, Box, Paper, Typography} from "@mui/material";
import CustomAlert from '../custom-alert/custom-alert.component';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const Category = ({ category }) => {
  const { products } = useContext(ProductContext);

  const productsCurrentCategory = category
  ? products.filter(product => product.categories === category.id)
  : [];

  console.log('on refresh le category component ');
  console.log(category);

  // useEffect(() => {
  //   setProducts(categoriesMap[category]);
  // }, [category, categoriesMap]);

  /*
return (
  <>
    {productsCurrentCategory.length ?
      <>
      <Title>{category.name.toUpperCase()}</Title>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)' }}>
          {productsCurrentCategory.map((product) => (
              <Item><ProductCard product={product} /></Item>
          ))}
      </Box>
      </>
      :
      <span>Aucun produit actifs dans cette categorie</span>
    }
    </>
)
*/


  return (
      <>
      {category ?
          <>
            <Title>{category.name.toUpperCase()}</Title>
                  {productsCurrentCategory.length ?
                      <Grid container rowSpacing={4} columnSpacing={{ xs: 1, sm: 2, md: 1 }}>
                        {productsCurrentCategory.map((product) => (
                            <Grid key={product.id} xs={6} sm={6} md={12} lg={4} xl={3}>
                              <ProductCard product={product} />
                            </Grid>
                        ))}
                      </Grid>
                      :
                      <Box>
                        <CustomAlert
                          text="Aucun produit actifs dans cette categorie"
                          />
                      {/* <Alert severity="info">
                      <Typography variant="h6" align='center'>
                        Aucun produit actifs dans cette categorie
                      </Typography>
                      </Alert> */}
                      {/* <img alt="toto" src="https://firebasestorage.googleapis.com/v0/b/shop-app-udemy-fe5b1.appspot.com/o/image.png?alt=media&token=752514c1-0609-428a-8907-147ebb5e3709" /> */}
                      </Box>
                    }
          </>
        :
        <>
        <CustomAlert
          text="Aucune produit trouvé"
          />
        {/* <span>Aucune produit trouvé</span> */}
        {/* <img alt="toto" src="https://firebasestorage.googleapis.com/v0/b/shop-app-udemy-fe5b1.appspot.com/o/image.png?alt=media&token=752514c1-0609-428a-8907-147ebb5e3709" /> */}
        </>
      }
      </>
  );
};

export default Category;
