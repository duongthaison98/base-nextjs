import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "../store"

type ThemeMode = "light" | "dark" | "system"

interface ThemeState {
  mode: ThemeMode
  accentColor: string
}

const initialState: ThemeState = {
  mode: "system",
  accentColor: "blue",
}

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload
    },
    setAccentColor: (state, action: PayloadAction<string>) => {
      state.accentColor = action.payload
    },
  },
})

export const { setThemeMode, setAccentColor } = themeSlice.actions

// Selectors
export const selectThemeMode = (state: RootState) => state.theme.mode
export const selectAccentColor = (state: RootState) => state.theme.accentColor

export default themeSlice.reducer
