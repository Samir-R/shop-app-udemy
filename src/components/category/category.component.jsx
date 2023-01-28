import { useContext, useState, useEffect, Fragment } from 'react';

import ProductCard from '../../components/product-card/product-card.component';
import { ProductContext } from '../../contexts/product.context';


import { CategoryContainer, Title } from './category.styles';
import Grid from "@mui/material/Unstable_Grid2";
import { styled } from '@mui/material/styles';
import {Paper} from "@mui/material";

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

  // useEffect(() => {
  //   setProducts(categoriesMap[category]);
  // }, [category, categoriesMap]);

  return (
      <>
      {category ?
          <>
            <Title>{category.name.toUpperCase()}</Title>
            {/*<CategoryContainer>*/}
              <Grid container rowSpacing={5} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                  {productsCurrentCategory.length ?
                      productsCurrentCategory.map((product) => (
                          <Grid xs={12} sm={6} md={3}><ProductCard key={product.id} product={product} /></Grid>
                      ))
                      :
                      <span>Aucun produit actifs dans cette categorie</span>
                    }
              </Grid>
            {/*</CategoryContainer>*/}
          </>
        :
        <span>Aucun produit pour cette categorie</span>
      }
      </>
  );
};

export default Category;
