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
        const { data } = await this.httpGet(this.endpointUrl);
        return data ? data.map(product => new Product(product)) : [];
    }

    async getAllProductsByCategory() {
        const { data } = await this.httpGet(this.endpointUrl);
        return data ? data.map(product => new Product(product)) : [];
    }
};