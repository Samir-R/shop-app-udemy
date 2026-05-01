import Product from "../../entities/product.entity";
import CoreService from "../core/core.service";

export default class ProductService extends CoreService {
    constructor(apiUrl) {
      if (!apiUrl) {
        throw new Error('Missing apiUrl argument for service constructor');
      }
      super(apiUrl);
    }

    get endpointUrl() {
      return `${this.apiUrl}/products`;
    }

    async getAllProducts() {
        const { data } = await this.httpGet(`${this.apiUrl}/shops/019a8ed6-d371-78f7-8560-9c6508e30fa0/products`, {}, false);
        return data.member ? data.member.map(product => new Product(product)) : [];
    }
};