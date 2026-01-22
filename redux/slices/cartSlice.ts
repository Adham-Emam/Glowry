import { CartItems, CartState } from '@/types/cart'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState: CartState = { items: [] }

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItems>) {
      const existing = state.items.find(
        (item) => item.productId === action.payload.productId,
      )
      if (existing) existing.quantity += action.payload.quantity
      else state.items.push(action.payload)
    },
    updateQuantity(
      state,
      action: PayloadAction<{ productId: number; quantity: number }>,
    ) {
      const item = state.items.find(
        (i) => i.productId === action.payload.productId,
      )
      if (item && action.payload.quantity > 0) {
        item.quantity = action.payload.quantity
      }
    },
    changeQuantity(
      state,
      action: PayloadAction<{ productId: number; delta: number }>,
    ) {
      const item = state.items.find(
        (i) => i.productId === action.payload.productId,
      )
      if (item) {
        const newQty = item.quantity + action.payload.delta
        item.quantity = newQty > 0 ? newQty : 1 // Prevents quantity < 1
      }
    },
    removeFromCart(state, action: PayloadAction<number>) {
      state.items = state.items.filter(
        (item) => item.productId !== action.payload,
      )
    },
    clearCart(state) {
      state.items = []
    },
  },
})

export const {
  addToCart,
  updateQuantity,
  changeQuantity,
  removeFromCart,
  clearCart,
} = cartSlice.actions

// SELECTORS
export const selectCartTotalItems = (state: { cart: CartState }) => 
  state.cart.items.reduce((total, item) => total + item.quantity, 0)

export const selectCartUniqueItems = (state: { cart: CartState }) => 
  state.cart.items.length

export default cartSlice.reducer