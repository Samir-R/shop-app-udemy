import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

const ButtonDanger = styled(Button)({
  backgroundColor: '#e74c3c',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#c0392b',
  },
  '&.Mui-disabled': {
    backgroundColor: '#e74c3c',
    color: '#fff',
  },
});

export default ButtonDanger;
