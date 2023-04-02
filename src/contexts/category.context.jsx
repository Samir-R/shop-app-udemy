import { createContext, useState, useEffect } from 'react';
import services from '../services';

export const CategoriesContext = createContext({
  categories: [],
  currentCategory: null,
  setCurrentCategory: () => {},
});

export const CategoriesProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);

  useEffect(() => {
    const getCategoriesMap = async () => {
      const categoriesList = await services.categoryService.getAllCategories();
      console.log(categoriesList);
      console.log(categoriesList[0] || null);
      setCategories(categoriesList);
      console.log(categories);
      setCurrentCategory(categoriesList[0] || null);
      console.log(currentCategory);
    };

    getCategoriesMap();
  }, []);

  const value = { categories, currentCategory, setCurrentCategory };
  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  );
};
