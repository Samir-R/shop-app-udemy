import Product from "../../entities/product.entity";
import CoreService from "../core/core.service";
import Shop from "../../entities/shop.entity";

export default class ShopService extends CoreService {
    constructor(apiUrl) {
      if (!apiUrl) {
        throw new Error('Missing apiUrl argument for service constructor');
      }
      super(apiUrl);
    }

    get endpointUrl() {
      return `${this.apiUrl}/shops`;
    }

    async getShopsList() {
        const { data } = await this.httpGet(this.endpointUrl);
        return data ? data.map(shop => new Shop(shop)) : [];
    }
};