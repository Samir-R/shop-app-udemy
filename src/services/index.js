// import categoryService from './firebase/categories.service';
import ThemeService from './json-server/theme.service';
import CategoryService from './json-server/category.service';
import ProductService from './json-server/product.service';
import ShopService from "./json-server/shop.service";
import UserService from "./json-server/user.service";
import AddressService from "./json-server/address.service";

const apiUrl = process.env.REACT_APP_API_URL;
// const apiUrl2 = 'https://f3c5-2a01-e0a-abc-d3c0-b990-201d-1dfb-c674.ngrok-free.app';
const customerApiUrl = 'https://localhost:4435';

const services = {
    // categoryService,// firebase
    categoryService: new CategoryService(apiUrl),
    productService: new ProductService(apiUrl),
    shopService: new ShopService(apiUrl),
    themeService: new ThemeService(apiUrl),
    userService: new UserService(customerApiUrl),
    addressService: new AddressService(customerApiUrl),
}

export default services;