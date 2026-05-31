import Product from "../../entities/product.entity";
import CoreService from "../core/core.service";
import Shop from "../../entities/shop.entity";

export default class ShopSettingsService extends CoreService {
    constructor(apiUrl) {
      if (!apiUrl) {
        throw new Error('Missing apiUrl argument for service constructor');
      }
      super(apiUrl);
    }

    get endpointUrl() {
      return `${this.apiUrl}/shops`;
    }

    async getShopSettings() {
        const url = `${this.apiUrl}/shops/by-website?websiteUrl=${encodeURIComponent(window.location.origin)}`;
        const { data } = await this.httpGet(url, {}, false);
        return data;
    }
};