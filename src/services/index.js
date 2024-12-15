// import categoryService from './firebase/categories.service';
import ThemeService from './json-server/theme.service';
import CategoryService from './json-server/category.service';
import ProductService from './json-server/product.service';

const apiUrl = process.env.REACT_APP_API_URL;
// const apiUrl2 = 'https://f3c5-2a01-e0a-abc-d3c0-b990-201d-1dfb-c674.ngrok-free.app';

const services = {
    // categoryService,// firebase
    categoryService: new CategoryService(apiUrl),
    productService: new ProductService(apiUrl),
    themeService: new ThemeService(apiUrl),
}

export default services;