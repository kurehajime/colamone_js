pub static LIMIT_1000DAY: isize = 3;
pub static PIECES: [[usize; 9]; 17] = [
    [
        0, 0, 0, // -8
        0, 0, 0, //
        0, 1, 0,
    ],
    [
        0, 1, 0, //-7
        0, 0, 0, //
        0, 1, 0,
    ],
    [
        0, 1, 0, //-6
        0, 0, 0, //
        1, 0, 1,
    ],
    [
        1, 0, 1, // -5
        0, 0, 0, //
        1, 0, 1,
    ],
    [
        1, 0, 1, // -4
        0, 0, 0, //
        1, 1, 1,
    ],
    [
        1, 1, 1, // -3
        0, 0, 0, //
        1, 1, 1,
    ],
    [
        1, 0, 1, //-2
        1, 0, 1, //
        1, 1, 1,
    ],
    [
        1, 1, 1, //-1
        1, 0, 1, //
        1, 1, 1,
    ],
    [
        0, 0, 0, // 0
        0, 0, 0, //
        0, 0, 0,
    ],
    [
        1, 1, 1, // 1
        1, 0, 1, //
        1, 1, 1,
    ],
    [
        1, 1, 1, // 2
        1, 0, 1, //
        1, 0, 1,
    ],
    [
        1, 1, 1, // 3
        0, 0, 0, //
        1, 1, 1,
    ],
    [
        1, 1, 1, // 4
        0, 0, 0, //
        1, 0, 1,
    ],
    [
        1, 0, 1, // 5
        0, 0, 0, //
        1, 0, 1,
    ],
    [
        1, 0, 1, // 6
        0, 0, 0, //
        0, 1, 0,
    ],
    [
        0, 1, 0, // 7
        0, 0, 0, //
        0, 1, 0,
    ],
    [
        0, 1, 0, // 8
        0, 0, 0, //
        0, 0, 0,
    ],
];
pub const NUMBERS: [usize; 36] = [
    0, 1, 2, 3, 4, 5, //
    10, 11, 12, 13, 14, 15, //
    20, 21, 22, 23, 24, 25, //
    30, 31, 32, 33, 34, 35, //
    40, 41, 42, 43, 44, 45, //
    50, 51, 52, 53, 54, 55,
];
pub type MapArray = [i8; 56];
pub type Hand = (usize, usize);
pub type HandNode = (Hand, MapArray);

#[inline]
pub fn get_can_move_panel_x(panel_num: usize, map: &MapArray) -> Vec<usize> {
    let mut can_move: Vec<usize> = vec![];
    let number: i8 = map[panel_num];
    let panel_num = panel_num as isize;
    let x = panel_num / 10;
    let y = panel_num % 10;
    // アガリのコマは動かしたらダメ。何も無いマスも動かしようがない。
    if (number > 0 && y == 0) || (number < 0 && y == 5) || number == 0 {
        return can_move;
    }
    for i in 0..9 {
        let ii = i as isize;
        if PIECES[(number + 8) as usize][i] == 0 {
            continue;
        }
        let target_x = x + (ii % 3) - 1;
        let target_y = y + (ii / 3) - 1;
        if target_y < 0 || target_y > 5 || target_x > 5 || target_x < 0 {
            continue;
        }

        let idx = (target_x * 10 + target_y) as usize;
        let target_number = map[idx];

        // 自コマとアガリのコマはとったらダメ。
        if (target_number * number > 0)
            || (target_number > 0 && target_y == 0)
            || (target_number < 0 && target_y == 5)
        {
            continue;
        }
        can_move.push(idx);
    }
    can_move
}

#[inline]
pub fn get_node_map(map: &MapArray, turn_player: isize) -> Vec<HandNode> {
    let mut node_list: Vec<HandNode> = vec![];
    for i in 0..36 {
        let panel_num: usize = NUMBERS[i];
        if (map[panel_num] as isize) * turn_player <= 0 || map[panel_num] == 0 {
            continue;
        }
        let can_move = get_can_move_panel_x(panel_num, map);
        for num in 0..can_move.len() {
            let mut node_map: MapArray = map.clone();
            node_map[can_move[num]] = node_map[panel_num];
            node_map[panel_num] = 0;
            let hand = (panel_num, can_move[num]);
            let map_array = node_map;
            node_list.push((hand, map_array));
        }
    }
    return node_list;
}

#[inline]
pub fn has_can_move_panel_x(panel_num: usize, map: &MapArray) -> bool {
    let number = map[panel_num];
    let panel_num = panel_num as isize;
    let x = panel_num / 10; // [~~]=Math.floor
    let y = panel_num % 10;

    // アガリのコマは動かしたらダメ。何も無いマスも動かしようがない。
    if (number > 0 && y == 0) || (number < 0 && y == 5) || number == 0 {
        return false;
    }
    for i in 0..9 {
        if PIECES[(number + 8) as usize][i] == 0 {
            continue;
        }
        let ii = i as isize;
        let target_x = x + (ii % 3) - 1;
        let target_y = y + (ii / 3) - 1;
        if target_y < 0 || target_y > 5 || target_x > 5 || target_x < 0 {
            continue;
        }

        let idx = target_x * 10 + target_y;
        let target_number = map[idx as usize];

        // 自コマとアガリのコマはとったらダメ。
        if (target_number * number > 0)
            || (target_number > 0 && target_y == 0)
            || (target_number < 0 && target_y == 5)
        {
            continue;
        }
        return true;
    }
    false
}

#[inline]
pub fn is_none_node(map: &MapArray) -> bool {
    let mut flag1 = false;
    let mut flag2 = false;
    for i in 0..36 {
        let panel_num = NUMBERS[i];
        if map[panel_num] == 0 {
            continue;
        }
        let can_move = has_can_move_panel_x(panel_num, map);
        if can_move == true {
            if map[panel_num] > 0 {
                flag1 = true;
            } else if map[panel_num] < 0 {
                flag2 = true;
            }
        }
        if flag1 && flag2 {
            return false;
        }
    }
    true
}

#[inline]
pub fn is_draw(map: &MapArray) -> bool {
    let mut sum1 = 0;
    let mut sum2 = 0;
    // ループだと遅いので展開
    if map[0] > 0 {
        sum1 += map[0];
    }
    if map[10] > 0 {
        sum1 += map[10];
    }
    if map[20] > 0 {
        sum1 += map[20];
    }
    if map[30] > 0 {
        sum1 += map[30];
    }
    if map[40] > 0 {
        sum1 += map[40];
    }
    if map[50] > 0 {
        sum1 += map[50];
    }
    if map[5] * -1 > 0 {
        sum2 -= map[5];
    }
    if map[15] * -1 > 0 {
        sum2 -= map[15]
    }
    if map[25] * -1 > 0 {
        sum2 -= map[25];
    }
    if map[35] * -1 > 0 {
        sum2 -= map[35];
    }
    if map[45] * -1 > 0 {
        sum2 -= map[45];
    }
    if map[55] * -1 > 0 {
        sum2 -= map[55];
    }
    if sum1 == sum2 {
        if !is_none_node(map) {
            return false;
        }
        return true;
    }
    false
}

#[inline]
pub fn is_end_x(map: &MapArray, near_win: bool) -> isize {
    let mut sum1 = 0;
    let mut sum2 = 0;
    // ループだと遅いので展開
    if map[0] > 0 {
        sum1 += map[0];
    }
    if map[10] > 0 {
        sum1 += map[10];
    }
    if map[20] > 0 {
        sum1 += map[20];
    }
    if map[30] > 0 {
        sum1 += map[30];
    }
    if map[40] > 0 {
        sum1 += map[40];
    }
    if map[50] > 0 {
        sum1 += map[50];
    }
    if map[5] * -1 > 0 {
        sum2 += map[5];
    }
    if map[15] * -1 > 0 {
        sum2 += map[15];
    }
    if map[25] * -1 > 0 {
        sum2 += map[25];
    }
    if map[35] * -1 > 0 {
        sum2 += map[35];
    }
    if map[45] * -1 > 0 {
        sum2 += map[45];
    }
    if map[55] * -1 > 0 {
        sum2 += map[55];
    }

    if sum1 >= 8 {
        return 1;
    } else if sum2 <= -8 {
        return -1;
    }

    // 手詰まりは判定
    if is_none_node(map) {
        if sum1 > (-1 * sum2) {
            return 1;
        } else if sum1 < (-1 * sum2) {
            return -1;
        } else {
            return 0;
        }
    }
    // 実質的判定勝利
    if near_win == false && (sum1 != 0 || sum2 != 0) {
        let mut live1 = 0;
        let mut live2 = 0;
        for i in 0..36 {
            let num = NUMBERS[i];
            if map[num] > 0 {
                live1 += map[num];
            } else if map[num] < 0 {
                live2 += map[num];
            }
        }
        if sum1 > (-1 * (live2 + sum2)) {
            return 1;
        } else if -1 * sum2 > (live1 + sum1) {
            return -1;
        }
    }
    0
}

#[inline]
pub fn is_goaled(after_hand: isize, turn: isize) -> bool {
    if turn > 0 {
        if after_hand % 10 == 0 {
            return true;
        }
    } else if turn < 0 {
        if after_hand % 10 == 5 {
            return true;
        }
    }
    false
}

#[inline]
pub fn get_node_count(map: &MapArray) -> usize {
    let mut count = 0;
    for panel_num in 0..map.len() {
        if map[panel_num] == 0 {
            continue;
        }
        let can_move = get_can_move_panel_x(panel_num, map);
        count += can_move.len()
    }
    count
}
