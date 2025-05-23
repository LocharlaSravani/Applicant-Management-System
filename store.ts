import { configureStore } from "@reduxjs/toolkit"
import applicantReducer from "./applicantSlice"

export const store = configureStore({
  reducer: {
    applicants: applicantReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
