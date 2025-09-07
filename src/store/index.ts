import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import boxReducer from './slices/boxSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    box: boxReducer,
  },
});

// Types để dùng với useSelector & useDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
