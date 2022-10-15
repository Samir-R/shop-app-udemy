import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Fragment } from 'react/cjs/react.production.min';

import ProductCard from '../../components/product-card/product-card.component';

import { ProductsContext } from '../../contexts/products.context';

import './shop.styles.scss';

const Shop = () => {
  const { products } = useContext(ProductsContext);
  const navigate = useNavigate();

  const goToCategoryHandler = (title) => {
    navigate('/shop/'+title);
  };

  return (
    <>
      {
        Object.keys(products).map((title) => (
          <Fragment key={title}>
            <h2 onClick={() => goToCategoryHandler(title)}>{title}</h2>
            <div className='products-container'>
              {products[title].slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
                ))
              }
            </div>
          </ Fragment>
        ))
      }
    </>
  );
};

export default Shop;
