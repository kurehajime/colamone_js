use wasm_bindgen::prelude::wasm_bindgen;

pub mod ai;
pub mod eval;
pub mod rule;

#[wasm_bindgen]
pub struct Result {
    pub from: usize,
    pub to: usize,
}

#[wasm_bindgen]
pub fn think_ai(map: &[i8], turn_player: isize, depth: isize) -> Result {
    let mut _map: [i8; 56] = [0; 56];
    _map.copy_from_slice(&map[..56]);

    let result = ai::think_ai(&_map, turn_player, depth, None, None, None);
    let hand = result.0.unwrap();
    Result {
        from: hand.0,
        to: hand.1,
    }
}
