export class ViewState {
    public CellSize: number = 0;
    public Ratio = 1;
    public Img_bk_loaded = false;
    public Img_bk: (HTMLImageElement) = new Image();
    public mouse_x = 0;
    public mouse_y = 0;
    public isTouch = true;
    public message = '';
    public demo = true;
    public demo_inc = 0;
    public autoLog = false;
}