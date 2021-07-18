/* @license Copyright (c) @kurehajime / source code: https://github.com/kurehajime/colamone_js */
import { Rule, MapArray, Hand } from "./rule";
import { Aijs } from "./ai";
import { GameState } from "./gameState";
import { View } from "../canvas/view";

export class BoardGamejs {

  private gameState = new GameState();
  private view = new View();

  private thinktime = 0.0;
  private intervalID: (number | null) = null;
  private intervalID_log: (number | null) = null;
  private map_list: { [index: string]: number; } = {};
  private readonly LIMIT_1000DAY = 3;
  private startMap: MapArray = new Int8Array();
  private logPointer = 0;
  private logArray: Array<MapArray> = [];
  private logArray2: Array<Hand> = [];
  private storage: any = null;

  constructor() {
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
        this.storage.hasItem = function (sKey: string) {
          return (new RegExp('(?:^|;\\s*)' + escape(sKey).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=')).test(document.cookie);
        };
        this.storage.getItem = function (sKey: string) {
          if (!sKey || !(new RegExp('(?:^|;\\s*)' + escape(sKey).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=')).test(document.cookie)) { return null; }
          return unescape(document.cookie.replace(new RegExp('(?:^|.*;\\s*)' + escape(sKey).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*'), '$1'));
        };
        this.storage.setItem = function (sKey: string, sValue: any) {
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

    this.gameState.turn_player = 1;
    this.gameState.demo = true;

    this.view.init();



    if ('ontouchstart' in window) {
      this.gameState.isTouch = true;
    } else {
      this.gameState.isTouch = false;
    }
    // イベントを設定
    if (this.gameState.isTouch) {
      (<HTMLElement>document.querySelector('#canv')).addEventListener('touchstart', this.ev_mouseClick);
      (<HTMLElement>document.querySelector('#canv')).addEventListener('touchmove', this.ev_touchMove, { passive: false });
    } else {
      (<HTMLElement>document.querySelector('#canv')).addEventListener('mousemove', this.ev_mouseMove);
      (<HTMLElement>document.querySelector('#canv')).addEventListener('mouseup', this.ev_mouseClick);
    }
    (<HTMLElement>document.querySelector('#level')).addEventListener('change', this.ev_radioChange);
    (<HTMLElement>document.querySelector('#prevprev')).addEventListener('click', () => { this.move_start() });
    (<HTMLElement>document.querySelector('#prev')).addEventListener('click', () => { this.move_prev() });
    (<HTMLElement>document.querySelector('#next')).addEventListener('click', () => { this.move_next() });
    (<HTMLElement>document.querySelector('#nextnext')).addEventListener('click', () => { this.move_end() });
    (<HTMLElement>document.querySelector('#replay')).addEventListener('click', () => { this.jumpkento() });
    (<HTMLElement>document.querySelector('#tweetlog')).addEventListener('click', () => { this.tweetlog() });
    (<HTMLElement>document.querySelector('#newgame')).addEventListener('click', () => { this.reloadnew() });
    (<HTMLElement>document.querySelector('#collapsible')).addEventListener('click', () => {
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
      (<HTMLInputElement>document.querySelector('#level')).value = String(parseInt(this.storage.getItem('level_save')));
    } else {
      this.storage.setItem('level_save', 1);
      (<HTMLInputElement>document.querySelector('#level')).value = String(1);
    }

    //document.querySelector('#canv').classList.add("hue-rotate1");


    // パラメータを取得
    let paramObj = this.getParam();

    // 盤面を初期化
    if (paramObj.init) {
      this.startMap = this.getMapByParam(paramObj.init);
      this.gameState.thisMap = Rule.copyMap(this.startMap);
    } else {
      this.startMap = Rule.copyMap(this.gameState.thisMap);
    }
    // ログをデコード
    if (paramObj.log) {
      this.logArray = this.decodeLog(paramObj.log, this.startMap);
    }
    // レベル取得
    if (paramObj.lv) {
      (<HTMLSelectElement>document.querySelector('#level')).value = String(parseInt(paramObj.lv));
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
    this.view.ViewState.Img_bk!.onload = () => {
      this.view.ViewState.Img_bk_loaded = true;
      this.view.flush(this.gameState, true, false);
    };
    // 画像読み込み失敗時
    this.view.ViewState.Img_bk!.onerror = () => {
      this.view.flush(this.gameState, true, false);
    };
    // もう既に読み込み終わってた時
    if (this.view.ViewState.Img_bk!.width !== 0) {
      this.view.ViewState.Img_bk_loaded = true;
      this.view.flush(this.gameState, true, false);
    }
    // 2.5秒後に強制描画※Googleの検索結果から飛ぶとなぜか描画が走らない事があるので。
    setTimeout(() => {
      if (this.view.ViewState.Img_bk!.width !== 0) {
        this.view.ViewState.Img_bk_loaded = true;
      }
      this.view.flush(this.gameState, true, false);
    }, 2500);
    this.updateMessage();
    this.setTweet(); // ツイートボタンを生成

    if (this.logArray.length === 0) {
      if (this.isBot() == false) {
        window.setTimeout(() => {
          if (this.gameState.demo == true) {
            this.intervalID = window.setInterval(() => { this.playDemo() }, 400);
            this.playDemo();
          }
        }, 500);
      }
    } else {
      this.gameState.demo = false;
      this.gameState.autoLog = true;
      this.intervalID_log = window.setInterval(() => { this.playLog() }, 1000);
    }
    this.gameState.goaled = false;
    this.view.flush(this.gameState, true, false);
  }

  /** 
   * Demoを再生
   */
  private playDemo() {
    if (this.intervalID !== null) {
      if (Math.random() > 0.3) {
        this.ai(2);
      } else {
        this.ai(1);
      }
    }
    this.gameState.demo_inc++;
    this.calcScore();
    this.view.flush(this.gameState, false, false);
    if (this.gameState.winner === 1 || this.gameState.winner === -1 || this.gameState.winner === 0) {
      this.gameState.goaled = true;
      this.gameState.winner = null;
      this.view.flush(this.gameState, false, false);
      this.shuffleBoard();
    }
    if (this.gameState.demo_inc > 42) {
      window.clearInterval(this.intervalID as number);
    }
  }

  /** 
   * Logを再生
   */
  private playLog() {

    if (this.intervalID_log !== null && this.gameState.autoLog == true) {
      this.move_next();
    } else {
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
  private ev_mouseMove = (e: MouseEvent) => {
    this.getMousePosition(e);
    this.view.flush(this.gameState, false, true);
  };
  /** 
   * タッチ移動時処理
   */
  private ev_touchMove = (e: TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }

  /** 
   * マウスクリック時処理
   */
  private ev_mouseClick = (e: MouseEvent | TouchEvent | null): boolean => {
    this.getMousePosition(e);
    let target = Math.floor(this.gameState.mouse_x / this.view.ViewState.CellSize) * 10 + Math.floor(this.gameState.mouse_y / this.view.ViewState.CellSize);
    if (this.gameState.winner !== null || this.logArray.length !== 0) {
      this.reloadnew();
      return true;
    }
    if (this.gameState.demo === true) {
      this.gameState.demo = false;
      this.gameState.thisHand = undefined;
      this.gameState.thisMap = Rule.copyMap(this.startMap);
      this.logArray2 = [];
      this.view.flush(this.gameState, false, false);
      this.gameState.winner = null;
      this.gameState.goaled = false;
      this.gameState.turn_player = 1;
      window.clearInterval(this.intervalID as number);
      this.view.flush(this.gameState, false, false);
      return true;
    }

    if (this.gameState.hover_piece === null) {
      if (this.gameState.thisMap[target] * this.gameState.turn_player > 0) {
        this.gameState.hover_piece = target;
      }
    } else {
      if (target == this.gameState.hover_piece) {
        this.gameState.hover_piece = null;
        this.view.flush(this.gameState, false, false);
        return true;
      }
      let canm = Rule.getCanMovePanelX(this.gameState.hover_piece!, this.gameState.thisMap);
      if (canm.indexOf(target) >= 0) {
        this.view.flush(this.gameState, false, true);
        if (this.isGoaled(this.gameState.thisMap, target, this.gameState.turn_player)) {
          this.gameState.goaled = true;
          this.view.flush(this.gameState, false, true);
          setTimeout(() => {
            this.gameState.goaled = false;
            this.view.flush(this.gameState, false, false);
          }, 2000);
        }


        this.gameState.thisMap[target] = this.gameState.thisMap[this.gameState.hover_piece!];
        this.gameState.thisMap[this.gameState.hover_piece!] = 0;
        this.gameState.turn_player = this.gameState.turn_player * -1;
        this.logArray2.push([this.gameState.hover_piece!, target]);
        this.gameState.thisHand = [this.gameState.hover_piece!, target];
        this.gameState.hover_piece = null;


        // AIが考える。
        this.gameState.message = 'thinking...';
        window.setTimeout(() => {
          this.view.flush(this.gameState, false, false);
        }, 50);
        this.updateMessage();
        if (this.gameState.winner === null) {
          window.setTimeout(() => {
            this.ai(parseInt((<HTMLSelectElement>document.querySelector('#level')).value));
            this.gameState.message = '';
            this.updateMessage();
            this.view.flush(this.gameState, false, false);
          }, 250);
        }
      }
    }
    this.view.flush(this.gameState, false, false);

    return true;
  }

  /** 
   * ラジオボタン変更時処理
   */
  private ev_radioChange = () => {
    let num = (<HTMLSelectElement>document.querySelector('#level')).value;
    this.storage.setItem('level_save', num);
    if (this.storage.getItem('level_' + num) > 0) {
      document.querySelector('#wins')!.innerHTML = this.storage.getItem('level_' + num) + ' win!';
    } else {
      document.querySelector('#wins')!.innerHTML = '';
    }
    this.gameState.thisMap = Rule.copyMap(this.startMap);
    this.gameState.thisHand = undefined;
    this.map_list = {};
    this.logArray2 = [];
    this.view.flush(this.gameState, false, false);
  }

  /** 
   * AIに考えてもらう。
   */
  private ai(level: number) {
    let hand;
    let startTime = new Date();
    let endTime;
    // 終盤になったら長考してみる。
    let count = this.getNodeCount(this.gameState.thisMap) / 2;
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

    hand = Aijs.thinkAI(this.gameState.thisMap, this.gameState.turn_player, level + plus + 1, undefined, undefined, undefined)[0];
    this.gameState.thisHand = hand;
    if (hand) {
      if (this.isGoaled(this.gameState.thisMap, hand[1], this.gameState.turn_player)) {
        this.gameState.goaled = true;
        this.view.flush(this.gameState, false, true);
        setTimeout(() => {
          this.gameState.goaled = false;
          this.view.flush(this.gameState, false, false);
        }, 2000);
      }
      this.gameState.thisMap[hand[1]] = this.gameState.thisMap[hand[0]];
      this.gameState.thisMap[hand[0]] = 0;
      this.logArray2.push([hand[0], hand[1]]);
      // //フォーカス座標を移す。
      // mouse_x = Math.floor(hand[1] / 10)*cellSize+1
      // mouse_y = Math.floor(hand[1] % 10)*cellSize+1
    }
    this.gameState.turn_player = this.gameState.turn_player * -1;
    endTime = new Date();
    this.thinktime = (endTime.getTime() - startTime.getTime()) / 1000;
  }
  /** 
   * ゴールしたか
   */
  private isGoaled(map: MapArray, afterHand: number, turn: number) {
    if (turn > 0) {
      if (afterHand % 10 === 0) {
        return true;
      }
    } else if (turn < 0) {
      if (afterHand % 10 === 5) {
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
    for (let num in this.gameState.thisMap) {
      this.gameState.thisMap[num] = 0;
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
      this.gameState.thisMap[blue_num[num]] = arr[num];
    }
    for (let num in red_num) {
      this.gameState.thisMap[red_num[num]] = -1 * arr[num];
    }
  }

  /** 
   * マウス位置取得
   */
  private getMousePosition(e: any) {
    if (e == null) {
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
    this.gameState.mouse_x = e.clientX - rect.left;
    this.gameState.mouse_y = e.clientY - rect.top;
    this.gameState.mouse_x = this.gameState.mouse_x * this.view.ViewState.Ratio;
    this.gameState.mouse_y = this.gameState.mouse_y * this.view.ViewState.Ratio;
  }

  /** 
   * メッセージを更新
   */
  private updateMessage() {
    this.calcScore();
    let Block = '';
    document.querySelector('#blue')!.innerHTML = 'Blue: ' + this.gameState.blueScore + '/8';
    document.querySelector('#red')!.innerHTML = ' Red: ' + this.gameState.redScore + '/8';
    document.querySelector('#time')!.innerHTML = '(' + (this.thinktime.toFixed(3)) + 'sec)';
    if (this.logArray.length === 0) {
      if (this.gameState.winner == 1) {
        this.gameState.message = 'You win!';
        this.storage.setItem('level_' + (<HTMLSelectElement>document.querySelector('#level')).value,
          parseInt(this.storage.getItem('level_' + (<HTMLSelectElement>document.querySelector('#level')).value)) + 1);
        this.endgame();
      } else if (this.gameState.winner == -1) {
        this.gameState.message = 'You lose...';
        this.storage.setItem('level_' + (<HTMLSelectElement>document.querySelector('#level')).value, 0);
        this.endgame();
      } else if (this.gameState.winner === 0) {
        if (this.map_list[JSON.stringify(this.gameState.thisMap)] >= this.LIMIT_1000DAY) {
          this.gameState.message = '3fold repetition';
        } else {
          this.gameState.message = '-- Draw --';
        }
        this.endgame();
      }
    }

    if (this.storage.getItem('level_' + (<HTMLSelectElement>document.querySelector('#level')).value) > 0) {
      document.querySelector('#wins')!.innerHTML = this.storage.getItem('level_' + (<HTMLSelectElement>document.querySelector('#level')).value) + ' win!';
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
      if (this.gameState.thisMap[GoalTop[i]] * 1 > 0) {
        sum1 += this.gameState.thisMap[GoalTop[i]];
      }
    }
    for (let i in GoalBottom) {
      if (this.gameState.thisMap[GoalBottom[i]] * -1 > 0) {
        sum2 += this.gameState.thisMap[GoalBottom[i]];
      }
    }
    if (sum1 >= 8) {
      this.gameState.winner = 1;
    } else if (sum2 <= -8) {
      this.gameState.winner = -1;
    }

    // 手詰まりは判定
    if (this.isNoneNode(this.gameState.thisMap)) {
      if (Math.abs(sum1) > Math.abs(sum2)) {
        this.gameState.winner = 1;
      } else if (Math.abs(sum1) < Math.abs(sum2)) { // 引き分けは後攻勝利
        this.gameState.winner = -1;
      } else if (Math.abs(sum1) == Math.abs(sum2)) {
        this.gameState.winner = 0;
      }
    } else {
      if (this.is1000day(this.gameState.thisMap) === true) {
        this.gameState.winner = 0;
      }
    }
    this.gameState.blueScore = Math.abs(sum1);
    this.gameState.redScore = Math.abs(sum2);
  }

  /** 
   * 手詰まり判定。
   */
  private isNoneNode(wkMap: MapArray) {
    let flag1 = false;
    let flag2 = false;
    for (let panel_num in wkMap) {
      if (wkMap[panel_num] === 0) {
        continue;
      }
      let canMove = Rule.getCanMovePanelX(parseInt(panel_num), wkMap);
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
  private is1000day(wkMap: MapArray) {
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
  private getNodeCount(wkMap: MapArray) {
    let count = 0;
    for (let panel_num in wkMap) {
      if (wkMap[panel_num] === 0) {
        continue;
      }
      let canMove = Rule.getCanMovePanelX(parseInt(panel_num), wkMap);
      count += canMove.length;
    }
    return count;
  }


  /** 
   * パラメータ取得
   */
  private getParam(): any {
    let obj: any = {};
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
  private getMapByParam(initString: string): MapArray {
    let wkMap;
    if (initString) {
      wkMap = Rule.copyMap(this.gameState.thisMap);
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
  private decodeLog(logstr: string, wkInitMap: MapArray) {
    let wklogArray = [];
    let wkMap = Rule.copyMap(wkInitMap);
    let arrow: { [index: string]: number; } = {
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
      wkMap = Rule.copyMap(wkMap);
      wkMap[to] = wkMap[from];
      wkMap[from] = 0;
      wklogArray.push(wkMap);
    }
    return wklogArray;
  }
  /** 
   * ログをエンコード
   */
  private encodeLog(wklogArray: Hand[]) {
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
      if (x_vec === 0 && y_vec === -1) { arw = 'w'; }
      if (x_vec === 1 && y_vec === -1) { arw = 'e'; }
      if (x_vec === -1 && y_vec === 0) { arw = 'a'; }
      if (x_vec === 0 && y_vec === 0) { arw = 's'; }
      if (x_vec === 1 && y_vec === 0) { arw = 'd'; }
      if (x_vec === -1 && y_vec === 1) { arw = 'z'; }
      if (x_vec === 0 && y_vec === 1) { arw = 'x'; }
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
    this.gameState.autoLog = false;
    this.gameState.thisMap = Rule.copyMap(this.logArray[this.logPointer]);
    this.gameState.winner = null;
    this.gameState.goaled = false;
    this.updateMessage();
    this.view.flush(this.gameState, false, false);
  }

  /** 
   * ログを戻す
   */
  private move_prev() {
    if (this.logPointer <= 0) { return; }
    this.gameState.autoLog = false;
    this.logPointer -= 1;
    this.gameState.thisMap = Rule.copyMap(this.logArray[this.logPointer]);
    this.gameState.winner = null;
    this.gameState.goaled = false;
    this.updateMessage();
    this.view.flush(this.gameState, false, false);
  }

  /** 
   * ログを進める
   */
  private move_next() {
    if (this.logPointer + 1 > this.logArray.length - 1) { return; }
    this.logPointer += 1;
    this.gameState.thisMap = Rule.copyMap(this.logArray[this.logPointer]);
    this.updateMessage();
    this.view.flush(this.gameState, false, false);
  }

  /** 
   * ログを最後まで進める。
   */
  private move_end() {
    this.logPointer = this.logArray.length - 1;
    this.gameState.autoLog = false;
    this.gameState.thisMap = Rule.copyMap(this.logArray[this.logPointer]);
    this.updateMessage();
    this.view.flush(this.gameState, false, false);
  }

  /** 
   * リセット
   */
  private reloadnew() {
    let url = document.location.href.split('?')[0];

    //demo中ならdemoを終了
    if (this.gameState.demo === true) {
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
      this.gameState.thisMap = Rule.copyMap(this.startMap);
      this.shuffleBoard();
      this.logArray2 = [];
      this.gameState.message = '';
      this.gameState.winner = null;
      this.gameState.turn_player = 1;
      this.view.flush(this.gameState, false, false);
    }
  }

  /** 
   * 検討画面に飛ぶ
   */
  private jumpkento() {
    let url = document.location.href.split('?')[0];
    let init = '?init=' + this.startMap[55] + ',' +
      this.startMap[45] + ',' +
      this.startMap[35] + ',' +
      this.startMap[25] + ',' +
      this.startMap[15] + ',' +
      this.startMap[5] + ',' +
      this.startMap[44] + ',' +
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
    let init = '?init=' + this.startMap[55] + ',' +
      this.startMap[45] + ',' +
      this.startMap[35] + ',' +
      this.startMap[25] + ',' +
      this.startMap[15] + ',' +
      this.startMap[5] + ',' +
      this.startMap[44] + ',' +
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
    (function f(d: any, s: string, id: string) {
      let js, fjs = d.getElementsByTagName(s)[0];
      if (!d.getElementById(id)) { js = d.createElement(s); js.id = id; js.async = true; js.src = 'https://platform.twitter.com/widgets.js'; fjs.parentNode.insertBefore(js, fjs); }
    })(document, 'script', 'twitter-wjs');
  }
  /** 
   * botかどうか判定
   */
  private isBot() {
    let ua = window.navigator.userAgent.toLowerCase();
    if (ua.indexOf('bot') != -1 ||
      ua.indexOf('lighthouse') != -1 ||
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
document.addEventListener('DOMContentLoaded', function () {
  bg.Run();
});
