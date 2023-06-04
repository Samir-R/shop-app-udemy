import { useContext, useState, useEffect, Fragment, useRef } from 'react';

import ProductCard from '../../components/product-card/product-card.component';
import { ProductContext } from '../../contexts/product.context';


import { CategoryContainer, Title } from './category.styles';
import Grid from "@mui/material/Unstable_Grid2";
import { styled, useTheme } from '@mui/material/styles';
import {Alert, Box, Button, Paper, Toolbar, Typography, useMediaQuery} from "@mui/material";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CustomAlert from '../custom-alert/custom-alert.component';
import { ThemeCustomContext } from '../../contexts/theme-custom.context';

const CustomShowCategoriesButton = styled(Button)(({ theme }) => ({
  fontSize: '16px',
  fontWeight: 'bold',
  width: '100%',
  textTransform: 'none',
  borderRadius: '0px',
  padding: '10px',
  backgroundColor: theme.palette.CategorySelectedButton.main,
  color: theme.palette.CategorySelectedButton.contrastText,
  "& .MuiSvgIcon-root": {
      fontSize: "33px !important"
  } ,
  ":hover": {
    backgroundColor: theme.palette.CategorySelectedButton.main,
    color: theme.palette.CategorySelectedButton.contrastText,
  }         
}));

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const Category = ({ category, handleSetCategoryMenuTop, categoriesCount }) => {
  // https://stackoverflow.com/questions/72826309/get-current-material-ui-breakpoint-name
  const theme = useTheme();
  // const greaterThanMid = useMediaQuery(theme.breakpoints.up("md"));
  const lessThanSmall = useMediaQuery(theme.breakpoints.down("md"));

  const { products } = useContext(ProductContext);
  const { headerHeight } = useContext(ThemeCustomContext);
  const ref = useRef(null);

  const productsCurrentCategory = category
  ? products.filter(product => product.categories === category.id)
  : [];

  const [categoryHeight, setCategoryHeight] = useState(null)

  console.log('on refresh le category component ');
  console.log(category);

  // useEffect(() => {
  //   setProducts(categoriesMap[category]);
  // }, [category, categoriesMap]);

  /*
return (
  <>
    {productsCurrentCategory.length ?
      <>
      <Title>{category.name.toUpperCase()}</Title>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)' }}>
          {productsCurrentCategory.map((product) => (
              <Item><ProductCard product={product} /></Item>
          ))}
      </Box>
      </>
      :
      <span>Aucun produit actifs dans cette categorie</span>
    }
    </>
)
*/

  return (
      <>
      {category ?
          <>
          {
            lessThanSmall ?
            (<div style={{
              position: 'fixed',
              zIndex: '1200',
              width: '100%',
              left: '0',
              top: headerHeight !== null ? headerHeight + 'px' : 'initial' }
            }
            ref={el => { ref.current = el; setCategoryHeight(ref.current?.clientHeight) }}
            >
            <Typography variant="h6" align='center'
              style={{
                fontSize: '28px',
                width: '100%',
                backgroundColor: '#fff'
              }}>{category.name.toUpperCase()}</Typography>
              {
                categoriesCount > 1 && (
                <CustomShowCategoriesButton
                  size='small'
                  onClick={() => handleSetCategoryMenuTop(true)}
                  style={{
                    }}
                  startIcon={<ArrowDropDownIcon />}
                  endIcon={<ArrowDropDownIcon />}
                >
                  Voir nos autres categories
                </CustomShowCategoriesButton>
                )
              }
              
              </div>
              )
            :
            <Title>{category.name.toUpperCase()}</Title>
          }
            {/* <Title>{category.name.toUpperCase()}</Title> */}
                  {productsCurrentCategory.length ?
                      <Grid container rowSpacing={4} columnSpacing={{ xs: 1, sm: 2, md: 1 }}
                      sx={{
                        marginTop: lessThanSmall && categoryHeight !== null ? (categoryHeight + 5) + 'px' : 'initial',
                      }}>
                        {productsCurrentCategory.map((product) => (
                            <Grid key={product.id} xs={6} sm={6} md={6} lg={4} xl={3}>
                              <ProductCard product={product} />
                            </Grid>
                        ))}
                      </Grid>
                      :
                      <Box
                      sx={{
                        marginTop: lessThanSmall && categoryHeight !== null ? (categoryHeight + 15) + 'px' : 'initial',
                      }}>
                        <CustomAlert
                          text="Aucun produit actifs dans cette categorie"
                          />
                      {/* <Alert severity="info">
                      <Typography variant="h6" align='center'>
                        Aucun produit actifs dans cette categorie
                      </Typography>
                      </Alert> */}
                      {/* <img alt="toto" src="https://firebasestorage.googleapis.com/v0/b/shop-app-udemy-fe5b1.appspot.com/o/image.png?alt=media&token=752514c1-0609-428a-8907-147ebb5e3709" /> */}
                      </Box>
                    }
          </>
        :
        <>
        <CustomAlert
          text="Aucune produit trouvé"
          />
        {/* <span>Aucune produit trouvé</span> */}
        {/* <img alt="toto" src="https://firebasestorage.googleapis.com/v0/b/shop-app-udemy-fe5b1.appspot.com/o/image.png?alt=media&token=752514c1-0609-428a-8907-147ebb5e3709" /> */}
        </>
      }
      </>
  );
};

export default Category;
