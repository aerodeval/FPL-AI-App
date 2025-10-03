import { create } from "zustand";

type TeamState = {
  teamId: string | null;
  setTeamId: (id: string | null) => void;
  clear: () => void;
};

export const useTeamStore = create<TeamState>((set) => ({
  teamId: null,
  setTeamId: (id) => set({ teamId: id }),
  clear: () => set({ teamId: null }),
}));


