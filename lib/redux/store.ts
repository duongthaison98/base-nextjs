import { configureStore, combineReducers } from "@reduxjs/toolkit"
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist"
import storage from "redux-persist/lib/storage"

import counterReducer from "./slices/counterSlice"
import themeReducer from "./slices/themeSlice"
import notificationsReducer from "./slices/notificationsSlice"

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["theme", "notifications"], // Only persist these reducers
}

const rootReducer = combineReducers({
  counter: counterReducer,
  theme: themeReducer,
  notifications: notificationsReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
