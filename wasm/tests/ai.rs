use std::collections::HashMap;

use colamone::{
    ai::think_ai,
    rule::{self, MapArray},
};

extern crate colamone;

fn hash_to_map(hash: HashMap<usize, isize>) -> MapArray {
    let mut map: MapArray = vec![0; 56];
    for (key, value) in hash.into_iter() {
        map[key] = value;
    }
    map
}
#[test]
fn test_think() {
    let mut map = hash_to_map(maplit::hashmap!(
        0=> -1, 10=> -2, 20=> -3, 30=> -4, 40=> -5, 50=> -6,
        1=> 0, 11=> -8, 21=> 0, 31=> 0, 41=> -7, 51=> 0,
        2=> 0, 12=> 0, 22=> 0, 32=> 0, 42=> 0, 52=> 0,
        3=> 0, 13=> 0, 23=> 0, 33=> 0, 43=> 0, 53=> 0,
        4=> 0, 14=> 7, 24=> 0, 34=> 0, 44=> 8, 54=> 0,
        5=> 6, 15=> 5, 25=> 4, 35=> 3, 45=> 2, 55=> 1));
    let mut turn_player = 1;
    let mut end;
    let mut count = 0;
    let result = hash_to_map(maplit::hashmap!(
        0=> 5, 1=> 0, 2=> 0, 3=> 0, 4=> 0, 5=> 0,
        10=> 6, 11=> 0, 12=> 0, 13=> 0, 14=> 0, 15=> 0,
        20=> 0, 21=> 0, 22=> 0, 23=> 0, 24=> 0, 25=> 0,
        30=> 0, 31=> 0, 32=> 0, 33=> 0, 34=> 0, 35=> 0,
        40=> 0, 41=> 0, 42=> 0, 43=> 0, 44=> 0, 45=> -2,
        50=> -6, 51=> 0, 52=> 0, 53=> 0, 54=> 0, 55=> 1));
    while count <= 255 {
        count += 1;
        if count > 255 {
            break;
        }
        let hand = think_ai(&map, turn_player, 3, None, None, None).0;
        if hand != None {
            map[hand.unwrap().1] = map[hand.unwrap().0];
            map[hand.unwrap().0] = 0;
        }
        if rule::is_draw(&map) == true {
            break;
        }
        end = rule::is_end_x(&map, false);
        if end == 1 || end == -1 {
            break;
        }
        turn_player = turn_player * -1
    }

    assert_eq!(map, result);
}
