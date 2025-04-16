import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface Applicant {
  id: string
  firstName: string
  dob: string
  graduate: boolean
  email: string
  course: string
}

interface ApplicantState {
  applicants: Applicant[]
}

const initialState: ApplicantState = {
  applicants: [],
}

export const applicantSlice = createSlice({
  name: "applicants",
  initialState,
  reducers: {
    addApplicant: (state, action: PayloadAction<Applicant>) => {
      state.applicants.push(action.payload)
    },
    setApplicants: (state, action: PayloadAction<Applicant[]>) => {
      state.applicants = action.payload
    },
    removeApplicant: (state, action: PayloadAction<string>) => {
      state.applicants = state.applicants.filter((applicant) => applicant.id !== action.payload)
    },
  },
})

export const { addApplicant, setApplicants, removeApplicant } = applicantSlice.actions

export default applicantSlice.reducer
