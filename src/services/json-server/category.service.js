import Category from "../../entities/category.entity";
import CoreService from "../core/core.service";

//const CategoryService = {
export default class CategoryService extends CoreService {
    constructor(apiUrl) {
      if (!apiUrl) {
        throw new Error('Missing apiUrl argument for service constructor');
      }
      super(apiUrl);
    }

    get endpointUrl() {
      return `${this.apiUrl}/categories`;
    }

    async getAllCategories() {
        const { data } = await this.httpGet(`${this.apiUrl}/shops/019a8ed6-d371-78f7-8560-9c6508e30fa0/categories`, {}, false);
        return data.member ? data.member.map(category => new Category(category)) : [];
    }
};

// export default CategoryService;