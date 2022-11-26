import { useContext } from 'react';
import { CategoriesContext } from '../../contexts/category.context';
import Category from '../category/category.component';
import DirectoryItem from '../directory-item/directory-item.component';

import { DirectoryLeftContainer, DirectoryRightContainer } from './directory.styles';

const Directory = () => {
  const { categories, currentCategory } = useContext(CategoriesContext);
  return (
    <>
      <DirectoryLeftContainer>
        {categories.map((category) => (
          <DirectoryItem key={category.id} category={category} />
        ))}
      </DirectoryLeftContainer>
      <DirectoryRightContainer>
          {/* {JSON.stringify(currentCategory)} */}
          <Category category={currentCategory} />
      </DirectoryRightContainer>
    </>
  );
};

export default Directory;
