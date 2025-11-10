export const user = {
    id: '1',
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@email.com',
    phone: '06 12 34 56 78',
    addresses: [
        {
            id: '1',
            label: 'Domicile',
            street: '123 Rue de la Paix',
            city: 'Paris',
            postalCode: '75001',
            country: 'France',
            isDefault: true
        }
    ],
    loyaltyPoints: 850
};

export const orders = [
    {
        id: 'CMD001',
        date: '2024-01-15',
        status: 'completed',
        total: 24.50,
        deliveryAddress: '123 Rue de la Paix, Paris',
        items: [
            {
                id: '1',
                name: 'Big Burger Menu',
                quantity: 1,
                price: 12.90,
                image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=200'
            },
            {
                id: '2',
                name: 'Frites Large',
                quantity: 2,
                price: 4.50,
                image: 'https://images.pexels.com/photos/1893556/pexels-photo-1893556.jpeg?auto=compress&cs=tinysrgb&w=200'
            },
            {
                id: '3',
                name: 'Coca Cola',
                quantity: 1,
                price: 2.60,
                image: 'https://images.pexels.com/photos/50593/coca-cola-cold-drink-soft-drink-coke-50593.jpeg?auto=compress&cs=tinysrgb&w=200'
            }
        ]
    },
    {
        id: 'CMD002',
        date: '2024-01-12',
        status: 'completed',
        total: 18.90,
        deliveryAddress: '123 Rue de la Paix, Paris',
        items: [
            {
                id: '4',
                name: 'Chicken Wrap',
                quantity: 1,
                price: 8.90,
                image: 'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&w=200'
            },
            {
                id: '5',
                name: 'Salade César',
                quantity: 1,
                price: 7.50,
                image: 'https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg?auto=compress&cs=tinysrgb&w=200'
            },
            {
                id: '6',
                name: 'Jus d\'Orange',
                quantity: 1,
                price: 2.50,
                image: 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=200'
            }
        ]
    }
];

export const promoCodes = [
    {
        id: '1',
        code: 'WELCOME20',
        description: '20% de réduction sur votre première commande',
        discount: '20%',
        validUntil: '2024-02-28',
        isUsed: false
    },
    {
        id: '2',
        code: 'BURGER15',
        description: '15% de réduction sur tous les burgers',
        discount: '15%',
        validUntil: '2024-02-15',
        isUsed: false
    },
    {
        id: '3',
        code: 'LIVRAISON0',
        description: 'Livraison gratuite dès 25€',
        discount: 'Gratuite',
        validUntil: '2024-02-29',
        isUsed: true
    }
];
