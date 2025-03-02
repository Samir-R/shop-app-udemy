import React, { useState, useEffect } from 'react';
import {
    Typography,
    Box,
    IconButton,
    Divider
} from '@mui/material';
// import {
//     Search,
//     X,
//     Clock,
//     Star,
//     Store
// } from 'lucide-react';
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
    EmptyResults
} from './shop-modal.styles';
import {LuClock, LuSearch, LuStar, LuStore} from "react-icons/lu";

/**
 * @typedef {import('../types/RestaurantTypes').Restaurant} Restaurant
 */

// Données de démonstration
const restaurantsData = [
    {
        id: '1',
        name: 'Burger Palace',
        address: '123 Avenue des Champs-Élysées, Paris',
        image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        cuisine: 'Burgers',
        rating: 4.5,
        deliveryTime: 25,
        isOpen: true
    },
    {
        id: '2',
        name: 'Pizza Express',
        address: '45 Rue de Rivoli, Paris',
        image: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        cuisine: 'Italienne',
        rating: 4.2,
        deliveryTime: 35,
        isOpen: true
    },
    {
        id: '3',
        name: 'Sushi Master',
        address: '78 Boulevard Saint-Germain, Paris',
        image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        cuisine: 'Japonaise',
        rating: 4.7,
        deliveryTime: 40,
        isOpen: true
    },
    {
        id: '4',
        name: 'Le Bistrot Français',
        address: '22 Rue du Faubourg Saint-Honoré, Paris',
        image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        cuisine: 'Française',
        rating: 4.8,
        deliveryTime: 45,
        isOpen: false
    },
    {
        id: '5',
        name: 'Taco Fiesta',
        address: '156 Rue de Vaugirard, Paris',
        image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        cuisine: 'Mexicaine',
        rating: 4.0,
        deliveryTime: 30,
        isOpen: true
    },
    {
        id: '6',
        name: 'Noodle House',
        address: '89 Avenue Parmentier, Paris',
        image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        cuisine: 'Asiatique',
        rating: 4.3,
        deliveryTime: 25,
        isOpen: true
    }
];

/**
 * @param {Object} props
 * @param {boolean} props.open
 * @param {() => void} props.onClose
 * @param {(restaurant: Restaurant) => void} props.onSelectRestaurant
 */
const ShopModal = ({ open, onClose, onSelectRestaurant }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [restaurants, setRestaurants] = useState(restaurantsData);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setRestaurants(restaurantsData);
        } else {
            const filtered = restaurantsData.filter(
                restaurant =>
                    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    restaurant.address.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setRestaurants(filtered);
        }
    }, [searchTerm]);

    const handleSelectRestaurant = (restaurant) => {
        onSelectRestaurant(restaurant);
        onClose();
    };

    return (
        <ModalContainer
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
        >
            <ModalHeader>
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
            </ModalHeader>

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
        </ModalContainer>
    );
};

export default ShopModal;