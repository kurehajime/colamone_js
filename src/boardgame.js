/* @license Copyright (c) @kurehajime / source code: https://github.com/kurehajime/colamone_js */
import { Aijs } from "./ai";

/** 
 * BoardGamejs名前空間 
 */
; (function (global) {
  'use strict';

  // Class ------------------------------------------------
  function BoardGamejs() { }

  // Header -----------------------------------------------
  global.BoardGamejs = BoardGamejs;
  global.BoardGamejs.init = init;


  // Body ---------------------------------------
  let ctx = null;
  let isTouch = true;
  let goaled=false;
  let canv_board = null;
  let canv_board2 = null;
  let canv_focus = null;
  let canv_pieces = null;
  let canv_shadow = null;
  let canv_hover_piece = null;
  let canv_overlay = null;
  let canv_bk = null;
  let canv_cover = null;
  let canv_score = null;
  let canv_cache = null;
  let cache_on = false;
  let img_bk_loaded = false;
  let hover_piece = null;
  let cellSize = null;
  let turn_player = null;
  let blueScore = 0;
  let redScore = 0;
  let winner = null;
  let message = '';
  let thinktime = 0.0;
  let demo = true;
  let autoLog=false;
  let intervalID = null;
  let intervalID_log = null;  
  let thisHand = [];
  let demo_inc=0;
  const COLOR_LINE = '#333333';
  const COLOR_PANEL_1 = '#660033';
  const COLOR_PANEL_2 = '#004466';
  const COLOR_PANEL_3 = '#FFFFFF';
  const COLOR_PANEL_4 = '#111111';
  const COLOR_PANEL_5 = '#444444';
  const COLOR_PANEL_6 = '#888888';
  const COLOR_SELECT = '#7fed7f';
  const COLOR_SELECT2='#148d14';
  const COLOR_RED = '#E60073';
  const COLOR_BLUE = '#0099E6';
  const COLOR_RED2 = '#E60073';
  const COLOR_BLUE2 = '#0099E6';
  const COLOR_WHITE = '#FFFFFF';
  let RATIO=1;
  if( window.devicePixelRatio!==undefined&& window.devicePixelRatio!=1){
    RATIO = window.devicePixelRatio;
  }
  let CANV_SIZE=500*RATIO;

  const PIECES = {
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
  let thisMap =[
    -1,0,0,0,0,6,0,0,0,0,-2,-8,
    0,0,7,5,0,0,0,0,-3,0,0,0,
    0,4,0,0,0,0,-4,0,0,0,0,
    3,0,0,0,0,-5,-7,0,0,8,2,
    0,0,0,0,-6,0,0,0,0,1
  ]

  let map_list = {};
  const LIMIT_1000DAY = 3;
  let mouse_x = 0;
  let mouse_y = 0;
  let startMap;
  let logPointer = 0;
  let logArray = [];
  let logArray2 = [];
  let img_bk = null;
  img_bk = new Image(); img_bk.src = 'bk.gif';
  let storage = null;
  try {
    if (window == parent && ('localStorage' in window) && window.localStorage !== null) {
      storage = localStorage;
      storage.setItem('test', 0); // Safariのプライベートモードは、できないのにできるって言うからかまをかけてみる。
    }
  } catch (e) {
    storage = null;
  }
  if (storage === null) {
    // localStorageが使えない場合
    storage = {}; // ダミー
    storage.getItem = function () { return undefined; };
    storage.setItem = function () { return undefined; };

    if (navigator.cookieEnabled) {
      storage.hasItem = function (sKey) {
        return (new RegExp('(?:^|;\\s*)' + escape(sKey).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=')).test(document.cookie);
      };
      storage.getItem = function (sKey) {
        if (!sKey || !(new RegExp('(?:^|;\\s*)' + escape(sKey).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=')).test(document.cookie)) { return null; }
        return unescape(document.cookie.replace(new RegExp('(?:^|.*;\\s*)' + escape(sKey).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*'), '$1'));
      };
      storage.setItem = function (sKey, sValue) {
        if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return; }
        document.cookie = escape(sKey) + '=' + escape(sValue);
      };
    }
  }

  /** 
   * 初期化
   */
  function init() {
    zoom(); // 小さい端末でズーム
    if (window.innerHeight < window.innerWidth) {
      document.querySelector('.manual').classList.remove("hide");
    } else {
      document.querySelector('.manual').classList.add("hide");
    }
    ctx = document.querySelector('#canv').getContext('2d');

    canv_board = document.createElement('canvas');
    canv_board.width = CANV_SIZE;
    canv_board.height = CANV_SIZE;


    canv_board2 = document.createElement('canvas');
    canv_board2.width = CANV_SIZE;
    canv_board2.height = CANV_SIZE;

    canv_focus = document.createElement('canvas');
    canv_focus.width = CANV_SIZE;
    canv_focus.height = CANV_SIZE;

    canv_pieces = document.createElement('canvas');
    canv_pieces.width = CANV_SIZE;
    canv_pieces.height = CANV_SIZE;

    canv_shadow = document.createElement('canvas');
    canv_shadow.width = CANV_SIZE;
    canv_shadow.height = CANV_SIZE;

    canv_hover_piece = document.createElement('canvas');
    canv_hover_piece.width = CANV_SIZE;
    canv_hover_piece.height = CANV_SIZE;

    canv_overlay = document.createElement('canvas');
    canv_overlay.width = CANV_SIZE;
    canv_overlay.height = CANV_SIZE;

    canv_bk = document.createElement('canvas');
    canv_bk.width = CANV_SIZE;
    canv_bk.height = CANV_SIZE;

    canv_cover = document.createElement('canvas');
    canv_cover.width = CANV_SIZE;
    canv_cover.height = CANV_SIZE;

    canv_score = document.createElement('canvas');
    canv_score.width = CANV_SIZE;
    canv_score.height = CANV_SIZE;

    canv_cache = document.createElement('canvas');
    canv_cache.width = CANV_SIZE;
    canv_cache.height = CANV_SIZE;

    cellSize = CANV_SIZE / 6;
    turn_player = 1;
    demo = true;

    //retina対応
    ctx.canvas.style.width = CANV_SIZE/RATIO + "px";
    ctx.canvas.style.height = CANV_SIZE/RATIO + "px";
    ctx.canvas.width = CANV_SIZE ;
    ctx.canvas.height = CANV_SIZE ;

    if ('ontouchstart' in window) {
      isTouch = true;
    } else {
      isTouch = false;
    }
    // イベントを設定
    if (isTouch) {
      document.querySelector('#canv').addEventListener('touchstart', ev_mouseClick);
      document.querySelector('#canv').addEventListener('touchmove', ev_touchMove);
    } else {
      document.querySelector('#canv').addEventListener('mousemove', ev_mouseMove);
      document.querySelector('#canv').addEventListener('mouseup', ev_mouseClick);
    }
    document.querySelector('#level').addEventListener('change', ev_radioChange);
    document.querySelector('#prevprev').addEventListener('click', move_start);
    document.querySelector('#prev').addEventListener('click', move_prev);
    document.querySelector('#next').addEventListener('click', move_next);
    document.querySelector('#nextnext').addEventListener('click', move_end);
    document.querySelector('#replay').addEventListener('click', jumpkento);
    document.querySelector('#tweetlog').addEventListener('click', tweetlog);
    document.querySelector('#newgame').addEventListener('click', reloadnew);
    document.querySelector('#collapsible').addEventListener('click', function () {
      document.querySelector('.manual').classList.toggle("hide");
    });


    window.addEventListener('orientationchange', zoom);

    shuffleBoard();

    // 連勝記録初期化
    if (!storage.getItem('level_1')) {
      storage.setItem('level_1', 0);
    }
    if (!storage.getItem('level_2')) {
      storage.setItem('level_2', 0);
    }
    if (!storage.getItem('level_3')) {
      storage.setItem('level_3', 0);
    }
    if (!storage.getItem('level_4')) {
      storage.setItem('level_4', 0);
    }
    if (!storage.getItem('level_5')) {
      storage.setItem('level_5', 0);
    }
    // レベル記憶
    if (storage.getItem('level_save') !== undefined && storage.getItem('level_save') !== 'undefined' && storage.getItem('level_save') !== null) {
      document.querySelector('#level').value=parseInt(storage.getItem('level_save'));
    } else {
      storage.setItem('level_save', 1);
      document.querySelector('#level').value=1;
    }

    //document.querySelector('#canv').classList.add("hue-rotate1");


    // パラメータを取得
    let paramObj = getParam();

    // 盤面を初期化
    if (paramObj.init) {
      startMap = getMapByParam(paramObj.init);
      thisMap = Aijs.copyMap(startMap);
    } else {
      startMap = Aijs.copyMap(thisMap);
    }
    // ログをデコード
    if (paramObj.log) {
      logArray = decodeLog(paramObj.log, startMap);
    }
    // レベル取得
    if (paramObj.lv) {
      document.querySelector('#level').value=parseInt(paramObj.lv);
    }

    if (logArray.length !== 0) {
      document.querySelector('#log').classList.remove("hide");
      document.querySelector('#prevprev').classList.remove("hide");
      document.querySelector('#prev').classList.remove("hide");
      document.querySelector('#next').classList.remove("hide");
      document.querySelector('#nextnext').classList.remove("hide");
      document.querySelector('#span_replay').classList.add("hide");
      document.querySelector('#span_tweetlog').classList.add("hide");
      document.querySelector('#next').focus();
    } else {
      document.querySelector('#log').classList.add("hide");
      document.querySelector('#prevprev').classList.add("hide");
      document.querySelector('#prev').classList.add("hide");
      document.querySelector('#next').classList.add("hide");
      document.querySelector('#nextnext').classList.add("hide");
      document.querySelector('#span_replay').classList.add("hide");
      document.querySelector('#span_tweetlog').classList.add("hide");
    }

    // 画像読み込み成功時
    img_bk.onload = function () {
      img_bk_loaded = true;
      flush(true, false);
    };
    // 画像読み込み失敗時
    img_bk.onerror = function () {
      flush(true, false);
    };
    // もう既に読み込み終わってた時
    if (img_bk.width !== 0) {
      img_bk_loaded = true;
      flush(true, false);
    }
    // 2.5秒後に強制描画※Googleの検索結果から飛ぶとなぜか描画が走らない事があるので。
    setTimeout(function () {
      if (img_bk.width !== 0) {
        img_bk_loaded = true;
      }
      flush(true, false);
    }, 2500);
    updateMessage();
    setTweet(); // ツイートボタンを生成

    if (logArray.length === 0) {
      if(isBot()==false){
        window.setTimeout(function(){
          if(demo==true){
            intervalID = window.setInterval(playDemo, 400);
            playDemo();
          }
        },500);
      }
    } else {
      demo = false;
      autoLog=true;
      intervalID_log = window.setInterval(playLog, 1000);      
    }
    goaled=false;
    flush(true, false);
  }

  /** 
   * Demoを再生
   */
  function playDemo() {
    if (intervalID !==null) {
      if (Math.random() > 0.3) {
        ai(2);
      } else {
        ai(1);
      }
    }
    demo_inc++;
    calcScore();
    flush(false, false);
    if (winner === 1 || winner === -1 || winner === 0) {
      goaled=true;
      winner = null;
      flush(false, false);
      shuffleBoard();
    }
    if(demo_inc>42){
      window.clearInterval(intervalID);
    }
  }

  /** 
   * Logを再生
   */
  function playLog() {

    if (intervalID_log !==null&&autoLog==true) {
      move_next();
    }else{
      clearInterval(intervalID_log);
    }
  }

  /** 
   * 小さい画面ではViewportを固定化
   */
  function zoom() {
    let viewport = document.querySelector('meta[name=viewport]');
    if (screen.width < 500 && screen.height < 500) {
      if (screen.width < screen.height) {
        viewport.setAttribute('content', 'width=500,user-scalable=no');
      } else {
        viewport.setAttribute('content', 'height=500,user-scalable=no');
      }
    } else if (screen.width < 500) {
      viewport.setAttribute('content', 'width=500,user-scalable=no');
    } else if (screen.height < 500) {
      viewport.setAttribute('content', 'height=500,user-scalable=no');
    }
    // iOS9のViewportはなぜか機能してくれない。
    if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
      let w = screen.width;
      let w2 = 520;
      if (Math.abs(window.orientation) !== 0) {
        w = screen.height;
        w2 = 900;
      }
      let rate = Math.round((w / w2) * 1000) / 1000.0;
      if (rate == Math.round(rate)) { // iOS 9のViewportは整数指定すると機能しない
        rate += 0.0001;
      }

      viewport.setAttribute(
        'content',
        'initial-scale=' + rate + ', minimum-scale=' + rate + ', maximum-scale=' + rate + ', user-scalable=no'
      );
    }
  }

  /** 
   * マウス移動時処理
   */
  function ev_mouseMove(e) {
    getMousePosition(e);
    flush(false, true);
  }
  /** 
   * タッチ移動時処理
   */
  function ev_touchMove(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  /** 
   * マウスクリック時処理
   */
  function ev_mouseClick(e) {
    getMousePosition(e);
    let target = Math.floor(mouse_x / cellSize) * 10+ Math.floor(mouse_y / cellSize);
    if (winner !== null || logArray.length !== 0) {
      reloadnew();
      return true;
    }
    if (demo === true) {
      demo = false;
      thisHand = [];
      thisMap = Aijs.copyMap(startMap);
      logArray2 = [];
      flush(false, false);
      winner = null;
      goaled=false;
      turn_player = 1;
      window.clearInterval(intervalID);
      flush(false, false);
      return true;
    }

    if (hover_piece === null) {
      if (thisMap[target] * turn_player > 0) {
        hover_piece = target;
      }
    } else {
      if (target == hover_piece) {
        hover_piece = null;
        flush(false, false);
        return;
      }
      let canm = Aijs.getCanMovePanelX(hover_piece, thisMap);
      if (canm.indexOf(target) >= 0) {
        flush(false, true);
        if(isGoaled(thisMap,target,turn_player)){
            goaled=true;
            flush(false, true);
            setTimeout(function(){
              goaled=false;
              flush(false, false);
            },2000);
        }


        thisMap[target] = thisMap[hover_piece];
        thisMap[hover_piece] = 0;
        turn_player = turn_player * -1;
        logArray2.push([hover_piece, target]);
        thisHand = [hover_piece, target];
        hover_piece = null;


        // AIが考える。
        message = 'thinking...';
        window.setTimeout(function () {
          flush(false, false);
        }, 50);
        updateMessage();
        if (winner === null) {
          window.setTimeout(function () {
            ai(document.querySelector('#level').value);
            message = '';
            updateMessage();
            flush(false, false);
          }, 250);
        }
      }
    }
    flush(false, false);
  }

  /** 
   * ラジオボタン変更時処理
   */
  function ev_radioChange() {
    let num = document.querySelector('#level').value;
    storage.setItem('level_save', num);
    if (storage.getItem('level_' + num) > 0) {
      document.querySelector('#wins').innerHTML = storage.getItem('level_' + num) + ' win!';
    } else {
      document.querySelector('#wins').innerHTML = '';
    }
    thisMap = Aijs.copyMap(startMap);
    thisHand = [];
    map_list = {};
    logArray2 = [];
    flush(false, false);
  }

  /** 
   * AIに考えてもらう。
   */
  function ai(level) {
    let hand;
    let startTime = new Date();
    let endTime;
    // 終盤になったら長考してみる。
    let count = getNodeCount(thisMap) / 2;
    let plus = 0;
    level = parseInt(level);
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

    hand = Aijs.thinkAI(thisMap, turn_player, level + plus + 1)[0];
    thisHand = hand;
    if (hand) {
      if(isGoaled(thisMap,hand[1],turn_player)){
          goaled=true;
          flush(false, true);
          setTimeout(function(){
            goaled=false;
            flush(false, false);
          },2000);
      }
      thisMap[hand[1]] = thisMap[hand[0]];
      thisMap[hand[0]] = 0;
      logArray2.push([hand[0], hand[1]]);
      // //フォーカス座標を移す。
      // mouse_x = Math.floor(hand[1] / 10)*cellSize+1
      // mouse_y = Math.floor(hand[1] % 10)*cellSize+1
    }
    turn_player = turn_player * -1;
    endTime = new Date();
    thinktime = (endTime - startTime) / 1000;
  }
  /** 
   * ゴールしたか
   */
  function isGoaled(map,afterHand,turn){
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
  function shuffleBoard() {
    // クリア
    for (let num in thisMap) {
      thisMap[num] = 0;
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
      thisMap[blue_num[num]] = arr[num];
    }
    for (let num in red_num) {
      thisMap[red_num[num]] = -1 * arr[num];
    }
  }

  /** 
   * マウス位置取得
   */
  function getMousePosition(e) {
    if(e==null){
      return;
    }
    if (!e.clientX) { // SmartPhone
      if (e.touches) {
        e = e.touches[0];
      } else if (e.touches) {
        e = e.touches[0];
      } else {
        e = event.touches[0];
      }
    }
    let rect = e.target.getBoundingClientRect();
    mouse_x = e.clientX - rect.left;
    mouse_y = e.clientY - rect.top;
    mouse_x = mouse_x *  RATIO;
    mouse_y = mouse_y *  RATIO;
  }

  /** 
   * 画面描画。
   */
  function flush(initflg, cache_flg) {
    let wkMap = new Int8Array(thisMap);
    ctx.clearRect(0, 0, CANV_SIZE, CANV_SIZE);

    if (cache_flg === false) {
      cache_on = false;
    }
    // キャッシュに保存
    if (cache_flg === false || cache_on === false) {
      // 盤面を描画
      ctx.drawImage(drawBoard(initflg), 0, 0, CANV_SIZE, CANV_SIZE);

      // テカリを描画
      ctx.drawImage(drawBoard2(initflg), 0, 0, CANV_SIZE, CANV_SIZE);

      // 選択したコマを除外
      if (hover_piece !== null) {
        wkMap[hover_piece] = 0;
      }

      // 残像を表示
      ctx.drawImage(drawShadow(wkMap, thisHand), 0, 0, CANV_SIZE, CANV_SIZE);


      // コマを表示
      ctx.drawImage(drawPieceAll(wkMap), 0, 0, CANV_SIZE, CANV_SIZE);

      // キャッシュに保存
      let ctx_canv = canv_cache.getContext('2d');
      ctx_canv.clearRect(0, 0, CANV_SIZE, CANV_SIZE);
      ctx_canv.drawImage(ctx.canvas, 0, 0, CANV_SIZE, CANV_SIZE);
      // キャッシュ有効化
      cache_on = true;
    } else {
      // キャッシュから描画
      ctx.drawImage(canv_cache, 0, 0, CANV_SIZE, CANV_SIZE);
    }

    // 選択したコマを表示
    ctx.drawImage(drawHoverPiece(), 0, 0, CANV_SIZE, CANV_SIZE);

    if ((mouse_x !== 0 || mouse_y !== 0) && demo === false) {
      // フォーカスを描画
      ctx.drawImage(drawFocus(), 0, 0, CANV_SIZE, CANV_SIZE);
    }

    //スコアを表示
    if(goaled||winner!==null){
      if(demo===false&&autoLog==false){
        ctx.drawImage(drawScore(), 0, 0, CANV_SIZE, CANV_SIZE);
      }
    }
    // メッセージを描画
    ctx.drawImage(drawOverlay(), 0, 0, CANV_SIZE, CANV_SIZE);

    // カバーを描画
    if (demo === true) {
      ctx.drawImage(drawCover(), 0, 0, CANV_SIZE, CANV_SIZE);
    }


  }

  /** 
   * 背景描画
   */
  function drawBk() {
    let ctx_bk = canv_bk.getContext('2d');
    if (img_bk_loaded) {
      ctx_bk.drawImage(img_bk, 0, 0, CANV_SIZE/RATIO, CANV_SIZE/RATIO, 0, 0, CANV_SIZE, CANV_SIZE);
    }
    return canv_bk;
  }
  /** 
   * カバー描画
   */
  function drawCover() {
    // 背景
    let ctx_cover = canv_cover.getContext('2d');
    ctx_cover.clearRect(0, 0, CANV_SIZE, CANV_SIZE);
    ctx_cover.globalAlpha = 0.50;
    ctx_cover.fillStyle = '#000000';
    ctx_cover.fillRect(0, 0, CANV_SIZE, CANV_SIZE);

    // 枠
    let x = cellSize * 2;
    let y = cellSize * 3.5;
    ctx_cover.shadowBlur = 20;
    ctx_cover.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx_cover.shadowOffsetX = 5;
    ctx_cover.shadowOffsetY = 5;
    ctx_cover.globalAlpha = 0.8;
    ctx_cover.fillStyle = COLOR_WHITE;
    ctx_cover.beginPath();
    fillRoundRect(ctx_cover, x, y, cellSize * 2, cellSize * 1, cellSize/20);
    ctx_cover.shadowColor = 'rgba(0, 0, 0, 0)';
    ctx_cover.shadowBlur = 0;
    ctx_cover.shadowOffsetX = 0;
    ctx_cover.shadowOffsetY = 0;




    // 文字
    let fontsize = Math.round(cellSize * 0.5);
    let message = 'Play';
    message+=(demo_inc%10==0)?" ":"";
    ctx_cover.shadowBlur = 0;
    ctx_cover.shadowOffsetX = 0;
    ctx_cover.shadowOffsetY = 0;
    ctx_cover.shadowColor = 'rgba(0, 0, 0, 0)';
    ctx_cover.font = 'bold ' + fontsize + 'px Play,sans-serif';
    ctx_cover.globalAlpha = 1;
    ctx_cover.fillStyle = COLOR_LINE;
    ctx_cover.textBaseline = 'middle';
    ctx_cover.textAlign = 'center';
    ctx_cover.beginPath();
    ctx_cover.fillText(message, cellSize * 3, cellSize * 4);
    // 文字２
    message = 'colamone';
    fontsize = Math.round(cellSize * 1);
    ctx_cover.font = 'bold ' + fontsize + 'px Play,sans-serif';
    ctx_cover.fillStyle = COLOR_WHITE;
    ctx_cover.shadowBlur = 0;
    ctx_cover.beginPath();
    ctx_cover.fillText(message, cellSize * 3, cellSize * 2);


    return canv_cover;
  }

  /** 
   * スコア描画
   */
  function drawScore() {
    // 背景
    let ctx_score = canv_score.getContext('2d');
    let message ="";
    let fontsize = Math.round(cellSize *1.5);
    let blue=COLOR_BLUE2;
    let red=COLOR_RED2;
    ctx_score.clearRect(0, 0, CANV_SIZE, CANV_SIZE);

    ctx_score.globalAlpha = 0.4;
    ctx_score.textBaseline = 'middle';
    ctx_score.textAlign = 'center';
    ctx_score.shadowBlur = 10;
    ctx_score.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx_score.font = 'bold ' + fontsize + 'px Play,sans-serif';

    // 文字
    ctx_score.globalAlpha = 0.3;
    ctx_score.shadowBlur = 2;
    ctx_score.shadowColor = 'rgba(255, 255, 255, 1)';
    ctx_score.fillStyle = red;
    message = redScore;
    ctx_score.beginPath();
    ctx_score.fillText(message, cellSize * 1, cellSize * 3.8);
    // 文字
    message = "8";
    ctx_score.beginPath();
    ctx_score.fillText(message, cellSize * 2, cellSize * 5.3);
    //線
    ctx_score.lineWidth=cellSize*0.2;
    ctx_score.strokeStyle = red;
    ctx_score.beginPath();
    ctx_score.moveTo(cellSize * 0.4, cellSize * 5.55);
    ctx_score.lineTo(cellSize * 2.6, cellSize * 3.55);
    ctx_score.closePath();
    ctx_score.stroke();


    // 文字
    message = blueScore;
    ctx_score.fillStyle = blue;
    ctx_score.beginPath();
    ctx_score.fillText(message, cellSize * 4, cellSize * 0.7);
    // 文字
    message = "8";
    ctx_score.beginPath();
    ctx_score.fillText(message, cellSize * 5, cellSize * 2.3);
    // 文字
    ctx_score.lineWidth=cellSize*0.2;
    ctx_score.strokeStyle = blue;
    ctx_score.beginPath();
    ctx_score.moveTo(cellSize * 3.4, cellSize * 2.55);
    ctx_score.lineTo(cellSize * 5.6, cellSize * 0.55);
    ctx_score.closePath();
    ctx_score.stroke();
    return canv_score;
  }



  /** 
   * フォーカスを描画
   */
  function drawFocus() {
    // 選択マスを強調
    let x = mouse_x - (mouse_x % cellSize);
    let y = mouse_y - (mouse_y % cellSize);
    let ctx_focus = canv_focus.getContext('2d');
    let grad = ctx_focus.createRadialGradient(x, y, 0, x,y, cellSize);
    grad.addColorStop(0.3, COLOR_SELECT);
    grad.addColorStop(1, COLOR_SELECT2);
    ctx_focus.clearRect(0, 0, CANV_SIZE, CANV_SIZE);
    ctx_focus.globalAlpha = 0.35;
    ctx_focus.fillStyle = grad;
    ctx_focus.lineWidth = 1;
    ctx_focus.beginPath();
    ctx_focus.fillRect(x, y, cellSize, cellSize);


    if (isTouch === true && hover_piece === null) {
      return canv_focus;
    }

    // 移動可能マスを強調
    let target = (x / cellSize) * 10 + (y / cellSize);
    if (thisMap[target] * turn_player > 0) {
      let canm = Aijs.getCanMovePanelX(target, thisMap);
      for (let i = 0; i <= canm.length - 1; i++) {
        x = Math.floor(canm[i] / 10);
        y = Math.floor(canm[i] % 10);
        ctx_focus.globalAlpha = 0.6;
        ctx_focus.strokeStyle = COLOR_SELECT;
        ctx_focus.lineWidth = cellSize/20;
        ctx_focus.beginPath();
        ctx_focus.arc(x * cellSize + (cellSize / 2), y * cellSize + (cellSize / 2),
         (cellSize / 2) - (cellSize/10), 0, Math.PI * 2, false);
        ctx_focus.stroke();
      }
    }
    return canv_focus;
  }

  /** 
   * 盤面を描画してCANVASを返す。
   */
  function drawBoard(initflg) {
    if (initflg === false) {
      return canv_board;
    }
    let ctx_board = canv_board.getContext('2d');
    ctx_board.clearRect(0, 0, CANV_SIZE, CANV_SIZE);

    let grad = ctx_board.createLinearGradient(0, 0, CANV_SIZE, CANV_SIZE);
    grad.addColorStop(0, COLOR_PANEL_6);
    grad.addColorStop(0.3, COLOR_PANEL_5);
    grad.addColorStop(1, COLOR_PANEL_4);

    for (let x = 0; x < 6; x++) {
      for (let y = 0; y < 6; y++) {
        // パネル描画
        ctx_board.strokeStyle = COLOR_LINE;
        if (y === 0) {
          ctx_board.fillStyle = COLOR_PANEL_1;
        } else if (y == 5) {
          ctx_board.fillStyle = COLOR_PANEL_2;
        } else if ((x + y) % 2 === 0) {
          ctx_board.fillStyle = COLOR_PANEL_3;
        } else {
          ctx_board.fillStyle = COLOR_PANEL_4;
          ctx_board.fillStyle = grad;
        }
        ctx_board.beginPath();
        ctx_board.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        ctx_board.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }

    return canv_board;
  }

  /** 
   * 盤面をテカテカにする。
   */
  function drawBoard2(initflg) {
    if (initflg === false) {
      return canv_board2;
    }
    let ctx_board2 = canv_board2.getContext('2d');
    ctx_board2.clearRect(0, 0, CANV_SIZE, CANV_SIZE);
    ctx_board2.globalAlpha = 0.07;
    ctx_board2.fillStyle = COLOR_WHITE;
    ctx_board2.beginPath();
    ctx_board2.arc(cellSize * 1, -3 * cellSize, 7 * cellSize, 0, Math.PI * 2, false);
    ctx_board2.fill();

    return canv_board2;
  }


  /** 
   * 浮遊しているコマを描画する。
   */
  function drawHoverPiece() {
    let ctx_hover = canv_hover_piece.getContext('2d');
    ctx_hover.clearRect(0, 0, CANV_SIZE, CANV_SIZE);
    let x = mouse_x - (cellSize / 2);
    let y = mouse_y - (cellSize / 2);
    if (hover_piece !== null) {
      drawPiece(ctx_hover, x, y, thisMap[hover_piece], false);
    }
    return canv_hover_piece;
  }

  /** 
   * コマを描画する。
   */
  function drawPiece(wkCtx, x, y, number, goal) {
    let wkColor;

    // 外枠を描画
    if (number === 0) {
      return wkCtx;
    } else if (number > 0) {
      wkColor = COLOR_BLUE;
    } else {
      wkColor = COLOR_RED;
    }

    let grad = ctx.createLinearGradient(x, y, x + cellSize, y + cellSize);
    grad.addColorStop(0, 'rgb(255, 255, 255)');
    grad.addColorStop(0.4, wkColor);
    grad.addColorStop(1, wkColor);

    wkCtx.shadowBlur = 10;
    wkCtx.shadowColor = 'rgba(0, 0, 0, 1)';
    wkCtx.shadowOffsetX = 2;
    wkCtx.shadowOffsetY = 2;
    wkCtx.fillStyle = grad;
    wkCtx.beginPath();
    fillRoundRect(wkCtx, x + cellSize / 10, y + cellSize / 10, cellSize - 1 * cellSize / 5, cellSize - 1 * cellSize / 5, cellSize/20);

    wkCtx.shadowColor = 'rgba(0, 0, 0, 0)';
    wkCtx.shadowBlur = 0;
    wkCtx.shadowOffsetX = 0;
    wkCtx.shadowOffsetY = 0;

    // 曇りエフェクト
    if (img_bk_loaded) {
      wkCtx.globalAlpha = 0.35;
      wkCtx.save();
      wkCtx.clip();
      wkCtx.drawImage(drawBk(true), x + cellSize / 10, y + cellSize / 10, cellSize - 1 * cellSize / 5, cellSize - 1 * cellSize / 5);
      wkCtx.restore();
      wkCtx.globalAlpha = 1;
    }

    // 文字を描画。
    wkCtx.fillStyle = COLOR_WHITE;
    
    let fontsize = Math.round(cellSize * 0.18);
    wkCtx.textBaseline = 'middle';
    wkCtx.textAlign = 'center';
    wkCtx.font = fontsize + "pt 'Play',Arial";
    wkCtx.beginPath();

    // 数字を印字
    wkCtx.fillText(Math.abs(number), x + (cellSize / 2), y + (cellSize / 2));

    // 点を描画
    for (let i = 0; i <= PIECES[number].length - 1; i++) {
      if (PIECES[number][i] === 0) {
        continue;
      }
      let x_dot = x + cellSize / 4.16 + (Math.floor(cellSize - 1 * cellSize / 5) / 3) * Math.floor(i % 3.0);
      let y_dot = y + cellSize / 4.16 + (Math.floor(cellSize - 1 * cellSize / 5) / 3) * Math.floor(i / 3.0);

      wkCtx.fillStyle = COLOR_WHITE;

      wkCtx.beginPath();
      wkCtx.arc(x_dot, y_dot, cellSize * 0.06, 0, Math.PI * 2, false);
      wkCtx.fill();
    }

    if (goal) { // 得点を印字
      wkCtx.shadowBlur = 10;
      wkCtx.shadowColor = 'rgba(0, 0, 0, 1)';
      wkCtx.globalAlpha = 1;
      wkCtx.fillStyle = COLOR_WHITE;
      fontsize = Math.round(cellSize * 0.5);
      wkCtx.textBaseline = 'middle';
      wkCtx.textAlign = 'center';
      wkCtx.font = 'bolder ' + fontsize + 'pt Play,Arial ';
      wkCtx.beginPath();
      wkCtx.fillText(Math.abs(number), x + (cellSize / 2), y + (cellSize / 2));
      wkCtx.globalAlpha = 1;
      wkCtx.shadowColor = 'rgba(0, 0, 0, 0)';
      wkCtx.shadowBlur = 0;
    }

    return wkCtx;
  }
  // 角丸
  function fillRoundRect(ctx, x, y, w, h, r) {
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
  function drawPieceAll(wkMap) {
    let ctx_pieces = canv_pieces.getContext('2d');
    ctx_pieces.clearRect(0, 0, CANV_SIZE, CANV_SIZE);
    for (let x = 0; x < 6; x++) {
      for (let y = 0; y < 6; y++) {
        if (wkMap[x * 10 + y] !== 0) {
          let goal = false;
          if (wkMap[x * 10 + y] > 0 && y === 0) {
            goal = true;
          } else if (wkMap[x * 10 + y] < 0 && y == 5) {
            goal = true;
          }
          ctx_pieces = drawPiece(ctx_pieces, x * cellSize, y * cellSize, wkMap[x * 10 + y], goal);
        }
      }
    }
    return canv_pieces;
  }
  /** 
   * 残像を描画する。
   */
  function drawShadow(wkMap, hand) {
    let ctx_shadow = canv_shadow.getContext('2d');
    ctx_shadow.clearRect(0, 0, CANV_SIZE, CANV_SIZE);
    let x0 = (hand[0] / 10 | 0);
    let y0 = hand[0] % 10;
    let x1 = (hand[1] / 10 | 0);
    let y1 = hand[1] % 10;
    let h = cellSize - 1 * cellSize / 5;
    let w = cellSize - 1 * cellSize / 5;
    let x = x1 * cellSize + cellSize / 10;
    let y = y1 * cellSize + cellSize / 10;
    let shadow_start_x = x + w / 2;
    let shadow_start_y = y + h / 2;
    let shadow_end_x = shadow_start_x;
    let shadow_end_y = shadow_start_y;
    let number = wkMap[hand[1]];
    let wkColor = '';
    let center = 0;
    let grad;
    if (hand.length != 2) {
      return canv_shadow;
    }
    if (number > 0) {
      wkColor = COLOR_BLUE; // "#EAEFFD";   
    } else {
      wkColor = COLOR_RED; // "#FDEAFA";           
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
      grad = ctx_shadow.createLinearGradient(shadow_start_x, shadow_start_y, shadow_end_x, shadow_end_y);

      grad.addColorStop(0, wkColor);
      grad.addColorStop(center, wkColor);
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx_shadow.fillStyle = grad;
      ctx_shadow.fillRect(x, y, h, w);
    } else { // 斜め移動
      if ((x0 + y0) % 2 === 0 && y0 !== 0 && y0 != 5) {
        center = 0.3;
      } else {
        center = 0.5;
      }
      let px1, py1, px2, py2, px3, py3, px4, py4;
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
      ctx_shadow.beginPath();
      ctx_shadow.moveTo(px1, py1);
      ctx_shadow.lineTo(px2, py2);
      ctx_shadow.lineTo(px3, py3);
      ctx_shadow.lineTo(px4, py4);
      ctx_shadow.lineTo(px1, py1);
      ctx_shadow.closePath();
      grad = ctx_shadow.createLinearGradient(shadow_start_x, shadow_start_y, shadow_end_x, shadow_end_y);
      grad.addColorStop(0, wkColor);
      grad.addColorStop(center, wkColor);
      grad.addColorStop(0.97, 'rgba(255, 255, 255, 0)');
      ctx_shadow.fillStyle = grad;
      ctx_shadow.fill();
    }

    return canv_shadow;
  }
  /** 
   * メッセージを描画
   */
  function drawOverlay() {
    let ctx_overlay = canv_overlay.getContext('2d');
    let x = cellSize * 1.3;
    let y = cellSize * 2.5;

    ctx_overlay.clearRect(0, 0, CANV_SIZE, CANV_SIZE);

    if (message === '') {
      return canv_overlay;
    }
    ctx_overlay.shadowBlur = 10;
    ctx_overlay.shadowColor = 'rgba(100, 100, 100, 0.5)';
    ctx_overlay.shadowOffsetX = 5;
    ctx_overlay.shadowOffsetY = 5;

    ctx_overlay.globalAlpha = 0.9;
    ctx_overlay.fillStyle = COLOR_WHITE;
    fillRoundRect(ctx_overlay, x, y, cellSize * 3.4, cellSize * 1, cellSize/20);

    let fontsize = Math.round(cellSize * 0.36);
    ctx_overlay.shadowBlur = 0;
    ctx_overlay.shadowOffsetX = 0;
    ctx_overlay.shadowOffsetY = 0;
    ctx_overlay.shadowColor = 'rgba(0, 0, 0, 0)';
    ctx_overlay.font = 'bold ' + fontsize + 'px Play,sans-serif';
    ctx_overlay.globalAlpha = 1;
    ctx_overlay.fillStyle = COLOR_LINE;
    ctx_overlay.textBaseline = 'middle';
    ctx_overlay.textAlign = 'center';
    ctx_overlay.beginPath();
    ctx_overlay.fillText(message, cellSize * 3, cellSize * 3);

    return canv_overlay;
  }

  /** 
   * メッセージを更新
   */
  function updateMessage() {
    calcScore();
    let Block = '';
    document.querySelector('#blue').innerHTML = 'Blue: ' + blueScore + '/8';
    document.querySelector('#red').innerHTML = ' Red: ' + redScore + '/8';
    document.querySelector('#time').innerHTML = '(' + (thinktime.toFixed(3)) + 'sec)';
    if (logArray.length === 0) {
      if (winner == 1) {
        message = 'You win!';
        storage.setItem('level_' + document.querySelector('#level').value,
          parseInt(storage.getItem('level_' + document.querySelector('#level').value)) + 1);
        endgame();
      } else if (winner == -1) {
        message = 'You lose...';
        storage.setItem('level_' + document.querySelector('#level').value, 0);
        endgame();
      } else if (winner === 0) {
        if (map_list[JSON.stringify(thisMap)] >= LIMIT_1000DAY) {
          message = '3fold repetition';
        } else {
          message = '-- Draw --';
        }
        endgame();
      }
    }

    if (storage.getItem('level_' + document.querySelector('#level').value) > 0) {
      document.querySelector('#wins').innerHTML = storage.getItem('level_' + document.querySelector('#level').value) + ' win!';
    } else {
      document.querySelector('#wins').innerHTML = '';
    }
  }

  /** 
   * ゲーム終了
   */
  function endgame() {
    if (logArray.length === 0) {
      document.querySelector('#span_replay').classList.remove("hide");
      document.querySelector('#span_tweetlog').classList.remove("hide");
    }
  }
  /** 
   * 得点計算。
   */
  function calcScore() {
    let sum1 = 0;
    let sum2 = 0;
    let GoalTop = [0, 10, 20, 30, 40, 50];
    let GoalBottom = [5, 15, 25, 35, 45, 55];
    // 点数勝利        
    for (let i in GoalTop) {
      if (thisMap[GoalTop[i]] * 1 > 0) {
        sum1 += thisMap[GoalTop[i]];
      }
    }
    for (let i in GoalBottom) {
      if (thisMap[GoalBottom[i]] * -1 > 0) {
        sum2 += thisMap[GoalBottom[i]];
      }
    }
    if (sum1 >= 8) {
      winner = 1;
    } else if (sum2 <= -8) {
      winner = -1;
    }

    // 手詰まりは判定
    if (isNoneNode(thisMap)) {
      if (Math.abs(sum1) > Math.abs(sum2)) {
        winner = 1;
      } else if (Math.abs(sum1) < Math.abs(sum2)) { // 引き分けは後攻勝利
        winner = -1;
      } else if (Math.abs(sum1) == Math.abs(sum2)) {
        winner = 0;
      }
    } else {
      if (is1000day(thisMap) === true) {
        winner = 0;
      }
    }
    blueScore = Math.abs(sum1);
    redScore = Math.abs(sum2);
  }

  /** 
   * 手詰まり判定。
   */
  function isNoneNode(wkMap) {
    let flag1 = false;
    let flag2 = false;
    for (let panel_num in wkMap) {
      if (wkMap[panel_num] === 0) {
        continue;
      }
      let canMove = Aijs.getCanMovePanelX(panel_num, wkMap);
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
  function is1000day(wkMap) {
    let map_json = JSON.stringify(wkMap);
    if (map_list[map_json] === undefined) {
      map_list[map_json] = 1;
      return false;
    } else {
      map_list[map_json] += 1;
    }
    if (map_list[map_json] >= LIMIT_1000DAY) {
      return true;
    }
    return false;
  }

  /** 
   * 手の数を取得
   */
  function getNodeCount(wkMap) {
    let count = 0;
    for (let panel_num in wkMap) {
      if (wkMap[panel_num] === 0) {
        continue;
      }
      let canMove = Aijs.getCanMovePanelX(panel_num, wkMap);
      count += canMove.length;
    }
    return count;
  }


  /** 
   * パラメータ取得
   */
  function getParam() {
    let obj = {};
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
  function getMapByParam(initString) {
    let wkMap;
    if (initString) {
      wkMap = Aijs.copyMap(thisMap);
      // クリア
      for (let num in wkMap) {
        wkMap[num] = 0;
      }
      let arr = initString.split(',');
      if (arr.length < 8) {
        arr = [1, 2, 3, 4, 5, 6, 7, 8];
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

    return wkMap;
  }
  /** 
   * ログをデコード。
   */
  function decodeLog(logstr, wkInitMap) {
    let wklogArray = [];
    let wkMap = Aijs.copyMap(wkInitMap);
    let arrow = {
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
      let arw = arrow[logArr[i].match(/[qweasdzxc]/)[0]];
      let from = parseInt(logArr[i].match(/\d*/)[0]);
      let to = (Math.floor(from / 10) + Math.floor(arw % 3) - 1) * 10 +
       (Math.floor(from % 10) + Math.floor(arw / 3) - 1);
      wkMap = Aijs.copyMap(wkMap);
      wkMap[to] = parseInt(wkMap[from]);
      wkMap[from] = 0;
      wklogArray.push(wkMap);
    }
    return wklogArray;
  }
  /** 
   * ログをエンコード
   */
  function encodeLog(wklogArray) {
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
  function move_start() {
    logPointer = 0;
    autoLog=false;    
    thisMap = Aijs.copyMap(logArray[logPointer]);
    winner=null;
    goaled=false;
    updateMessage();
    flush(false, false);
  }

  /** 
   * ログを戻す
   */
  function move_prev() {
    if (logPointer <= 0) { return; }
    autoLog=false;    
    logPointer -= 1;
    thisMap = Aijs.copyMap(logArray[logPointer]);
    winner=null;
    goaled=false;
    updateMessage();
    flush(false, false);
  }

  /** 
   * ログを進める
   */
  function move_next() {
    if (logPointer + 1 > logArray.length - 1) { return; }
    logPointer += 1;
    thisMap = Aijs.copyMap(logArray[logPointer]);
    updateMessage();
    flush(false, false);
  }

  /** 
   * ログを最後まで進める。
   */
  function move_end() {
    logPointer = logArray.length - 1;
    autoLog=false;    
    thisMap = Aijs.copyMap(logArray[logPointer]);
    updateMessage();
    flush(false, false);
  }

  /** 
   * リセット
   */
  function reloadnew() {
    let url = document.location.href.split('?')[0];

    //demo中ならdemoを終了
    if(demo===true){
      ev_mouseClick(null);
      return;
    }

    // パラメータを取得
    let paramObj = getParam();
    if (paramObj.lang) {
      url += '?lang=' + paramObj.lang;
    }
    if (navigator.onLine) {
      location.href = url;
    } else {
      thisMap = Aijs.copyMap(startMap);
      shuffleBoard();
      logArray2 = [];
      message = '';
      winner = null;
      turn_player = 1;
      flush(false, false);
    }
  }

  /** 
   * 検討画面に飛ぶ
   */
  function jumpkento() {
    let url = document.location.href.split('?')[0];
    let init = '?init=' + startMap[55] + ','+
     startMap[45] + ','+
     startMap[35] + ','+
     startMap[25] + ','+
     startMap[15] + ','+
     startMap[5] + ','+
     startMap[44] + ','+
     startMap[14];
    let log = '&log=' + encodeLog(logArray2);
    log += '&lv=' + document.querySelector('#level').value;
    location.href = url + init + log;
  }
  /** 
   * ログをツイートする。
   */
  function tweetlog() {
    let url = document.location.href.split('?')[0];
    let init = '?init=' + startMap[55] + ','+
     startMap[45] + ','+
     startMap[35] + ','+
     startMap[25] + ','+
     startMap[15] + ','+
     startMap[5] + ','+
     startMap[44] + ','+
     startMap[14];
    let log = '%26log=' + encodeLog(logArray2);
    log += '%26lv=' + document.querySelector('#level').value;
    window.open('https://twitter.com/intent/tweet?text=' + url + init + log + '%20%23colamone');
  }
  /** 
   * ツイートボタンを読み込む。
   */
  function setTweet() {
    /*jshint -W030 */
    !function (d, s, id) {
      let js, fjs = d.getElementsByTagName(s)[0];
      if (!d.getElementById(id)) { js = d.createElement(s); js.id = id; js.async = true; js.src = 'https://platform.twitter.com/widgets.js'; fjs.parentNode.insertBefore(js, fjs); }
    } (document, 'script', 'twitter-wjs');
  }
  /** 
   * botかどうか判定
   */
  function isBot(){
    let ua = window.navigator.userAgent.toLowerCase();
    if (ua.indexOf('bot') != -1 ||
    ua.indexOf('lighthouse') != -1||
    ua.indexOf('headless') != -1) {
      return true;
    }
    return false;
  }

})((this || 0).self || global);

/** 
 * init 
 */
document.addEventListener('DOMContentLoaded', function() {
  BoardGamejs.init();
});
