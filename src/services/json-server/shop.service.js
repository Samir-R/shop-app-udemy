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

    async getShopsList(city) {
        const base = `${this.apiUrl}/shops/019a8ed6-d371-78f7-8560-9c6508e30fa0/point-of-sales`;
        const url = city ? `${base}?city=${encodeURIComponent(city)}` : base;
        const { data } = await this.httpGet(url, {}, false);
        const members = data?.member ?? data ?? [];
        return members.map(shop => new Shop(shop));
    }
};