use crate::rule::{self, MapArray, NUMBERS};

pub static DEFAULT_EVALPARAM: [[isize; 6]; 9] = [
    [0, 0, 0, 0, 0, 0],
    [1800, 1850, 1900, 1950, 2100, 2800],  //1
    [1800, 1860, 1920, 2100, 2400, 3800],  //2
    [1450, 1520, 1590, 1900, 2350, 4450],  //3
    [1450, 1530, 1610, 2050, 2650, 5450],  //4
    [1350, 1440, 1530, 2100, 2850, 6350],  //5
    [1350, 1450, 1550, 2250, 3150, 7350],  //6
    [1250, 1360, 1470, 2300, 3350, 8250],  //7
    [1250, 1370, 1490, 2450, 4350, 11250], //8
];
pub fn eval_map(map: &MapArray, near_win: bool, eval_param: [[isize; 6]; 9]) -> isize {
    let mut ev = 0;
    // 引き分け判定
    if rule::is_draw(map) {
        return 0;
    }
    // 終局判定
    let end = rule::is_end_x(map, near_win);
    if end == 1 {
        return 9999999;
    } else if end == -1 {
        return -9999999;
    }
    // 評価
    for i in 0..36 {
        let panel_num = NUMBERS[i];
        let p = map[panel_num];
        let mut cell_p = 0;
        // コマの評価値を加算
        if p > 0 {
            let line = 5 - (panel_num % 10);
            cell_p += eval_param[p.abs() as usize][line];
        } else if p < 0 {
            let line = panel_num % 10;
            cell_p += eval_param[p.abs() as usize][line] * -1;
        }
        // 評価値に加算。
        ev += cell_p
    }
    ev
}
