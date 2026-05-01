import { useContext } from 'react';
// import { CategoryContext } from '../context/CategoryContext';
// import { categories } from '../data/mockProducts';
import './Sidebar.css';
import {CategoriesContext} from "../contexts/category.context";

function Sidebar() {
  // const { currentCategory, setCurrentCategory } = useContext(CategoryContext);
  const { categories, currentCategory, setCurrentCategory } = useContext(CategoriesContext);

  const handleCategoryClick = (categoryId) => {
    console.log(`Changement de catégorie: ${categoryId}`);
    setCurrentCategory(categoryId);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        <h2 className="sidebar-title">Catégories</h2>
        <nav className="categories-list">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`category-btn ${currentCategory === category.id ? 'active' : ''}`}
              onClick={() => handleCategoryClick(category.id)}
            >
              {category.name}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}

export default Sidebar;
