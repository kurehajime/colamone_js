import { atom } from "recoil";
import { Point } from "../model/Point";

export const HoverPointerState = atom<Point>({
    key: 'HoverPointerState',
    default: { x: 0, y: 0 }
});