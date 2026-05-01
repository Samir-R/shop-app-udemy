import { useContext, useState, useRef, useEffect } from 'react';
// import { CategoryContext } from '../context/CategoryContext';
// import { categories } from '../data/mockProducts';
import './CategoryDropdown.css';
import {CategoriesContext} from "../contexts/category.context";

function CategoryDropdown() {
  // const { currentCategory, setCurrentCategory } = useContext(CategoryContext);
  const { categories, currentCategory, setCurrentCategory } = useContext(CategoriesContext);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentCategoryName = categories.find(cat => cat.id === currentCategory)?.name || 'Tous les produits';

  const handleCategoryClick = (categoryId) => {
    console.log(`Changement de catégorie: ${categoryId}`);
    setCurrentCategory(categoryId);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="category-dropdown-wrapper" ref={dropdownRef}>
      <button
        className="category-dropdown-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="category-dropdown-label">{currentCategoryName}</span>
        <svg
          className={`category-dropdown-icon ${isOpen ? 'open' : ''}`}
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {isOpen && (
        <div className="category-dropdown-menu">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`category-dropdown-item ${currentCategory === category.id ? 'active' : ''}`}
              onClick={() => handleCategoryClick(category.id)}
            >
              {category.name}
              {currentCategory === category.id && (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default CategoryDropdown;
