import { createContext, useState } from "react";

export const CartContext = createContext({
    showCart: false,
    toggleCart: () => null,
});

export const CartProvider = ({ children }) => {
    const [showCart, toggleCart] = useState(false);
    const value = { showCart, toggleCart };
    
    return <CartContext.Provider value={value}>
        {children}
    </CartContext.Provider>;
}