import { useContext } from 'react';
import ProductCard from './ProductCard';
import Sidebar from './Sidebar';
import Header from './Header';
import { mockProducts } from '../data/mockProducts';
// import { CategoryContext } from '../context/CategoryContext';
import './ProductList.css';

function ProductList() {
  // const { currentCategory } = useContext(CategoryContext);

  const filteredProducts = mockProducts;
  // const filteredProducts = currentCategory === 'all'
  //   ? mockProducts
  //   : mockProducts.filter(product => product.category === currentCategory);

  return (
    <>
      {/*<Header />*/}
      {/*<Sidebar />*/}
      <div className="product-list-container">
        <div className="page-header">
          <h1 className="page-title">Notre Menu</h1>
          <p className="page-subtitle">Découvrez notre sélection de plats délicieux</p>
        </div>

        <div className="products-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </>
  );
}

export default ProductList;
