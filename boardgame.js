/** 
 * init 
 */
$(function(){
    BoardGamejs.init();
});


/** 
 * BoardGamejs名前空間 
 */
(function (global) {
    // Class ------------------------------------------------
    function BoardGamejs () {}    
    
    // Header -----------------------------------------------
    global.BoardGamejs = BoardGamejs;
    global.BoardGamejs.init = init;
    

    // Body ---------------------------------------
    var ctx=null;
    var isTouch=true;
    var canv_board=null;
    var canv_board2=null;
    var canv_focus=null;
    var canv_pieces=null;
    var canv_hover_piece=null;
    var canv_overlay=null;
    var canv_bk=null;
    var canv_cache=null;
    var cache_on=false;
    var img_bk_loaded=false;
    var hover_piece=null;
    var cellSize=null;
    var turn_player=null;
    var blueScore=0;
    var redScore=0;
    var winner=null;
    var message="";
    var thinktime=0.0;
    var COLOR_LINE="#333333";
    var COLOR_PANEL_1="#550025";
    var COLOR_PANEL_2="#003856";
    var COLOR_PANEL_3="#FFFFFF";
    var COLOR_PANEL_4="#111111";
    var COLOR_PANEL_5="#444444";
    var COLOR_PANEL_6="#888888";
    var COLOR_SELECT="#7fed7f";
    var COLOR_RED="#E5004F";
    var COLOR_BLUE="#00A0E9";
    var COLOR_WHITE="#FFFFFF";
    var COLOR_GOLD="#FFFF00";
    var PIECES={"1":[1,1,1,
                     1,0,1,
                     1,1,1],
                "2":[1,1,1,
                     1,0,1,
                     1,0,1],
                "3":[1,1,1,
                     0,0,0,
                     1,1,1],
                "4":[1,1,1,
                     0,0,0,
                     1,0,1],
                "5":[1,0,1,
                     0,0,0,
                     1,0,1],
                "6":[1,0,1,
                     0,0,0,
                     0,1,0],
                "7":[0,1,0,
                     0,0,0,
                     0,1,0],
                "8":[0,1,0,
                     0,0,0,
                     0,0,0],
                "-1":[1,1,1,
                      1,0,1,
                      1,1,1],
                "-2":[1,0,1,
                      1,0,1,
                      1,1,1],
                "-3":[1,1,1,
                      0,0,0,
                      1,1,1],
                "-4":[1,0,1,
                      0,0,0,
                      1,1,1],
                "-5":[1,0,1,
                      0,0,0,
                      1,0,1],
                "-6":[0,1,0,
                      0,0,0,
                      1,0,1],
                "-7":[0,1,0,
                      0,0,0,
                      0,1,0],
                "-8":[0,0,0,
                      0,0,0,
                      0,1,0]
               };

    var thisMap={  0:-1,10:-2,20:-3,30:-4,40:-5,50:-6,
                   1: 0,11:-8,21: 0,31: 0,41:-7,51: 0,
                   2: 0,12: 0,22: 0,32: 0,42: 0,52: 0,
                   3: 0,13: 0,23: 0,33: 0,43: 0,53: 0,
                   4: 0,14: 7,24: 0,34: 0,44: 8,54: 0,
                   5: 6,15: 5,25: 4,35: 3,45: 2,55: 1
                  };
    var mouse_x =0;
    var mouse_y =0;
    var startMap;
    var logPointer=0;
    var logArray=new Array();
    var logArray2=new Array();
    var img_bk=null;img_bk = new Image();img_bk.src = "bk.gif";
    var storage=null;    
    try{
        if(window==parent && ('localStorage' in window) && window['localStorage'] !== null){
            storage= localStorage;
            storage.setItem('test',0);//Safariのプライベートモードは、できないのにできるって言うからかまをかけてみる。
        }
    }catch( e ){
        storage=null;
    }
    if(storage==null){
            //localStorageが使えない場合
            storage = new Object();//ダミー
            storage["getItem"]=function(){return undefined;};
            storage["setItem"]=function(){return undefined;};

            if (navigator.cookieEnabled){
                storage["hasItem "]=function (sKey) {
                    return (new RegExp("(?:^|;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
                }
                storage["getItem"]=function (sKey) {
                    if (!sKey || !(new RegExp("(?:^|;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie)) { return null; }
                    return unescape(document.cookie.replace(new RegExp("(?:^|.*;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1"));
                }
                storage["setItem"]=function (sKey, sValue) {
                    if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return; }
                    document.cookie = escape(sKey) + "=" + escape(sValue);
                }
            }
    }

    /** 
     * 初期化
     */
    function init(){
        set_manual();//国際化
        zoom();//小さい端末でズーム
        
        ctx=$("#canv")[0].getContext('2d');

        canv_board =document.createElement("canvas");
        canv_board.width=ctx.canvas.width;
        canv_board.height=ctx.canvas.height;

        canv_board2 =document.createElement("canvas");
        canv_board2.width=ctx.canvas.width;
        canv_board2.height=ctx.canvas.height;


        canv_focus =document.createElement("canvas");
        canv_focus.width=ctx.canvas.width;
        canv_focus.height=ctx.canvas.height;

        canv_pieces =document.createElement("canvas");
        canv_pieces.width=ctx.canvas.width;
        canv_pieces.height=ctx.canvas.height;

        canv_hover_piece =document.createElement("canvas");
        canv_hover_piece.width=ctx.canvas.width;
        canv_hover_piece.height=ctx.canvas.height;

        canv_overlay =document.createElement("canvas");
        canv_overlay.width=ctx.canvas.width;
        canv_overlay.height=ctx.canvas.height;

        canv_bk =document.createElement("canvas");
        canv_bk.width=ctx.canvas.width;
        canv_bk.height=ctx.canvas.height;

        canv_cache =document.createElement("canvas");
        canv_cache.width=ctx.canvas.width;
        canv_cache.height=ctx.canvas.height;

        cellSize=ctx.canvas.width /6;
        turn_player=1;

        if('ontouchstart' in window){
            isTouch=true;
        }else{
            isTouch=false;        
        }
        //イベントを設定
        if(isTouch){
            $("#canv").bind('touchstart',ev_mouseClick)
        }else{
            $("#canv").bind('mousemove ',ev_mouseMove)
            $("#canv").bind('mouseup',ev_mouseClick);
        }
        $("#level").bind('change ',ev_radioChange);
        $("#prevprev").bind('click',move_start);
        $("#prev").bind('click',move_prev);
        $("#next").bind('click',move_next);
        $("#nextnext").bind('click',move_end);
        $("#replay").bind('click',jumpkento);
        $("#tweetlog").bind('click',tweetlog);
        $("#newgame").bind('click',reloadnew);

        shuffleBoard();

        //連勝記録初期化
        if(!storage.getItem('level_1')){
            storage.setItem('level_1',0);
        }
        if(!storage.getItem('level_2')){
            storage.setItem('level_2',0);
        }
        if(!storage.getItem('level_3')){
            storage.setItem('level_3',0);
        }
        if(!storage.getItem('level_4')){
            storage.setItem('level_4',0);
        }
        //レベル記憶
        if(storage.getItem('level_save')!=undefined && storage.getItem('level_save')!="undefined"){
             $('#level').val([ parseInt(storage.getItem('level_save')) ]); 
            $('#level').selectmenu('refresh',true);
        }else{
            storage.setItem('level_save',2);
            $('#level').val([2]); 
        }


        //パラメータを取得
        var paramObj=getParam();
        //盤面を初期化
        if(paramObj["init"]){
            startMap= getMapByParam(paramObj["init"]);
            thisMap=Aijs.copyMap(startMap);
        }else{
            startMap=Aijs.copyMap(thisMap);
        }
        //ログをデコード
        if(paramObj["log"]){
            logArray=decodeLog(paramObj["log"],startMap);
        }

        if(logArray.length!=0){
            $("#log").show();
            $("#prevprev").show();
            $("#prev").show();
            $("#next").show();
            $("#nextnext").show();
            $("#span_replay").hide();
            $("#span_tweetlog").hide();
        }else{
            $("#log").hide();
            $("#prevprev").hide();
            $("#prev").hide();
            $("#next").hide();
            $("#nextnext").hide();
            $("#span_replay").hide();
            $("#span_tweetlog").hide();
        }

        //画像読み込み成功時
        img_bk.onload = function() {
            img_bk_loaded=true;
            flush(true,false);
        }
        //画像読み込み失敗時
        img_bk.onerror = function() { 
            flush(true,false);
        } 
        //もう既に読み込み終わってた時
        if(img_bk.width!=0){
            img_bk_loaded=true;
            flush(true,false);
        }
        // 2.5秒後に強制描画※Googleの検索結果から飛ぶとなぜか描画が走らない事があるので。
        setTimeout(function() {
            if(img_bk.width!=0){
                img_bk_loaded=true;
            }
            flush(true,false);
        }, 2500);  
        updateMessage();
        setTweet();//ツイートボタンを生成
        
    }
    /** 
     * ユーザーの言語環境を取得
     */
    function get_lang() {
        return (navigator.browserLanguage || navigator.language || navigator.userLanguage).substr(0,2).toLowerCase();
    }
    /** 
     * 国際化
     */
    function set_manual(){
        if(get_lang()==="ja"){
            var manual=document.getElementById("manual");
            manual.innerHTML="【ルール】\n\
1.各コマは、丸が付いている方向に進めます。\n\
2.取られたコマは盤上から除かれます。再利用はできません。\n\
3.一番奥の陣地まで進めると、コマの数字が得点になります。\n\
4.得点になったコマは動くことも取ることもできません。\n\
5.先に得点が8点以上になったプレーヤーの勝利です。\n\
6.ただしどちらかのプレーヤーの動かせるコマが無くなった時は\n\
その時点で点数の高いプレーヤーの勝利です。 ";
            var canvas= document.getElementById("canv");
            if (!canvas || !canvas.getContext) { 
                alert("申し訳ございません。お使いのブラウザは対応していません。"); 
            }
            $('#htp').text("Colamoneのルール");
            $('#newgame').text("リセット");
        }else{
            var manual=document.getElementById("manual");
            //Translator:Extractum11
            manual.innerHTML="# How to play Colamone\n\
* Colamone is kinda like chess. \n\
Only some loose similarities. \n\
* Each piece can move 1 tile in the direction \n\
of any of it's dots. \n\
* If a piece gets to the other side, \n\
you get how many ever points it's worth. \n\
* If you get 8 points, you win.\n\
* When a piece gets to the other side, you can \n\
no longer move it and the enemy cannot take it. \n\
* When a player can't make any more moves, \n\
whoever has the highest score wins.";
            $('#htp').text("How to play Colamone");
            $('#newgame').text("Reset");
            var canvas= document.getElementById("canv");
            if (!canvas || !canvas.getContext) { 
                alert("Sorry. Your browser does not support."); 
            }
        }
        if (window.innerHeight < window.innerWidth) {
          $("#collapsible").collapsible({
              collapsed: false
            });
        };
    }
    
    /** 
     * 小さい画面ではViewportを固定化
     */
    function zoom(){
        var viewport = document.querySelector("meta[name=viewport]");
        if(screen.width<500&&screen.height<500){
            if(screen.width<screen.height){
                viewport.setAttribute('content', 'width=500,user-scalable=no');
            }else{
                viewport.setAttribute('content', 'height=500,user-scalable=no'); 
            }
        }else if(screen.width<500){
            viewport.setAttribute('content', 'width=500,user-scalable=no');
        }else if(screen.height<500){
            viewport.setAttribute('content', 'height=500,user-scalable=no');
        }

    }
    
    /** 
     * マウス移動時処理
     */
    function ev_mouseMove(e){
        getMousePosition(e);
        flush(false,true);
    }

    /** 
     * マウスクリック時処理
     */
    function ev_mouseClick(e){
        getMousePosition(e);
        var target=Math.floor(mouse_x/cellSize)*10
                    +Math.floor(mouse_y/cellSize)
        if(winner!=null ||logArray.length!=0){
            reloadnew();
            return true;
        }
        if(hover_piece==null){
            if(thisMap[target]*turn_player>0){
                hover_piece=target;
            }
        }else{
            if(target==hover_piece){
                hover_piece=null;
                updateMessage();
                flush(false,false);
                return;
            }
            var canm=getCanMovePanel(hover_piece);
            if(canm.indexOf (target)>=0){
                flush(false,true);
                thisMap[target]=thisMap[hover_piece];
                thisMap[hover_piece]=0;
                turn_player=turn_player*-1;
                logArray2.push([hover_piece,target]);
                hover_piece=null;

                //AIが考える。
                message="thinking..."
                window.setTimeout(function(){
                    flush(false,false);
                },50);
                updateMessage();
                if(winner==null){
                    window.setTimeout(function(){
                        ai();   
                        message=""
                        updateMessage();
                        flush(false,false);
                    },250);
                }
            }        
        }
        flush(false,false);
    }
    
    /** 
     * ラジオボタン変更時処理
     */
    function ev_radioChange(){
        var num = $("#level option:selected").val();
        storage.setItem('level_save',num);
        if(storage.getItem('level_'+num)>0){
            $("#wins")[0].innerHTML=storage.getItem('level_'+num)+" win!";
        }else{
            $("#wins")[0].innerHTML="";
        }
    }

    /** 
     * AIに考えてもらう。
     */
    function ai(){
        var hand;
        var startTime = new Date();
        var endTime;
       //終盤になったら長考してみる。
        var zan=0;
        var p=0;
        for(var i in thisMap){
            var number=thisMap[i];
            var x = Math.floor(i / 10);
            var y = Math.floor(i % 10);
            if((number>0 && y==0)||(number<0 && y==5)){
                continue;   
            }else if(thisMap[i]!=0){
                zan+=1;
            }
        }
        if(zan<8&&$("#level option:selected").val()!=3){
            p+=1;
        }
        if(zan<5){
            p+=1;
        }
        if(zan<4){
            p+=1;
        }
        if($("#level option:selected").val()==1){
            hand=Aijs.thinkAI(thisMap,turn_player,2+p)[0];  
        }else if($("#level option:selected").val()==2){
            hand=Aijs.thinkAI(thisMap,turn_player,3+p)[0];  
        }else if($("#level option:selected").val()==3){
            hand=Aijs.thinkAI(thisMap,turn_player,4)[0];        
        }else{
            hand=Aijs.thinkAI(thisMap,turn_player,5)[0];        
        }

        if(hand){
            thisMap[hand[1]]=thisMap[hand[0]];
            thisMap[hand[0]]=0;
            logArray2.push([hand[0],hand[1]]);
            //フォーカス座標を移す。
            mouse_x = Math.floor(hand[1] / 10)*cellSize+1;
            mouse_y = Math.floor(hand[1] % 10)*cellSize+1;
        }
        turn_player=turn_player*-1;
        endTime=new Date();
        thinktime=(endTime-startTime)/1000;
    }
    
    /** 
     * 盤面をシャッフル。
     */
    function shuffleBoard(){
        //クリア
        for(var num in thisMap){
            thisMap[num]=0;   
        }
        var arr=[1,2,3,4,5,6,7,8];
        var red_num=[0,10,20,30,40,50,11,41];
        var blue_num=[55,45,35,25,15,5,44,14];
        for(var i = arr.length-1; i >= 0; i--){
          var r = Math.floor(Math.random()*(i+1)); 
          var tmp = arr[i];
          arr[i] = arr[r];
          arr[r] = tmp;
        }
        for(var num in blue_num){
            thisMap[blue_num[num]]=arr[num];   
        }
        for(var num in red_num){
            thisMap[red_num[num]]=-1*arr[num];   
        }
    }
  
    /** 
     * マウス位置取得
     */
    function getMousePosition(e) {  
        if(!e.clientX){//SmartPhone
            if(e.touches){
                e = e.originalEvent.touches[0];            
            }else if(e.originalEvent.touches){
                e = e.originalEvent.touches[0];
            }else{
                e = event.touches[0];
            }
        }
        var rect = e.target.getBoundingClientRect();
        mouse_x = e.clientX - rect.left;  
        mouse_y = e.clientY - rect.top;  
    }  
    
    /** 
     * 画面描画。
     */
    function flush(initflg,cache_flg){
        var wkMap=$.extend(true,{},thisMap)
        ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.width);

        if(cache_flg==false){
            cache_on=false;
        }
        //キャッシュに保存
        if(cache_flg==false||cache_on==false){
            //盤面を描画
            ctx.drawImage(drawBoard(initflg), 0, 0, ctx.canvas.width, ctx.canvas.height);

            //テカリを描画
            ctx.drawImage(drawBoard2(initflg), 0, 0, ctx.canvas.width, ctx.canvas.height);

            //選択したコマを除外
            if(hover_piece!=null){
                wkMap[hover_piece]=0;
            }
            //コマを表示
            ctx.drawImage(drawPieceAll(wkMap), 0, 0, ctx.canvas.width, ctx.canvas.height);

            //キャッシュに保存
            var ctx_canv=canv_cache.getContext('2d');
            ctx_canv.clearRect(0,0,ctx.canvas.width,ctx.canvas.width);
            ctx_canv.drawImage(ctx.canvas, 0, 0, ctx.canvas.width, ctx.canvas.height)
            //キャッシュ有効化
            cache_on=true;
        }else{
            //キャッシュから描画
            ctx.drawImage(canv_cache, 0, 0, ctx.canvas.width, ctx.canvas.height);
        }


        //選択したコマを表示
        ctx.drawImage(drawHoverPiece(), 0, 0, ctx.canvas.width, ctx.canvas.height);

        if(mouse_x!=0|mouse_y!=0){
            //フォーカスを描画
            ctx.drawImage(drawFocus(), 0, 0, ctx.canvas.width, ctx.canvas.height);        
        }

        //メッセージを描画
        ctx.drawImage(drawOverlay(), 0, 0, ctx.canvas.width, ctx.canvas.height);

    }
    
    /** 
     * 背景描画
     */
    function drawBk(){
        var ctx_bk=canv_bk.getContext('2d');
        if(img_bk_loaded){
            ctx_bk.drawImage(img_bk,0,0, ctx.canvas.width, ctx.canvas.height,0,0,500,500);
        }
        return canv_bk;
    }


    /** 
     * フォーカスを描画
     */
    function drawFocus(){
        //選択マスを強調
        var x=mouse_x- (mouse_x % cellSize);
        var y=mouse_y- (mouse_y % cellSize);
        var ctx_focus=canv_focus.getContext('2d');
        ctx_focus.clearRect(0,0,ctx.canvas.width,ctx.canvas.width);
        ctx_focus.globalAlpha = 0.35;
        ctx_focus.fillStyle=COLOR_SELECT;
        ctx_focus.lineWidth =1;
        ctx_focus.beginPath();
        ctx_focus.fillRect(x, y, cellSize, cellSize);
        ctx_focus.globalAlpha = 0.6;

        if(isTouch==true &&hover_piece==null){
            return canv_focus;
        }

        //移動可能マスを強調
        var target=(x/cellSize)*10+(y/cellSize);
        if(thisMap[target]*turn_player>0){
            var canm = getCanMovePanel(target)
            for(var i=0;i<=canm.length-1;i++){
                x=Math.floor(canm[i]/10);
                y=Math.floor(canm[i]%10);
                ctx_focus.globalAlpha = 0.6;
                ctx_focus.strokeStyle  = COLOR_SELECT;
                ctx_focus.lineWidth =5;
                ctx_focus.beginPath();
                ctx_focus.arc(x*cellSize+(cellSize/2), y*cellSize+(cellSize/2)
                              , (cellSize/2)-10, 0, Math.PI*2, false);
                ctx_focus.stroke();
            }        
        }
        return canv_focus;
    }

    /** 
     * 盤面を描画してCANVASを返す。
     */
    function drawBoard(initflg){
        if(initflg==false){
            return canv_board;
        }
        var ctx_board=canv_board.getContext('2d');
        ctx_board.clearRect(0,0,ctx.canvas.width,ctx.canvas.width);

        var grad  = ctx_board.createLinearGradient(0,0,ctx.canvas.width,ctx.canvas.width);
        grad.addColorStop(0,COLOR_PANEL_6);    
        grad.addColorStop(0.3,COLOR_PANEL_5); 
        grad.addColorStop(1,COLOR_PANEL_4);                  


        for(var x=0;x<6;x++){
            for(var y=0;y<6;y++){
                //パネル描画
                ctx_board.strokeStyle = COLOR_LINE;
                if(y==0){
                    ctx_board.fillStyle=COLOR_PANEL_1;
                }else if(y==5){
                    ctx_board.fillStyle=COLOR_PANEL_2;            
                }else if((x+y) % 2 ==0){
                    ctx_board.fillStyle=COLOR_PANEL_3;
                }else{
                    ctx_board.fillStyle=COLOR_PANEL_4;
                    ctx_board.fillStyle   = grad
                }
                ctx_board.beginPath();
                ctx_board.fillRect(x*cellSize, y*cellSize, cellSize, cellSize);
                ctx_board.strokeRect(x*cellSize, y*cellSize, cellSize, cellSize);
            }
        }

        return canv_board;
    }
    
    /** 
     * 盤面をテカテカにする。
     */
    function drawBoard2(initflg){
        if(initflg==false){
            return canv_board2;
        }
        var ctx_board2=canv_board2.getContext('2d');
        ctx_board2.clearRect(0,0,ctx.canvas.width,ctx.canvas.width);
        ctx_board2.globalAlpha = 0.07;
        ctx_board2.fillStyle = COLOR_WHITE;
        ctx_board2.beginPath();
        ctx_board2.arc(cellSize*1, -3*cellSize, 7*cellSize, 0, Math.PI*2, false);
        ctx_board2.fill();

        return canv_board2;
    }

    /** 
     * 浮遊しているコマを描画する。
     */
    function drawHoverPiece(){
        var ctx_hover=canv_hover_piece.getContext('2d');
        ctx_hover.clearRect(0,0,ctx.canvas.width,ctx.canvas.width);
        var x = mouse_x-(cellSize/2)
        var y = mouse_y-(cellSize/2)
        if(hover_piece!=null){
            drawPiece(ctx_hover,x,y,thisMap[hover_piece]
                      ,false)
        }
        return canv_hover_piece;
    }
    
    /** 
     * コマを描画する。
     */
    function drawPiece(wkCtx,x,y,number,goal){
        var wkColor;

        //外枠を描画
        if(number==0){
            return wkCtx;
        }else if(number>0){
            wkColor=COLOR_BLUE;   
        }else{
            wkColor=COLOR_RED;           
        }
        //wkCtx.fillStyle = wkColor;
        var grad  = ctx.createLinearGradient(x,y, x+cellSize,y+cellSize);
        grad.addColorStop(0,'rgb(255, 255, 255)');    
        grad.addColorStop(0.4,wkColor); 
        grad.addColorStop(1,wkColor);  

        wkCtx.shadowBlur = 10;
        wkCtx.shadowColor = "rgba(0, 0, 0, 1)";
        wkCtx.shadowOffsetX = 2;
        wkCtx.shadowOffsetY = 2;
        wkCtx.fillStyle   = grad;
        wkCtx.beginPath();
        wkCtx.fillRect(x+cellSize/10,y+cellSize/10,cellSize-1*cellSize/5,cellSize-1*cellSize/5);
        wkCtx.shadowColor= "rgba(0, 0, 0, 0)";; 
        wkCtx.shadowBlur = 0;
        wkCtx.shadowOffsetX = 0;
        wkCtx.shadowOffsetY = 0;

        //曇りエフェクト
        if(img_bk_loaded){
            wkCtx.globalAlpha = 0.35;
            wkCtx.drawImage(drawBk(true),x+cellSize/10,y+cellSize/10,cellSize-1*cellSize/5,cellSize-1*cellSize/5);

            wkCtx.globalAlpha = 1;
        }

        //文字を描画。
        if(goal){
            wkCtx.fillStyle   = COLOR_GOLD;                
        }else{
            wkCtx.fillStyle   = COLOR_WHITE;        
        };        



        var fontsize=Math.round(cellSize*0.18);
        wkCtx.textBaseline ="middle";
        wkCtx.textAlign="center";
        wkCtx.font = fontsize+"pt Arial";
        wkCtx.beginPath();

        //数字を印字
        wkCtx.fillText(Math.abs(number), x+(cellSize/2), y+(cellSize/2));


        //点を描画
        for(var i =0;i<= PIECES[number].length-1;i++){
            if(PIECES[number][i]==0){
                continue;   
            }
            var x_dot = x+cellSize/4.16+( Math.floor (cellSize-1*cellSize/5)/3)*Math.floor (i % 3.0);
            var y_dot = y+cellSize/4.16+( Math.floor (cellSize-1*cellSize/5)/3)*Math.floor (i / 3.0);

            if(goal){
                wkCtx.fillStyle   = COLOR_GOLD;                
            }else{
                wkCtx.fillStyle   = COLOR_WHITE;        
            }
            wkCtx.beginPath();
            wkCtx.arc(x_dot, y_dot, cellSize*0.06, 0, Math.PI*2, false);
            wkCtx.fill();
        }


        return wkCtx;

    }
    /** 
     * コマをすべて描画
     */
    function drawPieceAll(wkMap){
        var ctx_pieces=canv_pieces.getContext('2d');
        ctx_pieces.clearRect(0,0,ctx.canvas.width,ctx.canvas.width);
        for(var x=0;x<6;x++){
            for(var y=0;y<6;y++){
                if(wkMap[x*10+y]!=0){
                    var goal=false;
                    if(wkMap[x*10+y]>0 & y==0){
                        goal=true;
                    }else if(wkMap[x*10+y]<0 & y==5){
                        goal=true;
                    }
                    ctx_pieces=drawPiece(ctx_pieces,x*cellSize
                                            ,y*cellSize,wkMap[x*10+y],goal);
                }
            }
        }
        return canv_pieces;
    }

    /** 
     * メッセージを描画
     */
    function drawOverlay(){
        var ctx_overlay=canv_overlay.getContext('2d');
        var x = cellSize*1.5
        var y = cellSize*2.5

        ctx_overlay.clearRect(0,0,ctx.canvas.width,ctx.canvas.width);

        if(message==""){
            return canv_overlay;
        }
        ctx_overlay.shadowBlur = 5;
        ctx_overlay.shadowColor = "rgba(100, 100, 100, 0.1)";
        ctx_overlay.shadowOffsetX = 5;
        ctx_overlay.shadowOffsetY = 5;

        ctx_overlay.globalAlpha = 0.8;
        ctx_overlay.fillStyle = COLOR_WHITE;
        ctx_overlay.beginPath();
        ctx_overlay.fillRect(x,y,cellSize*3,cellSize*1);
        ctx_overlay.fill();

        var fontsize=Math.round(cellSize*0.36);
        ctx_overlay.shadowBlur = 0;
        ctx_overlay.shadowOffsetX = 0;
        ctx_overlay.shadowOffsetY = 0;
        ctx_overlay.shadowColor = "rgba(0, 0, 0, 0)";
        ctx_overlay.font = "bold "+fontsize+"px sans-serif";
        ctx_overlay.globalAlpha = 1;
        ctx_overlay.fillStyle = COLOR_LINE;
        ctx_overlay.textBaseline ="middle";
        ctx_overlay.textAlign="center";
        ctx_overlay.beginPath();
        ctx_overlay.fillText(message, cellSize*3, cellSize*3);

        return canv_overlay;
    }

    /** 
     * 動かせるマスを返す。
     */
    function getCanMovePanel(panel_num){
        var number = thisMap[panel_num];
        var x = Math.floor(panel_num / 10);
        var y = Math.floor(panel_num % 10);
        var canMove=new Array;
        if(number==0){
            return canMove;   
        }
        //アガリのコマは動かしたらダメ。
        if(number>0 & y==0){
            return canMove;   
        }else if(number<0 &y==5){
            return canMove;   
        }

        for(var i=0;i<=PIECES[number].length-1;i++){
            var target_x= x + Math.floor(i%3)-1;
            var target_y= y + Math.floor(i/3)-1;

            if(PIECES[number][i]==0){
                continue;
            }
            if(target_x<0 || target_y<0|target_x>5|target_y>5 ){
                continue;
            }
            var target_number=thisMap[target_x*10+target_y];
            if(target_number*number>0){
                continue;   
            }
            //アガリのコマはとったらダメ。
            if(target_number>0 & target_y==0){
                continue;   
            }else if(target_number<0 &target_y==5){
                continue;
            }
            canMove.push(target_x*10+target_y);

        }
        return canMove;
    }

    /** 
     * メッセージを更新
     */
    function updateMessage(){
        calcScore();
        if(turn_player>0){
            $("#turn")[0].innerHTML="Blue";
            $("#turn")[0].style.color=COLOR_BLUE;
        }else if(turn_player<0){
            $("#turn")[0].innerHTML="Red";          
            $("#turn")[0].style.color=COLOR_RED;
        }else{
            $("#turn")[0].innerHTML="";                  
        }
        $("#blue")[0].innerHTML=blueScore;                  
        $("#red")[0].innerHTML=redScore;
        //$("#score")[0].innerHTML=score;

        $("#time")[0].innerHTML="("+(thinktime)+"sec)";
        if(logArray.length==0){
            if(winner==1){
                message="You Win!"
                storage.setItem('level_'+$("#level option:selected").val(),
                               parseInt(storage.getItem('level_'+$("#level option:selected").val()))+1);
                endgame();
            }else if(winner==-1){
                message="You Lose..."
                storage.setItem('level_'+$("#level option:selected").val(),0);
                endgame();
            }else if(winner==0){
                message="-- Draw --"
                endgame();
            }
        }

        if(storage.getItem('level_'+$("#level option:selected").val())>0){
            $("#wins")[0].innerHTML=storage.getItem('level_'+$("#level option:selected").val())+" win!";
        }else{
            $("#wins")[0].innerHTML="";   
        }

    }
    
    /** 
     * ゲーム終了
     */
    function endgame(){
        if(logArray.length==0){
            //$("#tweet").show();
            $("#span_replay").show(); 
            $("#span_tweetlog").show();   
        }
    }
    /** 
     * 得点計算。
     */
    function calcScore(){
        var sum1=0;
        var sum2=0;
        var GoalTop=[0,10,20,30,40,50];
        var GoalBottom=[5,15,25,35,45,55]; 
        //点数勝利        
        for(var i in GoalTop){
            if(thisMap[GoalTop[i]]*1>0){
                sum1+=thisMap[GoalTop[i]];
            }
        }
        for(var i in GoalBottom){
            if(thisMap[GoalBottom[i]]*-1>0){
                sum2+=thisMap[GoalBottom[i]];
            }
        }
        if(sum1>=8){
            winner= 1;
        }else if(sum2<=-8){
            winner= -1;
        }

        //手詰まりは判定
        if(isNoneNode(thisMap)){
            if(Math.abs(sum1)>Math.abs(sum2)){
                winner= 1;
            }else if(Math.abs(sum1)<Math.abs(sum2)){//引き分けは後攻勝利
                winner= -1;
            }else if(Math.abs(sum1)==Math.abs(sum2)){
                winner=0;
            }
        }
        blueScore=Math.abs(sum1);
        redScore=Math.abs(sum2);
    }

    /** 
     * 手詰まり判定。
     */
    function isNoneNode(wkMap){
        var flag1=false;
        var flag2=false;
        for(var panel_num in wkMap){
            if(wkMap[panel_num]==0){
                continue;
            }
            var canMove=Aijs.getCanMovePanelX(panel_num,wkMap,false);
            if(canMove.length!=0){
                if(wkMap[panel_num]>0){
                    flag1=true;
                }else if(wkMap[panel_num]<0){
                    flag2=true;
                }
            }
            if(flag1&&flag2){
                return false;
            }
        }
        return true;
    }

    /** 
     * パラメータ取得
     */
    function getParam(){
        var obj = new Object();
        if (1 < document.location.search.length) {
            var paramstr = document.location.search.substring(1).split('&');
            for (var i = 0; i < paramstr.length; i++) {
                var entry = paramstr[i].split('=');
                var key = decodeURIComponent(entry[0]);
                var value = decodeURIComponent(entry[1]);
                obj[key] = decodeURIComponent(value);
            }
        }
        return obj;
    }
    
    /** 
     * パタメータから初期配置を取得
     */
    function getMapByParam(initString){
        if(initString){
            var wkMap=Aijs.copyMap(thisMap);
            //クリア
            for(var num in wkMap){
                wkMap[num]=0;   
            }
            var arr=initString.split(',');
            if(arr.length<8){
                arr=[1,2,3,4,5,6,7,8];
            }
            var red_num=[0,10,20,30,40,50,11,41];
            var blue_num=[55,45,35,25,15,5,44,14];


            for(var num in blue_num){
                wkMap[blue_num[num]]=parseInt(arr[num]);   
            }
            for(var num in red_num){
                wkMap[red_num[num]]=-1*parseInt(arr[num]);   
            }
        }

        return wkMap;
    }
    /** 
     * ログをデコード。
     */
    function decodeLog(logstr,wkInitMap){
        var wklogArray=new Array();
        var wkMap=Aijs.copyMap(wkInitMap);
        var arrow={ "q":0,"w":1,"e":2,
                    "a":3,"s":4,"d":5,
                    "z":6,"x":7,"c":8};
        logstr=logstr.replace(/q/g,'q,').replace(/w/g,'w,').replace(/e/g,'e,');
        logstr=logstr.replace(/a/g,'a,').replace(/s/g,'s,').replace(/d/g,'d,');
        logstr=logstr.replace(/z/g,'z,').replace(/x/g,'x,').replace(/c/g,'c,');
        var logArr=logstr.split(",");

        wklogArray.push(wkMap);
        for(var i=0;i<logArr.length;i++){
            if(logArr[i]===""){continue;}
            var arw=arrow[logArr[i].match(/[qweasdzxc]/)[0]];
            var from=parseInt(logArr[i].match(/\d*/)[0]);
            var to= (Math.floor(from / 10) + Math.floor(arw%3)-1)*10
                    +(Math.floor(from % 10) + Math.floor(arw/3)-1);
            wkMap=Aijs.copyMap(wkMap);
            wkMap[to]=parseInt(wkMap[from]);
            wkMap[from]=0;
            wklogArray.push(wkMap);
        }
        return wklogArray;
    }
    /** 
     * ログをエンコード
     */
    function encodeLog(wklogArray){
        var logstr="";
        var arrow=[ "q","w","e",
                    "a","s","d",
                    "z","x","c"];
        for(var i in wklogArray){
            var from=wklogArray[i][0];
            var to=wklogArray[i][1];
            var x_vec=((Math.floor(to / 10))-Math.floor(from / 10));
            var y_vec=((Math.floor(to % 10))-Math.floor(from % 10));
            var arw="";
            if(x_vec==-1 && y_vec==-1){arw="q"}
            if(x_vec== 0 && y_vec==-1){arw="w"}
            if(x_vec== 1 && y_vec==-1){arw="e"}
            if(x_vec==-1 && y_vec== 0){arw="a"}
            if(x_vec== 0 && y_vec== 0){arw="s"}
            if(x_vec== 1 && y_vec== 0){arw="d"}
            if(x_vec==-1 && y_vec== 1){arw="z"}
            if(x_vec== 0 && y_vec== 1){arw="x"}
            if(x_vec== 1 && y_vec== 1){arw="c"}
            logstr+=from+arw;
        }
        return logstr;
    }
    
    /** 
     * ログを全部巻き戻す
     */
    function move_start(){
        logPointer=0;
        thisMap=Aijs.copyMap(logArray[logPointer]);
        flush(false,false);
        updateMessage();
    }
    
    /** 
     * ログを戻す
     */
    function move_prev(){
        if(logPointer<=0){return;}
        logPointer-=1;
        thisMap=Aijs.copyMap(logArray[logPointer]);
        flush(false,false);
        updateMessage();
    }
    
    /** 
     * ログを進める
     */
    function move_next(){
        if(logPointer+1>logArray.length-1){return;}
        logPointer+=1;
        thisMap=Aijs.copyMap(logArray[logPointer]);
        flush(false,false);
        updateMessage();
    }
    
    /** 
     * ログを最後まで進める。
     */
    function move_end(){
        logPointer=logArray.length-1;
        thisMap=Aijs.copyMap(logArray[logPointer]);
        flush(false,false);
        updateMessage();
    }
    
    /** 
     * リセット
     */
    function reloadnew(){
        location.href =document.location.href.split("?")[0];
    }
    
    /** 
     * 検討画面に飛ぶ
     */
    function jumpkento(){
        var url=document.location.href.split("?")[0];
        var init="?init="+startMap[55]+","
                        +startMap[45]+","
                        +startMap[35]+","
                        +startMap[25]+","
                        +startMap[15]+","
                        +startMap[5]+","
                        +startMap[44]+","
                        +startMap[14];
        var log="&log="+encodeLog(logArray2);
        location.href =url+init+log;
    }
    /** 
     * ログをツイートする。
     */
    function tweetlog(){
        var url=document.location.href.split("?")[0];
        var init="?init="+startMap[55]+","
                        +startMap[45]+","
                        +startMap[35]+","
                        +startMap[25]+","
                        +startMap[15]+","
                        +startMap[5]+","
                        +startMap[44]+","
                        +startMap[14];
        var log="%26log="+encodeLog(logArray2);
        window.open("https://twitter.com/intent/tweet?text="+url+init+log+"%20%23colamone");
    }
    /** 
     * ツイートボタンを読み込む。
     */
    function setTweet(){
        !function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.async=true;js.src="https://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");
    }

})((this || 0).self || global); 