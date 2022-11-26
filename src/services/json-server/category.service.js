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
        const { data } = await this.httpGet(this.endpointUrl);
        return data ? data.map(category => new Category(category)) : [];
    }
};

// export default CategoryService;