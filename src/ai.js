/* @license Copyright (c) @kurehajime / source code: https://github.com/kurehajime/colamone_js */
'use strict';
// Class ------------------------------------------------
export function Aijs() {}
// Header -----------------------------------------------
Aijs.copyMap = copyMap;
Aijs.thinkAI = thinkAI;
Aijs.getCanMovePanelX = getCanMovePanelX;
Aijs.isEndX = isEndX;
Aijs.isDraw = isDraw;

// Body ---------------------------------------

/** 
 * 駒の進める方向 
 * @const 
 * @type {Array.<Array.<number>>} 
 * index+8:コマの数字
 */
const PIECES = [
  [0, 0, 0,
    0, 0, 0,
    0, 1, 0],
  [0, 1, 0,
    0, 0, 0,
    0, 1, 0],
  [0, 1, 0,
    0, 0, 0,
    1, 0, 1],
  [1, 0, 1,
    0, 0, 0,
    1, 0, 1],
  [1, 0, 1,
    0, 0, 0,
    1, 1, 1],
  [1, 1, 1,
    0, 0, 0,
    1, 1, 1],
  [1, 0, 1,
    1, 0, 1,
    1, 1, 1],
  [1, 1, 1,
    1, 0, 1,
    1, 1, 1],
  [0, 0, 0,
    0, 0, 0,
    0, 0, 0],
  [1, 1, 1,
    1, 0, 1,
    1, 1, 1],
  [1, 1, 1,
    1, 0, 1,
    1, 0, 1],
  [1, 1, 1,
    0, 0, 0,
    1, 1, 1],
  [1, 1, 1,
    0, 0, 0,
    1, 0, 1],
  [1, 0, 1,
    0, 0, 0,
    1, 0, 1],
  [1, 0, 1,
    0, 0, 0,
    0, 1, 0],
  [0, 1, 0,
    0, 0, 0,
    0, 1, 0],
  [0, 1, 0,
    0, 0, 0,
    0, 0, 0]
];

/** 
 * 盤の番号 
 * @const 
 * @type {Array.<number>} 
 */
const NUMBERS = [0, 1, 2, 3, 4, 5,
  10, 11, 12, 13, 14, 15,
  20, 21, 22, 23, 24, 25,
  30, 31, 32, 33, 34, 35,
  40, 41, 42, 43, 44, 45,
  50, 51, 52, 53, 54, 55];
/** 
 * 初期評価関数 
 * @const 
 * @type {Object.<number, Array.<number>>} 
 */
const DEFAULT_EVALPARAM = {
  1: [1800, 1850, 1900, 1950, 2100, 2800],
  2: [1800, 1860, 1920, 2100, 2400, 3800],
  3: [1450, 1520, 1590, 1900, 2350, 4450],
  4: [1450, 1530, 1610, 2050, 2650, 5450],
  5: [1350, 1440, 1530, 2100, 2850, 6350],
  6: [1350, 1450, 1550, 2250, 3150, 7350],
  7: [1250, 1360, 1470, 2300, 3350, 8250],
  8: [1250, 1370, 1490, 2450, 4350, 11250]
};

/** 
 * Mapをコピーして返す。 
 * @param  {Object.<number, number>}  wkMap
 * @return {Object.<number, number>} 
 */
function copyMap(wkMap) {   
  return new Int8Array(wkMap);
}

/** 
 * 終了判定(実質的勝利含む) 
 * @param  {Object.<number, number>}  wkMap
 * @param  {boolean}  nearwin
 * @return {number} 0:引き分け,1:先手勝利,-1:後手勝利
 */
function isEndX(wkMap, nearwin) {
  let sum1 = 0;
  let sum2 = 0;
  // ループだと遅いので展開
  if (wkMap[0] > 0) { sum1 += wkMap[0]; }
  if (wkMap[10] > 0) { sum1 += wkMap[10]; }
  if (wkMap[20] > 0) { sum1 += wkMap[20]; }
  if (wkMap[30] > 0) { sum1 += wkMap[30]; }
  if (wkMap[40] > 0) { sum1 += wkMap[40]; }
  if (wkMap[50] > 0) { sum1 += wkMap[50]; }
  if (wkMap[5] * -1 > 0) { sum2 += wkMap[5]; }
  if (wkMap[15] * -1 > 0) { sum2 += wkMap[15]; }
  if (wkMap[25] * -1 > 0) { sum2 += wkMap[25]; }
  if (wkMap[35] * -1 > 0) { sum2 += wkMap[35]; }
  if (wkMap[45] * -1 > 0) { sum2 += wkMap[45]; }
  if (wkMap[55] * -1 > 0) { sum2 += wkMap[55]; }

  if (sum1 >= 8) {
    return 1;
  } else if (sum2 <= -8) {
    return -1;
  }

  // 手詰まりは判定
  if (isNoneNode(wkMap)) {
    if (sum1 > (-1 * sum2)) {
      return 1;
    } else if (sum1 < (-1 * sum2)) {
      return -1;
    } else {
      return 0;
    }
  }
  // 実質的判定勝利
  if (nearwin === false && (sum1 !== 0 || sum2 !== 0)) {
    let live1 = 0;
    let live2 = 0;
    for (let i = 0; i <= 35; i++) {
      let num = NUMBERS[i] | 0;
      if (wkMap[num] > 0) {
        live1 += wkMap[num];
      } else if (wkMap[num] < 0) {
        live2 += wkMap[num];
      }
    }
    if (sum1 > (-1 * (live2 + sum2))) {
      return 1;
    } else if (-1 * sum2 > (live1 + sum1)) {
      return -1;
    }
  }
  return 0;
}

/** 
 * 引き分け判定。最後の一個を取るかどうかの判断
 * @param  {Object.<number, number>}  wkMap
 * @return {boolean} 
 */
function isDraw(wkMap) {
  let sum1 = 0;
  let sum2 = 0;
  // ループだと遅いので展開
  if (wkMap[0] > 0) { sum1 += wkMap[0]; }
  if (wkMap[10] > 0) { sum1 += wkMap[10]; }
  if (wkMap[20] > 0) { sum1 += wkMap[20]; }
  if (wkMap[30] > 0) { sum1 += wkMap[30]; }
  if (wkMap[40] > 0) { sum1 += wkMap[40]; }
  if (wkMap[50] > 0) { sum1 += wkMap[50]; }
  if (wkMap[5] * -1 > 0) { sum2 -= wkMap[5]; }
  if (wkMap[15] * -1 > 0) { sum2 -= wkMap[15]; }
  if (wkMap[25] * -1 > 0) { sum2 -= wkMap[25]; }
  if (wkMap[35] * -1 > 0) { sum2 -= wkMap[35]; }
  if (wkMap[45] * -1 > 0) { sum2 -= wkMap[45]; }
  if (wkMap[55] * -1 > 0) { sum2 -= wkMap[55]; }
  if (sum1 === sum2) {
    if (!isNoneNode(wkMap)) {
      return false;
    }
    return true;
  }
  return false;
}

/** 
 * 手詰まり判定
 * @param  {Object.<number, number>}  wkMap
 * @return {boolean} 
 */
function isNoneNode(wkMap) {
  let flag1 = false;
  let flag2 = false;
  for (let i = 0; i <= 35; i++) {
    let panel_num = NUMBERS[i] | 0;
    if (wkMap[panel_num] === 0) {
      continue;
    }
    let canMove = hasCanMovePanelX(panel_num, wkMap);
    if (canMove === true) {
      if (wkMap[panel_num] > 0) {
        flag1 = true;
      } else if (wkMap[panel_num] < 0) {
        flag2 = true;
      }
    }
    if (flag1 && flag2) {
      return false;
    }
  }
  return true;
}
/** 
 * 動かせるマスを返す。Return:[NN,NN,NN...]
 * @param  {number}  panel_num
 * @param  {Object.<number, number>}  wkMap
 * @return {boolean} 
 */
function hasCanMovePanelX(panel_num, wkMap) {
  let number = wkMap[panel_num] | 0;
  let x = ~~(panel_num / 10); // [~~]=Math.floor 
  let y = ~~(panel_num % 10);

  // アガリのコマは動かしたらダメ。何も無いマスも動かしようがない。
  if ((number > 0 && y === 0) || (number < 0 && y === 5) || number === 0) {
    return false;
  }
  for (let i = 0; i < 9; i++) {
    if (PIECES[number + 8][i] === 0) {
      continue;
    }
    let target_x = x + ~~(i % 3) - 1;
    let target_y = y + ~~(i / 3) - 1;
    if (target_y < 0 || target_y > 5 || target_x > 5 || target_x < 0) {
      continue;
    }

    let idx = target_x * 10 + target_y;
    let target_number = wkMap[idx];

    // 自コマとアガリのコマはとったらダメ。
    if ((target_number * number > 0) || (target_number > 0 && target_y === 0) || (target_number < 0 && target_y === 5)) {
      continue;
    }
    return true;
  }
  return false;
}
/** 
 * 動かせるマスを返す。Return:[NN,NN,NN...]
 * @param  {number}  panel_num
 * @param  {Object.<number, number>}  wkMap
 * @return {Array.<number, number>} 
 */
function getCanMovePanelX(panel_num, wkMap) {
  let number = wkMap[panel_num] | 0;
  let x = ~~(panel_num / 10); // [~~]=Math.floor 
  let y = ~~(panel_num % 10);
  let canMove = [];

  // アガリのコマは動かしたらダメ。何も無いマスも動かしようがない。
  if ((number > 0 && y === 0) || (number < 0 && y === 5) || number === 0) {
    return canMove;
  }
  for (let i = 0; i < 9; i++) {
    if (PIECES[number + 8][i] === 0) {
      continue;
    }
    let target_x = x + ~~(i % 3) - 1;
    let target_y = y + ~~(i / 3) - 1;
    if (target_y < 0 || target_y > 5 || target_x > 5 || target_x < 0) {
      continue;
    }

    let idx = target_x * 10 + target_y;
    let target_number = wkMap[idx]|0;

    // 自コマとアガリのコマはとったらダメ。
    if ((target_number * number > 0) || (target_number > 0 && target_y === 0) || (target_number < 0 && target_y === 5)) {
      continue;
    }
    canMove.push(idx);
  }
  return canMove;
}

/** 
 * 起こりうる次の一手を返す。Return:[[q,map0],[qmap1],[q,map2]...] //q=[prev,next]
 * @param  {Object.<number, number>}  wkMap
 * @param  {number}  turn_player
 * @return {Array.<number,Array.<Array.<number, number>, Object.<number, number>>>} 
 */
function getNodeMap(wkMap, turn_player) {
  let nodeList = [];
  for (let i = 0; i <= 35; i++) {
    let panel_num = NUMBERS[i] | 0;
    if (wkMap[panel_num] * turn_player <= 0 || wkMap[panel_num] === 0) {
      continue;
    }
    let canMove = getCanMovePanelX(panel_num, wkMap);
    for (let num = 0; num < canMove.length; num++) {
      let nodeMap = copyMap(wkMap);
      nodeMap[canMove[num]] = nodeMap[panel_num];
      nodeMap[panel_num] = 0;
      nodeList.push([[panel_num, canMove[num]], nodeMap]);
    }
  }
  return nodeList;
}

/** 
 * 盤面を評価して-10000〜+10000で採点数する。
 * @param  {Object.<number, number>}  wkMap
 * @param  {boolean}  nearwin
 * @param  {Object.<number, Array.<number>>}  evalparam
 * @return {number} 
 */
function evalMap(wkMap, nearwin, evalparam) {
  let ev = 0;

  // 引き分け判定
  if (isDraw(wkMap)) {
    return 0;
  }
  // 終局判定
  let end = isEndX(wkMap, nearwin);
  if (end === 1) {
    return +9999999;
  } else if (end === -1) {
    return -9999999;
  }
  // 評価
  for (let i = 0; i <= 35; i++) {
    let panel_num = NUMBERS[i] | 0;
    let cell_p = 0;
    let p = wkMap[panel_num];
    let line;
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
function deepThinkAllAB(map, turn_player, depth, a, b, nearwin, evalparam) {
  let best_score = turn_player * 9999999 * -1;
  let besthand;
  if (depth === 0) {
    best_score = evalMap(map, nearwin, evalparam);
    return [besthand, best_score];
  }
  if (a === void 0 || b === void 0) {
    a = 9999999 * turn_player * -1;
    b = 9999999 * turn_player;
  }

  let nodeList = getNodeMap(map, turn_player);
  for (let i = 0; i < nodeList.length; i++) {
    let hand = nodeList[i][0];
    let map0 = nodeList[i][1];
    let sc = 0;
    // 必勝            
    let end = isEndX(map0, nearwin);
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
    if (isNoneNode(map0)) {
      sc = 0;
    } else {
      sc = deepThinkAllAB(map0, turn_player * -1, depth - 1, b, a, nearwin, evalparam)[1];
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
function thinkAI(map, turn_player, depth, a, b, evalparam) {
  let nearwin = false;
  let hand = [null, null];
  let wkMap = copyMap(map);
  if (!evalparam) {
    evalparam = DEFAULT_EVALPARAM;
  }
  if (isEndX(wkMap, false) !== 0) {
    nearwin = true;
  }

  hand = deepThinkAllAB(wkMap, turn_player, depth, a, b, nearwin, evalparam);
  if (hand[1] * turn_player === -999999) {
    hand = deepThinkAllAB(wkMap, turn_player, 1, a, b, nearwin, evalparam);
  }
  return hand;
}
