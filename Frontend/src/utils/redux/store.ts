import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from './slices/userSlice'
import hostReducer from './slices/hostSlice'
import adminReducer from './slices/adminSlice'
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'


const rootReducer=combineReducers({
    user:userReducer,
    host:hostReducer,
    admin:adminReducer
})
const persistConfig = {
    key: 'root',
    storage, //by default localstorage
  };
  
  const persistedReducer = persistReducer(persistConfig, rootReducer);
const store=configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['persist/PERSIST'],
        },
      }),
})
export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;