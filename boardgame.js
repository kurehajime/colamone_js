//メモ
//　盤面の表し方。。
//  wkMap[02]=[-3,0]  : X=0,Y=2,赤の3番,隠し。
//

var ctx=null;
var canv_board=null;
var canv_board2=null;
var canv_focus=null;
var canv_pieces=null;
var canv_hover_piece=null;
var canv_overlay=null;
var hover_piece=null;
var cellSize=null;
var turn_player=null;
var blueScore=0;
var redScore=0;
var winner=0;
var message="";
var COLOR_LINE="#333333";
var COLOR_PANEL_1="#550025";
var COLOR_PANEL_2="#003856";
var COLOR_PANEL_3="#FFFFFF";
var COLOR_PANEL_4="#111111";
var COLOR_PANEL_5="#444444";
var COLOR_PANEL_6="#888888";

var COLOR_SELECT="#88FF88";
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
                 1,0,1,
                 0,1,0],
            "4":[1,1,1,
                 0,0,0,
                 1,0,1],
            "5":[0,1,0,
                 1,0,1,
                 0,1,0],
            "6":[0,1,0,
                 0,0,0,
                 1,0,1],
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
            "-3":[0,1,0,
                  1,0,1,
                  1,1,1],
            "-4":[1,0,1,
                  0,0,0,
                  1,1,1],
            "-5":[0,1,0,
                  1,0,1,
                  0,1,0],
            "-6":[1,0,1,
                  0,0,0,
                  0,1,0],
            "-7":[0,1,0,
                  0,0,0,
                  0,1,0],
            "-8":[0,0,0,
                  0,0,0,
                  0,1,0]
           }

var thisMap={00:[-1,1],10:[-2,1],20:[-3,1],30:[-4,1],40:[-5,1],50:[-6,1],
               01:[+0,1],11:[+0,1],21:[-8,1],31:[-7,1],41:[+0,1],51:[+0,1],
               02:[+0,1],12:[+0,1],22:[+0,1],32:[+0,1],42:[+0,1],52:[+0,1],
               03:[+0,1],13:[+0,1],23:[+0,1],33:[+0,1],43:[+0,1],53:[+0,1],
               04:[+0,1],14:[+0,1],24:[+7,1],34:[+8,1],44:[+0,1],54:[+0,1],
               05:[+6,1],15:[+5,1],25:[+4,1],35:[+3,1],45:[+2,1],55:[+1,1]
              }


var mouse_x =0;
var mouse_y =0;



//init
$(function(){
    //初期化
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
    
    
    cellSize=ctx.canvas.width/6;
    turn_player=1;

    //イベントを設定
    if('ontouchstart' in window){
        $("#canv").bind('touchstart',ev_mouseClick)
    }else{
        $("#canv").bind('mousemove ',ev_mouseMove)
        $("#canv").bind('mouseup',ev_mouseClick);
    }
    shuffleBoard();


    
    //描画
    flush();
    updateMessage();

});

//マウス移動時処理
function ev_mouseMove(e){
    getMousePosition(e);
    flush();
}
//マウスクリック時処理
function ev_mouseClick(e){
    getMousePosition(e);
    var target=Math.floor(mouse_x/cellSize)*10
                +Math.floor(mouse_y/cellSize)
    if(winner!=""){
        return true;
    }
    if(hover_piece==null){
        if(thisMap[target][0]*turn_player>0){
            hover_piece=target;
        }
    }else{
        if(target==hover_piece){
            hover_piece=null;
            updateMessage();
            flush();
            return;
        }
        var canm=getCanMovePanel(hover_piece);
        if(canm.indexOf (target)>=0){
            thisMap[target]=thisMap[hover_piece];
            thisMap[hover_piece]=[0,0];
            turn_player=turn_player*-1;
            hover_piece=null;
            
            //AIが考える。
            drawFocus();
            message="thinking..."
            flush();
            updateMessage();
            window.setTimeout(function(){
                ai();   
                message=""
                updateMessage();
                flush();
            },50);
        }        
    }
    drawFocus();
    updateMessage();
    flush();
}
//AIに考えてもらう。
function ai(){
//  var hand=think(thisMap,turn_player);

//    var hand=deepThink(-1,-1,
//                       [[new Array(),thisMap],0]
//                       ,3,99999,-99999)[0][0][0];
    var hand;
    if($("#fast:checked").val()){
        hand=think(thisMap,turn_player);
    }else{
        hand=deepThinkAll(thisMap,turn_player,3)[0][0];        
    }
    
    if(hand){
        thisMap[hand[1]]=thisMap[hand[0]];
        thisMap[hand[0]]=[0,0];
        score=evalMap(thisMap,turn_player);
    }
    turn_player=turn_player*-1;
}
//盤面をシャッフル
function shuffleBoard(){
    //クリア
    for(var num in thisMap){
        thisMap[num]=[0,1];   
    }
    var arr=[1,2,3,4,5,6,7,8];
    var red_num=[0,10,20,30,40,50,21,31];
    var blue_num=[55,45,35,25,15,5,34,24];
    for(var i=0;i<=42;i++){
        arr.sort(function() {
                return Math.random() - Math.random();
            });        
    }
    
    for(var num in blue_num){
        thisMap[blue_num[num]]=[arr[num],1];   
    }
    for(var num in red_num){
        thisMap[red_num[num]]=[-1*arr[num],1];   
    }
}


// マウス位置取得  
function getMousePosition(e) {  
	if(!e.clientX){//SmartPhone
        if(e.touches){
            e = e.touches[0];            
        }else{
            e = event.touches[0];            
        }
    }
    var rect = e.target.getBoundingClientRect();
    mouse_x = e.clientX - rect.left;  
    mouse_y = e.clientY - rect.top;  
}  
//画面描画
function flush(){
    var wkMap=$.extend(true,{},thisMap)
    ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.width);

    //盤面を描画
    ctx.drawImage(drawBoard(), 0, 0, ctx.canvas.width, ctx.canvas.height);
    
    //テカリを描画
    ctx.drawImage(drawBoard2(), 0, 0, ctx.canvas.width, ctx.canvas.height);
    
    //選択したコマを除外
    if(hover_piece!=null){
        wkMap[hover_piece]=[0,0];
    }
    //コマを表示
    ctx.drawImage(drawPieceAll(wkMap), 0, 0, ctx.canvas.width, ctx.canvas.height);
    
    //選択したコマを表示
    ctx.drawImage(drawHoverPiece(), 0, 0, ctx.canvas.width, ctx.canvas.height);
    
    //フォーカスを描画
    ctx.drawImage(drawFocus(), 0, 0, ctx.canvas.width, ctx.canvas.height);
    
    //メッセージを描画
    ctx.drawImage(drawOverlay(), 0, 0, ctx.canvas.width, ctx.canvas.height);
    
    
    
}
//フォーカスを描画
function drawFocus(){
    //選択マスを強調
    var x=mouse_x- (mouse_x % cellSize);
    var y=mouse_y- (mouse_y % cellSize);
    var ctx_focus=canv_focus.getContext('2d');
    ctx_focus.clearRect(0,0,ctx.canvas.width,ctx.canvas.width);
    ctx_focus.globalAlpha = 0.5;
    ctx_focus.fillStyle=COLOR_SELECT;
    ctx_focus.lineWidth =1;
    ctx_focus.beginPath();
    ctx_focus.fillRect(x, y, cellSize, cellSize);

    //移動可能マスを強調
    var target=(x/cellSize)*10+(y/cellSize);
    if(thisMap[target][0]*turn_player>0){
        var canm = getCanMovePanel(target)
        for(var i=0;i<=canm.length-1;i++){
            x=Math.floor(canm[i]/10);
            y=Math.floor(canm[i]%10);
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



//盤面を描画してCANVASオブジェクトを返す。
function drawBoard(){
    var ctx_board=canv_board.getContext('2d');
    ctx_board.clearRect(0,0,ctx.canvas.width,ctx.canvas.width);

    var grad  = ctx_board.createLinearGradient(0,0,ctx.canvas.width,ctx.canvas.width);
    grad.addColorStop(0,COLOR_PANEL_6);    
    grad.addColorStop(0.3,COLOR_PANEL_5); 
    grad.addColorStop(1,COLOR_PANEL_4);                  

    
    for(x=0;x<6;x++){
        for(y=0;y<6;y++){
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
function drawBoard2(){
    var ctx_board2=canv_board2.getContext('2d');
    ctx_board2.clearRect(0,0,ctx.canvas.width,ctx.canvas.width);
    ctx_board2.globalAlpha = 0.07;
    ctx_board2.fillStyle = COLOR_WHITE;
    ctx_board2.beginPath();
    ctx_board2.arc(50, -150, 350, 0, Math.PI*2, false);
    ctx_board2.fill();

    return canv_board2;
}
//浮遊しているコマを描画する。
function drawHoverPiece(){
    var ctx_hover=canv_hover_piece.getContext('2d');
    ctx_hover.clearRect(0,0,ctx.canvas.width,ctx.canvas.width);
    var x = mouse_x-(cellSize/2)
    var y = mouse_y-(cellSize/2)
    if(hover_piece!=null){
        drawPiece(ctx_hover,x,y,thisMap[hover_piece][0]
                  ,thisMap[hover_piece][1],false)
    }
    return canv_hover_piece;
}
//コマを描画する。
function drawPiece(wkCtx,x,y,number,viewflg,goal){
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
    wkCtx.fillStyle   = grad;
    
    
    wkCtx.beginPath();
    wkCtx.fillRect(x+5,y+5,cellSize-10,cellSize-10);
    
    //文字を描画。
    if(goal){
        wkCtx.fillStyle   = COLOR_GOLD;                
    }else{
        wkCtx.fillStyle   = COLOR_WHITE;        
    };        
    
    
    
    
    wkCtx.textBaseline ="middle";
    wkCtx.textAlign="center";
    wkCtx.beginPath();
    if(viewflg==1){
        wkCtx.fillText(Math.abs(number), x+(cellSize/2), y+(cellSize/2));
    }else{
        wkCtx.fillText(Math.abs(0), x+(cellSize/2), y+(cellSize/2));
    }
    
    //点を描画
    if(viewflg==1){
        for(var i =0;i<= PIECES[number].length-1;i++){
            if(PIECES[number][i]==0){
                continue;   
            }
            var x_dot = x+12+( Math.floor (cellSize-10)/3)*Math.floor (i % 3.0);
            var y_dot = y+12+( Math.floor (cellSize-10)/3)*Math.floor (i / 3.0);

            if(goal){
                wkCtx.fillStyle   = COLOR_GOLD;                
            }else{
                wkCtx.fillStyle   = COLOR_WHITE;        
            }
            wkCtx.beginPath();
            wkCtx.arc(x_dot, y_dot, 3, 0, Math.PI*2, false);
            wkCtx.fill();
        }
    }else{
            if(number>0){
                i=1;   
            }else{
                i=7;
            }
            var x_dot = x+12+( Math.floor (cellSize-10)/3)*Math.floor (i % 3.0);
            var y_dot = y+12+( Math.floor (cellSize-10)/3)*Math.floor (i / 3.0);

            wkCtx.fillStyle = COLOR_WHITE;
            wkCtx.beginPath();
            wkCtx.arc(x_dot, y_dot, 3, 0, Math.PI*2, false);
            wkCtx.fill();
    }
    
    
    return wkCtx;
    
}
//コマをすべて描画
function drawPieceAll(wkMap){
    var ctx_pieces=canv_pieces.getContext('2d');
    ctx_pieces.clearRect(0,0,ctx.canvas.width,ctx.canvas.width);
    for(x=0;x<6;x++){
        for(y=0;y<6;y++){
            if(wkMap[x*10+y]!=0){
                var goal=false;
                if(y*cellSize,wkMap[x*10+y][0]>0 & y==0){
                    goal=true;
                }else if(y*cellSize,wkMap[x*10+y][0]<0 & y==5){
                    goal=true;
                }
                ctx_pieces=drawPiece(ctx_pieces,x*cellSize
                                        ,y*cellSize,wkMap[x*10+y][0],wkMap[x*10+y][1],goal);
            }
        }
    }
    return canv_pieces;
}

//メッセージを描画
function drawOverlay(){
    var ctx_overlay=canv_overlay.getContext('2d');
    var x = cellSize*1.5
    var y = cellSize*2.5
    
    ctx_overlay.clearRect(0,0,ctx.canvas.width,ctx.canvas.width);

    if(message==""){
        return canv_overlay;
    }
    ctx_overlay.globalAlpha = 0.8;
    ctx_overlay.fillStyle = COLOR_WHITE;
    ctx_overlay.beginPath();
    ctx_overlay.fillRect(x,y,cellSize*3,cellSize*1);
    ctx_overlay.fill();
    
    
    ctx_overlay.font = "bold 20px sans-serif";
    ctx_overlay.globalAlpha = 1;
    ctx_overlay.fillStyle = COLOR_LINE;
    ctx_overlay.textBaseline ="middle";
    ctx_overlay.textAlign="center";
    ctx_overlay.beginPath();
    ctx_overlay.fillText(message, cellSize*3, cellSize*3);
    
    return canv_overlay;
}


//動かせるマスを返す。Return:[NN,NN,NN]
function getCanMovePanel(panel_num){
    var number = thisMap[panel_num][0];
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
        var target_number=thisMap[target_x*10+target_y][0];
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
    $("#score")[0].innerHTML=score;
    if(winner==1){
        message="You Win!"
    }else if(winner==-1){
        message="You Lose..."
    }
    
    
   
}
function calcScore(){
    var wkBlueScore=0;
    var wkRedScore=0;
    var wkBlueCanMove=0;
    var wkRedSCanMove=0;
    var wkBlueLivePoint=0;
    var wkRedSLivePoint=0;
    
    var wkWinner="";
    for(var num in thisMap){
        //アガリ判定
        var y = Math.floor(num % 10);
        if(y==0&thisMap[num][0]>0){
            wkBlueScore+= Math.abs(thisMap[num][0]);
        }else if(y==5&thisMap[num][0]<0){
            wkRedScore+=Math.abs(thisMap[num][0]);
        }else{
            //現在生きているコマ
            if(thisMap[num][0]>0){
                wkBlueLivePoint+=thisMap[num][0]
            }else if(thisMap[num][0]>0){
                wkRedLivePoint+=thisMap[num][0]
            }
        }
        
        //動かせるか。
        if(wkBlueCanMove==0 || wkRedSCanMove==0){
            if(getCanMovePanel(num).length!=0){
                if(thisMap[num][0]>0){
                    wkBlueCanMove+=1;
                }else if(thisMap[num][0]<0){
                    wkRedSCanMove+=1;
                }                
            }
        }
    }
    
    //動かせなくなったら負け
    if(wkRedSCanMove==0 && turn_player==-1){
        wkWinner=1;
    }else if(wkBlueCanMove==0 && turn_player==1){
        wkWinner=-1;
    }
    if(wkBlueLivePoint+wkBlueScore<8 &&wkRedLivePoint+wkRedScore<8){
        if(wkBlueScore<wkRedScore){
            wkWinner=1;
        }else if(wkBlueScore>wkRedScore){
            wkWinner=-1;
        }else if(wkBlueLivePoint<wkRedLivePoint){
            wkWinner=1;
        }else if(wkBlueLivePoint>wkRedLivePoint){
            wkWinner=-1;
        }
    }
    
    //点数で勝利
    if(wkBlueScore>=8){
        wkWinner=1;
    }else if(wkRedScore>=8){
        wkWinner=-1;
    }
    blueScore=wkBlueScore;
    redScore=wkRedScore;
    winner=wkWinner;
}