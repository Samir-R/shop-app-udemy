import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import ProductCard from '../../components/product-card/product-card.component';

import { ProductsContext } from '../../contexts/products.context';

import './shop.styles.scss';

const Category = () => {
  const { title } = useParams();
  const { products } = useContext(ProductsContext);
const [categoryProducts, setCategoryProducts] = useState(products[title]);
console.log('on render ,,,,');
console.log(categoryProducts);
useEffect(() => {
  setCategoryProducts(products[title]);

}, [title, products])



  return (
    <>
            <h2>{title}</h2>
            <div className='products-container'>
              {categoryProducts && categoryProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
                ))
              }
            </div>
    </>
  );
};

export default Category;
