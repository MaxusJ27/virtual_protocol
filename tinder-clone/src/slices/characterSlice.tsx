import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export const characterSlice = createSlice({
    name: 'character',
    initialState: {
        selectedCharacter: "",
    },
    reducers: {
        setSelectedCharacter: (state, action: PayloadAction<string>) => {
            state.selectedCharacter = action.payload;
        }
    }
});

export const { setSelectedCharacter } = characterSlice.actions;

export default characterSlice.reducer;