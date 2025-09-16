import { create } from 'zustand'

const fplBootstrapData = create((set) => ({
  fpldata: null,

  updateBears: (newBears) => set({ bears: newBears }),
}))
