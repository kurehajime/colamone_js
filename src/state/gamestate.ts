import { MapArray, Hand } from "../logic/rule";
export class GameState {
  public goaled = false;
  public turn_player: number = 0;
  public blueScore = 0;
  public redScore = 0;
  public winner: (number | null) = null;
  public thisHand: (Hand | undefined) = undefined;
  /*  let thisMap = {
      0: -1, 10: -2, 20: -3, 30: -4, 40: -5, 50: -6,
      1: 0, 11: -8, 21: 0, 31: 0, 41: -7, 51: 0,
      2: 0, 12: 0, 22: 0, 32: 0, 42: 0, 52: 0,
      3: 0, 13: 0, 23: 0, 33: 0, 43: 0, 53: 0,
      4: 0, 14: 7, 24: 0, 34: 0, 44: 8, 54: 0,
      5: 6, 15: 5, 25: 4, 35: 3, 45: 2, 55: 1
    };*/
  public thisMap: MapArray = new Int8Array([
    -1, 0, 0, 0, 0, 6, 0, 0, 0, 0, -2, -8,
    0, 0, 7, 5, 0, 0, 0, 0, -3, 0, 0, 0,
    0, 4, 0, 0, 0, 0, -4, 0, 0, 0, 0,
    3, 0, 0, 0, 0, -5, -7, 0, 0, 8, 2,
    0, 0, 0, 0, -6, 0, 0, 0, 0, 1
  ]);
  public hover_piece: (number | null) = null;
  public map_list: { [index: string]: number; } = {};
}