import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  Typography,
  useMediaQuery,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';

const ItemsTable = ({ items }) => (
  <Table size="small">
    <TableHead>
      <TableRow>
        <TableCell sx={{ fontWeight: 'bold' }}>Nom</TableCell>
        <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {items.map((item) => (
        <TableRow key={item.id}>
          <TableCell>{item.title}</TableCell>
          <TableCell>{item.description ?? '—'}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

const ItemsList = ({ items }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
    {items.map((item) => (
      <Box key={item.id} sx={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid', borderColor: 'divider', pb: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{item.title}</Typography>
        {item.description && (
          <Typography variant="body2" color="text.secondary">{item.description}</Typography>
        )}
      </Box>
    ))}
  </Box>
);

const ProductInformationsModal = ({ open, onClose, productInformations = [] }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  const hasTabs = productInformations.length > 1;
  const currentItems = productInformations[tabIndex]?.items ?? [];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: { width: isSmall ? '90%' : undefined, m: isSmall ? 1 : undefined },
      }}
    >
      <DialogTitle sx={{ pr: 6 }}>
        {productInformations[tabIndex]?.title ?? 'Informations'}
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {hasTabs && (
        <Tabs
          value={tabIndex}
          onChange={(_, val) => setTabIndex(val)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ px: 2, borderBottom: 1, borderColor: 'divider' }}
        >
          {productInformations.map((group, i) => (
            <Tab key={i} label={group.title} />
          ))}
        </Tabs>
      )}

      <DialogContent>
        {isSmall ? (
          <ItemsList items={currentItems} />
        ) : (
          <ItemsTable items={currentItems} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProductInformationsModal;
