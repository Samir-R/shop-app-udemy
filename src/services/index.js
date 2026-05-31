// import categoryService from './firebase/categories.service';
import ThemeService from './json-server/theme.service';
import CategoryService from './json-server/category.service';
import ProductService from './json-server/product.service';
import ShopService from "./json-server/shop.service";
import UserService from "./json-server/user.service";
import AddressService from "./json-server/address.service";
import OrderService from "./json-server/order.service";
import PromotionService from "./json-server/promotion.service";
import ShopSettingsService from "./json-server/shop-settings.service";

const apiUrl = process.env.REACT_APP_API_URL;
// const apiUrl2 = 'https://f3c5-2a01-e0a-abc-d3c0-b990-201d-1dfb-c674.ngrok-free.app';
const customerApiUrl = 'https://localhost:4435';
const apiUrl2 = 'https://localhost:4437/api';

const services = {
    // categoryService,// firebase
    shopSettingsService: new ShopSettingsService(apiUrl2),
    categoryService: new CategoryService(apiUrl2),
    productService: new ProductService(apiUrl2),
    promotionService: new PromotionService(apiUrl2),
    shopService: new ShopService(apiUrl2),
    themeService: new ThemeService(apiUrl),
    userService: new UserService(apiUrl2),
    addressService: new AddressService(apiUrl2),
    orderService: new OrderService(apiUrl2),
}

export default services;