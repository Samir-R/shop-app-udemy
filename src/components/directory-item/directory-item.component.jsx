import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@mui/material';
import { CardContent } from '@mui/material';
import { CardMedia } from '@mui/material';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
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
    <Card onClick={onNavigateHandler}>
      <CardMedia
        sx={{ height: 240 }}
        image={imageUrl}
        title="green iguana"
      />
      <CardContent>

      {/* <BackgroundImage imageUrl={imageUrl} /> */}
        {/* <h2>{name}</h2> */}
        <Typography variant="h4" component="div" align='center'>
          {name}
        </Typography>
      </CardContent>
    </Card>
    // <ListItem disablePadding>
    //   <ListItemButton>
    //     <ListItemText primary={name} />
    //   </ListItemButton>
    // </ListItem>
  );
};

export default DirectoryItem;
