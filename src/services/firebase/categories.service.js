import Category from "../../entities/category.entity";
import { getDocumentsOfCollectionByCondition } from "../../utils/firebase/firebase.utils"

const CategoryService = {
    async getAllCategories() {
        const whereConditions = [['status', '==', 'ACTIVE' ]];
        return await getDocumentsOfCollectionByCondition('categories', whereConditions, Category);
    },
};

export default CategoryService;