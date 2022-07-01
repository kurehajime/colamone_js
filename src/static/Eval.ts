/* @license Copyright (c) @kurehajime / source code: https://github.com/kurehajime/colamone_js */
'use strict';
import { Rule, MapArray } from "./Rule";

export class Eval {
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
        let ev = 0;

        // 引き分け判定
        if (Rule.isDraw(wkMap)) {
            return 0;
        }
        // 終局判定
        const end = Rule.isEndX(wkMap, nearwin);
        if (end === 1) {
            return +9999999;
        } else if (end === -1) {
            return -9999999;
        }
        // 評価
        for (let i = 0; i <= 35; i++) {
            const panel_num = Rule.NUMBERS[i] | 0;
            const p = wkMap[panel_num];
            let cell_p = 0;
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
}