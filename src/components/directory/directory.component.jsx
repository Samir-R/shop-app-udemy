import { useContext, Fragment, useState } from 'react';
import { CategoriesContext } from '../../contexts/category.context';
import Category from '../category/category.component';
import DirectoryItem from '../directory-item/directory-item.component';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import { useTheme } from '@mui/material/styles';
import { Button } from '@mui/material';

// import { DirectoryLeftContainer, DirectoryRightContainer } from './directory.styles';

const drawerWidth = {
  xs:0,
  sm:0,
  // sm:240,
  md:250,
  lg:300,
};




const Directory = () => {

const theme = useTheme();
  const { categories, currentCategory, setCurrentCategory } = useContext(CategoriesContext);
  
  const handleSelectCurrentCategory = (category) => {
    setCategoryMenuTop(false);
    setCurrentCategory(category);
  }

  const [categoryMenuTop, setCategoryMenuTop] = useState(false);

  return (
    <Fragment>
      <Drawer
          variant="permanent"
          sx={{
            display: { sm: 'none', md: 'block' },
            width: { xs: drawerWidth.xs, sm: drawerWidth.sm, md: drawerWidth.md },
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: { xs: drawerWidth.xs, sm: drawerWidth.sm, md: drawerWidth.md }, boxSizing: 'border-box' },
          }}
        >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        {
          categories.length > 1 && (
            <List sx={{ pt: '16px' }} >
              {categories.map((category) => (
                <DirectoryItem key={category.id} category={category}
                  isCurrentCategory={category.id === currentCategory?.id}
                  handleSelectCurrentCategory={handleSelectCurrentCategory} />
              ))}
            </List>
          ) 
        }
        
      </Box>
      </Drawer>
    <Drawer
      anchor="top"
      open={categoryMenuTop}
      onClose={() => setCategoryMenuTop(false)}
      sx={{
        display: { sm: 'block', md: 'none' },
      }}
    >
      <Toolbar />
      <List sx={{ pt: '16px' }} >
          {categories.map((category) => (
            <DirectoryItem key={category.id} category={category}
              isCurrentCategory={category.id === currentCategory?.id}
              handleSelectCurrentCategory={handleSelectCurrentCategory} />
          ))}
        </List>
    </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, ml: { xs: drawerWidth.xs + 'px', sm: drawerWidth.sm + 'px', md: drawerWidth.md + 'px' } }}>
        <Toolbar />
          <Category category={currentCategory} categoriesCount={categories.length}
              handleSetCategoryMenuTop={setCategoryMenuTop} />
      </Box>
    </Fragment>
  );
};

export default Directory;
