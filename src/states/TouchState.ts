import { atom } from "recoil";

export const TouchState = atom<boolean>({
    key: 'TouchState',
    default: false
});