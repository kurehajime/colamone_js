use crate::eval::{self, DEFAULT_EVALPARAM};
use crate::rule::{self, Hand, MapArray};

#[inline]
pub fn deep_think_all_ab(
    map: &MapArray,
    turn_player: isize,
    depth: isize,
    a: Option<isize>,
    b: Option<isize>,
    nearwin: bool,
    evalparam: [[isize; 6]; 9],
) -> (Option<Hand>, isize) {
    let mut best_score: isize = turn_player * 9999999 * -1;
    let mut besthand: Option<Hand> = None;
    let mut a = a;
    let mut b = b;
    if depth == 0 {
        best_score = eval::eval_map(map, nearwin, evalparam);
        return (None, best_score);
    }
    if a == None || b == None {
        a = Some(9999999 * turn_player * -1);
        b = Some(9999999 * turn_player);
    }

    let node_list = rule::get_node_map(map, turn_player);
    for node in node_list {
        let hand: Hand = node.0;
        let map0 = node.1;
        let sc: isize;
        // 必勝
        let end = rule::is_end_x(&map0, nearwin);
        if end == turn_player {
            return (Some(hand), 999999 * turn_player);
        }
        // 必敗
        if end == turn_player * -1 {
            if besthand == None {
                best_score = 999999 * turn_player * -1;
                besthand = Some(hand);
            }
            continue;
        }
        if rule::is_none_node(&map0) {
            sc = 0;
        } else {
            sc = deep_think_all_ab(&map0, turn_player * -1, depth - 1, b, a, nearwin, evalparam).1;
        }
        if besthand == None {
            best_score = sc;
            besthand = Some(hand);
        }
        if turn_player == 1 && sc > best_score {
            best_score = sc;
            besthand = Some(hand);
        } else if turn_player == -1 && sc < best_score {
            best_score = sc;
            besthand = Some(hand);
        }
        if turn_player == 1 && a.unwrap() < best_score
            || turn_player == -1 && a.unwrap() > best_score
        {
            a = Some(best_score);
        }
        if turn_player == 1 && b.unwrap() <= best_score
            || turn_player == -1 && b.unwrap() >= best_score
        {
            break;
        }
    }
    return (besthand, best_score);
}

pub fn think_ai(
    map: &MapArray,
    turn_player: isize,
    depth: isize,
    a: Option<isize>,
    b: Option<isize>,
    evalparam: Option<[[isize; 6]; 9]>,
) -> (Option<Hand>, isize) {
    let mut nearwin = false;
    let mut hand: (Option<Hand>, isize);
    let evalparam = evalparam.unwrap_or(DEFAULT_EVALPARAM);

    if rule::is_end_x(map, false) != 0 {
        nearwin = true;
    }
    hand = deep_think_all_ab(map, turn_player, depth, a, b, nearwin, evalparam);
    if hand.1 * turn_player == -999999 {
        hand = deep_think_all_ab(map, turn_player, 1, a, b, nearwin, evalparam);
    }
    return hand;
}
