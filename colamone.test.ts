import { Aijs, MapArray } from "./src/ai";
let thisMap:any;

function convMap(map:any):MapArray {
    let rtn = new Int8Array(54);
    for (const i in map) {
        rtn[parseInt(i)] = map[i];
    }
    return rtn;
}

beforeEach(() => {
    thisMap = {
        0: -1, 10: -2, 20: -3, 30: -4, 40: -5, 50: -6,
        1: 0, 11: -8, 21: 0, 31: 0, 41: -7, 51: 0,
        2: 0, 12: 0, 22: 0, 32: 0, 42: 0, 52: 0,
        3: 0, 13: 0, 23: 0, 33: 0, 43: 0, 53: 0,
        4: 0, 14: 7, 24: 0, 34: 0, 44: 8, 54: 0,
        5: 6, 15: 5, 25: 4, 35: 3, 45: 2, 55: 1,
    }
});

test('移動可能マスを正しく返すか', () => {

    let map1 = {
        0: 0, 10: 0, 20: 0, 30: 0, 40: 0, 50: 0,
        1: 0, 11: 1, 21: 0, 31: 2, 41: 0, 51: 0,
        2: 0, 12: 0, 22: 0, 32: 0, 42: 0, 52: 0,
        3: 0, 13: 3, 23: 0, 33: 4, 43: 0, 53: 0,
        4: 0, 14: 0, 24: 0, 34: 0, 44: 0, 54: 0,
        5: 0, 15: 0, 25: 0, 35: 0, 45: 0, 55: 0,
    };
    let map2 = {
        0: 0, 10: 0, 20: 0, 30: 0, 40: 0, 50: 0,
        1: 0, 11: 5, 21: 0, 31: 6, 41: 0, 51: 0,
        2: 0, 12: 0, 22: 0, 32: 0, 42: 0, 52: 0,
        3: 0, 13: 7, 23: 0, 33: 8, 43: 0, 53: 0,
        4: 0, 14: 0, 24: 0, 34: 0, 44: 0, 54: 0,
        5: 0, 15: 0, 25: 0, 35: 0, 45: 0, 55: 0,
    }
    let map3 = {
        0: 0, 10: 0, 20: 0, 30: 0, 40: 0, 50: 0,
        1: 0, 11: 0, 21: 0, 31: 0, 41: 0, 51: 0,
        2: 0, 12: 0, 22: 1, 32: 0, 42: 0, 52: 0,
        3: 0, 13: 0, 23: 8, 33: 0, 43: 0, 53: 0,
        4: 0, 14: 0, 24: 0, 34: 0, 44: 0, 54: 0,
        5: 0, 15: 0, 25: 0, 35: 0, 45: 0, 55: 0,
    };

    //1の動きテスト
    expect(Aijs.getCanMovePanelX(11, convMap(map1))).toEqual(
        expect.objectContaining([0, 10, 20, 1, 21, 2, 12, 22]),
    );

    //2の動きテスト
    expect(Aijs.getCanMovePanelX(31, convMap(map1))).toEqual(
        expect.objectContaining([20, 30, 40, 21, 41, 22, 42]),
    );

    //3の動きテスト
    expect(Aijs.getCanMovePanelX(13, convMap(map1))).toEqual(
        expect.objectContaining([2, 12, 22, 4, 14, 24]),
    );

    //4の動きテスト
    expect(Aijs.getCanMovePanelX(33, convMap(map1))).toEqual(
        expect.objectContaining([22, 32, 42, 24, 44]),
    );

    //5の動きテスト
    expect(Aijs.getCanMovePanelX(11, convMap(map2))).toEqual(
        expect.objectContaining([0, 20, 2, 22]),
    );

    //6の動きテスト
    expect(Aijs.getCanMovePanelX(31, convMap(map2))).toEqual(
        expect.objectContaining([20, 40, 32]),
    );

    //7の動きテスト
    expect(Aijs.getCanMovePanelX(13, convMap(map2))).toEqual(
        expect.objectContaining([12, 14]),
    );

    //8の動きテスト
    expect(Aijs.getCanMovePanelX(33, convMap(map2))).toEqual(
        expect.objectContaining([32]),
    );

    //障害物のテスト
    expect(Aijs.getCanMovePanelX(23, convMap(map3))).toEqual(
        expect.objectContaining([]),
    );
});

test('勝利判定がちゃんと動いてるか', () => {
    let blueWinMap = {
        0: 0, 10: 0, 20: 0, 30: -4, 40: 6, 50: 2,
        1: 0, 11: 0, 21: 0, 31: 0, 41: 0, 51: 0,
        2: 0, 12: 0, 22: 0, 32: 0, 42: 0, 52: 0,
        3: 0, 13: 0, 23: 0, 33: 0, 43: 0, 53: 0,
        4: 0, 14: 7, 24: 0, 34: 0, 44: 8, 54: 0,
        5: 0, 15: 5, 25: 4, 35: 3, 45: 0, 55: 1,
    }
    let redWinMap = {
        0: -1, 10: -2, 20: -3, 30: 0, 40: 0, 50: -6,
        1: 0, 11: -8, 21: 0, 31: 0, 41: -7, 51: 0,
        2: 0, 12: 0, 22: 0, 32: 0, 42: 0, 52: 0,
        3: 0, 13: 0, 23: 0, 33: 0, 43: 0, 53: 0,
        4: 0, 14: 7, 24: 0, 34: 0, 44: 8, 54: 0,
        5: 6, 15: -5, 25: -4, 35: 3, 45: 2, 55: 1,
    }
    let blueWinMap2 = {
        0: 0, 10: 1, 20: 0, 30: 0, 40: 0, 50: 0,
        1: 0, 11: 0, 21: -2, 31: -4, 41: 0, 51: 0,
        2: 0, 12: 0, 22: 0, 32: 0, 42: 0, 52: 0,
        3: 0, 13: 0, 23: 0, 33: 0, 43: 0, 53: 0,
        4: 0, 14: 0, 24: 0, 34: 0, 44: 0, 54: 0,
        5: 0, 15: 0, 25: 0, 35: 0, 45: 0, 55: 0,
    }
    let redWinMap2 = {
        0: 0, 10: 0, 20: 0, 30: 0, 40: 0, 50: 0,
        1: 0, 11: 0, 21: 2, 31: 4, 41: 0, 51: 0,
        2: 0, 12: 0, 22: 0, 32: 0, 42: 0, 52: 0,
        3: 0, 13: 0, 23: 0, 33: 0, 43: 0, 53: 0,
        4: 0, 14: 0, 24: 0, 34: 0, 44: 8, 54: 0,
        5: 0, 15: 0, 25: 0, 35: -1, 45: 0, 55: 0,
    }
    let drawMap = {
        0: 0, 10: 0, 20: 0, 30: 8, 40: 0, 50: 0,
        1: 0, 11: 0, 21: 0, 31: 0, 41: 0, 51: 0,
        2: 0, 12: 0, 22: 0, 32: 0, 42: 0, 52: 0,
        3: 0, 13: 0, 23: 0, 33: 0, 43: 0, 53: 0,
        4: 0, 14: 0, 24: 0, 34: 0, 44: 0, 54: 0,
        5: 0, 15: 0, 25: 0, 35: -8, 45: 0, 55: 0,
    }
    expect(Aijs.isEndX(convMap(blueWinMap), false)).toBe(1);
    expect(Aijs.isEndX(convMap(redWinMap), false)).toBe(-1);
    expect(Aijs.isEndX(convMap(blueWinMap2), false)).toBe(1);
    expect(Aijs.isEndX(convMap(redWinMap2), false)).toBe(-1);
    expect(Aijs.isDraw(convMap(drawMap))).toBe(true);
});

test('終局時に同じ局面になるか確認する(レベル2)', () => {
    var turn_player = 1;
    var end;
    var map = Aijs.copyMap(convMap(thisMap));
    var count = 0;
    var result = Aijs.copyMap(convMap(
        {
            0: 5, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0,
            10: 6, 11: 0, 12: 0, 13: 0, 14: 0, 15: 0,
            20: 0, 21: 0, 22: 0, 23: 0, 24: 0, 25: 0,
            30: 0, 31: 0, 32: 0, 33: 0, 34: 0, 35: 0,
            40: 0, 41: 0, 42: 0, 43: 0, 44: 0, 45: -2,
            50: -6, 51: 0, 52: 0, 53: 0, 54: 0, 55: 1
        }))
    while (true) {
        count += 1;
        if (count > 255) {
            break;
        }
        let hand = Aijs.thinkAI(map, turn_player, 3,undefined,undefined,undefined)[0];
        map[hand[1]] = map[hand[0]];
        map[hand[0]] = 0;
        if (Aijs.isDraw(map) === true) {
            end = 0;
            break;
        }
        end = Aijs.isEndX(map, false);
        if (end === 1 || end === -1) {
            break;
        }
        turn_player = turn_player * -1;
    }

    expect(map).toEqual(result);
});