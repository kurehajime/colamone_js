
import { GameState } from "./gamestate";
import {  Aijs,MapArray,Hand } from "./ai";
export class View{
    public  CellSize:number = 0;
    public Ratio=1;
    public  Img_bk_loaded = false;
    public Img_bk:(HTMLImageElement);
  
    private ctx:(CanvasRenderingContext2D|null)=null;
    private  canv_board:(HTMLCanvasElement);
    private  canv_board2:(HTMLCanvasElement);
    private  canv_focus:(HTMLCanvasElement);
    private  canv_pieces:(HTMLCanvasElement);
    private  canv_shadow:(HTMLCanvasElement);
    private  canv_hover_piece:(HTMLCanvasElement);
    private  canv_overlay:(HTMLCanvasElement);
    private  canv_bk :(HTMLCanvasElement);
    private  canv_cover:(HTMLCanvasElement);
    private  canv_score:(HTMLCanvasElement);
    private  canv_cache:(HTMLCanvasElement);
    private  cache_on = false;
    private readonly  COLOR_LINE = '#333333';
    private readonly COLOR_PANEL_1 = '#660033';
    private readonly  COLOR_PANEL_2 = '#004466';
    private readonly  COLOR_PANEL_3 = '#FFFFFF';
    private readonly  COLOR_PANEL_4 = '#111111';
    private readonly  COLOR_PANEL_5 = '#444444';
    private readonly  COLOR_PANEL_6 = '#888888';
    private readonly  COLOR_SELECT = '#7fed7f';
    private readonly  COLOR_SELECT2='#148d14';
    private readonly  COLOR_RED = '#E60073';
    private readonly  COLOR_BLUE = '#0099E6';
    private readonly  COLOR_RED2 = '#E60073';
    private readonly  COLOR_BLUE2 = '#0099E6';
    private readonly  COLOR_WHITE = '#FFFFFF';
    private  CANV_SIZE:number = 0;
    private readonly PIECES:{ [index: string]: number[]; } = {
      '1': [1, 1, 1,
        1, 0, 1,
        1, 1, 1],
      '2': [1, 1, 1,
        1, 0, 1,
        1, 0, 1],
      '3': [1, 1, 1,
        0, 0, 0,
        1, 1, 1],
      '4': [1, 1, 1,
        0, 0, 0,
        1, 0, 1],
      '5': [1, 0, 1,
        0, 0, 0,
        1, 0, 1],
      '6': [1, 0, 1,
        0, 0, 0,
        0, 1, 0],
      '7': [0, 1, 0,
        0, 0, 0,
        0, 1, 0],
      '8': [0, 1, 0,
        0, 0, 0,
        0, 0, 0],
      '-1': [1, 1, 1,
        1, 0, 1,
        1, 1, 1],
      '-2': [1, 0, 1,
        1, 0, 1,
        1, 1, 1],
      '-3': [1, 1, 1,
        0, 0, 0,
        1, 1, 1],
      '-4': [1, 0, 1,
        0, 0, 0,
        1, 1, 1],
      '-5': [1, 0, 1,
        0, 0, 0,
        1, 0, 1],
      '-6': [0, 1, 0,
        0, 0, 0,
        1, 0, 1],
      '-7': [0, 1, 0,
        0, 0, 0,
        0, 1, 0],
      '-8': [0, 0, 0,
        0, 0, 0,
        0, 1, 0]
    };
    
  
    constructor(){
      if( window.devicePixelRatio!==undefined&& window.devicePixelRatio!=1){
        this.Ratio = window.devicePixelRatio;
      }
    
      this.CANV_SIZE=500*this.Ratio;
      this.Img_bk = new Image(); this.Img_bk.src = 'bk.gif';
      this.canv_board = document.createElement('canvas');
      this.canv_board2 = document.createElement('canvas');
      this.canv_focus = document.createElement('canvas');
      this.canv_pieces = document.createElement('canvas');
      this.canv_shadow = document.createElement('canvas');
      this.canv_hover_piece = document.createElement('canvas');
      this.canv_overlay = document.createElement('canvas');
      this.canv_bk = document.createElement('canvas');
      this.canv_cover = document.createElement('canvas');
      this.canv_score = document.createElement('canvas');
      this.canv_cache = document.createElement('canvas');
    }
  
    public init(){
      
      this.ctx = (<HTMLCanvasElement>document.querySelector('#canv')).getContext('2d');
  
      this.canv_board.width = this.CANV_SIZE;
      this.canv_board.height = this.CANV_SIZE;
  
      this.canv_board2.width = this.CANV_SIZE;
      this.canv_board2.height = this.CANV_SIZE;
  
      this.canv_focus.width = this.CANV_SIZE;
      this.canv_focus.height = this.CANV_SIZE;
  
      this.canv_pieces.width = this.CANV_SIZE;
      this.canv_pieces.height = this.CANV_SIZE;
  
      this.canv_shadow.width = this.CANV_SIZE;
      this.canv_shadow.height = this.CANV_SIZE;
  
      this.canv_hover_piece.width = this.CANV_SIZE;
      this.canv_hover_piece.height = this.CANV_SIZE;
  
      this.canv_overlay.width = this.CANV_SIZE;
      this.canv_overlay.height = this.CANV_SIZE;
  
      this.canv_bk.width = this.CANV_SIZE;
      this.canv_bk.height = this.CANV_SIZE;
  
      this.canv_cover.width = this.CANV_SIZE;
      this.canv_cover.height = this.CANV_SIZE;
  
      this.canv_score.width = this.CANV_SIZE;
      this.canv_score.height = this.CANV_SIZE;
  
      this.canv_cache.width = this.CANV_SIZE;
      this.canv_cache.height = this.CANV_SIZE;
  
      this.CellSize = this.CANV_SIZE / 6;
      //retina対応
      this.ctx!.canvas.style.width = this.CANV_SIZE/this.Ratio + "px";
      this.ctx!.canvas.style.height = this.CANV_SIZE/this.Ratio + "px";
      this.ctx!.canvas.width = this.CANV_SIZE ;
      this.ctx!.canvas.height = this.CANV_SIZE ;
    }
  
    /** 
     * 画面描画。
     */
    public flush(gameState:GameState,initflg:boolean, cache_flg:boolean) {
      let wkMap = new Int8Array(gameState.thisMap);
      this.ctx!.clearRect(0, 0, this.CANV_SIZE, this.CANV_SIZE);
  
      if (cache_flg === false) {
        this.cache_on = false;
      }
      // キャッシュに保存
      if (cache_flg === false || this.cache_on === false) {
        // 盤面を描画
        this.ctx!.drawImage(this.drawBoard(initflg), 0, 0, this.CANV_SIZE, this.CANV_SIZE);
  
        // テカリを描画
        this.ctx!.drawImage(this.drawBoard2(initflg), 0, 0, this.CANV_SIZE, this.CANV_SIZE);
  
        // 選択したコマを除外
        if (gameState.hover_piece !== null) {
          wkMap[gameState.hover_piece!] = 0;
        }
  
        // 残像を表示
        this.ctx!.drawImage(this.drawShadow(wkMap, gameState.thisHand), 0, 0, this.CANV_SIZE, this.CANV_SIZE);
  
  
        // コマを表示
        this.ctx!.drawImage(this.drawPieceAll(wkMap), 0, 0, this.CANV_SIZE, this.CANV_SIZE);
  
        // キャッシュに保存
        let ctx_canv = this.canv_cache!.getContext('2d');
        ctx_canv!.clearRect(0, 0, this.CANV_SIZE, this.CANV_SIZE);
        ctx_canv!.drawImage(this.ctx!.canvas, 0, 0, this.CANV_SIZE, this.CANV_SIZE);
        // キャッシュ有効化
        this.cache_on = true;
      } else {
        // キャッシュから描画
        this.ctx!.drawImage(this.canv_cache, 0, 0, this.CANV_SIZE, this.CANV_SIZE);
      }
  
      // 選択したコマを表示
      this.ctx!.drawImage(this.drawHoverPiece(gameState), 0, 0, this.CANV_SIZE, this.CANV_SIZE);
  
      if ((gameState.mouse_x !== 0 || gameState.mouse_y !== 0) && gameState.demo === false) {
        // フォーカスを描画
        this.ctx!.drawImage(this.drawFocus(gameState), 0, 0, this.CANV_SIZE, this.CANV_SIZE);
      }
  
      //スコアを表示
      if(gameState.goaled||gameState.winner!==null){
        if(gameState.demo===false&&gameState.autoLog==false){
          this.ctx!.drawImage(this.drawScore(gameState), 0, 0, this.CANV_SIZE, this.CANV_SIZE);
        }
      }
      // メッセージを描画
      this.ctx!.drawImage(this.drawOverlay(gameState), 0, 0, this.CANV_SIZE, this.CANV_SIZE);
  
      // カバーを描画
      if (gameState.demo === true) {
        this.ctx!.drawImage(this.drawCover(gameState), 0, 0, this.CANV_SIZE, this.CANV_SIZE);
      }
  
  
    }
  
    /** 
     * 背景描画
     */
    private drawBk() {
      let ctx_bk = this.canv_bk!.getContext('2d');
      if (this.Img_bk_loaded) {
        ctx_bk!.drawImage(this.Img_bk as HTMLImageElement, 0, 0, this.CANV_SIZE/this.Ratio, this.CANV_SIZE/this.Ratio, 0, 0, this.CANV_SIZE, this.CANV_SIZE);
      }
      return this.canv_bk;
    }
    /** 
     * カバー描画
     */
    private drawCover(gameState:GameState) {
      // 背景
      let ctx_cover = this.canv_cover!.getContext('2d');
      ctx_cover!.clearRect(0, 0, this.CANV_SIZE, this.CANV_SIZE);
      ctx_cover!.globalAlpha = 0.50;
      ctx_cover!.fillStyle = '#000000';
      ctx_cover!.fillRect(0, 0, this.CANV_SIZE, this.CANV_SIZE);
  
      // 枠
      let x = this.CellSize * 2;
      let y = this.CellSize * 3.5;
      ctx_cover!.shadowBlur = 20;
      ctx_cover!.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx_cover!.shadowOffsetX = 5;
      ctx_cover!.shadowOffsetY = 5;
      ctx_cover!.globalAlpha = 0.8;
      ctx_cover!.fillStyle = this.COLOR_WHITE;
      ctx_cover!.beginPath();
      this.fillRoundRect(ctx_cover as CanvasRenderingContext2D, x, y, this.CellSize * 2, this.CellSize * 1, this.CellSize/20);
      ctx_cover!.shadowColor = 'rgba(0, 0, 0, 0)';
      ctx_cover!.shadowBlur = 0;
      ctx_cover!.shadowOffsetX = 0;
      ctx_cover!.shadowOffsetY = 0;
  
  
  
  
      // 文字
      let fontsize = Math.round(this.CellSize * 0.5);
      let message = 'Play';
      message+=(gameState.demo_inc%10==0)?" ":"";
      ctx_cover!.shadowBlur = 0;
      ctx_cover!.shadowOffsetX = 0;
      ctx_cover!.shadowOffsetY = 0;
      ctx_cover!.shadowColor = 'rgba(0, 0, 0, 0)';
      ctx_cover!.font = 'bold ' + fontsize + 'px Play,sans-serif';
      ctx_cover!.globalAlpha = 1;
      ctx_cover!.fillStyle = this.COLOR_LINE;
      ctx_cover!.textBaseline = 'middle';
      ctx_cover!.textAlign = 'center';
      ctx_cover!.beginPath();
      ctx_cover!.fillText(message, this.CellSize * 3, this.CellSize * 4);
      // 文字２
      message = 'colamone';
      fontsize = Math.round(this.CellSize * 1);
      ctx_cover!.font = 'bold ' + fontsize + 'px Play,sans-serif';
      ctx_cover!.fillStyle = this.COLOR_WHITE;
      ctx_cover!.shadowBlur = 0;
      ctx_cover!.beginPath();
      ctx_cover!.fillText(message, this.CellSize * 3, this.CellSize * 2);
  
  
      return this.canv_cover;
    }
  
    /** 
     * スコア描画
     */
    private drawScore(gameState:GameState) {
      // 背景
      let ctx_score = this.canv_score!.getContext('2d');
      let message ="";
      let fontsize = Math.round(this.CellSize *1.5);
      let blue=this.COLOR_BLUE2;
      let red=this.COLOR_RED2;
      ctx_score!.clearRect(0, 0, this.CANV_SIZE, this.CANV_SIZE);
  
      ctx_score!.globalAlpha = 0.4;
      ctx_score!.textBaseline = 'middle';
      ctx_score!.textAlign = 'center';
      ctx_score!.shadowBlur = 10;
      ctx_score!.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx_score!.font = 'bold ' + fontsize + 'px Play,sans-serif';
  
      // 文字
      ctx_score!.globalAlpha = 0.3;
      ctx_score!.shadowBlur = 2;
      ctx_score!.shadowColor = 'rgba(255, 255, 255, 1)';
      ctx_score!.fillStyle = red;
      message = String(gameState.redScore);
      ctx_score!.beginPath();
      ctx_score!.fillText(message, this.CellSize * 1, this.CellSize * 3.8);
      // 文字
      message = "8";
      ctx_score!.beginPath();
      ctx_score!.fillText(message, this.CellSize * 2, this.CellSize * 5.3);
      //線
      ctx_score!.lineWidth=this.CellSize*0.2;
      ctx_score!.strokeStyle = red;
      ctx_score!.beginPath();
      ctx_score!.moveTo(this.CellSize * 0.4, this.CellSize * 5.55);
      ctx_score!.lineTo(this.CellSize * 2.6, this.CellSize * 3.55);
      ctx_score!.closePath();
      ctx_score!.stroke();
  
  
      // 文字
      message = String(gameState.blueScore);
      ctx_score!.fillStyle = blue;
      ctx_score!.beginPath();
      ctx_score!.fillText(message, this.CellSize * 4, this.CellSize * 0.7);
      // 文字
      message = "8";
      ctx_score!.beginPath();
      ctx_score!.fillText(message, this.CellSize * 5, this.CellSize * 2.3);
      // 文字
      ctx_score!.lineWidth=this.CellSize*0.2;
      ctx_score!.strokeStyle = blue;
      ctx_score!.beginPath();
      ctx_score!.moveTo(this.CellSize * 3.4, this.CellSize * 2.55);
      ctx_score!.lineTo(this.CellSize * 5.6, this.CellSize * 0.55);
      ctx_score!.closePath();
      ctx_score!.stroke();
      return this.canv_score;
    }
  
  
  
    /** 
     * フォーカスを描画
     */
    private drawFocus(gameState:GameState) {
      // 選択マスを強調
      let x = gameState.mouse_x - (gameState.mouse_x % this.CellSize);
      let y = gameState.mouse_y - (gameState.mouse_y % this.CellSize);
      let ctx_focus = this.canv_focus!.getContext('2d');
      let grad = ctx_focus!.createRadialGradient(x, y, 0, x,y, this.CellSize);
      grad.addColorStop(0.3, this.COLOR_SELECT);
      grad.addColorStop(1, this.COLOR_SELECT2);
      ctx_focus!.clearRect(0, 0, this.CANV_SIZE, this.CANV_SIZE);
      ctx_focus!.globalAlpha = 0.35;
      ctx_focus!.fillStyle = grad;
      ctx_focus!.lineWidth = 1;
      ctx_focus!.beginPath();
      ctx_focus!.fillRect(x, y, this.CellSize, this.CellSize);
  
  
      if (gameState.isTouch === true && gameState.hover_piece === null) {
        return this.canv_focus;
      }
  
      // 移動可能マスを強調
      let target = (x / this.CellSize) * 10 + (y / this.CellSize);
      if (gameState.thisMap[target] * gameState.turn_player > 0) {
        let canm = Aijs.getCanMovePanelX(target, gameState.thisMap);
        for (let i = 0; i <= canm.length - 1; i++) {
          x = Math.floor(canm[i] / 10);
          y = Math.floor(canm[i] % 10);
          ctx_focus!.globalAlpha = 0.6;
          ctx_focus!.strokeStyle = this.COLOR_SELECT;
          ctx_focus!.lineWidth = this.CellSize/20;
          ctx_focus!.beginPath();
          ctx_focus!.arc(x * this.CellSize + (this.CellSize / 2), y * this.CellSize + (this.CellSize / 2),
           (this.CellSize / 2) - (this.CellSize/10), 0, Math.PI * 2, false);
          ctx_focus!.stroke();
        }
      }
      return this.canv_focus;
    }
  
    /** 
     * 盤面を描画してCANVASを返す。
     */
    private drawBoard(initflg:boolean) {
      if (initflg === false) {
        return this.canv_board;
      }
      let ctx_board = this.canv_board!.getContext('2d');
      ctx_board!.clearRect(0, 0, this.CANV_SIZE, this.CANV_SIZE);
  
      let grad = ctx_board!.createLinearGradient(0, 0, this.CANV_SIZE, this.CANV_SIZE);
      grad.addColorStop(0, this.COLOR_PANEL_6);
      grad.addColorStop(0.3, this.COLOR_PANEL_5);
      grad.addColorStop(1, this.COLOR_PANEL_4);
  
      for (let x = 0; x < 6; x++) {
        for (let y = 0; y < 6; y++) {
          // パネル描画
          ctx_board!.strokeStyle = this.COLOR_LINE;
          if (y === 0) {
            ctx_board!.fillStyle = this.COLOR_PANEL_1;
          } else if (y == 5) {
            ctx_board!.fillStyle = this.COLOR_PANEL_2;
          } else if ((x + y) % 2 === 0) {
            ctx_board!.fillStyle = this.COLOR_PANEL_3;
          } else {
            ctx_board!.fillStyle = this.COLOR_PANEL_4;
            ctx_board!.fillStyle = grad;
          }
          ctx_board!.beginPath();
          ctx_board!.fillRect(x * this.CellSize, y * this.CellSize, this.CellSize, this.CellSize);
          ctx_board!.strokeRect(x * this.CellSize, y * this.CellSize, this.CellSize, this.CellSize);
        }
      }
  
      return this.canv_board;
    }
  
    /** 
     * 盤面をテカテカにする。
     */
    private drawBoard2(initflg:boolean) {
      if (initflg === false) {
        return this.canv_board2;
      }
      let ctx_board2 = this.canv_board2!.getContext('2d');
      ctx_board2!.clearRect(0, 0, this.CANV_SIZE, this.CANV_SIZE);
      ctx_board2!.globalAlpha = 0.07;
      ctx_board2!.fillStyle = this.COLOR_WHITE;
      ctx_board2!.beginPath();
      ctx_board2!.arc(this.CellSize * 1, -3 * this.CellSize, 7 * this.CellSize, 0, Math.PI * 2, false);
      ctx_board2!.fill();
  
      return this.canv_board2;
    }
  
  
    /** 
     * 浮遊しているコマを描画する。
     */
    private drawHoverPiece(gameState:GameState) {
      let ctx_hover = this.canv_hover_piece!.getContext('2d');
      ctx_hover!.clearRect(0, 0, this.CANV_SIZE, this.CANV_SIZE);
      let x = gameState.mouse_x - (this.CellSize / 2);
      let y = gameState.mouse_y - (this.CellSize / 2);
      if (gameState.hover_piece !== null) {
        this.drawPiece(ctx_hover as CanvasRenderingContext2D, x, y, gameState.thisMap[gameState.hover_piece!], false);
      }
      return this.canv_hover_piece;
    }
  
    /** 
     * コマを描画する。
     */
    private drawPiece(wkCtx:CanvasRenderingContext2D, x:number, y:number, number:number, goal:boolean) {
      let wkColor;
  
      // 外枠を描画
      if (number === 0) {
        return wkCtx;
      } else if (number > 0) {
        wkColor = this.COLOR_BLUE;
      } else {
        wkColor = this.COLOR_RED;
      }
  
      let grad = this.ctx!.createLinearGradient(x, y, x + this.CellSize, y + this.CellSize);
      grad.addColorStop(0, 'rgb(255, 255, 255)');
      grad.addColorStop(0.4, wkColor);
      grad.addColorStop(1, wkColor);
  
      wkCtx.shadowBlur = 10;
      wkCtx.shadowColor = 'rgba(0, 0, 0, 1)';
      wkCtx.shadowOffsetX = 2;
      wkCtx.shadowOffsetY = 2;
      wkCtx.fillStyle = grad;
      wkCtx.beginPath();
      this.fillRoundRect(wkCtx, x + this.CellSize / 10, y + this.CellSize / 10, this.CellSize - 1 * this.CellSize / 5, this.CellSize - 1 * this.CellSize / 5, this.CellSize/20);
  
      wkCtx.shadowColor = 'rgba(0, 0, 0, 0)';
      wkCtx.shadowBlur = 0;
      wkCtx.shadowOffsetX = 0;
      wkCtx.shadowOffsetY = 0;
  
      // 曇りエフェクト
      if (this.Img_bk_loaded) {
        wkCtx.globalAlpha = 0.35;
        wkCtx.save();
        wkCtx.clip();
        wkCtx.drawImage(this.drawBk(), x + this.CellSize / 10, y + this.CellSize / 10, this.CellSize - 1 * this.CellSize / 5, this.CellSize - 1 * this.CellSize / 5);
        wkCtx.restore();
        wkCtx.globalAlpha = 1;
      }
  
      // 文字を描画。
      wkCtx.fillStyle = this.COLOR_WHITE;
      
      let fontsize = Math.round(this.CellSize * 0.18);
      wkCtx.textBaseline = 'middle';
      wkCtx.textAlign = 'center';
      wkCtx.font = fontsize + "pt 'Play',Arial";
      wkCtx.beginPath();
  
      // 数字を印字
      wkCtx.fillText(String(Math.abs(number)), x + (this.CellSize / 2), y + (this.CellSize / 2));
  
      // 点を描画
      for (let i = 0; i <= this.PIECES[number].length - 1; i++) {
        if (this.PIECES[number][i] === 0) {
          continue;
        }
        let x_dot = x + this.CellSize / 4.16 + (Math.floor(this.CellSize - 1 * this.CellSize / 5) / 3) * Math.floor(i % 3.0);
        let y_dot = y + this.CellSize / 4.16 + (Math.floor(this.CellSize - 1 * this.CellSize / 5) / 3) * Math.floor(i / 3.0);
  
        wkCtx.fillStyle = this.COLOR_WHITE;
  
        wkCtx.beginPath();
        wkCtx.arc(x_dot, y_dot, this.CellSize * 0.06, 0, Math.PI * 2, false);
        wkCtx.fill();
      }
  
      if (goal) { // 得点を印字
        wkCtx.shadowBlur = 10;
        wkCtx.shadowColor = 'rgba(0, 0, 0, 1)';
        wkCtx.globalAlpha = 1;
        wkCtx.fillStyle = this.COLOR_WHITE;
        fontsize = Math.round(this.CellSize * 0.5);
        wkCtx.textBaseline = 'middle';
        wkCtx.textAlign = 'center';
        wkCtx.font = 'bolder ' + fontsize + 'pt Play,Arial ';
        wkCtx.beginPath();
        wkCtx.fillText(String(Math.abs(number)), x + (this.CellSize / 2), y + (this.CellSize / 2));
        wkCtx.globalAlpha = 1;
        wkCtx.shadowColor = 'rgba(0, 0, 0, 0)';
        wkCtx.shadowBlur = 0;
      }
  
      return wkCtx;
    }
    // 角丸
    private fillRoundRect(ctx:CanvasRenderingContext2D, x:number, y:number, w:number, h:number, r:number) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, 0, false);
      ctx.lineTo(x + w, y + h - r);
      ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5, false);
      ctx.lineTo(x + r, y + h);
      ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI, false);
      ctx.lineTo(x, y + r);
      ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false);
      ctx.closePath();
      ctx.fill();
    }
  
    /** 
     * コマをすべて描画
     */
    private drawPieceAll(wkMap:MapArray) {
      let ctx_pieces = this.canv_pieces!.getContext('2d');
      ctx_pieces!.clearRect(0, 0, this.CANV_SIZE, this.CANV_SIZE);
      for (let x = 0; x < 6; x++) {
        for (let y = 0; y < 6; y++) {
          if (wkMap[x * 10 + y] !== 0) {
            let goal = false;
            if (wkMap[x * 10 + y] > 0 && y === 0) {
              goal = true;
            } else if (wkMap[x * 10 + y] < 0 && y == 5) {
              goal = true;
            }
            ctx_pieces = this.drawPiece(ctx_pieces as CanvasRenderingContext2D, x * this.CellSize, y * this.CellSize, wkMap[x * 10 + y], goal);
          }
        }
      }
      return this.canv_pieces;
    }
    /** 
     * 残像を描画する。
     */
    private drawShadow(wkMap:MapArray, hand:Hand|undefined) {
      let ctx_shadow = this.canv_shadow!.getContext('2d');
      ctx_shadow!.clearRect(0, 0, this.CANV_SIZE, this.CANV_SIZE);
      if(hand ===undefined){
        return this.canv_shadow;
      }
      let x0 = (hand[0] / 10 | 0);
      let y0 = hand[0] % 10;
      let x1 = (hand[1] / 10 | 0);
      let y1 = hand[1] % 10;
      let h = this.CellSize - 1 * this.CellSize / 5;
      let w = this.CellSize - 1 * this.CellSize / 5;
      let x = x1 * this.CellSize + this.CellSize / 10;
      let y = y1 * this.CellSize + this.CellSize / 10;
      let shadow_start_x = x + w / 2;
      let shadow_start_y = y + h / 2;
      let shadow_end_x = shadow_start_x;
      let shadow_end_y = shadow_start_y;
      let number = wkMap[hand[1]];
      let wkColor = '';
      let center = 0;
      let grad;
      if (hand.length != 2) {
        return this.canv_shadow;
      }
      if (number > 0) {
        wkColor = this.COLOR_BLUE; // "#EAEFFD";   
      } else {
        wkColor = this.COLOR_RED; // "#FDEAFA";           
      }
      if (x0 == x1 || y0 == y1) { // 直角移動
        if ((x0 + y0) % 2 === 0 && y0 !== 0 && y0 != 5) {
          center = 0.5;
        } else {
          center = 0.3;
        }
        if (x0 < x1) {
          x = x - w + 10;
          shadow_end_x = shadow_end_x - w;
        }
        if (x0 > x1) {
          x = x + w - 10;
          shadow_end_x = shadow_end_x + w;
        }
        if (y0 < y1) {
          y = y - h + 10;
          shadow_end_y = shadow_end_y - h;
        }
        if (y0 > y1) {
          y = y + h - 10;
          shadow_end_y = shadow_end_y + h;
        }
        grad = ctx_shadow!.createLinearGradient(shadow_start_x, shadow_start_y, shadow_end_x, shadow_end_y);
  
        grad.addColorStop(0, wkColor);
        grad.addColorStop(center, wkColor);
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx_shadow!.fillStyle = grad;
        ctx_shadow!.fillRect(x, y, h, w);
      } else { // 斜め移動
        if ((x0 + y0) % 2 === 0 && y0 !== 0 && y0 != 5) {
          center = 0.3;
        } else {
          center = 0.5;
        }
        let [px1, py1, px2, py2, px3, py3, px4, py4]=[0,0,0,0,0,0,0,0];
        if (x0 < x1 && y0 < y1) {
          px1 = x;
          py1 = y - h;
          px2 = x + w;
          py2 = y;
          px3 = x;
          py3 = y + h;
          px4 = x - w;
          py4 = y;
          shadow_end_x = shadow_end_x - w;
          shadow_end_y = shadow_end_y - h;
          shadow_start_x = shadow_start_x + w * 2;
          shadow_start_y = shadow_start_y + h * 2;
        }
        if (x0 > x1 && y0 > y1) {
          px1 = x + w;
          py1 = y;
          px2 = x + w + w;
          py2 = y + h;
          px3 = x + w;
          py3 = y + h + h;
          px4 = x;
          py4 = y + h;
          shadow_end_x = shadow_end_x + w;
          shadow_end_y = shadow_end_y + h;
          shadow_start_x = shadow_start_x - w * 2;
          shadow_start_y = shadow_start_y - h * 2;
        }
        if (x0 < x1 && y0 > y1) {
          px1 = x;
          py1 = y;
          px2 = x + w;
          py2 = y + h;
          px3 = x;
          py3 = y + h + h;
          px4 = x - w;
          py4 = y + h;
          shadow_end_x = shadow_end_x - w;
          shadow_end_y = shadow_end_y + h;
          shadow_start_x = shadow_start_x + w * 2;
          shadow_start_y = shadow_start_y - h * 2;
        }
        if (x0 > x1 && y0 < y1) {
          px1 = x + w;
          py1 = y - h;
          px2 = x + w + w;
          py2 = y;
          px3 = x + w;
          py3 = y + h;
          px4 = x;
          py4 = y;
          shadow_end_x = shadow_end_x + w;
          shadow_end_y = shadow_end_y - h;
          shadow_start_x = shadow_start_x - w * 2;
          shadow_start_y = shadow_start_y + h * 2;
        }
        ctx_shadow!.beginPath();
        ctx_shadow!.moveTo(px1, py1);
        ctx_shadow!.lineTo(px2, py2);
        ctx_shadow!.lineTo(px3, py3);
        ctx_shadow!.lineTo(px4, py4);
        ctx_shadow!.lineTo(px1, py1);
        ctx_shadow!.closePath();
        grad = ctx_shadow!.createLinearGradient(shadow_start_x, shadow_start_y, shadow_end_x, shadow_end_y);
        grad.addColorStop(0, wkColor);
        grad.addColorStop(center, wkColor);
        grad.addColorStop(0.97, 'rgba(255, 255, 255, 0)');
        ctx_shadow!.fillStyle = grad;
        ctx_shadow!.fill();
      }
  
      return this.canv_shadow;
    }
    /** 
     * メッセージを描画
     */
    private drawOverlay(gameState:GameState) {
      let ctx_overlay = this.canv_overlay!.getContext('2d');
      let x = this.CellSize * 1.3;
      let y = this.CellSize * 2.5;
  
      ctx_overlay!.clearRect(0, 0, this.CANV_SIZE, this.CANV_SIZE);
  
      if (gameState.message === '') {
        return this.canv_overlay;
      }
      ctx_overlay!.shadowBlur = 10;
      ctx_overlay!.shadowColor = 'rgba(100, 100, 100, 0.5)';
      ctx_overlay!.shadowOffsetX = 5;
      ctx_overlay!.shadowOffsetY = 5;
  
      ctx_overlay!.globalAlpha = 0.9;
      ctx_overlay!.fillStyle = this.COLOR_WHITE;
      this.fillRoundRect(ctx_overlay as CanvasRenderingContext2D, x, y, this.CellSize * 3.4, this.CellSize * 1, this.CellSize/20);
  
      let fontsize = Math.round(this.CellSize * 0.36);
      ctx_overlay!.shadowBlur = 0;
      ctx_overlay!.shadowOffsetX = 0;
      ctx_overlay!.shadowOffsetY = 0;
      ctx_overlay!.shadowColor = 'rgba(0, 0, 0, 0)';
      ctx_overlay!.font = 'bold ' + fontsize + 'px Play,sans-serif';
      ctx_overlay!.globalAlpha = 1;
      ctx_overlay!.fillStyle = this.COLOR_LINE;
      ctx_overlay!.textBaseline = 'middle';
      ctx_overlay!.textAlign = 'center';
      ctx_overlay!.beginPath();
      ctx_overlay!.fillText(gameState.message, this.CellSize * 3, this.CellSize * 3);
  
      return this.canv_overlay;
    }
  
  
  }