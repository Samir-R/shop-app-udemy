export const categories = [
  { id: 'all', name: 'Tous les produits' },
  { id: 'burgers', name: 'Burgers' },
  { id: 'poulet', name: 'Poulet' },
  { id: 'pizzas', name: 'Pizzas' },
  { id: 'tacos', name: 'Tacos' },
  { id: 'salades', name: 'Salades' },
  { id: 'sides', name: 'Accompagnements' }
];

export const mockProducts = [
  {
    id: 1,
    name: "Burger Classic",
    category: 'burgers',
    image: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=600",
    price: 8.99,
    originalPrice: null,
    hasMenu: true,
    isSpicy: false,
    isHalal: true,
    isKosher: false,
    allergens: ["Gluten", "Lactose", "Sésame"]
  },
  {
    id: 2,
    name: "Chicken Wings Épicés",
    category: 'poulet',
    image: "https://images.pexels.com/photos/60616/fried-chicken-chicken-fried-crunchy-60616.jpeg?auto=compress&cs=tinysrgb&w=600",
    price: 7.99,
    originalPrice: 9.99,
    hasMenu: true,
    isSpicy: true,
    isHalal: true,
    isKosher: false,
    allergens: ["Gluten", "Céleri"]
  },
  {
    id: 3,
    name: "Pizza Margherita",
    category: 'pizzas',
    image: "https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg?auto=compress&cs=tinysrgb&w=600",
    price: 11.50,
    originalPrice: null,
    hasMenu: true,
    isSpicy: false,
    isHalal: false,
    isKosher: true,
    allergens: ["Gluten", "Lactose"]
  },
  {
    id: 4,
    name: "Tacos Poulet",
    category: 'tacos',
    image: "https://images.pexels.com/photos/4958792/pexels-photo-4958792.jpeg?auto=compress&cs=tinysrgb&w=600",
    price: 6.50,
    originalPrice: 7.99,
    hasMenu: false,
    isSpicy: true,
    isHalal: true,
    isKosher: false,
    allergens: ["Gluten", "Lactose"]
  },
  {
    id: 5,
    name: "Salade César Premium",
    category: 'salades',
    image: "https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=600",
    price: 9.99,
    originalPrice: null,
    hasMenu: false,
    isSpicy: false,
    isHalal: false,
    isKosher: false,
    allergens: ["Lactose", "Poisson", "Œufs"]
  },
  {
    id: 6,
    name: "Wrap Végétarien",
    category: 'salades',
    image: "https://images.pexels.com/photos/1059943/pexels-photo-1059943.jpeg?auto=compress&cs=tinysrgb&w=600",
    price: 5.99,
    originalPrice: null,
    hasMenu: true,
    isSpicy: false,
    isHalal: true,
    isKosher: true,
    allergens: ["Gluten", "Soja"]
  },
  {
    id: 7,
    name: "Nuggets de Poulet Croustillants",
    category: 'poulet',
    image: "https://images.pexels.com/photos/11401287/pexels-photo-11401287.jpeg?auto=compress&cs=tinysrgb&w=600",
    price: 6.99,
    originalPrice: 8.50,
    hasMenu: true,
    isSpicy: false,
    isHalal: true,
    isKosher: false,
    allergens: ["Gluten", "Œufs"]
  },
  {
    id: 8,
    name: "Frites Maison XXL",
    category: 'sides',
    image: "https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?auto=compress&cs=tinysrgb&w=600",
    price: 3.99,
    originalPrice: null,
    hasMenu: false,
    isSpicy: false,
    isHalal: true,
    isKosher: true,
    allergens: []
  }
];
