/* @license Copyright (c) @kurehajime / source code: https://github.com/kurehajime/colamone_js */
; (function (global) {
  'use strict';

  // Class ------------------------------------------------
  function Aijs() { }
  // Header -----------------------------------------------
  global.Aijs = Aijs;
  global.Aijs.copyMap = copyMap;
  global.Aijs.thinkAI = thinkAI;
  global.Aijs.getCanMovePanelX = getCanMovePanelX;
  global.Aijs.isEndX = isEndX;
  global.Aijs.isDraw = isDraw;

  // Body ---------------------------------------

  /** 
   * 駒の進める方向 
   * @const 
   * @type {Array.<Array.<number>>} 
   * index+8:コマの数字
   */
  var PIECES = [
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
  var NUMBERS = [0, 1, 2, 3, 4, 5,
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
  var DEFAULT_EVALPARAM = {
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
    var rtnMap = new Int8Array(56);
    // 不格好だがループするより高速。
    rtnMap[0] = wkMap[0];
    rtnMap[10] = wkMap[10];
    rtnMap[20] = wkMap[20];
    rtnMap[30] = wkMap[30];
    rtnMap[40] = wkMap[40];
    rtnMap[50] = wkMap[50];
    rtnMap[1] = wkMap[1];
    rtnMap[11] = wkMap[11];
    rtnMap[21] = wkMap[21];
    rtnMap[31] = wkMap[31];
    rtnMap[41] = wkMap[41];
    rtnMap[51] = wkMap[51];
    rtnMap[2] = wkMap[2];
    rtnMap[12] = wkMap[12];
    rtnMap[22] = wkMap[22];
    rtnMap[32] = wkMap[32];
    rtnMap[42] = wkMap[42];
    rtnMap[52] = wkMap[52];
    rtnMap[3] = wkMap[3];
    rtnMap[13] = wkMap[13];
    rtnMap[23] = wkMap[23];
    rtnMap[33] = wkMap[33];
    rtnMap[43] = wkMap[43];
    rtnMap[53] = wkMap[53];
    rtnMap[4] = wkMap[4];
    rtnMap[14] = wkMap[14];
    rtnMap[24] = wkMap[24];
    rtnMap[34] = wkMap[34];
    rtnMap[44] = wkMap[44];
    rtnMap[54] = wkMap[54];
    rtnMap[5] = wkMap[5];
    rtnMap[15] = wkMap[15];
    rtnMap[25] = wkMap[25];
    rtnMap[35] = wkMap[35];
    rtnMap[45] = wkMap[45];
    rtnMap[55] = wkMap[55];    
    return rtnMap;
  }

  /** 
   * 終了判定(実質的勝利含む) 
   * @param  {Object.<number, number>}  wkMap
   * @param  {boolean}  nearwin
   * @return {number} 0:引き分け,1:先手勝利,-1:後手勝利
   */
  function isEndX(wkMap, nearwin) {
    var sum1 = 0;
    var sum2 = 0;
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
      var live1 = 0;
      var live2 = 0;
      for (var i = 0; i <= 35; i++) {
        var num = NUMBERS[i] | 0;
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
    if (!isNoneNode(wkMap)) {
      return false;
    }
    var sum1 = 0;
    var sum2 = 0;
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
      return true;
    } else {
      return false;
    }
  }

  /** 
   * 手詰まり判定
   * @param  {Object.<number, number>}  wkMap
   * @return {boolean} 
   */
  function isNoneNode(wkMap) {
    var flag1 = false;
    var flag2 = false;
    for (var i = 0; i <= 35; i++) {
      var panel_num = NUMBERS[i] | 0;
      if (wkMap[panel_num] === 0) {
        continue;
      }
      var canMove = hasCanMovePanelX(panel_num, wkMap);
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
    var number = wkMap[panel_num] | 0;
    var x = ~~(panel_num / 10); // [~~]=Math.floor 
    var y = ~~(panel_num % 10);

    // アガリのコマは動かしたらダメ。何も無いマスも動かしようがない。
    if ((number > 0 && y === 0) || (number < 0 && y === 5) || number === 0) {
      return false;
    }
    for (var i = 0; i < 9; i++) {
      if (PIECES[number + 8][i] === 0) {
        continue;
      }
      var target_x = x + ~~(i % 3) - 1;
      var target_y = y + ~~(i / 3) - 1;
      if (target_y < 0 || target_y > 5 || target_x > 5 || target_x < 0) {
        continue;
      }

      var idx = target_x * 10 + target_y;
      var target_number = wkMap[idx];

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
    var number = wkMap[panel_num] | 0;
    var x = ~~(panel_num / 10); // [~~]=Math.floor 
    var y = ~~(panel_num % 10);
    var canMove = [];

    // アガリのコマは動かしたらダメ。何も無いマスも動かしようがない。
    if ((number > 0 && y === 0) || (number < 0 && y === 5) || number === 0) {
      return canMove;
    }
    for (var i = 0; i < 9; i++) {
      if (PIECES[number + 8][i] === 0) {
        continue;
      }
      var target_x = x + ~~(i % 3) - 1;
      var target_y = y + ~~(i / 3) - 1;
      if (target_y < 0 || target_y > 5 || target_x > 5 || target_x < 0) {
        continue;
      }

      var idx = target_x * 10 + target_y;
      var target_number = wkMap[idx];

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
    var nodeList = [];
    for (var i = 0; i <= 35; i++) {
      var panel_num = NUMBERS[i] | 0;
      if (wkMap[panel_num] * turn_player <= 0 || wkMap[panel_num] === 0) {
        continue;
      }
      var canMove = getCanMovePanelX(panel_num, wkMap);
      for (var num = 0; num < canMove.length; num++) {
        var nodeMap = copyMap(wkMap);
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
   * @param  {number}  turn_player
   * @param  {boolean}  nearwin
   * @param  {Object.<number, Array.<number>>}  evalparam
   * @return {number} 
   */
  function evalMap(wkMap, turn_player, nearwin, evalparam) {
    var ev = 0;

    // 引き分け判定
    if (isDraw(wkMap)) {
      return 0;
    }
    // 終局判定
    var end = isEndX(wkMap, nearwin);
    if (end === 1) {
      return +9999999;
    } else if (end === -1) {
      return -9999999;
    }
    // 評価
    for (var i = 0; i <= 35; i++) {
      var panel_num = NUMBERS[i] | 0;
      var cell_p = 0;
      var p = wkMap[panel_num];
      var line;
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
    var best_score = turn_player * 9999999 * -1;
    var besthand;
    if (depth === 0) {
      best_score = evalMap(map, turn_player, nearwin, evalparam);
      return [besthand, best_score];
    }
    if (a === void 0 || b === void 0) {
      a = 9999999 * turn_player * -1;
      b = 9999999 * turn_player;
    }

    var nodeList = getNodeMap(map, turn_player);
    for (var i = 0; i < nodeList.length; i++) {
      var hand = nodeList[i][0];
      var map0 = nodeList[i][1];
      var sc = 0;
      // 必勝            
      var end = isEndX(map0, nearwin);
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
    var nearwin = false;
    var hand = [null, null];
    var wkMap = copyMap(map);
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
})((this || 0).self || global);