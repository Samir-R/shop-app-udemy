import React, { useContext } from 'react'
import { CartContext } from '../../contexts/cart.context'

const Checkout = () => {
    const { cartItems, removeItemToCart, addItemToCart, subItemToCart, cartTotal } = useContext(CartContext)
  return (
    <div>
        <table>
            <tr>
                <th>Product</th>
                <th>Description</th>
                <th>Quatity</th>
                <th>Price</th>
                <th>Remove</th>
            </tr>
            {
                cartItems.map((cartItem) => (
                    <tr key={cartItem.id}>
                        <th><img src={cartItem.imageUrl} alt={cartItem.name}/></th>
                        <th>{cartItem.name}</th>
                        <th>
                            <button onClick={() => subItemToCart(cartItem)}>-</button>
                            {cartItem.quantity}
                            <button onClick={() => addItemToCart(cartItem)}>+</button>
                        </th>
                        <th>{cartItem.price}</th>
                        <th><span onClick={() => removeItemToCart(cartItem)}>&#10005;</span></th>
                    </tr>
                ))
            }
        </table>
        total : {cartTotal}
    </div>
  )
}

export default Checkout