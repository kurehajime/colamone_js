/* @license Copyright (c) @kurehajime / source code: https://github.com/kurehajime/colamone_js */
import { Aijs, MapArray } from "./ai";
import { Hand } from "./ai";

// Class ------------------------------------------------
export class BoardGamejs{

  // Body ---------------------------------------
  private ctx:(CanvasRenderingContext2D|null) = null;
  private  isTouch = true;
  private  goaled=false;
  private  canv_board:(HTMLCanvasElement|null) = null;
  private  canv_board2:(HTMLCanvasElement|null) = null;
  private  canv_focus:(HTMLCanvasElement|null) = null;
  private  canv_pieces:(HTMLCanvasElement|null) = null;
  private  canv_shadow:(HTMLCanvasElement|null) = null;
  private  canv_hover_piece:(HTMLCanvasElement|null) = null;
  private  canv_overlay:(HTMLCanvasElement|null) = null;
  private  canv_bk :(HTMLCanvasElement|null) = null;
  private  canv_cover:(HTMLCanvasElement|null) = null;
  private  canv_score:(HTMLCanvasElement|null) = null;
  private  canv_cache:(HTMLCanvasElement|null) = null;
  private  cache_on = false;
  private  img_bk_loaded = false;
  private  hover_piece:(number|null) = null;
  private  cellSize:number = 0;
  private  turn_player:number = 0;
  private  blueScore = 0;
  private  redScore = 0;
  private  winner:(number|null) = null;
  private  message = '';
  private  thinktime = 0.0;
  private  demo = true;
  private  autoLog=false;
  private  intervalID:(number|null) = null;
  private  intervalID_log:(number|null) = null;  
  private  thisHand:(Hand|undefined) = undefined;
  private  demo_inc=0;
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
  private RATIO=1;
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

/*  let thisMap = {
    0: -1, 10: -2, 20: -3, 30: -4, 40: -5, 50: -6,
    1: 0, 11: -8, 21: 0, 31: 0, 41: -7, 51: 0,
    2: 0, 12: 0, 22: 0, 32: 0, 42: 0, 52: 0,
    3: 0, 13: 0, 23: 0, 33: 0, 43: 0, 53: 0,
    4: 0, 14: 7, 24: 0, 34: 0, 44: 8, 54: 0,
    5: 6, 15: 5, 25: 4, 35: 3, 45: 2, 55: 1
  };*/
  private thisMap:MapArray = new Int8Array([
    -1,0,0,0,0,6,0,0,0,0,-2,-8,
    0,0,7,5,0,0,0,0,-3,0,0,0,
    0,4,0,0,0,0,-4,0,0,0,0,
    3,0,0,0,0,-5,-7,0,0,8,2,
    0,0,0,0,-6,0,0,0,0,1
  ]);

  private map_list:{ [index: string]: number; }  = {};
  private readonly LIMIT_1000DAY = 3;
  private mouse_x = 0;
  private mouse_y = 0;
  private startMap:MapArray =new Int8Array();
  private logPointer = 0;
  private logArray:Array<MapArray> = [];
  private logArray2:Array<Hand>  = [];
  private img_bk:(HTMLImageElement|null) = null;
  private storage:any = null;
  
constructor(){
  if( window.devicePixelRatio!==undefined&& window.devicePixelRatio!=1){
    this.RATIO = window.devicePixelRatio;
  }

  this.CANV_SIZE=500*this.RATIO;
  this.img_bk = new Image(); this.img_bk.src = 'bk.gif';
  try {
    if (window == parent && ('localStorage' in window) && window.localStorage !== null) {
      this.storage = localStorage;
      this.storage.setItem('test', 0); // Safariのプライベートモードは、できないのにできるって言うからかまをかけてみる。
    }
  } catch (e) {
    this.storage = null;
  }
  if (this.storage === null) {
    // localStorageが使えない場合
    this.storage = {}; // ダミー
    this.storage.getItem = function () { return undefined; };
    this.storage.setItem = function () { return undefined; };

    if (navigator.cookieEnabled) {
      this.storage.hasItem = function (sKey:string) {
        return (new RegExp('(?:^|;\\s*)' + escape(sKey).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=')).test(document.cookie);
      };
      this.storage.getItem = function (sKey:string) {
        if (!sKey || !(new RegExp('(?:^|;\\s*)' + escape(sKey).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=')).test(document.cookie)) { return null; }
        return unescape(document.cookie.replace(new RegExp('(?:^|.*;\\s*)' + escape(sKey).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*'), '$1'));
      };
      this.storage.setItem = function (sKey:string, sValue:any) {
        if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return; }
        document.cookie = escape(sKey) + '=' + escape(sValue);
      };
    }
  }
}

  /** 
   * ゲーム開始
   */
  public Run() {

    this.zoom(); // 小さい端末でズーム
    if (window.innerHeight < window.innerWidth) {
      document.querySelector('.manual')?.classList.remove("hide");
    } else {
      document.querySelector('.manual')?.classList.add("hide");
    }
    this.ctx = (<HTMLCanvasElement>document.querySelector('#canv'))?.getContext('2d');

    this.canv_board = document.createElement('canvas');
    this.canv_board.width = this.CANV_SIZE;
    this.canv_board.height = this.CANV_SIZE;


    this.canv_board2 = document.createElement('canvas');
    this.canv_board2.width = this.CANV_SIZE;
    this.canv_board2.height = this.CANV_SIZE;

    this.canv_focus = document.createElement('canvas');
    this.canv_focus.width = this.CANV_SIZE;
    this.canv_focus.height = this.CANV_SIZE;

    this.canv_pieces = document.createElement('canvas');
    this.canv_pieces.width = this.CANV_SIZE;
    this.canv_pieces.height = this.CANV_SIZE;

    this.canv_shadow = document.createElement('canvas');
    this.canv_shadow.width = this.CANV_SIZE;
    this.canv_shadow.height = this.CANV_SIZE;

    this.canv_hover_piece = document.createElement('canvas');
    this.canv_hover_piece.width = this.CANV_SIZE;
    this.canv_hover_piece.height = this.CANV_SIZE;

    this.canv_overlay = document.createElement('canvas');
    this.canv_overlay.width = this.CANV_SIZE;
    this.canv_overlay.height = this.CANV_SIZE;

    this.canv_bk = document.createElement('canvas');
    this.canv_bk.width = this.CANV_SIZE;
    this.canv_bk.height = this.CANV_SIZE;

    this.canv_cover = document.createElement('canvas');
    this.canv_cover.width = this.CANV_SIZE;
    this.canv_cover.height = this.CANV_SIZE;

    this.canv_score = document.createElement('canvas');
    this.canv_score.width = this.CANV_SIZE;
    this.canv_score.height = this.CANV_SIZE;

    this.canv_cache = document.createElement('canvas');
    this.canv_cache.width = this.CANV_SIZE;
    this.canv_cache.height = this.CANV_SIZE;

    this.cellSize = this.CANV_SIZE / 6;
    this.turn_player = 1;
    this.demo = true;

    //retina対応
    this.ctx!.canvas.style.width = this.CANV_SIZE/this.RATIO + "px";
    this.ctx!.canvas.style.height = this.CANV_SIZE/this.RATIO + "px";
    this.ctx!.canvas.width = this.CANV_SIZE ;
    this.ctx!.canvas.height = this.CANV_SIZE ;

    if ('ontouchstart' in window) {
      this.isTouch = true;
    } else {
      this.isTouch = false;
    }
    // イベントを設定
    if (this.isTouch) {
      (<HTMLElement>document.querySelector('#canv')).addEventListener('touchstart', this.ev_mouseClick);
      (<HTMLElement>document.querySelector('#canv')).addEventListener('touchmove', this.ev_touchMove, {passive: false});
    } else {
      (<HTMLElement>document.querySelector('#canv')).addEventListener('mousemove', this.ev_mouseMove);
      (<HTMLElement>document.querySelector('#canv')).addEventListener('mouseup', this.ev_mouseClick);
    }
    (<HTMLElement>document.querySelector('#level')).addEventListener('change', this.ev_radioChange);
    (<HTMLElement>document.querySelector('#prevprev')).addEventListener('click',()=>{ this.move_start()});
    (<HTMLElement>document.querySelector('#prev')).addEventListener('click',()=>{ this.move_prev()});
    (<HTMLElement>document.querySelector('#next')).addEventListener('click', ()=>{this.move_next()});
    (<HTMLElement>document.querySelector('#nextnext')).addEventListener('click', ()=>{this.move_end()});
    (<HTMLElement>document.querySelector('#replay')).addEventListener('click', ()=>{this.jumpkento()});
    (<HTMLElement>document.querySelector('#tweetlog')).addEventListener('click',()=>{ this.tweetlog()});
    (<HTMLElement>document.querySelector('#newgame')).addEventListener('click',()=>{ this.reloadnew()});
    (<HTMLElement>document.querySelector('#collapsible')).addEventListener('click',  ()=> {
      (<HTMLElement>document.querySelector('.manual')).classList.toggle("hide");
      if (window.innerHeight > window.innerWidth) {
        var element = document.documentElement;
        var bottom = element.scrollHeight - element.clientHeight;
        window.scroll(0, bottom);
      }
    });


    window.addEventListener('orientationchange', this.zoom);

    this.shuffleBoard();

    // 連勝記録初期化
    if (!this.storage.getItem('level_1')) {
      this.storage.setItem('level_1', 0);
    }
    if (!this.storage.getItem('level_2')) {
      this.storage.setItem('level_2', 0);
    }
    if (!this.storage.getItem('level_3')) {
      this.storage.setItem('level_3', 0);
    }
    if (!this.storage.getItem('level_4')) {
      this.storage.setItem('level_4', 0);
    }
    if (!this.storage.getItem('level_5')) {
      this.storage.setItem('level_5', 0);
    }
    // レベル記憶
    if (this.storage.getItem('level_save') !== undefined && this.storage.getItem('level_save') !== 'undefined' && this.storage.getItem('level_save') !== null) {
      (<HTMLInputElement>document.querySelector('#level')).value=String(parseInt(this.storage.getItem('level_save')));
    } else {
      this.storage.setItem('level_save', 1);
      (<HTMLInputElement>document.querySelector('#level')).value= String(1);
    }

    //document.querySelector('#canv').classList.add("hue-rotate1");


    // パラメータを取得
    let paramObj = this.getParam();

    // 盤面を初期化
    if (paramObj.init) {
      this.startMap = this.getMapByParam(paramObj.init);
      this.thisMap = Aijs.copyMap(this.startMap);
    } else {
      this.startMap = Aijs.copyMap(this.thisMap);
    }
    // ログをデコード
    if (paramObj.log) {
      this.logArray = this.decodeLog(paramObj.log, this.startMap);
    }
    // レベル取得
    if (paramObj.lv) {
      (<HTMLSelectElement>document.querySelector('#level')).value=String(parseInt(paramObj.lv));
    }

    if (this.logArray.length !== 0) {
      (<HTMLElement>document.querySelector('#log')).classList.remove("hide");
      (<HTMLElement>document.querySelector('#prevprev')).classList.remove("hide");
      (<HTMLElement>document.querySelector('#prev')).classList.remove("hide");
      (<HTMLElement>document.querySelector('#next')).classList.remove("hide");
      (<HTMLElement>document.querySelector('#nextnext')).classList.remove("hide");
      (<HTMLElement>document.querySelector('#span_replay')).classList.add("hide");
      (<HTMLElement>document.querySelector('#span_tweetlog')).classList.add("hide");
      (<HTMLElement>document.querySelector('#next')).focus();
    } else {
      (<HTMLElement>document.querySelector('#log')).classList.add("hide");
      (<HTMLElement>document.querySelector('#prevprev')).classList.add("hide");
      (<HTMLElement>document.querySelector('#prev')).classList.add("hide");
      (<HTMLElement>document.querySelector('#next')).classList.add("hide");
      (<HTMLElement>document.querySelector('#nextnext')).classList.add("hide");
      (<HTMLElement>document.querySelector('#span_replay')).classList.add("hide");
      (<HTMLElement>document.querySelector('#span_tweetlog')).classList.add("hide");
    }

    // 画像読み込み成功時
    this.img_bk!.onload =  () => {
      this.img_bk_loaded = true;
      this.flush(true, false);
    };
    // 画像読み込み失敗時
    this.img_bk!.onerror =  () => {
      this.flush(true, false);
    };
    // もう既に読み込み終わってた時
    if (this.img_bk!.width !== 0) {
      this.img_bk_loaded = true;
      this.flush(true, false);
    }
    // 2.5秒後に強制描画※Googleの検索結果から飛ぶとなぜか描画が走らない事があるので。
    setTimeout( () => {
      if (this.img_bk!.width !== 0) {
        this.img_bk_loaded = true;
      }
      this.flush(true, false);
    }, 2500);
    this.updateMessage();
    this.setTweet(); // ツイートボタンを生成

    if (this.logArray.length === 0) {
      if(this.isBot()==false){
        window.setTimeout(()=>{
          if(this.demo==true){
            this.intervalID = window.setInterval(()=>{this.playDemo()}, 400);
            this.playDemo();
          }
        },500);
      }
    } else {
      this.demo = false;
      this.autoLog=true;
      this.intervalID_log = window.setInterval(()=>{this.playLog()}, 1000);      
    }
    this.goaled=false;
    this.flush(true, false);
  }

  /** 
   * Demoを再生
   */
  private playDemo() {
    if (this.intervalID !==null) {
      if (Math.random() > 0.3) {
        this.ai(2);
      } else {
        this.ai(1);
      }
    }
    this.demo_inc++;
    this.calcScore();
    this.flush(false, false);
    if (this.winner === 1 || this.winner === -1 || this.winner === 0) {
      this.goaled=true;
      this.winner = null;
      this.flush(false, false);
      this.shuffleBoard();
    }
    if(this.demo_inc>42){
      window.clearInterval(this.intervalID as number);
    }
  }

  /** 
   * Logを再生
   */
  private playLog() {

    if (this.intervalID_log !==null&&this.autoLog==true) {
      this.move_next();
    }else{
      clearInterval(this.intervalID_log as number);
    }
  }

  /** 
   * 小さい画面ではViewportを固定化
   */
  private zoom() {
    let viewport = document.querySelector('meta[name=viewport]');
    if (screen.width < 500 && screen.height < 500) {
      if (screen.width < screen.height) {
        viewport!.setAttribute('content', 'width=500,user-scalable=no');
      } else {
        viewport!.setAttribute('content', 'height=500,user-scalable=no');
      }
    } else if (screen.width < 500) {
      viewport!.setAttribute('content', 'width=500,user-scalable=no');
    } else if (screen.height < 500) {
      viewport!.setAttribute('content', 'height=500,user-scalable=no');
    }
    // iOS9のViewportはなぜか機能してくれない。
    if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
      let w = screen.width;
      let w2 = 520;
      if (Math.abs(window.orientation as number) !== 0) {
        w = screen.height;
        w2 = 900;
      }
      let rate = Math.round((w / w2) * 1000) / 1000.0;
      if (rate == Math.round(rate)) { // iOS 9のViewportは整数指定すると機能しない
        rate += 0.0001;
      }

      viewport!.setAttribute(
        'content',
        'initial-scale=' + rate + ', minimum-scale=' + rate + ', maximum-scale=' + rate + ', user-scalable=no'
      );
    }
  }

  /** 
   * マウス移動時処理
   */
  private ev_mouseMove = (e:Event) => {
    this.getMousePosition(e);
    this.flush(false, true);
  };
  /** 
   * タッチ移動時処理
   */
  private ev_touchMove = (e:Event) => {
    e.preventDefault();
    e.stopPropagation();
  }

  /** 
   * マウスクリック時処理
   */
  private ev_mouseClick = (e:Event|null):boolean => {
    this.getMousePosition(e);
    let target = Math.floor(this.mouse_x / this.cellSize) * 10+ Math.floor(this.mouse_y / this.cellSize);
    if (this.winner !== null || this.logArray.length !== 0) {
      this.reloadnew();
      return true;
    }
    if (this.demo === true) {
      this.demo = false;
      this.thisHand = undefined;
      this.thisMap = Aijs.copyMap(this.startMap);
      this.logArray2 = [];
      this.flush(false, false);
      this.winner = null;
      this.goaled=false;
      this.turn_player = 1;
      window.clearInterval(this.intervalID as number);
      this.flush(false, false);
      return true;
    }

    if (this.hover_piece === null) {
      if (this.thisMap[target] * this.turn_player > 0) {
        this.hover_piece = target;
      }
    } else {
      if (target == this.hover_piece) {
        this.hover_piece = null;
        this.flush(false, false);
        return true;
      }
      let canm = Aijs.getCanMovePanelX(this.hover_piece, this.thisMap);
      if (canm.indexOf(target) >= 0) {
        this.flush(false, true);
        if(this.isGoaled(this.thisMap,target,this.turn_player)){
            this.goaled=true;
            this.flush(false, true);
            setTimeout(()=>{
              this.goaled=false;
              this.flush(false, false);
            },2000);
        }


        this.thisMap[target] = this.thisMap[this.hover_piece];
        this.thisMap[this.hover_piece] = 0;
        this.turn_player = this.turn_player * -1;
        this.logArray2.push([this.hover_piece, target]);
        this.thisHand = [this.hover_piece, target];
        this.hover_piece = null;


        // AIが考える。
        this.message = 'thinking...';
        window.setTimeout( ()=> {
          this.flush(false, false);
        }, 50);
        this.updateMessage();
        if (this.winner === null) {
          window.setTimeout( ()=> {
            this.ai(parseInt((<HTMLSelectElement>document.querySelector('#level')).value));
            this.message = '';
            this.updateMessage();
            this.flush(false, false);
          }, 250);
        }
      }
    }
    this.flush(false, false);

    return true;
  }

  /** 
   * ラジオボタン変更時処理
   */
  private ev_radioChange =() => {
    let num = (<HTMLSelectElement>document.querySelector('#level')).value;
    this.storage.setItem('level_save', num);
    if (this.storage.getItem('level_' + num) > 0) {
      document.querySelector('#wins')!.innerHTML = this.storage.getItem('level_' + num) + ' win!';
    } else {
      document.querySelector('#wins')!.innerHTML = '';
    }
    this.thisMap = Aijs.copyMap(this.startMap);
    this.thisHand = undefined;
    this.map_list = {};
    this.logArray2 = [];
    this.flush(false, false);
  }

  /** 
   * AIに考えてもらう。
   */
  private ai(level:number) {
    let hand;
    let startTime = new Date();
    let endTime;
    // 終盤になったら長考してみる。
    let count = this.getNodeCount(this.thisMap) / 2;
    let plus = 0;
    switch (level) {
      case 1:
        if (count <= 7) {
          plus++;
        }
        break;
      case 2:
        if (count <= 8) {
          plus++;
        }
        break;
      case 3:
        if (count <= 10) {
          plus++;
        }
        if (count <= 6) {
          plus++;
        }
        break;
      case 4:
        if (count <= 11) {
          plus++;
        }
        if (count <= 7) {
          plus++;
        }
        break;
      case 5:
        if (count > 16) {
          plus--;
        }
        if (count <= 12) {
          plus++;
        }
        if (count <= 8) {
          plus++;
        }
        break;
      case 6:
        if (count > 16) {
          plus--;
        }
        if (count <= 12) {
          plus++;
        }
        if (count <= 8) {
          plus++;
        }
        break;
    }

    hand = Aijs.thinkAI(this.thisMap, this.turn_player, level + plus + 1,undefined,undefined,undefined)[0];
    this.thisHand = hand;
    if (hand) {
      if(this.isGoaled(this.thisMap,hand[1],this.turn_player)){
          this.goaled=true;
          this.flush(false, true);
          setTimeout(()=>{
            this.goaled=false;
            this.flush(false, false);
          },2000);
      }
      this.thisMap[hand[1]] = this.thisMap[hand[0]];
      this.thisMap[hand[0]] = 0;
      this.logArray2.push([hand[0], hand[1]]);
      // //フォーカス座標を移す。
      // mouse_x = Math.floor(hand[1] / 10)*cellSize+1
      // mouse_y = Math.floor(hand[1] % 10)*cellSize+1
    }
    this.turn_player = this.turn_player * -1;
    endTime = new Date();
    this.thinktime = (endTime.getTime() - startTime.getTime()) / 1000;
  }
  /** 
   * ゴールしたか
   */
  private isGoaled(map:MapArray,afterHand:number,turn:number){
      if(turn>0){
        if(afterHand%10===0){
            return true;
        }
      }else if(turn<0){
        if(afterHand%10===5){
            return true;
        }
      }

      return false;
  }
  /** 
   * 盤面をシャッフル。
   */
  private shuffleBoard() {
    // クリア
    for (let num in this.thisMap) {
      this.thisMap[num] = 0;
    }
    let arr = [1, 2, 3, 4, 5, 6, 7, 8];
    let red_num = [0, 10, 20, 30, 40, 50, 11, 41];
    let blue_num = [55, 45, 35, 25, 15, 5, 44, 14];
    for (let i = arr.length - 1; i >= 0; i--) {
      let r = Math.floor(Math.random() * (i + 1));
      let tmp = arr[i];
      arr[i] = arr[r];
      arr[r] = tmp;
    }
    for (let num in blue_num) {
      this.thisMap[blue_num[num]] = arr[num];
    }
    for (let num in red_num) {
      this.thisMap[red_num[num]] = -1 * arr[num];
    }
  }

  /** 
   * マウス位置取得
   */
  private getMousePosition(e:any) {
    if(e==null){
      return;
    }
    if (!e.clientX) { // SmartPhone
      if (e.touches) {
        e = e.touches[0];
      } else if (e.touches) {
        e = e.touches[0];
      } else {
        e = (<any>event)?.touches[0];
      }
    }
    let rect = e.target.getBoundingClientRect();
    this.mouse_x = e.clientX - rect.left;
    this.mouse_y = e.clientY - rect.top;
    this.mouse_x = this.mouse_x *  this.RATIO;
    this.mouse_y = this.mouse_y *  this.RATIO;
  }

  /** 
   * 画面描画。
   */
  private flush(initflg:boolean, cache_flg:boolean) {
    let wkMap = new Int8Array(this.thisMap);
    this.ctx!.clearRect(0, 0, this.CANV_SIZE, this.CANV_SIZE);

    if (cache_flg === false) {
      this.cache_on = false;
    }
    // キャッシュに保存
    if (cache_flg === false || this.cache_on === false) {
      // 盤面を描画
      this.ctx!.drawImage(this.drawBoard(initflg) as HTMLCanvasElement, 0, 0, this.CANV_SIZE, this.CANV_SIZE);

      // テカリを描画
      this.ctx!.drawImage(this.drawBoard2(initflg) as HTMLCanvasElement, 0, 0, this.CANV_SIZE, this.CANV_SIZE);

      // 選択したコマを除外
      if (this.hover_piece !== null) {
        wkMap[this.hover_piece] = 0;
      }

      // 残像を表示
      this.ctx!.drawImage(this.drawShadow(wkMap, this.thisHand) as HTMLCanvasElement, 0, 0, this.CANV_SIZE, this.CANV_SIZE);


      // コマを表示
      this.ctx!.drawImage(this.drawPieceAll(wkMap) as HTMLCanvasElement, 0, 0, this.CANV_SIZE, this.CANV_SIZE);

      // キャッシュに保存
      let ctx_canv = this.canv_cache!.getContext('2d');
      ctx_canv!.clearRect(0, 0, this.CANV_SIZE, this.CANV_SIZE);
      ctx_canv!.drawImage(this.ctx!.canvas, 0, 0, this.CANV_SIZE, this.CANV_SIZE);
      // キャッシュ有効化
      this.cache_on = true;
    } else {
      // キャッシュから描画
      this.ctx!.drawImage(this.canv_cache as HTMLCanvasElement, 0, 0, this.CANV_SIZE, this.CANV_SIZE);
    }

    // 選択したコマを表示
    this.ctx!.drawImage(this.drawHoverPiece() as HTMLCanvasElement, 0, 0, this.CANV_SIZE, this.CANV_SIZE);

    if ((this.mouse_x !== 0 || this.mouse_y !== 0) && this.demo === false) {
      // フォーカスを描画
      this.ctx!.drawImage(this.drawFocus() as HTMLCanvasElement, 0, 0, this.CANV_SIZE, this.CANV_SIZE);
    }

    //スコアを表示
    if(this.goaled||this.winner!==null){
      if(this.demo===false&&this.autoLog==false){
        this.ctx!.drawImage(this.drawScore() as HTMLCanvasElement, 0, 0, this.CANV_SIZE, this.CANV_SIZE);
      }
    }
    // メッセージを描画
    this.ctx!.drawImage(this.drawOverlay() as HTMLCanvasElement, 0, 0, this.CANV_SIZE, this.CANV_SIZE);

    // カバーを描画
    if (this.demo === true) {
      this.ctx!.drawImage(this.drawCover() as HTMLCanvasElement, 0, 0, this.CANV_SIZE, this.CANV_SIZE);
    }


  }

  /** 
   * 背景描画
   */
  private drawBk() {
    let ctx_bk = this.canv_bk!.getContext('2d');
    if (this.img_bk_loaded) {
      ctx_bk!.drawImage(this.img_bk as HTMLImageElement, 0, 0, this.CANV_SIZE/this.RATIO, this.CANV_SIZE/this.RATIO, 0, 0, this.CANV_SIZE, this.CANV_SIZE);
    }
    return this.canv_bk;
  }
  /** 
   * カバー描画
   */
  private drawCover() {
    // 背景
    let ctx_cover = this.canv_cover!.getContext('2d');
    ctx_cover!.clearRect(0, 0, this.CANV_SIZE, this.CANV_SIZE);
    ctx_cover!.globalAlpha = 0.50;
    ctx_cover!.fillStyle = '#000000';
    ctx_cover!.fillRect(0, 0, this.CANV_SIZE, this.CANV_SIZE);

    // 枠
    let x = this.cellSize * 2;
    let y = this.cellSize * 3.5;
    ctx_cover!.shadowBlur = 20;
    ctx_cover!.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx_cover!.shadowOffsetX = 5;
    ctx_cover!.shadowOffsetY = 5;
    ctx_cover!.globalAlpha = 0.8;
    ctx_cover!.fillStyle = this.COLOR_WHITE;
    ctx_cover!.beginPath();
    this.fillRoundRect(ctx_cover as CanvasRenderingContext2D, x, y, this.cellSize * 2, this.cellSize * 1, this.cellSize/20);
    ctx_cover!.shadowColor = 'rgba(0, 0, 0, 0)';
    ctx_cover!.shadowBlur = 0;
    ctx_cover!.shadowOffsetX = 0;
    ctx_cover!.shadowOffsetY = 0;




    // 文字
    let fontsize = Math.round(this.cellSize * 0.5);
    let message = 'Play';
    message+=(this.demo_inc%10==0)?" ":"";
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
    ctx_cover!.fillText(message, this.cellSize * 3, this.cellSize * 4);
    // 文字２
    message = 'colamone';
    fontsize = Math.round(this.cellSize * 1);
    ctx_cover!.font = 'bold ' + fontsize + 'px Play,sans-serif';
    ctx_cover!.fillStyle = this.COLOR_WHITE;
    ctx_cover!.shadowBlur = 0;
    ctx_cover!.beginPath();
    ctx_cover!.fillText(message, this.cellSize * 3, this.cellSize * 2);


    return this.canv_cover;
  }

  /** 
   * スコア描画
   */
  private drawScore() {
    // 背景
    let ctx_score = this.canv_score!.getContext('2d');
    let message ="";
    let fontsize = Math.round(this.cellSize *1.5);
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
    message = String(this.redScore);
    ctx_score!.beginPath();
    ctx_score!.fillText(message, this.cellSize * 1, this.cellSize * 3.8);
    // 文字
    message = "8";
    ctx_score!.beginPath();
    ctx_score!.fillText(message, this.cellSize * 2, this.cellSize * 5.3);
    //線
    ctx_score!.lineWidth=this.cellSize*0.2;
    ctx_score!.strokeStyle = red;
    ctx_score!.beginPath();
    ctx_score!.moveTo(this.cellSize * 0.4, this.cellSize * 5.55);
    ctx_score!.lineTo(this.cellSize * 2.6, this.cellSize * 3.55);
    ctx_score!.closePath();
    ctx_score!.stroke();


    // 文字
    message = String(this.blueScore);
    ctx_score!.fillStyle = blue;
    ctx_score!.beginPath();
    ctx_score!.fillText(message, this.cellSize * 4, this.cellSize * 0.7);
    // 文字
    message = "8";
    ctx_score!.beginPath();
    ctx_score!.fillText(message, this.cellSize * 5, this.cellSize * 2.3);
    // 文字
    ctx_score!.lineWidth=this.cellSize*0.2;
    ctx_score!.strokeStyle = blue;
    ctx_score!.beginPath();
    ctx_score!.moveTo(this.cellSize * 3.4, this.cellSize * 2.55);
    ctx_score!.lineTo(this.cellSize * 5.6, this.cellSize * 0.55);
    ctx_score!.closePath();
    ctx_score!.stroke();
    return this.canv_score;
  }



  /** 
   * フォーカスを描画
   */
  private drawFocus() {
    // 選択マスを強調
    let x = this.mouse_x - (this.mouse_x % this.cellSize);
    let y = this.mouse_y - (this.mouse_y % this.cellSize);
    let ctx_focus = this.canv_focus!.getContext('2d');
    let grad = ctx_focus!.createRadialGradient(x, y, 0, x,y, this.cellSize);
    grad.addColorStop(0.3, this.COLOR_SELECT);
    grad.addColorStop(1, this.COLOR_SELECT2);
    ctx_focus!.clearRect(0, 0, this.CANV_SIZE, this.CANV_SIZE);
    ctx_focus!.globalAlpha = 0.35;
    ctx_focus!.fillStyle = grad;
    ctx_focus!.lineWidth = 1;
    ctx_focus!.beginPath();
    ctx_focus!.fillRect(x, y, this.cellSize, this.cellSize);


    if (this.isTouch === true && this.hover_piece === null) {
      return this.canv_focus;
    }

    // 移動可能マスを強調
    let target = (x / this.cellSize) * 10 + (y / this.cellSize);
    if (this.thisMap[target] * this.turn_player > 0) {
      let canm = Aijs.getCanMovePanelX(target, this.thisMap);
      for (let i = 0; i <= canm.length - 1; i++) {
        x = Math.floor(canm[i] / 10);
        y = Math.floor(canm[i] % 10);
        ctx_focus!.globalAlpha = 0.6;
        ctx_focus!.strokeStyle = this.COLOR_SELECT;
        ctx_focus!.lineWidth = this.cellSize/20;
        ctx_focus!.beginPath();
        ctx_focus!.arc(x * this.cellSize + (this.cellSize / 2), y * this.cellSize + (this.cellSize / 2),
         (this.cellSize / 2) - (this.cellSize/10), 0, Math.PI * 2, false);
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
        ctx_board!.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
        ctx_board!.strokeRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
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
    ctx_board2!.arc(this.cellSize * 1, -3 * this.cellSize, 7 * this.cellSize, 0, Math.PI * 2, false);
    ctx_board2!.fill();

    return this.canv_board2;
  }


  /** 
   * 浮遊しているコマを描画する。
   */
  private drawHoverPiece() {
    let ctx_hover = this.canv_hover_piece!.getContext('2d');
    ctx_hover!.clearRect(0, 0, this.CANV_SIZE, this.CANV_SIZE);
    let x = this.mouse_x - (this.cellSize / 2);
    let y = this.mouse_y - (this.cellSize / 2);
    if (this.hover_piece !== null) {
      this.drawPiece(ctx_hover as CanvasRenderingContext2D, x, y, this.thisMap[this.hover_piece], false);
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

    let grad = this.ctx!.createLinearGradient(x, y, x + this.cellSize, y + this.cellSize);
    grad.addColorStop(0, 'rgb(255, 255, 255)');
    grad.addColorStop(0.4, wkColor);
    grad.addColorStop(1, wkColor);

    wkCtx.shadowBlur = 10;
    wkCtx.shadowColor = 'rgba(0, 0, 0, 1)';
    wkCtx.shadowOffsetX = 2;
    wkCtx.shadowOffsetY = 2;
    wkCtx.fillStyle = grad;
    wkCtx.beginPath();
    this.fillRoundRect(wkCtx, x + this.cellSize / 10, y + this.cellSize / 10, this.cellSize - 1 * this.cellSize / 5, this.cellSize - 1 * this.cellSize / 5, this.cellSize/20);

    wkCtx.shadowColor = 'rgba(0, 0, 0, 0)';
    wkCtx.shadowBlur = 0;
    wkCtx.shadowOffsetX = 0;
    wkCtx.shadowOffsetY = 0;

    // 曇りエフェクト
    if (this.img_bk_loaded) {
      wkCtx.globalAlpha = 0.35;
      wkCtx.save();
      wkCtx.clip();
      wkCtx.drawImage(this.drawBk() as HTMLCanvasElement, x + this.cellSize / 10, y + this.cellSize / 10, this.cellSize - 1 * this.cellSize / 5, this.cellSize - 1 * this.cellSize / 5);
      wkCtx.restore();
      wkCtx.globalAlpha = 1;
    }

    // 文字を描画。
    wkCtx.fillStyle = this.COLOR_WHITE;
    
    let fontsize = Math.round(this.cellSize * 0.18);
    wkCtx.textBaseline = 'middle';
    wkCtx.textAlign = 'center';
    wkCtx.font = fontsize + "pt 'Play',Arial";
    wkCtx.beginPath();

    // 数字を印字
    wkCtx.fillText(String(Math.abs(number)), x + (this.cellSize / 2), y + (this.cellSize / 2));

    // 点を描画
    for (let i = 0; i <= this.PIECES[number].length - 1; i++) {
      if (this.PIECES[number][i] === 0) {
        continue;
      }
      let x_dot = x + this.cellSize / 4.16 + (Math.floor(this.cellSize - 1 * this.cellSize / 5) / 3) * Math.floor(i % 3.0);
      let y_dot = y + this.cellSize / 4.16 + (Math.floor(this.cellSize - 1 * this.cellSize / 5) / 3) * Math.floor(i / 3.0);

      wkCtx.fillStyle = this.COLOR_WHITE;

      wkCtx.beginPath();
      wkCtx.arc(x_dot, y_dot, this.cellSize * 0.06, 0, Math.PI * 2, false);
      wkCtx.fill();
    }

    if (goal) { // 得点を印字
      wkCtx.shadowBlur = 10;
      wkCtx.shadowColor = 'rgba(0, 0, 0, 1)';
      wkCtx.globalAlpha = 1;
      wkCtx.fillStyle = this.COLOR_WHITE;
      fontsize = Math.round(this.cellSize * 0.5);
      wkCtx.textBaseline = 'middle';
      wkCtx.textAlign = 'center';
      wkCtx.font = 'bolder ' + fontsize + 'pt Play,Arial ';
      wkCtx.beginPath();
      wkCtx.fillText(String(Math.abs(number)), x + (this.cellSize / 2), y + (this.cellSize / 2));
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
          ctx_pieces = this.drawPiece(ctx_pieces as CanvasRenderingContext2D, x * this.cellSize, y * this.cellSize, wkMap[x * 10 + y], goal);
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
    let h = this.cellSize - 1 * this.cellSize / 5;
    let w = this.cellSize - 1 * this.cellSize / 5;
    let x = x1 * this.cellSize + this.cellSize / 10;
    let y = y1 * this.cellSize + this.cellSize / 10;
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
  private drawOverlay() {
    let ctx_overlay = this.canv_overlay!.getContext('2d');
    let x = this.cellSize * 1.3;
    let y = this.cellSize * 2.5;

    ctx_overlay!.clearRect(0, 0, this.CANV_SIZE, this.CANV_SIZE);

    if (this.message === '') {
      return this.canv_overlay;
    }
    ctx_overlay!.shadowBlur = 10;
    ctx_overlay!.shadowColor = 'rgba(100, 100, 100, 0.5)';
    ctx_overlay!.shadowOffsetX = 5;
    ctx_overlay!.shadowOffsetY = 5;

    ctx_overlay!.globalAlpha = 0.9;
    ctx_overlay!.fillStyle = this.COLOR_WHITE;
    this.fillRoundRect(ctx_overlay as CanvasRenderingContext2D, x, y, this.cellSize * 3.4, this.cellSize * 1, this.cellSize/20);

    let fontsize = Math.round(this.cellSize * 0.36);
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
    ctx_overlay!.fillText(this.message, this.cellSize * 3, this.cellSize * 3);

    return this.canv_overlay;
  }

  /** 
   * メッセージを更新
   */
  private updateMessage() {
    this.calcScore();
    let Block = '';
    document.querySelector('#blue')!.innerHTML = 'Blue: ' + this.blueScore + '/8';
    document.querySelector('#red')!.innerHTML = ' Red: ' + this.redScore + '/8';
    document.querySelector('#time')!.innerHTML = '(' + (this.thinktime.toFixed(3)) + 'sec)';
    if (this.logArray.length === 0) {
      if (this.winner == 1) {
        this.message = 'You win!';
        this.storage.setItem('level_' + (<HTMLSelectElement>document.querySelector('#level')).value,
          parseInt(this.storage.getItem('level_' + (<HTMLSelectElement>document.querySelector('#level')).value)) + 1);
        this.endgame();
      } else if (this.winner == -1) {
        this.message = 'You lose...';
        this.storage.setItem('level_' +(<HTMLSelectElement> document.querySelector('#level')).value, 0);
        this.endgame();
      } else if (this.winner === 0) {
        if (this.map_list[JSON.stringify(this.thisMap)] >= this.LIMIT_1000DAY) {
          this.message = '3fold repetition';
        } else {
          this.message = '-- Draw --';
        }
        this.endgame();
      }
    }

    if (this.storage.getItem('level_' + (<HTMLSelectElement> document.querySelector('#level')).value) > 0) {
      document.querySelector('#wins')!.innerHTML = this.storage.getItem('level_' + (<HTMLSelectElement> document.querySelector('#level')).value) + ' win!';
    } else {
      document.querySelector('#wins')!.innerHTML = '';
    }
  }

  /** 
   * ゲーム終了
   */
  private endgame() {
    if (this.logArray.length === 0) {
      document.querySelector('#span_replay')!.classList.remove("hide");
      document.querySelector('#span_tweetlog')!.classList.remove("hide");
    }
  }
  /** 
   * 得点計算。
   */
  private calcScore() {
    let sum1 = 0;
    let sum2 = 0;
    let GoalTop = [0, 10, 20, 30, 40, 50];
    let GoalBottom = [5, 15, 25, 35, 45, 55];
    // 点数勝利        
    for (let i in GoalTop) {
      if (this.thisMap[GoalTop[i]] * 1 > 0) {
        sum1 += this.thisMap[GoalTop[i]];
      }
    }
    for (let i in GoalBottom) {
      if (this.thisMap[GoalBottom[i]] * -1 > 0) {
        sum2 += this.thisMap[GoalBottom[i]];
      }
    }
    if (sum1 >= 8) {
      this.winner = 1;
    } else if (sum2 <= -8) {
      this.winner = -1;
    }

    // 手詰まりは判定
    if (this.isNoneNode(this.thisMap)) {
      if (Math.abs(sum1) > Math.abs(sum2)) {
        this.winner = 1;
      } else if (Math.abs(sum1) < Math.abs(sum2)) { // 引き分けは後攻勝利
        this.winner = -1;
      } else if (Math.abs(sum1) == Math.abs(sum2)) {
        this.winner = 0;
      }
    } else {
      if (this.is1000day(this.thisMap) === true) {
        this.winner = 0;
      }
    }
    this.blueScore = Math.abs(sum1);
    this.redScore = Math.abs(sum2);
  }

  /** 
   * 手詰まり判定。
   */
  private isNoneNode(wkMap:MapArray) {
    let flag1 = false;
    let flag2 = false;
    for (let panel_num in wkMap) {
      if (wkMap[panel_num] === 0) {
        continue;
      }
      let canMove = Aijs.getCanMovePanelX(parseInt(panel_num), wkMap);
      if (canMove.length !== 0) {
        if (wkMap[panel_num] > 0) {
          flag1 = true;
        } else if (wkMap[panel_num] < 0) {
          flag2 = true;
        }
      }
      if (flag1 && flag2) {
        return false;
      }
    }
    return true;
  }


  /** 
   * 千日手
   */
  private is1000day(wkMap:MapArray) {
    let map_json = JSON.stringify(wkMap);
    if (this.map_list[map_json] === undefined) {
      this.map_list[map_json] = 1;
      return false;
    } else {
      this.map_list[map_json] += 1;
    }
    if (this.map_list[map_json] >= this.LIMIT_1000DAY) {
      return true;
    }
    return false;
  }

  /** 
   * 手の数を取得
   */
  private getNodeCount(wkMap:MapArray) {
    let count = 0;
    for (let panel_num in wkMap) {
      if (wkMap[panel_num] === 0) {
        continue;
      }
      let canMove = Aijs.getCanMovePanelX(parseInt(panel_num), wkMap);
      count += canMove.length;
    }
    return count;
  }


  /** 
   * パラメータ取得
   */
  private getParam():any {
    let obj:any = {};
    if (1 < document.location.search.length) {
      let paramstr = document.location.search.substring(1).split('&');
      for (let i = 0; i < paramstr.length; i++) {
        let entry = paramstr[i].split('=');
        let key = decodeURIComponent(entry[0]);
        let value = decodeURIComponent(entry[1]);
        obj[key] = decodeURIComponent(value);
      }
    }
    return obj;
  }

  /** 
   * パタメータから初期配置を取得
   */
  private getMapByParam(initString:string):MapArray {
    let wkMap;
    if (initString) {
      wkMap = Aijs.copyMap(this.thisMap);
      // クリア
      for (let num in wkMap) {
        wkMap[num] = 0;
      }
      let arr = initString.split(',');
      if (arr.length < 8) {
        arr = ["1", "2", "3", "4", "5", "6", "7", "8"];
      }
      let red_num = [0, 10, 20, 30, 40, 50, 11, 41];
      let blue_num = [55, 45, 35, 25, 15, 5, 44, 14];

      for (let num in blue_num) {
        wkMap[blue_num[num]] = parseInt(arr[num]);
      }
      for (let num in red_num) {
        wkMap[red_num[num]] = -1 * parseInt(arr[num]);
      }
    }

    return wkMap as MapArray;
  }
  /** 
   * ログをデコード。
   */
  private decodeLog(logstr:string, wkInitMap:MapArray) {
    let wklogArray = [];
    let wkMap = Aijs.copyMap(wkInitMap);
    let arrow:{ [index: string]: number; } = {
      'q': 0, 'w': 1, 'e': 2,
      'a': 3, 's': 4, 'd': 5,
      'z': 6, 'x': 7, 'c': 8
    };
    logstr = logstr.replace(/q/g, 'q,').replace(/w/g, 'w,').replace(/e/g, 'e,');
    logstr = logstr.replace(/a/g, 'a,').replace(/s/g, 's,').replace(/d/g, 'd,');
    logstr = logstr.replace(/z/g, 'z,').replace(/x/g, 'x,').replace(/c/g, 'c,');
    let logArr = logstr.split(',');

    wklogArray.push(wkMap);
    for (let i = 0; i < logArr.length; i++) {
      if (logArr[i] === '') { continue; }
      let arw = arrow[logArr[i].match(/[qweasdzxc]/)![0]];
      let from = parseInt(logArr[i].match(/\d*/)![0]);
      let to = (Math.floor(from / 10) + Math.floor(arw % 3) - 1) * 10 +
       (Math.floor(from % 10) + Math.floor(arw / 3) - 1);
      wkMap = Aijs.copyMap(wkMap);
      wkMap[to] = wkMap[from];
      wkMap[from] = 0;
      wklogArray.push(wkMap);
    }
    return wklogArray;
  }
  /** 
   * ログをエンコード
   */
  private encodeLog(wklogArray:Hand[]) {
    let logstr = '';
    let arrow = ['q', 'w', 'e',
      'a', 's', 'd',
      'z', 'x', 'c'];
    for (let i in wklogArray) {
      let from = wklogArray[i][0];
      let to = wklogArray[i][1];
      let x_vec = ((Math.floor(to / 10)) - Math.floor(from / 10));
      let y_vec = ((Math.floor(to % 10)) - Math.floor(from % 10));
      let arw = '';
      if (x_vec === -1 && y_vec === -1) { arw = 'q'; }
      if (x_vec === 0 && y_vec === -1) { arw = 'w' ;}
      if (x_vec === 1 && y_vec === -1) { arw = 'e' ;}
      if (x_vec === -1 && y_vec === 0) { arw = 'a'; }
      if (x_vec === 0 && y_vec === 0) { arw = 's' ;}
      if (x_vec === 1 && y_vec === 0) { arw = 'd' ;}
      if (x_vec === -1 && y_vec === 1) { arw = 'z'; }
      if (x_vec === 0 && y_vec === 1) { arw = 'x' ;}
      if (x_vec === 1 && y_vec === 1) { arw = 'c'; }
      logstr += from + arw;
    }
    return logstr;
  }

  /** 
   * ログを全部巻き戻す
   */
  private move_start() {
    this.logPointer = 0;
    this.autoLog=false;    
    this.thisMap = Aijs.copyMap(this.logArray[this.logPointer]);
    this.winner=null;
    this.goaled=false;
    this.updateMessage();
    this.flush(false, false);
  }

  /** 
   * ログを戻す
   */
  private move_prev() {
    if (this.logPointer <= 0) { return; }
    this.autoLog=false;    
    this.logPointer -= 1;
    this.thisMap = Aijs.copyMap(this.logArray[this.logPointer]);
    this.winner=null;
    this.goaled=false;
    this.updateMessage();
    this.flush(false, false);
  }

  /** 
   * ログを進める
   */
  private move_next() {
    if (this.logPointer + 1 > this.logArray.length - 1) { return; }
    this.logPointer += 1;
    this.thisMap = Aijs.copyMap(this.logArray[this.logPointer]);
    this.updateMessage();
    this.flush(false, false);
  }

  /** 
   * ログを最後まで進める。
   */
  private move_end() {
    this.logPointer = this.logArray.length - 1;
    this.autoLog=false;    
    this.thisMap = Aijs.copyMap(this.logArray[this.logPointer]);
    this.updateMessage();
    this.flush(false, false);
  }

  /** 
   * リセット
   */
  private reloadnew() {
    let url = document.location.href.split('?')[0];

    //demo中ならdemoを終了
    if(this.demo===true){
      this.ev_mouseClick(null);
      return;
    }

    // パラメータを取得
    let paramObj = this.getParam();
    if (paramObj.lang) {
      url += '?lang=' + paramObj.lang;
    }
    if (navigator.onLine) {
      location.href = url;
    } else {
      this.thisMap = Aijs.copyMap(this.startMap);
      this.shuffleBoard();
      this.logArray2 = [];
      this.message = '';
      this.winner = null;
      this.turn_player = 1;
      this.flush(false, false);
    }
  }

  /** 
   * 検討画面に飛ぶ
   */
  private jumpkento() {
    let url = document.location.href.split('?')[0];
    let init = '?init=' + this.startMap[55] + ','+
     this.startMap[45] + ','+
     this.startMap[35] + ','+
     this.startMap[25] + ','+
     this.startMap[15] + ','+
     this.startMap[5] + ','+
     this.startMap[44] + ','+
     this.startMap[14];
    let log = '&log=' + this.encodeLog(this.logArray2);
    log += '&lv=' + (<HTMLSelectElement>document.querySelector('#level')).value;
    location.href = url + init + log;
  }
  /** 
   * ログをツイートする。
   */
  private tweetlog() {
    let url = document.location.href.split('?')[0];
    let init = '?init=' + this.startMap[55] + ','+
     this.startMap[45] + ','+
     this.startMap[35] + ','+
     this.startMap[25] + ','+
     this.startMap[15] + ','+
     this.startMap[5] + ','+
     this.startMap[44] + ','+
     this.startMap[14];
    let log = '%26log=' + this.encodeLog(this.logArray2);
    log += '%26lv=' + (<HTMLSelectElement>document.querySelector('#level')).value;
    window.open('https://twitter.com/intent/tweet?text=' + url + init + log + '%20%23colamone');
  }
  /** 
   * ツイートボタンを読み込む。
   */
  private setTweet() {
    /*jshint -W030 */
    (function f(d:any, s:string, id:string) {
      let js, fjs = d.getElementsByTagName(s)[0];
      if (!d.getElementById(id)) { js = d.createElement(s); js.id = id; js.async = true; js.src = 'https://platform.twitter.com/widgets.js'; fjs.parentNode.insertBefore(js, fjs); }
    }) (document, 'script', 'twitter-wjs');
  }
  /** 
   * botかどうか判定
   */
  private isBot(){
    let ua = window.navigator.userAgent.toLowerCase();
    if (ua.indexOf('bot') != -1 ||
    ua.indexOf('lighthouse') != -1||
    ua.indexOf('headless') != -1) {
      return true;
    }
    return false;
  }
}
const bg = new BoardGamejs();
/** 
 * init 
 */
document.addEventListener('DOMContentLoaded', function() {
  bg.Run();
});
