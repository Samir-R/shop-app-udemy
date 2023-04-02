import { useContext } from 'react';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { CategoriesContext } from '../../contexts/category.context';
import { styled } from '@mui/material/styles';

// import {
//   BackgroundImage,
//   DirectoryItemContainer,
// } from './directory-item.styles';


const CustomListItemCategory = styled(ListItem)(({ theme }) => ({
  "& .MuiListItemButton-root": {
    backgroundColor: theme.palette.CategoryButton.main,
    fontWeight: 'bold',
    color: theme.palette.CategoryButton.contrastText,
    "& .MuiListItemIcon-root": {
      color: theme.palette.CategoryButton.contrastText,
    },
    "& .MuiTypography-root": {
      color: theme.palette.CategoryButton.contrastText,
    }
  },
  "& .MuiListItemButton-root:hover": {
    backgroundColor: theme.palette.CategoryHoverButton.main,
    color: theme.palette.CategoryHoverButton.contrastText,
    "& .MuiListItemIcon-root": {
      color: theme.palette.CategoryHoverButton.contrastText,
    },
    "& .MuiTypography-root": {
      color: theme.palette.CategoryHoverButton.contrastText,
    }
  },
  "& .MuiListItemButton-root.Mui-selected": {
    backgroundColor: theme.palette.CategorySelectedButton.main,
    color: theme.palette.CategorySelectedButton.contrastText,
    "& .MuiListItemIcon-root": {
      color: theme.palette.CategorySelectedButton.contrastText,
    },
    "& .MuiTypography-root": {
      color: theme.palette.CategorySelectedButton.contrastText,
    }
  },
  "& .MuiListItemButton-root.Mui-selected:hover": {
    backgroundColor: theme.palette.CategorySelectedButton.main,
    color: theme.palette.CategorySelectedButton.contrastText,
    "& .MuiListItemIcon-root": {
      color: theme.palette.CategorySelectedButton.contrastText
    },
    "& .MuiTypography-root": {
      color: theme.palette.CategorySelectedButton.contrastText
    }
  },
}));


const DirectoryItem = ({ category, isCurrentCategory, handleSelectCurrentCategory }) => {
  
  const onClickHandler = () => (handleSelectCurrentCategory(category));

  return (
    <CustomListItemCategory key={category.id} disablePadding>
      {/* <ListItemButton selected={category.id === currentCategory?.id} onClick={onClickHandler}> */}
      <ListItemButton selected={isCurrentCategory} onClick={onClickHandler}>
        {/* <ListItemText sx={{ textAlign: 'center', p: 2, fontWeight: 'bold' }} */}
        <ListItemText disableTypography
        primary={<Typography sx={{ textAlign: 'center', p: 2, fontWeight: 'bold', color: '#FFFFFF' }}>{category.name}</Typography>} />
      </ListItemButton>
    </CustomListItemCategory>
  );
};

export default DirectoryItem;
