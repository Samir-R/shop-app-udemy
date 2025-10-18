import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Switch
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Home as HomeIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import {user} from "../../routes/checkout/fakeData";
// import { useUser } from '../context/UserContext';

export default function PersonalInfo({ onBack }) {
  // const { user, updateUser, addAddress, updateAddress, deleteAddress } = useUser();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(user);
  const [addressDialog, setAddressDialog] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({
    label: '',
    street: '',
    city: '',
    postalCode: '',
    country: 'France',
    isDefault: false
  });

  const handleSave = () => {
    // updateUser(formData);
    console.log('updateUser')
    console.log(formData)
    setEditMode(false);
  };

  const handleAddressSubmit = () => {
    if (editingAddress) {
      // updateAddress(editingAddress.id, addressForm);
      console.log('editingAddress.id, addressForm');
      console.log(editingAddress.id, addressForm);
    } else {
      // addAddress(addressForm);
      console.log('addressForm');
      console.log(addressForm);
    }
    setAddressDialog(false);
    resetAddressForm();
  };

  const resetAddressForm = () => {
    setAddressForm({
      label: '',
      street: '',
      city: '',
      postalCode: '',
      country: 'France',
      isDefault: false
    });
    setEditingAddress(null);
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setAddressForm(address);
    setAddressDialog(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Button
        onClick={onBack}
        sx={{ mb: 3, color: '#1976d2' }}
      >
        ← Retour au tableau de bord
      </Button>

      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
        Mes informations personnelles
      </Typography>

      {/* Informations personnelles */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Informations de base
            </Typography>
            <Button
              startIcon={editMode ? <SaveIcon /> : <EditIcon />}
              onClick={editMode ? handleSave : () => setEditMode(true)}
              variant={editMode ? 'contained' : 'outlined'}
            >
              {editMode ? 'Sauvegarder' : 'Modifier'}
            </Button>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Prénom"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                disabled={!editMode}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nom"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                disabled={!editMode}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!editMode}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Téléphone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={!editMode}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Adresses */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Mes adresses
            </Typography>
            <Button
              startIcon={<AddIcon />}
              variant="outlined"
              onClick={() => setAddressDialog(true)}
            >
              Ajouter une adresse
            </Button>
          </Box>

          <Grid container spacing={2}>
            {user.addresses.map((address) => (
              <Grid item xs={12} key={address.id}>
                <Box
                  sx={{
                    p: 2,
                    border: '1px solid #e0e0e0',
                    borderRadius: 2,
                    backgroundColor: address.isDefault ? '#f3f9ff' : 'transparent'
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <HomeIcon sx={{ mr: 1, color: '#666' }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {address.label}
                        </Typography>
                        {address.isDefault && (
                          <Chip label="Par défaut" size="small" sx={{ ml: 1 }} />
                        )}
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {address.street}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {address.postalCode} {address.city}, {address.country}
                      </Typography>
                    </Box>
                    <Box>
                      <IconButton
                        size="small"
                        onClick={() => handleEditAddress(address)}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        // onClick={() => deleteAddress(address.id)}
                        sx={{ color: '#f44336' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Dialog pour ajouter/modifier une adresse */}
      <Dialog open={addressDialog} onClose={() => setAddressDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingAddress ? 'Modifier l\'adresse' : 'Ajouter une adresse'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Libellé"
                value={addressForm.label}
                onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                placeholder="Ex: Domicile, Travail..."
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Adresse"
                value={addressForm.street}
                onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Code postal"
                value={addressForm.postalCode}
                onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Ville"
                value={addressForm.city}
                onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Pays"
                value={addressForm.country}
                onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={addressForm.isDefault}
                    onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                  />
                }
                label="Définir comme adresse par défaut"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddressDialog(false)}>Annuler</Button>
          <Button onClick={handleAddressSubmit} variant="contained">
            {editingAddress ? 'Modifier' : 'Ajouter'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}