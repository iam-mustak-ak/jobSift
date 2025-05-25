import { create } from "zustand";

type State = {
    user: Record<string, any> | undefined;
};

type Actions = {
    setAuth: (user: State["user"]) => void;
};

export const useAuthStore = create<State & Actions>((set) => ({
    user: undefined,
    setAuth: (user) => {
        set(() => ({ user }));
    },
}));
