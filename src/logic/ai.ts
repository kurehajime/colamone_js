/* @license Copyright (c) @kurehajime / source code: https://github.com/kurehajime/colamone_js */
'use strict';
import { Rule, MapArray, Hand, HandNode } from "./rule";
import { Eval } from "./eval";

export class Aijs {


  /** 
   * よく考える
   */
  static deepThinkAllAB(map: MapArray, turn_player: number, depth: number, a: number | undefined, b: number | undefined, nearwin: boolean, evalparam: number[][]): [Hand | undefined, number] {
    let best_score: number = turn_player * 9999999 * -1;
    let besthand;
    if (depth === 0) {
      best_score = Eval.evalMap(map, nearwin, evalparam);
      return [besthand, best_score];
    }
    if (a === void 0 || b === void 0) {
      a = 9999999 * turn_player * -1;
      b = 9999999 * turn_player;
    }

    let nodeList: HandNode[] = Rule.getNodeMap(map, turn_player);
    for (let i: number = 0; i < nodeList.length; i++) {
      let hand: Hand = nodeList[i][0];
      let map0 = nodeList[i][1];
      let sc: number = 0;
      // 必勝            
      let end: number = Rule.isEndX(map0, nearwin);
      if (end === turn_player) {
        return [hand, 999999 * turn_player];
      }
      // 必敗
      if (end === turn_player * -1) {
        if (besthand === void 0) {
          best_score = 999999 * turn_player * -1;
          besthand = hand;
        }
        continue;
      }
      if (Rule.isNoneNode(map0)) {
        sc = 0;
      } else {
        sc = Aijs.deepThinkAllAB(map0, turn_player * -1, depth - 1, b, a, nearwin, evalparam)[1];
      }
      if (besthand === void 0) {
        best_score = sc;
        besthand = hand;
      }
      if (turn_player === 1 && sc > best_score) {
        best_score = sc;
        besthand = hand;
      } else if (turn_player === -1 && sc < best_score) {
        best_score = sc;
        besthand = hand;
      }
      if (turn_player === 1 && a < best_score || turn_player === -1 && a > best_score) {
        a = best_score;
      }
      if (turn_player === 1 && b <= best_score || turn_player === -1 && b >= best_score) {
        break;
      }
    }
    return [besthand, best_score];
  }
  /** 
   * 考える
   */
  public static thinkAI(map: MapArray, turn_player: number, depth: number, a: number | undefined, b: number | undefined, evalparam: number[][] | undefined): [Hand | undefined, number] {
    let nearwin: boolean = false;
    let hand: [Hand | undefined, number] = [undefined, 0];
    let wkMap = new Int8Array(map);
    if (!evalparam) {
      evalparam = Eval.DEFAULT_EVALPARAM;
    }
    if (Rule.isEndX(wkMap, false) !== 0) {
      nearwin = true;
    }

    hand = Aijs.deepThinkAllAB(wkMap, turn_player, depth, a, b, nearwin, evalparam);
    if (hand[1]! * turn_player === -999999) {
      hand = Aijs.deepThinkAllAB(wkMap, turn_player, 1, a, b, nearwin, evalparam);
    }
    return hand;
  }
}
