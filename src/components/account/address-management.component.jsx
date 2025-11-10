import React, { useState, useContext, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
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
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { AddressContext } from '../../contexts/address.context';
import { addressSchema } from './address-validation';

// Valeurs par défaut du formulaire d'adresse
const getDefaultAddressForm = (mode = 'list') => ({
  name: '',
  street1: '',
  street2: '',
  city: '',
  zipcode: '',
  country: 'France',
  isFavorite: mode === 'select' // true en mode select, false en mode list
});

/**
 * Composant pour gérer les adresses de l'utilisateur
 * @param {string} mode - Mode d'affichage : 'list' (par défaut) ou 'select'
 * @param {Function} onAddAddress - Callback optionnel après ajout d'une adresse
 * @param {Function} onUpdateAddress - Callback optionnel après modification d'une adresse
 * @param {Function} onDeleteAddress - Callback optionnel après suppression d'une adresse
 */
const AddressManagement = ({ mode = 'list', onAddAddress, onUpdateAddress, onDeleteAddress }) => {
  const { addresses, currentAddress, isLoading, totalItems, currentPage, itemsPerPage, getAddresses, createAddress, updateAddress, deleteAddress, setCurrentAddress } = useContext(AddressContext);
  const [addressDialog, setAddressDialog] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [addressForm, setAddressForm] = useState(getDefaultAddressForm(mode));
  const [showAddressList, setShowAddressList] = useState(false);

  // Charger les adresses au montage du composant
  useEffect(() => {
    getAddresses();
  }, [getAddresses]);

  const handleAddressSubmit = async () => {
    setError('');
    setErrors({});

    // Validation avec Zod
    const validation = addressSchema.safeParse(addressForm);

    if (!validation.success) {
      // Convertir les erreurs Zod en format objet
      const zodErrors = {};
      validation.error.issues.forEach((err) => {
        const path = err.path[0];
        zodErrors[path] = err.message;
      });

      setErrors(zodErrors);
      return;
    }

    setIsSubmitting(true);

    let result;
    if (editingAddress) {
      // Modifier une adresse existante
      result = await updateAddress(editingAddress.id, addressForm);

      // Appeler le callback optionnel
      if (result.success && onUpdateAddress) {
        onUpdateAddress(editingAddress.id, addressForm);
      }
    } else {
      // Ajouter une nouvelle adresse
      result = await createAddress(addressForm);

      // Appeler le callback optionnel
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

    // Effacer l'erreur du champ modifié
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const resetAddressForm = () => {
    setAddressForm(getDefaultAddressForm(mode));
    setEditingAddress(null);
    setError('');
    setErrors({});
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setAddressForm(address);
    setAddressDialog(true);
  };

  const handleDeleteAddress = async (addressId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette adresse ?')) {
      const result = await deleteAddress(addressId);

      // Appeler le callback optionnel
      if (result.success && onDeleteAddress) {
        onDeleteAddress(addressId);
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
      setShowAddressList(false); // Cacher la liste après sélection
    }
  };

  const handlePageChange = (event, page) => {
    getAddresses(page);
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Réinitialiser l'affichage de la liste quand le composant se monte (mode select)
  useEffect(() => {
    if (mode === 'select') {
      setShowAddressList(false);
    }
  }, [mode]);

  // Mode SELECT : Affichage sous forme de sélection pour le checkout
  if (mode === 'select') {
    return (
      <>
        <Box>
          {/* Afficher l'adresse sélectionnée */}
          {currentAddress && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Adresse de livraison
              </Typography>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <HomeIcon sx={{ mr: 1, color: '#666' }} />
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
            </Box>
          )}

          {/* Bouton pour afficher/cacher la liste des adresses */}
          {!showAddressList ? (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => setShowAddressList(true)}
                fullWidth
              >
                Changer d'adresse de livraison
              </Button>
            </Box>
          ) : (
            <>
              {/* Liste des adresses disponibles */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Vos adresses
                </Typography>
                <Button
                  startIcon={<AddIcon />}
                  variant="outlined"
                  size="small"
                  onClick={() => setAddressDialog(true)}
                >
                  Nouvelle adresse
                </Button>
              </Box>

              {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                  <CircularProgress />
                </Box>
              ) : addresses.length === 0 ? (
                <Alert severity="info">
                  Aucune adresse enregistrée. Veuillez ajouter une adresse de livraison.
                </Alert>
              ) : (
            <Grid container spacing={2}>
              {addresses.map((address) => (
                <Grid item xs={12} key={address.id}>
                  <Box
                    onClick={() => handleSelectAddress(address)}
                    sx={{
                      p: 2,
                      border: '2px solid',
                      borderColor: currentAddress?.id === address.id ? 'primary.main' : '#e0e0e0',
                      borderRadius: 2,
                      backgroundColor: currentAddress?.id === address.id ? '#f3f9ff' : 'transparent',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: currentAddress?.id === address.id ? 'primary.main' : 'primary.light',
                        backgroundColor: currentAddress?.id === address.id ? '#f3f9ff' : '#fafafa',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <HomeIcon
                            sx={{
                              mr: 1,
                              color: currentAddress?.id === address.id ? 'primary.main' : '#666'
                            }}
                          />
                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontWeight: 600,
                              color: currentAddress?.id === address.id ? 'primary.main' : 'text.primary'
                            }}
                          >
                            {address.name}
                          </Typography>
                          {address.isFavorite && (
                            <Chip
                              label="Par défaut"
                              size="small"
                              color="primary"
                              variant={currentAddress?.id === address.id ? "filled" : "outlined"}
                              sx={{ ml: 1 }}
                            />
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
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditAddress(address);
                          }}
                          sx={{ mr: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              ))}
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
          )}
        </Box>

        {/* Dialog pour ajouter/modifier une adresse */}
        <Dialog open={addressDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editingAddress ? 'Modifier l\'adresse' : 'Ajouter une adresse'}
          </DialogTitle>
          <DialogContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Grid container spacing={2} sx={{ mt: 1 }}>
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
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} disabled={isSubmitting}>Annuler</Button>
            <Button onClick={handleAddressSubmit} variant="contained" disabled={isSubmitting}>
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                editingAddress ? 'Modifier' : 'Ajouter'
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  // Mode LIST : Affichage par défaut pour la gestion des adresses
  return (
    <>
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
              disabled={isLoading}
            >
              Ajouter une adresse
            </Button>
          </Box>

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
                      border: '1px solid #e0e0e0',
                      borderRadius: 2,
                      backgroundColor: address.isFavorite ? '#f3f9ff' : 'transparent'
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <HomeIcon sx={{ mr: 1, color: '#666' }} />
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {address.name}
                          </Typography>
                          {address.isFavorite && (
                            <Chip label="Par défaut" size="small" sx={{ ml: 1 }} />
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
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteAddress(address.id)}
                          sx={{ color: '#f44336' }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
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
        </CardContent>
      </Card>

      {/* Dialog pour ajouter/modifier une adresse */}
      <Dialog open={addressDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingAddress ? 'Modifier l\'adresse' : 'Ajouter une adresse'}
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={2} sx={{ mt: 1 }}>
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
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={isSubmitting}>Annuler</Button>
          <Button onClick={handleAddressSubmit} variant="contained" disabled={isSubmitting}>
            {isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              editingAddress ? 'Modifier' : 'Ajouter'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddressManagement;
