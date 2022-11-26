// import categoryService from './firebase/categories.service';
import CategoryService from './json-server/category.service';
import ProductService from './json-server/product.service';

const apiUrl = process.env.REACT_APP_API_URL;

const services = {
    // categoryService,// firebase
    categoryService: new CategoryService(apiUrl),
    productService: new ProductService(apiUrl),
}

export default services;