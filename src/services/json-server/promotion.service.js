import CoreService from "../core/core.service";
import Promotion from "../../entities/promotion.entity";

export default class PromotionService extends CoreService {
    constructor(apiUrl) {
      if (!apiUrl) {
        throw new Error('Missing apiUrl argument for service constructor');
      }
      super(apiUrl);
    }

    get endpointUrl() {
      return `${this.apiUrl}/promotions`;
    }

    async getAllPromotions() {
        const { data } = await this.httpGet(`${this.apiUrl}/shops/019a8ed6-d371-78f7-8560-9c6508e30fa0/promotions`, {}, false);
        return data.member ? data.member.map(promotion => new Promotion(promotion)) : [];
    }
};