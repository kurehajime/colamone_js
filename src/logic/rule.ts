/* @license Copyright (c) @kurehajime / source code: https://github.com/kurehajime/colamone_js */
'use strict';
export type Hand = [number, number];
export type MapArray = Int8Array;
export type HandNode = [Hand, MapArray];
export class Rule {
   public static LIMIT_1000DAY = 3;
    /** 
 * 駒の進める方向 
 * @const 
 * @type {Array.<Array.<number>>} 
 * index+8:コマの数字
 */
    static readonly PIECES = [
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
    static readonly NUMBERS = [0, 1, 2, 3, 4, 5,
        10, 11, 12, 13, 14, 15,
        20, 21, 22, 23, 24, 25,
        30, 31, 32, 33, 34, 35,
        40, 41, 42, 43, 44, 45,
        50, 51, 52, 53, 54, 55];

    /** 
     * Mapをコピーして返す。 
     * @param  {Object.<number, number>}  wkMap
     * @return {Object.<number, number>} 
     */
    public static copyMap(wkMap: MapArray): MapArray {
        return new Int8Array(wkMap);
    }


    /** 
     * 終了判定(実質的勝利含む) 
     * @param  {Object.<number, number>}  wkMap
     * @param  {boolean}  nearwin
     * @return {number} 0:引き分け,1:先手勝利,-1:後手勝利
     */
    public static isEndX(wkMap: MapArray, nearwin: boolean): number {
        let sum1: number = 0;
        let sum2: number = 0;
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
        if (Rule.isNoneNode(wkMap)) {
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
            let live1: number = 0;
            let live2: number = 0;
            for (let i: number = 0; i <= 35; i++) {
                let num: number = Rule.NUMBERS[i] | 0;
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
    public static isDraw(wkMap: MapArray): boolean {
        let sum1: number = 0;
        let sum2: number = 0;
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
            if (!Rule.isNoneNode(wkMap)) {
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
    static isNoneNode(wkMap: MapArray): boolean {
        let flag1: boolean = false;
        let flag2: boolean = false;
        for (let i: number = 0; i <= 35; i++) {
            let panel_num: number = Rule.NUMBERS[i] | 0;
            if (wkMap[panel_num] === 0) {
                continue;
            }
            let canMove: boolean = Rule.hasCanMovePanelX(panel_num, wkMap);
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
    static hasCanMovePanelX(panel_num: number, wkMap: MapArray): boolean {
        let number: number = wkMap[panel_num] | 0;
        let x: number = ~~(panel_num / 10); // [~~]=Math.floor 
        let y: number = ~~(panel_num % 10);

        // アガリのコマは動かしたらダメ。何も無いマスも動かしようがない。
        if ((number > 0 && y === 0) || (number < 0 && y === 5) || number === 0) {
            return false;
        }
        for (let i: number = 0; i < 9; i++) {
            if (Rule.PIECES[number + 8][i] === 0) {
                continue;
            }
            let target_x: number = x + ~~(i % 3) - 1;
            let target_y: number = y + ~~(i / 3) - 1;
            if (target_y < 0 || target_y > 5 || target_x > 5 || target_x < 0) {
                continue;
            }

            let idx: number = target_x * 10 + target_y;
            let target_number: number = wkMap[idx];

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
    public static getCanMovePanelX(panel_num: number, wkMap: MapArray): number[] {
        let number: number = wkMap[panel_num] | 0;
        let x: number = ~~(panel_num / 10); // [~~]=Math.floor 
        let y: number = ~~(panel_num % 10);
        let canMove: number[] = [];

        // アガリのコマは動かしたらダメ。何も無いマスも動かしようがない。
        if ((number > 0 && y === 0) || (number < 0 && y === 5) || number === 0) {
            return canMove;
        }
        for (let i: number = 0; i < 9; i++) {
            if (Rule.PIECES[number + 8][i] === 0) {
                continue;
            }
            let target_x: number = x + ~~(i % 3) - 1;
            let target_y: number = y + ~~(i / 3) - 1;
            if (target_y < 0 || target_y > 5 || target_x > 5 || target_x < 0) {
                continue;
            }

            let idx: number = target_x * 10 + target_y;
            let target_number: number = wkMap[idx] | 0;

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
    static getNodeMap(wkMap: MapArray, turn_player: number): HandNode[] {
        let nodeList: HandNode[] = [];
        for (let i: number = 0; i <= 35; i++) {
            let panel_num: number = Rule.NUMBERS[i] | 0;
            if (wkMap[panel_num] * turn_player <= 0 || wkMap[panel_num] === 0) {
                continue;
            }
            let canMove: number[] = Rule.getCanMovePanelX(panel_num, wkMap);
            for (let num: number = 0; num < canMove.length; num++) {
                let nodeMap: MapArray = new Int8Array(wkMap);
                nodeMap[canMove[num]] = nodeMap[panel_num];
                nodeMap[panel_num] = 0;
                nodeList.push([[panel_num, canMove[num]], nodeMap]);
            }
        }
        return nodeList;
    }

    /** 
     * 千日手
     */
     static is1000day(wkMap: MapArray,map_list:{ [index: string]: number }):[boolean,{ [index: string]: number }] {
        let map_json = JSON.stringify(wkMap);
        if (map_list[map_json] === undefined) {
            map_list[map_json] = 1;
            return [false,map_list];
        } else {
            map_list[map_json] += 1;
        }
        if (map_list[map_json] >= this.LIMIT_1000DAY) {
            return [true,map_list];
        }
        return [false,map_list];
    }
}