import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { addDays, isAfter, isSameDay, startOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  LuClock,
  LuHandPlatter,
  LuSearch,
  LuShoppingBag,
  LuStar,
  LuStore,
  LuTruck,
  LuUtensils,
  LuZap
} from 'react-icons/lu';
import {IoClose, IoRestaurantOutline} from 'react-icons/io5';
import {
  DateToggleButton,
  DeliveryOptionButton,
  EmptyResults,
  RestaurantCard,
  RestaurantInfo,
  RestaurantList,
  ShopAndShippingFooter,
  ShopAndShippingHeader,
  TimeSelect,
} from './shop-shipping.styles';
import { ShopShippingContext } from '../../contexts/shop-shipping.context';
import { AddressContext } from '../../contexts/address.context';
import AddressManagement from '../account/address-management.component';
import {FaStoreSlash} from "react-icons/fa";
import {MdOutlineDeliveryDining} from "react-icons/md";

const ShopAndShipping = ({ mode = 'modal', onClose }) => {
  const {
    shopsList,
    shopsLoading,
    shopsSearchLoading,
    isSingleShop,
    shop,
    setShop,
    deliveryMethod,
    setDeliveryMethod,
    deliveryDate,
    setDeliveryDate,
    deliveryHour,
    setDeliveryHour,
    nextDay,
    setNextDay,
    asap,
    setAsap,
    timeSlots,
    isSelectionValid,
    validateAndResetIfNeeded,
    searchShopsByCity,
  } = useContext(ShopShippingContext);

  const { currentAddress } = useContext(AddressContext);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    validateAndResetIfNeeded();
  }, [validateAndResetIfNeeded]);

  useEffect(() => {
    if (!searchTerm.trim()) return;
    const timer = setTimeout(() => {
      searchShopsByCity(searchTerm.trim());
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm, searchShopsByCity]);

  const handleClearSearch = useCallback(() => {
    setSearchTerm('');
    searchShopsByCity(undefined);
  }, [searchShopsByCity]);

  const today = new Date();
  const tomorrow = addDays(today, 1);
  const showAsapButton = !!shop?.schedule?.asap;
  const showAddressManagement = mode === 'checkout' && deliveryMethod === 'delivery';

  // Pour le DatePicker : valeur uniquement si la date n'est ni aujourd'hui ni demain
  const customDateValue = useMemo(() => {
    if (!deliveryDate || asap) return null;
    if (isSameDay(deliveryDate, today) || isSameDay(deliveryDate, tomorrow)) return null;
    return deliveryDate;
  }, [deliveryDate, asap, today, tomorrow]);

  const handleConfirmModal = useCallback(() => {
    if (isSelectionValid) onClose?.();
  }, [isSelectionValid, onClose]);

  return (
    <>
      {/* En-tête modal (titre + bouton fermer uniquement) */}
      {mode === 'modal' && (
        <ShopAndShippingHeader>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Choisir un restaurant
            </Typography>
            <IconButton onClick={onClose} color="inherit" edge="end" size="small">
              <IoClose size={22} />
            </IconButton>
          </Box>
          <Alert severity="info">Vous pourrez modifier vos choix à tout moment.</Alert>
        </ShopAndShippingHeader>
      )}

      {/* Barre de recherche — identique pour modal et checkout */}
      {!isSingleShop && (
        <Box sx={{ px: { xs: '6px', sm: 2 }, pt: 2, pb: 0 }}>
          <TextField
            size="small"
            fullWidth
            placeholder="Rechercher un restaurant, une cuisine..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <LuSearch size={18} style={{ marginRight: 8, color: '#9e9e9e' }} />,
              endAdornment: searchTerm ? (
                <IconButton size="small" onClick={handleClearSearch}>
                  <IoClose size={16} />
                </IconButton>
              ) : null,
            }}
          />
        </Box>
      )}

      {/* Liste des restaurants (mode multi-magasins) */}
      {!isSingleShop && (
        <RestaurantList sx={!shopsLoading && !shopsSearchLoading && shopsList.length === 0 ? { height: 'auto' } : {}}>
          {shopsLoading || shopsSearchLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : shopsList.length === 0 ? (
            <EmptyResults>
              <FaStoreSlash size={48} color="#ccc" />
              <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
                Aucun restaurant trouvé
              </Typography>
            </EmptyResults>
          ) : (
            shopsList.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                selected={shop?.id === restaurant.id}
                onClick={() => setShop(restaurant)}
              >
                {/*<RestaurantImage src={restaurant.image} alt={restaurant.name} />*/}
                <RestaurantInfo>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {restaurant.name}
                    </Typography>
                    {/*<StatusBadge isOpen={restaurant.isOpen}>*/}
                    {/*  {restaurant.isOpen ? 'Ouvert' : 'Fermé'}*/}
                    {/*</StatusBadge>*/}
                  </Box>
                  <Typography variant="body2" color="textSecondary" noWrap>
                    {restaurant.address}
                  </Typography>
                  {/*<RestaurantTags>*/}
                  {/*  <RestaurantTag>{restaurant.cuisine}</RestaurantTag>*/}
                  {/*  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>*/}
                  {/*    <RatingBadge>*/}
                  {/*      <LuStar size={14} style={{ marginRight: 4 }} />*/}
                  {/*      {restaurant.rating}*/}
                  {/*    </RatingBadge>*/}
                  {/*    <RestaurantTag sx={{ display: 'flex', alignItems: 'center' }}>*/}
                  {/*      <LuClock size={14} style={{ marginRight: 4 }} />*/}
                  {/*      {restaurant.deliveryTime} min*/}
                  {/*    </RestaurantTag>*/}
                  {/*  </Box>*/}
                  {/*</RestaurantTags>*/}
                </RestaurantInfo>
              </RestaurantCard>
            ))
          )}
        </RestaurantList>
      )}

      <ShopAndShippingFooter>
        {/* Affichage du magasin sélectionné */}
        {shop && (
            <Box sx={{ px: { xs: 0, sm: 2 }, pt: '3px', pb: 0, width: { xs: '100%', sm: '70%' }, margin: 'auto' }}>
              <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    px: 2,
                    pt: 0,
                    pb: '3px',
                    border: '2px solid',
                    borderColor: '#888',//'primary.main',
                    borderRadius: 2,
                    // backgroundColor: 'primary.light',
                  }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" sx={{ display: 'block', textAlign: 'center' }}>
                    {!isSingleShop ? 'Restaurant sélectionné' : 'Notre restaurant' }
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {shop.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {shop.address}
                  </Typography>
                </Box>
              </Box>
            </Box>
        )}
        {!shop && !shopsLoading ? (
          <Alert severity="info">
            Veuillez choisir un restaurant pour continuer.
          </Alert>
        ) : shop ? (
          <>
            {/* Mode de livraison */}
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
              Mode de livraison
            </Typography>
            {(shop.optionsAvailable || []).length === 0 ? (
              <Alert severity="warning">
                Ce restaurant n'est pas disponible à la commande. Veuillez choisir un autre restaurant.
              </Alert>
            ) : (
              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                {(shop.optionsAvailable || []).includes('delivery') && (
                  <DeliveryOptionButton
                    variant="contained"
                    selected={deliveryMethod === 'delivery'}
                    onClick={() => setDeliveryMethod('delivery')}
                    startIcon={<MdOutlineDeliveryDining size={21} />}
                  >
                    Livraison
                  </DeliveryOptionButton>
                )}
                {(shop.optionsAvailable || []).includes('pickup') && (
                  <DeliveryOptionButton
                    variant="contained"
                    selected={deliveryMethod === 'pickup'}
                    onClick={() => setDeliveryMethod('pickup')}
                    startIcon={<LuHandPlatter size={20} />}
                  >
                    Click & Collect
                  </DeliveryOptionButton>
                )}
                {(shop.optionsAvailable || []).includes('onsite') && (
                  <DeliveryOptionButton
                    variant="contained"
                    selected={deliveryMethod === 'onsite'}
                    onClick={() => setDeliveryMethod('onsite')}
                    startIcon={<IoRestaurantOutline size={20} />}
                  >
                    Sur place
                  </DeliveryOptionButton>
                )}
              </Box>
            )}
            {/* Sélection date/heure */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Date {deliveryMethod === 'delivery' ? 'de livraison' : deliveryMethod === 'onsite' ? 'de venue' : 'de retrait'}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                {showAsapButton && (
                  <DateToggleButton
                    selected={asap}
                    onClick={() => setAsap(true)}
                    startIcon={<LuZap size={16} />}
                  >
                    Dès que possible
                  </DateToggleButton>
                )}
                <DateToggleButton
                  selected={!asap && !!deliveryDate && isSameDay(deliveryDate, today)}
                  onClick={() => setDeliveryDate(today)}
                >
                  Aujourd'hui
                </DateToggleButton>
                <DateToggleButton
                  selected={!asap && !!deliveryDate && isSameDay(deliveryDate, tomorrow)}
                  onClick={() => setDeliveryDate(tomorrow)}
                >
                  Demain
                </DateToggleButton>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
                  <DatePicker
                    minDate={addDays(today, 2)}
                    maxDate={addDays(today, 30)}
                    value={customDateValue}
                    onChange={(date) => {
                      if (date && isAfter(startOfDay(date), startOfDay(today))) {
                        setDeliveryDate(date);
                      }
                    }}
                    slotProps={{
                      textField: {
                        size: 'small',
                        sx: {
                          flexGrow: 1,
                          minWidth: 120,
                          '& .MuiInputBase-root': { borderRadius: '8px', height: '40px' },
                        },
                      },
                    }}
                  />
                </LocalizationProvider>
              </Box>

              {!asap && deliveryDate && (
                <TimeSelect elevation={0}>
                  {timeSlots.length === 0 ? (
                    <Typography variant="body2" color="error">
                      Aucun créneau disponible pour cette date (restaurant fermé)
                    </Typography>
                  ) : (
                    <FormControl fullWidth error={!deliveryHour}>
                      <InputLabel id="time-select-label">
                        {deliveryMethod === 'delivery' ? 'Heure de livraison souhaitée' : deliveryMethod === 'onsite' ? 'Heure de venue souhaitée' : 'Heure de retrait souhaitée'}
                      </InputLabel>
                      <Select
                        labelId="time-select-label"
                        value={deliveryHour ? (nextDay ? `${deliveryHour}_1` : deliveryHour) : ''}
                        label={deliveryMethod === 'delivery' ? 'Heure de livraison souhaitée' : deliveryMethod === 'onsite' ? 'Heure de venue souhaitée' : 'Heure de retrait souhaitée'}
                        onChange={(e) => {
                          const raw = e.target.value;
                          if (raw.includes('_1')) {
                            setNextDay(true);
                            setDeliveryHour(raw.replace('_1', ''));
                          } else {
                            setNextDay(false);
                            setDeliveryHour(raw);
                          }
                        }}
                      >
                        {timeSlots.map((time) => (
                          <MenuItem key={time} value={time}>
                            {time.includes('_1') ? `${time.replace('_1', '')} (J+1)` : time}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                </TimeSelect>
              )}
            </Box>

            {/* Gestion d'adresse — uniquement en mode checkout avec livraison */}
            {showAddressManagement && (
              <>
                <Divider sx={{ my: 3 }} />
                <AddressManagement mode="select" />
                {!currentAddress && (
                  <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                    Veuillez sélectionner une adresse de livraison pour continuer
                  </Typography>
                )}
              </>
            )}
          </>
        ) : null}

      </ShopAndShippingFooter>

      {/* Footer fixe avec bouton Confirmer — uniquement en mode modal */}
      {mode === 'modal' && (
        <Box
          sx={{
            px: 3,
            py: 2,
            borderTop: (theme) => `1px solid ${theme.palette.divider}`,
            backgroundColor: 'background.paper',
            flexShrink: 0,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleConfirmModal}
            disabled={!isSelectionValid}
          >
            Confirmer
          </Button>
        </Box>
      )}
    </>
  );
};

export default ShopAndShipping;
