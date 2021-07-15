/* @license Copyright (c) @kurehajime / source code: https://github.com/kurehajime/colamone_js */
'use strict';
import { Rule, MapArray, Hand, HandNode } from "./rule";

export class Aijs {
  /** 
   * 初期評価関数 
   * @const 
   * @type {Object.<number, Array.<number>>} 
   */
  static readonly DEFAULT_EVALPARAM =
    [
      [],
      [1800, 1850, 1900, 1950, 2100, 2800],//1
      [1800, 1860, 1920, 2100, 2400, 3800],//2
      [1450, 1520, 1590, 1900, 2350, 4450],//3
      [1450, 1530, 1610, 2050, 2650, 5450],//4
      [1350, 1440, 1530, 2100, 2850, 6350],//5
      [1350, 1450, 1550, 2250, 3150, 7350],//6
      [1250, 1360, 1470, 2300, 3350, 8250],//7
      [1250, 1370, 1490, 2450, 4350, 11250]//8
    ];

  /** 
   * 盤面を評価して-10000〜+10000で採点数する。
   * @param  {Object.<number, number>}  wkMap
   * @param  {boolean}  nearwin
   * @param  {Object.<number, Array.<number>>}  evalparam
   * @return {number} 
   */
  static evalMap(wkMap: MapArray, nearwin: boolean, evalparam: number[][]): number {
    let ev: number = 0;

    // 引き分け判定
    if (Rule.isDraw(wkMap)) {
      return 0;
    }
    // 終局判定
    let end: number = Rule.isEndX(wkMap, nearwin);
    if (end === 1) {
      return +9999999;
    } else if (end === -1) {
      return -9999999;
    }
    // 評価
    for (let i: number = 0; i <= 35; i++) {
      let panel_num: number = Rule.NUMBERS[i] | 0;
      let cell_p: number = 0;
      let p: number = wkMap[panel_num];
      let line: number;
      // コマの評価値を加算
      if (p > 0) {
        line = 5 - (panel_num % 10);
        cell_p += evalparam[p][line]; // ポジションボーナス
      } else if (p < 0) {
        line = (panel_num % 10);
        cell_p += evalparam[-1 * p][line] * -1;
      }
      // 評価値に加算。
      ev += cell_p;
    }
    return (ev | 0);
  }

  /** 
   * よく考える
   */
  static deepThinkAllAB(map: MapArray, turn_player: number, depth: number, a: number | undefined, b: number | undefined, nearwin: boolean, evalparam: number[][]): [Hand | undefined, number] {
    let best_score: number = turn_player * 9999999 * -1;
    let besthand;
    if (depth === 0) {
      best_score = Aijs.evalMap(map, nearwin, evalparam);
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
      evalparam = Aijs.DEFAULT_EVALPARAM;
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
