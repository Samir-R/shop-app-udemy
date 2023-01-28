import { useContext, Fragment } from 'react';
import Grid from "@mui/material/Unstable_Grid2";
import { Scrollbars } from 'react-custom-scrollbars';
import { CategoriesContext } from '../../contexts/category.context';
import Category from '../category/category.component';
import DirectoryItem from '../directory-item/directory-item.component';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';

import { DirectoryLeftContainer, DirectoryRightContainer } from './directory.styles';


const drawerWidth = {
  xs:0,
  sm:240,
  md:300,
};

const Directory = () => {
  const { categories, currentCategory } = useContext(CategoriesContext);
  return (
    // <>
    //   <DirectoryLeftContainer>
    //     {categories.map((category) => (
    //       <DirectoryItem key={category.id} category={category} />
    //     ))}
    //   </DirectoryLeftContainer>
    //   <DirectoryRightContainer>
    //       {/* {JSON.stringify(currentCategory)} */}
    //       <Category category={currentCategory} />
    //   </DirectoryRightContainer>
    // </>
    // <Grid container rowSpacing={1} columnSpacing={{ xs: 2, sm: 2, md: 2 }}>
    //    <Grid xs={12} sm={12} md={2}
    //     sx={{ boxShadow: 6, borderRadius: 2, padding: 0, height: 810 }}>
    //       <Scrollbars style={{ height: 800 }}>
    //         {categories.map((category) => (
    //           <DirectoryItem key={category.id} category={category} />
    //         ))}
    //       </Scrollbars>
    //     </Grid>
    //     <Grid xs={12} sm={12} md={10} sx={{ padding: 0, height: 810, overflow: 'scroll' }}>
    //       {/* <Scrollbars renderTrackHorizontal={props => <div {...props} style={{display: 'none'}} className="track-horizontal"/>} style={{ height: 800 }} > */}
    //         <Category category={currentCategory} />
    //       {/* </Scrollbars> */}
    //     </Grid>
    // </Grid>
    <Fragment>
    {/* <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Clipped drawer
          </Typography>
        </Toolbar>
      </AppBar> */}
    <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          width: { xs: drawerWidth.xs, sm: drawerWidth.sm, md: drawerWidth.md },
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: { xs: drawerWidth.xs, sm: drawerWidth.sm, md: drawerWidth.md }, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {['All mail', 'Trash', 'Spam'].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, ml: { xs: drawerWidth.xs + 'px', sm: drawerWidth.sm + 'px', md: drawerWidth.md + 'px' } }}>
        <Toolbar />
          <Category category={currentCategory} />
      </Box>
    {/* </Box> */}
    </Fragment>
  );
};

export default Directory;
