import React, { useState, useContext, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Switch,
  TextField,
  CircularProgress,
  Alert,
  Pagination,
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { LuMapPinned, LuMapPinPlus, LuTrash2 } from "react-icons/lu";
import { AddressContext } from '../../contexts/address.context';
import { UserContext } from '../../contexts/user.context';
import { addressSchema } from './address-validation';
import { FaStar } from "react-icons/fa";
import { MdOutlineEditLocation } from "react-icons/md";

const getDefaultAddressForm = (mode = 'list', isGuest = false) => ({
  name: isGuest ? 'Votre adresse' : '',
  street1: '',
  street2: '',
  city: '',
  zipcode: '',
  country: 'France',
  isFavorite: mode === 'select'
});

const AddressManagement = ({ mode = 'list', onAddAddress, onUpdateAddress, onDeleteAddress }) => {
  const { addresses, currentAddress, isLoading, totalItems, currentPage, itemsPerPage, getAddresses, createAddress, updateAddress, deleteAddress, setCurrentAddress } = useContext(AddressContext);
  const { currentUserGuest } = useContext(UserContext);
  const [addressDialog, setAddressDialog] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [showAddressList, setShowAddressList] = useState(false);

  const isGuest = !!currentUserGuest;

  const [addressForm, setAddressForm] = useState(getDefaultAddressForm(mode, isGuest));

  useEffect(() => {
    if (!isGuest) {
      getAddresses();
    }
  }, [getAddresses, isGuest]);

  useEffect(() => {
    if (mode === 'select') {
      setShowAddressList(false);
    }
  }, [mode]);

  const handleAddressSubmit = async () => {
    setError('');
    setErrors({});

    const validation = addressSchema.safeParse(addressForm);

    if (!validation.success) {
      const zodErrors = {};
      validation.error.issues.forEach((err) => {
        const path = err.path[0];
        zodErrors[path] = err.message;
      });
      setErrors(zodErrors);
      return;
    }

    setIsSubmitting(true);

    if (isGuest) {
      setCurrentAddress({
        ...addressForm,
        id: editingAddress?.id || 'guest-address',
      });

      setIsSubmitting(false);
      setAddressDialog(false);
      resetAddressForm();

      if (editingAddress && onUpdateAddress) {
        onUpdateAddress('guest-address', addressForm);
      } else if (onAddAddress) {
        onAddAddress(addressForm);
      }

      return;
    }

    let result;
    if (editingAddress) {
      result = await updateAddress(editingAddress.id, addressForm);
      if (result.success && onUpdateAddress) {
        onUpdateAddress(editingAddress.id, addressForm);
      }
    } else {
      result = await createAddress(addressForm);
      if (result.success && onAddAddress) {
        onAddAddress(addressForm);
      }
    }

    setIsSubmitting(false);

    if (result.success) {
      setAddressDialog(false);
      resetAddressForm();
    } else {
      setError(result.message);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const resetAddressForm = () => {
    setAddressForm(getDefaultAddressForm(mode, isGuest));
    setEditingAddress(null);
    setError('');
    setErrors({});
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setAddressForm({
      ...getDefaultAddressForm(mode, isGuest),
      ...Object.fromEntries(Object.entries(address).map(([k, v]) => [k, v ?? ''])),
    });
    setAddressDialog(true);
  };

  const handleDeleteAddress = async (addressId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette adresse ?')) {
      const result = await deleteAddress(addressId);
      if (result.success) {
        if (currentAddress?.id === addressId) {
          setCurrentAddress(null);
        }
        if (onDeleteAddress) {
          onDeleteAddress(addressId);
        }
      }
    }
  };

  const handleCloseDialog = () => {
    setAddressDialog(false);
    resetAddressForm();
  };

  const handleSelectAddress = (address) => {
    setCurrentAddress(address);
    if (mode === 'select') {
      setShowAddressList(false);
    }
  };

  const handlePageChange = (event, page) => {
    getAddresses(page);
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const renderAddressSection = (title) => (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <Button
          startIcon={<LuMapPinPlus />}
          variant="contained"
          onClick={() => setAddressDialog(true)}
          disabled={isLoading}
        >
          <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Ajouter une adresse</Box>
          <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>Ajouter</Box>
        </Button>
      </Box>
      {renderAddressList()}
    </>
  );

  const renderDialog = () => (
    <Dialog open={addressDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
      <DialogTitle>
        {editingAddress ? 'Modifier l\'adresse' : (isGuest ? 'Créer une adresse' : 'Ajouter une adresse')}
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={2} sx={{ mt: 1 }}>
          {!isGuest && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="name"
                label="Libellé"
                value={addressForm.name}
                onChange={handleChange}
                placeholder="Ex: Domicile, Travail..."
                disabled={isSubmitting}
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>
          )}
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="street1"
              label="Adresse ligne 1"
              value={addressForm.street1}
              onChange={handleChange}
              disabled={isSubmitting}
              error={!!errors.street1}
              helperText={errors.street1}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="street2"
              label="Adresse ligne 2 (optionnel)"
              value={addressForm.street2}
              onChange={handleChange}
              disabled={isSubmitting}
              error={!!errors.street2}
              helperText={errors.street2}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="zipcode"
              label="Code postal"
              value={addressForm.zipcode}
              onChange={handleChange}
              disabled={isSubmitting}
              error={!!errors.zipcode}
              helperText={errors.zipcode}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="city"
              label="Ville"
              value={addressForm.city}
              onChange={handleChange}
              disabled={isSubmitting}
              error={!!errors.city}
              helperText={errors.city}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="country"
              label="Pays"
              value={addressForm.country}
              onChange={handleChange}
              disabled={isSubmitting}
              error={!!errors.country}
              helperText={errors.country}
            />
          </Grid>
          {!isGuest && (
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    name="isFavorite"
                    checked={addressForm.isFavorite}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                }
                label="Définir comme adresse par défaut"
              />
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog} disabled={isSubmitting}>Annuler</Button>
        <Button onClick={handleAddressSubmit} variant="contained" disabled={isSubmitting}>
          {isSubmitting ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            editingAddress ? 'Modifier' : (isGuest ? 'Créer' : 'Ajouter')
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderCurrentAddress = () => {
    if (!currentAddress) return null;
    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Adresse de livraison
        </Typography>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <LuMapPinned color="#666" style={{ marginRight: 8 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {currentAddress.name}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {currentAddress.street1}
          </Typography>
          {currentAddress.street2 && (
            <Typography variant="body2" color="text.secondary">
              {currentAddress.street2}
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary">
            {currentAddress.zipcode} {currentAddress.city}, {currentAddress.country}
          </Typography>
        </Box>
        {isGuest && (
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => handleEditAddress(currentAddress)}
            fullWidth
            sx={{ mt: 2 }}
          >
            Modifier l'adresse
          </Button>
        )}
      </Box>
    );
  };

  const renderAddressList = () => (
    <>
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {addresses && addresses.length > 0 ? (
            addresses.map((address) => (
              <Grid item xs={12} key={address.id}>
                <Box
                  sx={{
                    p: 2,
                    border: currentAddress?.id === address.id ? '2px solid' : '1px solid #e0e0e0',
                    borderColor: currentAddress?.id === address.id ? 'primary.main' : undefined,
                    borderRadius: 2,
                    backgroundColor: address.isFavorite || currentAddress?.id === address.id ? '#f3f9ff' : 'transparent',
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LuMapPinned color="#666" style={{ marginRight: 8 }} />
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 600,
                            color: currentAddress?.id === address.id ? 'primary.main' : 'text.primary',
                          }}
                        >
                          {address.name}
                        </Typography>
                        {address.isFavorite && (
                          <FaStar style={{ marginLeft: '10px' }} color="#fbc531" title="Par défaut" />
                        )}
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {address.street1}
                      </Typography>
                      {address.street2 && (
                        <Typography variant="body2" color="text.secondary">
                          {address.street2}
                        </Typography>
                      )}
                      <Typography variant="body2" color="text.secondary">
                        {address.zipcode} {address.city}, {address.country}
                      </Typography>
                    </Box>
                    <Box>
                      <IconButton
                        size="small"
                        onClick={() => handleEditAddress(address)}
                        sx={{ mr: 1 }}
                      >
                        <MdOutlineEditLocation size={25} color="#444" />
                      </IconButton>
                      {mode !== 'select' && (
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteAddress(address.id)}
                          sx={{ color: '#f44336' }}
                        >
                          <LuTrash2 size={25} />
                        </IconButton>
                      )}
                    </Box>
                  </Box>
                  {mode === 'select' && (
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleSelectAddress(address)}
                      sx={{ mt: 1 }}
                      fullWidth
                    >
                      Choisir cette adresse
                    </Button>
                  )}
                </Box>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                Aucune adresse enregistrée
              </Typography>
            </Grid>
          )}
        </Grid>
      )}

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            disabled={isLoading}
          />
        </Box>
      )}
    </>
  );

  // Mode SELECT
  if (mode === 'select') {
    if (isGuest) {
      return (
        <>
          <Box>
            {currentAddress ? (
              renderCurrentAddress()
            ) : (
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Veuillez créer une adresse de livraison pour continuer
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<LuMapPinPlus />}
                  onClick={() => setAddressDialog(true)}
                  fullWidth
                >
                  Créer une adresse
                </Button>
              </Box>
            )}
          </Box>
          {renderDialog()}
        </>
      );
    }

    return (
      <>
        <Box>
          {renderCurrentAddress()}

          {!showAddressList ? (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                onClick={() => setShowAddressList(true)}
                fullWidth
              >
                Changer d'adresse de livraison
              </Button>
            </Box>
          ) : (
            renderAddressSection('Vos adresses')
          )}
        </Box>
        {renderDialog()}
      </>
    );
  }

  // Mode LIST
  return (
    <>
      <Card>
        <CardContent>
          {renderAddressSection('Mes adresses')}
        </CardContent>
      </Card>
      {renderDialog()}
    </>
  );
};

export default AddressManagement;
