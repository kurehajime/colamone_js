import { atom } from "recoil";

export const HoverNumberState = atom<number | null>({
    key: 'HoverNumberState',
    default: null
});