import { useContext, useState, useEffect, Fragment } from 'react';

import ProductCard from '../../components/product-card/product-card.component';
import { ProductContext } from '../../contexts/product.context';


import { CategoryContainer, Title } from './category.styles';

const Category = ({ category }) => {
  const { products } = useContext(ProductContext);

  const productsCurrentCategory = category
  ? products.filter(product => product.categories === category.id)
  : [];
  
  // useEffect(() => {
  //   setProducts(categoriesMap[category]);
  // }, [category, categoriesMap]);

  return (
    <Fragment>
      {category ?
        <>
          <Title>{category.name.toUpperCase()}</Title>
          <CategoryContainer>
            {productsCurrentCategory.length ?
              productsCurrentCategory.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
              :
              <span>Aucun produit actifs dans cette categorie</span>
            }
          </CategoryContainer>
        </>
        :
        <span>Aucun produit pour cette categorie</span>
      }
    </Fragment>
  );
};

export default Category;
