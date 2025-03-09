import React, {useState, useEffect, useContext} from 'react';
import {
    Typography,
    Box,
    IconButton,
    Divider,
    Select,
    MenuItem,
    FormControl,
    InputLabel, Button,
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, addDays, isSameDay, isAfter, startOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';
// import {
//     Search,
//     X,
//     Clock,
//     Star,
//     Store,
//     Truck,
//     ShoppingBag
// } from 'lucide-react';
import {LuClock, LuSearch, LuShoppingBag, LuStar, LuStore, LuTruck} from "react-icons/lu";
import {
    ModalContainer,
    ModalHeader,
    SearchContainer,
    SearchInput,
    RestaurantList,
    RestaurantCard,
    RestaurantImage,
    RestaurantInfo,
    RestaurantTags,
    RestaurantTag,
    StatusBadge,
    RatingBadge,
    EmptyResults,
    ModalFooter,
    DeliveryOptionButton,
    TimeSelect, DateToggleButton, ShopAndShippingHeader, ShopAndShippingFooter
} from './shop-shipping.styles';
import {CategoriesContext} from "../../contexts/category.context";
import {ShopShippingContext} from "../../contexts/shop-shipping.context";

// Données de démonstration
const restaurantsData = [];

const generateTimeSlots = () => {
    const slots = [];
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // Arrondir à la prochaine tranche de 15 minutes
    const startMinute = Math.ceil(currentMinute / 15) * 15;
    let hour = currentHour;
    let minute = startMinute;

    // Générer les créneaux pour les prochaines 24 heures
    for (let i = 0; i < 96; i++) { // 24 heures * 4 (15 minutes intervals)
        if (minute >= 60) {
            hour += 1;
            minute = 0;
        }
        if (hour >= 24) {
            hour = 0;
        }

        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
        minute += 15;
    }

    return slots;
};

const ShopAndShipping = ({ open, onClose, onSelectRestaurant }) => {

    const [searchTerm, setSearchTerm] = useState('');
    const { shopsList } = useContext(ShopShippingContext);
    const [restaurants, setRestaurants] = useState(shopsList);
    const [deliveryType, setDeliveryType] = useState('delivery');
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [customDate, setCustomDate] = useState(null);
    const timeSlots = generateTimeSlots(selectedDate);

    useEffect(() => {
        setRestaurants(shopsList); // Reset selected time when date changes
    }, [shopsList]);

    useEffect(() => {
        setSelectedTime(''); // Reset selected time when date changes
    }, [selectedDate]);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setRestaurants(shopsList);
        } else {
            const filtered = shopsList.filter(
                restaurant =>
                    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    restaurant.address.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setRestaurants(filtered);
        }
    }, [searchTerm]);

    const handleSelectRestaurant = (restaurant) => {
        setSelectedRestaurant(restaurant);
    };

    const handleDateChange = (newDate) => {
        if (newDate === 'custom') {
            return; // Le DatePicker gère sa propre sélection
        }
        setCustomDate(null);
        setSelectedDate(newDate);
    };

    const handleCustomDateChange = (newDate) => {
        if (newDate && isAfter(startOfDay(newDate), startOfDay(new Date()))) {
            setCustomDate(newDate);
            setSelectedDate(newDate);
        }
    };

    const handleConfirm = () => {
        if (selectedRestaurant && selectedTime) {
            onSelectRestaurant({
                ...selectedRestaurant,
                deliveryType,
                selectedTime,
                selectedDate: format(selectedDate, 'dd/MM/yyyy')
            });
            onClose();
        }
    };

    const today = new Date();
    const tomorrow = addDays(today, 1);
    return (
        <>
            <ShopAndShippingHeader>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Choisir un restaurant
                    </Typography>
                    <IconButton onClick={onClose} color="inherit" edge="end">
                        {/*<X size={24} />*/}
                        X
                    </IconButton>
                </Box>

                <SearchContainer>
                    <LuSearch size={20} color="white" style={{ marginRight: 8 }} />
                    <SearchInput
                        placeholder="Rechercher un restaurant, une cuisine..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        fullWidth
                    />
                    {searchTerm && (
                        <IconButton size="small" onClick={() => setSearchTerm('')} sx={{ color: 'white' }}>
                            {/*<X size={16} />*/}
                            X
                        </IconButton>
                    )}
                </SearchContainer>
            </ShopAndShippingHeader>

            <RestaurantList>
                {restaurants.length === 0 ? (
                    <EmptyResults>
                        <LuStore size={64} color="#ccc" />
                        <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
                            Aucun restaurant trouvé
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                            Essayez avec d'autres termes de recherche
                        </Typography>
                    </EmptyResults>
                ) : (
                    restaurants.map((restaurant) => (
                        <RestaurantCard
                            key={restaurant.id}
                            onClick={() => handleSelectRestaurant(restaurant)}
                            sx={{
                                borderColor: selectedRestaurant?.id === restaurant.id ? 'primary.main' : 'divider',
                                backgroundColor: selectedRestaurant?.id === restaurant.id ? 'primary.light' : 'transparent',
                            }}
                        >
                            <RestaurantImage src={restaurant.image} alt={restaurant.name} />
                            <RestaurantInfo>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                        {restaurant.name}
                                    </Typography>
                                    <StatusBadge isOpen={restaurant.isOpen}>
                                        {restaurant.isOpen ? 'Ouvert' : 'Fermé'}
                                    </StatusBadge>
                                </Box>

                                <Typography variant="body2" color="textSecondary" noWrap>
                                    {restaurant.address}
                                </Typography>

                                <RestaurantTags>
                                    <RestaurantTag>{restaurant.cuisine}</RestaurantTag>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <RatingBadge>
                                            <LuStar size={14} style={{ marginRight: 4 }} />
                                            {restaurant.rating}
                                        </RatingBadge>
                                        <RestaurantTag sx={{ display: 'flex', alignItems: 'center' }}>
                                            <LuClock size={14} style={{ marginRight: 4 }} />
                                            {restaurant.deliveryTime} min
                                        </RestaurantTag>
                                    </Box>
                                </RestaurantTags>
                            </RestaurantInfo>
                        </RestaurantCard>
                    ))
                )}
            </RestaurantList>

            <ShopAndShippingFooter>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                    Mode de livraison
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <DeliveryOptionButton
                        variant="outlined"
                        selected={deliveryType === 'delivery'}
                        onClick={() => setDeliveryType('delivery')}
                        startIcon={<LuTruck size={20} />}
                    >
                        Livraison
                    </DeliveryOptionButton>
                    <DeliveryOptionButton
                        variant="outlined"
                        selected={deliveryType === 'pickup'}
                        onClick={() => setDeliveryType('pickup')}
                        startIcon={<LuShoppingBag size={20} />}
                    >
                        Click & Collect
                    </DeliveryOptionButton>
                </Box>
                <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        Date {deliveryType === 'delivery' ? 'de livraison' : 'de retrait'}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <DateToggleButton
                            selected={isSameDay(selectedDate, today)}
                            onClick={() => handleDateChange(today)}
                        >
                            Aujourd'hui
                        </DateToggleButton>
                        <DateToggleButton
                            selected={isSameDay(selectedDate, tomorrow)}
                            onClick={() => handleDateChange(tomorrow)}
                        >
                            Demain
                        </DateToggleButton>
                        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
                            <DatePicker
                                minDate={addDays(today, 2)}
                                maxDate={addDays(today, 30)}
                                value={customDate}
                                onChange={handleCustomDateChange}
                                slotProps={{
                                    textField: {
                                        size: "small",
                                        sx: {
                                            flexGrow: 1,
                                            '& .MuiInputBase-root': {
                                                borderRadius: '8px',
                                                height: '40px'
                                            }
                                        }
                                    }
                                }}
                            />
                        </LocalizationProvider>
                    </Box>
                </Box>
                <TimeSelect elevation={0}>
                    <FormControl fullWidth>
                        <InputLabel id="time-select-label">
                            {deliveryType === 'delivery' ? "Heure de livraison souhaitée" : "Heure de retrait souhaitée"}
                        </InputLabel>
                        <Select
                            labelId="time-select-label"
                            value={selectedTime}
                            label={deliveryType === 'delivery' ? "Heure de livraison souhaitée" : "Heure de retrait souhaitée"}
                            onChange={(e) => setSelectedTime(e.target.value)}
                        >
                            {timeSlots.map((time) => (
                                <MenuItem key={time} value={time}>
                                    {time}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </TimeSelect>

                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 3 }}
                    onClick={handleConfirm}
                    disabled={!selectedRestaurant || !selectedTime}
                >
                    Confirmer
                </Button>
            </ShopAndShippingFooter>
        </>
    );
};

export default ShopAndShipping;