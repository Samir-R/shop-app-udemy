import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CategoriesContext } from '../../contexts/category.context';

import {
  BackgroundImage,
  DirectoryItemContainer,
} from './directory-item.styles';

const DirectoryItem = ({ category }) => {
  const { setCurrentCategory } = useContext(CategoriesContext);
  const { imageUrl, name } = category;
  // const navigate = useNavigate();

  // const onNavigateHandler = () => navigate(route);
  const onNavigateHandler = () => (setCurrentCategory(category));

  return (
    <DirectoryItemContainer onClick={onNavigateHandler}>
      {/* <BackgroundImage imageUrl={imageUrl} /> */}
        <h2>{name}</h2>
    </DirectoryItemContainer>
  );
};

export default DirectoryItem;
