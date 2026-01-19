import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './slices/cartSlice'

// 1. Wrap it in a function so each request gets its own store
export const makeStore = () => {
  return configureStore({
    reducer: {
      cart: cartReducer,
    },
  })
}

// 2. Export these types so your hooks know what's up
export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
