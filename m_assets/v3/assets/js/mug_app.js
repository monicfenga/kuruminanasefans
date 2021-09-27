
    var isDesktop = navigator['userAgent'].match(/(ipad|iphone|ipod|android|windows phone)/i) ? false : true;
    var fontunit = isDesktop ? 20 : ((window.innerWidth>window.innerHeight?window.innerHeight:window.innerWidth)/320)*10;
    document.write('<style type="text/css">'+
        /*'html,body {font-size:'+(fontunit<30?fontunit:'30')+'px;}'+*/
        (isDesktop?'#welcome,#GameTimeLayer,#GameLayerBG,#GameScoreLayer.SHADE{position: absolute;}':
        '#welcome,#GameTimeLayer,#GameLayerBG,#GameScoreLayer.SHADE{position:fixed;}@media screen and (orientation:landscape) {#landscape {display: box; display: -webkit-box; display: -moz-box; display: -ms-flexbox;}}')+
        '</style>');

	if (isDesktop) {
        document.write('<div id="gameBody">');
    }

	var body, blockSize, GameLayer = [], GameLayerBG, touchArea = [], GameTimeLayer ;
	var transform, transitionDuration;

    /**
     * 初始化
     */
	function init (argument) {
		showWelcomeLayer();
		body = document.getElementById('gameBody') || document.body;
		body.style.height = window.innerHeight+'px';
		transform = typeof(body.style.webkitTransform) != 'undefined' ? 'webkitTransform' : (typeof(body.style.msTransform) != 'undefined'?'msTransform':'transform');
		transitionDuration = transform.replace(/ransform/g, 'ransitionDuration');

        GameTimeLayer = document.getElementById('GameTimeLayer');
		GameLayer.push( document.getElementById('GameLayer1') );
		GameLayer[0].children = GameLayer[0].querySelectorAll('div');
		GameLayer.push( document.getElementById( 'GameLayer2' ) );
		GameLayer[1].children = GameLayer[1].querySelectorAll('div');
		GameLayerBG = document.getElementById( 'GameLayerBG' );
		if( GameLayerBG.ontouchstart === null ){
			GameLayerBG.ontouchstart = gameTapEvent;
		}else{
			GameLayerBG.onmousedown = gameTapEvent;
			document.getElementById('landscape-text').innerHTML = '点我开始玩耍';
			document.getElementById('landscape').onclick = winOpen;
		}
		gameInit();
		window.addEventListener('resize', refreshSize, false);

		var rtnMsg = "true";	
				
		setTimeout(function(){
			if(rtnMsg == 'false'){
				var btn = document.getElementById('ready-btn');
				btn.className = 'btn';
				btn.innerHTML = '您今天已经吃太多苹果啦，请明天继续！'
			}else{
				var btn = document.getElementById('ready-btn');
				btn.className = 'btn';
				btn.innerHTML = '开始!'
				btn.style.backgroundColor = 'var(--primary)';
				btn.onclick = function(){
					closeWelcomeLayer();
				} 					
			}
		}, 500);
	}
	function winOpen() {
		window.open(location.href+'?r='+Math.random(), 'nWin', 'height=500,width=320,toolbar=no,menubar=no,scrollbars=no');
		var opened=window.open('about:blank','_self'); opened.opener=null; opened.close();
	}
	var refreshSizeTime;
	function refreshSize(){
		clearTimeout(refreshSizeTime);
		refreshSizeTime = setTimeout(_refreshSize, 200);
	}
	function _refreshSize(){
		countBlockSize();
		for( var i=0; i<GameLayer.length; i++ ){
			var box = GameLayer[i];
			for( var j=0; j<box.children.length; j++){
				var r = box.children[j],
					rstyle = r.style;
				rstyle.left = (j%4)*blockSize+'px';
				rstyle.bottom = Math.floor(j/4)*blockSize+'px';
				rstyle.width = blockSize+'px';
				rstyle.height = blockSize+'px';
			}
		}
		var f, a;
		if( GameLayer[0].y > GameLayer[1].y ){
			f = GameLayer[0];
			a = GameLayer[1];
		}else{
			f = GameLayer[1];
			a = GameLayer[0];
		}
		var y = ((_gameBBListIndex)%10)*blockSize;
		f.y = y;
		f.style[transform] = 'translate3D(0,'+f.y+'px,0)';

		a.y = -blockSize*Math.floor(f.children.length/4)+y;
		a.style[transform] = 'translate3D(0,'+a.y+'px,0)';

	}
	function countBlockSize(){
		blockSize = body.offsetWidth/4;
		body.style.height = window.innerHeight+'px';
		GameLayerBG.style.height = window.innerHeight+'px';
		touchArea[0] = window.innerHeight-blockSize*0;
		touchArea[1] = window.innerHeight-blockSize*3;
	}
    var _gameBBList = [], _gameBBListIndex = 0, _gameOver = false, _gameStart = false, _gameTime, _gameTimeNum, _gameScore;
    /**
     * 注册音效
     */
	function gameInit(){
        createjs.Sound.registerSound( {src:"./assets/break.ogg", id:"err"} );
        createjs.Sound.registerSound( {src:"./assets/orb.ogg", id:"end"} );
        createjs.Sound.registerSound( {src:"./assets/pop.ogg", id:"tap"} );
        createjs.Sound.registerSound( {src:"./assets/orb.ogg", id:"go"} );
        createjs.Sound.registerSound( {src:"./assets/levelup.ogg", id:"bestscore"} );
		gameRestart();
    }
    /**
     * 游戏（重新）启动
     * @param _gameScore 分数
     * @param _gameOver flag 游戏是否结束
     * @param _gameStart flag 游戏是否开始
     * @param _gameTimeNum 游戏时间，单位为毫秒
     */
	function gameRestart(){
		console.log('游戏开始。');
		_gameBBList = [];
		_gameBBListIndex = 0;
		_gameScore = 0;
		_gameOver = false;
		_gameStart = false;
		_gameTimeNum = 2000;
        GameTimeLayer.innerHTML = creatTimeText(_gameTimeNum);
        document.getElementById("GameScoreLayerInGame").innerHTML = 0;
        document.getElementById("GameHighScoreLayerInGame").innerHTML = cookie('bast-score');
		createjs.Sound.play("go");
		countBlockSize();
		refreshGameLayer(GameLayer[0]);
		refreshGameLayer(GameLayer[1], 1);
    }
    /**
     * 游戏开始
     */
	function gameStart(){
		_gameStart = true;
		_gameTime = setInterval(gameTime, 10);
    }
    /**
     * 游戏结束
     */
	function gameOver(){
		_gameOver = true;
		clearInterval(_gameTime);
		setTimeout(function(){
			GameLayerBG.className = '';
			showGameScoreLayer();
		}, 1500);
    }
    /**
     * 倒计时
     */
	function gameTime(){
		_gameTimeNum --;
		if( _gameTimeNum <= 0){
			GameTimeLayer.innerHTML = '时间到!';
			gameOver();
			GameLayerBG.className += ' flash';
			createjs.Sound.play("end");
		}else{
			GameTimeLayer.innerHTML = creatTimeText(_gameTimeNum);
		}
    }
    /**
     * 人类可读时间格式
     * @param n 时间
     */
	function creatTimeText( n ){
		var text = (100000+n+'').substr(-4,4);
		text = text.substr(0,2)+"."+text.substr(2)+"s"
		return text;
	}
    var _ttreg = / t{1,2}(\d+)/, _clearttClsReg = / t{1,2}\d+| bad/;
    
    /**
     * 刷新游戏界面
     * @param box 
     * @param loop 
     * @param offset 
     */
	function refreshGameLayer( box, loop, offset ){
		var i = Math.floor(Math.random()*1000)%4+(loop?0:4);
		for( var j=0; j<box.children.length; j++){
			var r = box.children[j],
				rstyle = r.style;
			rstyle.left = (j%4)*blockSize+'px';
			rstyle.bottom = Math.floor(j/4)*blockSize+'px';
			rstyle.width = blockSize+'px';
			rstyle.height = blockSize+'px';
			r.className = r.className.replace(_clearttClsReg, '');
			if( i == j ){
				_gameBBList.push( {cell:i%4, id:r.id} );
				r.className += ' t'+(Math.floor(Math.random()*1000)%5+1);
				r.notEmpty = true;
				i = ( Math.floor(j/4)+1)*4+Math.floor(Math.random()*1000 )%4;
			}else{
				r.notEmpty = false;
			}
		}
		if( loop ){
			box.style.webkitTransitionDuration = '0ms';
			box.style.display          = 'none';
			box.y                      = -blockSize*(Math.floor(box.children.length/4)+(offset||0))*loop;
			setTimeout(function(){
				box.style[transform] = 'translate3D(0,'+box.y+'px,0)';
				setTimeout( function(){
					box.style.display     = 'block';
				}, 100 );
			}, 200 );
		} else {
			box.y = 0;
			box.style[transform] = 'translate3D(0,'+box.y+'px,0)';
		}
		box.style[transitionDuration] = '150ms';
    }
    
    /**
     * 游戏界面移动到下一行
     */
	function gameLayerMoveNextRow(){
		for(var i=0; i<GameLayer.length; i++){
			var g = GameLayer[i];
			g.y += blockSize;
			if( g.y > blockSize*(Math.floor(g.children.length/4)) ){
				refreshGameLayer(g, 1, -1);
			}else{
				g.style[transform] = 'translate3D(0,'+g.y+'px,0)';
			}
		}
	}
	function gameTapEvent(e){
		if (_gameOver) {
			return false;
		}
		var tar = e.target;
		var y = e.clientY || e.targetTouches[0].clientY,
			x = (e.clientX || e.targetTouches[0].clientX)-body.offsetLeft,
			p = _gameBBList[_gameBBListIndex];
		if ( y > touchArea[0] || y < touchArea[1] ) {
			return false;
		}
		if( (p.id==tar.id&&tar.notEmpty) || (p.cell==0&&x<blockSize) || (p.cell==1&&x>blockSize&&x<2*blockSize) || (p.cell==2&&x>2*blockSize&&x<3*blockSize) || (p.cell==3&&x>3*blockSize) ){
			if( !_gameStart ){
				gameStart();
			}
        	createjs.Sound.play("tap");
			tar = document.getElementById(p.id);
			tar.className = tar.className.replace(_ttreg, ' tt$1');
			_gameBBListIndex++;
            _gameScore ++; 
            document.getElementById("GameScoreLayerInGame").innerHTML = _gameScore;
			gameLayerMoveNextRow();
		}else if( _gameStart && !tar.notEmpty ){
			createjs.Sound.play("err");
			gameOver();
			tar.className += ' bad';
		}
		return false;
    }
    /**
     * 创建游戏区域
     */
	function createGameLayer(){
		var html = '<div id="GameLayerBG">';
		for(var i=1; i<=2; i++){
			var id = 'GameLayer'+i;
			html += '<div id="'+id+'" class="GameLayer">';
			for(var j=0; j<10; j++ ){
				for(var k=0; k<4; k++){
					html += '<div id="'+id+'-'+(k+j*4)+'" num="'+(k+j*4)+'" class="block'+(k?' bl':'')+'"></div>';
				}
			}
			html += '</div>';
		}
		html += '</div>';

        html += '<div id="GameTimeLayer">30.00s</div>';
		html += '<div id="GameScoreLayerInGame">0</div>';
		html += '<div id="GameHighScoreLayerInGame">0</div>';

		return html;
    }
    /**
     * 隐藏标题画面
     */
	function closeWelcomeLayer(){
		var l = document.getElementById('welcome');
		l.style.display = 'none';
    }
    /**
     * 显示标题画面
     */
	function showWelcomeLayer(){
		var l = document.getElementById('welcome');
		l.style.display = 'block';
    }
    /**
     * 显示游戏结束画面
     */
	function showGameScoreLayer(){
		
		var l = document.getElementById('GameScoreLayer');
        var c = document.getElementById(_gameBBList[_gameBBListIndex-1].id).className.match(_ttreg)[1];
        console.info(c);
		document.getElementById('GameScoreBackground').className = document.getElementById('GameScoreBackground').className.replace(/bgc\d/, 'bgc'+c);
		document.getElementById('GameScoreLayer-myScore').innerHTML = _gameScore;
		document.getElementById('GameScoreLayer-text').innerHTML = shareText(_gameScore);
		//document.getElementById('GameScoreLayer-score').innerHTML = '得分&nbsp;&nbsp;'+_gameScore;
		var bast = cookie('bast-score');
		if( !bast || _gameScore > bast ){
			bast = _gameScore;
            cookie('bast-score', bast, 100);
		    createjs.Sound.play("bestscore");
		}
		document.getElementById('GameScoreLayer-bast').innerHTML = bast;
		document.getElementById('GameHighScoreLayerInGame').innerHTML = bast;
		l.style.display = 'block';
		//window.shareData.tTitle = '我吃掉了'+_gameScore+'个小苹果，不服来挑战！！！'
	}
	function hideGameScoreLayer(){
		var l = document.getElementById('GameScoreLayer');
		l.style.display = 'none';
    }
    /**
     * 重玩
     */
	function replayBtn(){
		gameRestart();
		hideGameScoreLayer();
    }
    /**
     * 回到标题画面
     */
	function backBtn(){
		gameRestart();
		hideGameScoreLayer();
		showWelcomeLayer();
	}
    var mebtnopenurl = '';
    /**
     * 显示评语
     * @param score 分数
     * @returns 评语文字
     */
	function shareText( score ){
		var coins = Math.ceil(score / 5);
        if( score <= 10 ) { return 'F';
		} else if( score <= 20 ) { return 'E';
		} else if( score <= 40 ) { return 'D';
		} else if( score <= 60 ) { return 'C';
		} else if( score <= 80 ) { return 'C++';
		} else if( score <= 100 ) { return 'B';
        } else if( score <= 150 ) { return 'B+';
        } else if( score <= 200 ) { return 'A';
        } else if( score <= 230 ) { return 'A+';
        }else { return 'A++'; }
	}
	
	function toStr(obj) {
		if ( typeof obj == 'object' ) {
			return JSON.stringify(obj);
		} else {
			return obj;
		}
		return '';
    }
    //旧版cookie操作
    /*
	function cookie(name, value, time) {
		if (name) {
			if (value) {
				if (time) {
					var date = new Date();
					date.setTime(date.getTime() + 864e5 * time), time = date.toGMTString();
				}
				return document.cookie = name + "=" + escape(toStr(value)) + (time ? "; expires=" + time + (arguments[3] ? "; domain=" + arguments[3] + (arguments[4] ? "; path=" + arguments[4] + (arguments[5] ? "; secure" : "") : "") : "") : ""), !0;
			}
			return value = document.cookie.match("(?:^|;)\\s*" + name.replace(/([-.*+?^${}()|[\]\/\\])/g, "\\$1") + "=([^;]*)"), value = value && "string" == typeof value[1] ? unescape(value[1]) : !1, (/^(\{|\[).+\}|\]$/.test(value) || /^[0-9]+$/g.test(value)) && eval("value=" + value), value;
		}
		var data = {};
		value = document.cookie.replace(/\s/g, "").split(";");
		for (var i = 0; value.length > i; i++) name = value[i].split("="), name[1] && (data[name[0]] = unescape(name[1]));
		return data;
    }
    */
    
    /**
     * 
     * @param  name 键，若未填写value，则读取该键里的内容
     * @param  value 值，如果这项有内容，则往name里写入该值
     * @param  time 未使用
     */
    function cookie(name, value, time) {
		if (name) {
			if (value) {
				return localStorage.setItem(name, value);
			}
			return localStorage.getItem(name);
		}
    }
	document.write(createGameLayer());
	