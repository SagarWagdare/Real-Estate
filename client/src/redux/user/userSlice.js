import { createSlice } from "@reduxjs/toolkit";

const initialState = {currentUser:null,
error:null,
loading:false}

const userSlice = createSlice({
   name:"user",
   initialState,
   reducers:{
    signInStart:(state)=>{
      state.loading = true
    },
    signInSuccess:(state,action)=>{
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null
    }
   }
})

export const {signInStart,signInSuccess} = userSlice.actions;
export default userSlice.reducer;