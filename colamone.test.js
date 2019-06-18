import { Aijs } from "./src/ai";

function convMap(map) {
    let rtn = new Int8Array(54);
    for (const i in map) {
        rtn[i] = map[i];
    }
    return rtn;
}

test('移動可能マスを正しく返すか', () => {

    let map1 = {
        0: 0, 10: 0, 20: 0, 30: 0, 40: 0, 50: 0,
        1: 0, 11: 1, 21: 0, 31: 2, 41: 0, 51: 0,
        2: 0, 12: 0, 22: 0, 32: 0, 42: 0, 52: 0,
        3: 0, 13: 3, 23: 0, 33: 4, 43: 0, 53: 0,
        4: 0, 14: 0, 24: 0, 34: 0, 44: 0, 54: 0,
        5: 0, 15: 0, 25: 0, 35: 0, 45: 0, 55: 0,
    };
    var map2 = {
        0: 0, 10: 0, 20: 0, 30: 0, 40: 0, 50: 0,
        1: 0, 11: 5, 21: 0, 31: 6, 41: 0, 51: 0,
        2: 0, 12: 0, 22: 0, 32: 0, 42: 0, 52: 0,
        3: 0, 13: 7, 23: 0, 33: 8, 43: 0, 53: 0,
        4: 0, 14: 0, 24: 0, 34: 0, 44: 0, 54: 0,
        5: 0, 15: 0, 25: 0, 35: 0, 45: 0, 55: 0,
    }
    var map3 = {
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
        expect.objectContaining([20,30,40,21,41,22,42]),
    );

    //3の動きテスト
    expect(Aijs.getCanMovePanelX(13, convMap(map1))).toEqual(
        expect.objectContaining([2,12,22,4,14,24]),
    );

    //4の動きテスト
    expect(Aijs.getCanMovePanelX(33, convMap(map1))).toEqual(
        expect.objectContaining([22,32,42,24,44]),
    );

    //5の動きテスト
    expect(Aijs.getCanMovePanelX(11, convMap(map2))).toEqual(
        expect.objectContaining([0,20,2,22]),
    );

    //6の動きテスト
    expect(Aijs.getCanMovePanelX(31, convMap(map2))).toEqual(
        expect.objectContaining([20,40,32]),
    );

    //7の動きテスト
    expect(Aijs.getCanMovePanelX(13, convMap(map2))).toEqual(
        expect.objectContaining([12,14]),
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