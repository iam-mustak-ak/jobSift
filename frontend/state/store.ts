import React, { RefObject } from "react";
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

type PrintState = {
    printRef: RefObject<Element | Text | null>;
};

type PrintActions = {
    setPrintRef: (printRef: PrintState["printRef"]) => void;
};

export const usePrintRef = create<PrintState & PrintActions>((set) => ({
    printRef: React.createRef<HTMLDivElement>(),
    setPrintRef: (printRef) => {
        set(() => ({ printRef }));
    },
}));
