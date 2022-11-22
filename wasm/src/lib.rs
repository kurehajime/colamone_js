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
pub fn think_ai(map: &[isize], turn_player: isize, depth: isize) -> Result {
    let mut _map: [isize; 56] = [0; 56];
    for i in 0..56 {
        _map[i] = map[i];
    }

    let result = ai::think_ai(&_map, turn_player, depth, None, None, None);
    Result {
        from: result.0.unwrap().0,
        to: result.0.unwrap().1,
    }
}
