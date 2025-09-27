import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/lib/store';
import { colorPalleteInterface } from '@/lib/GenerateColorPllete';

const initialState: colorPalleteInterface = {
    primaryColor: { h: 0, s: 0, l: 100 },
    secondaryColor: { h: 0, s: 0, l: 100 },
    complementaryColor: { h: 180, s: 0, l: 100 },
    textColor: { h: 0, s: 0, l: 100 },
    textSecondaryColor: { h: 0, s: 0, l: 100 },
};

export const paletteSlice = createSlice({
    name: 'colorPalette',
    initialState,
    reducers: {
        setPalette: (state, action: PayloadAction<colorPalleteInterface>) => {
            return action.payload;
        },
    },
});

export const { setPalette } = paletteSlice.actions;

export const selectPalette = (state: RootState) => state.colorPalette;

export default paletteSlice.reducer;
