; (function($) {
	var _that;

	//全局对象
	var canvas, ctx, Height, Width, rainArray = new Array();

	var _BG = function() {};
	_BG.prototype = {
		constructor: _BG,
		init: function() {
			//var canvas = document.getElementById('canvas');
			canvas = document.querySelector('.rain');
			ctx = canvas.getContext("2d");

			Height = $(window).height();
			Width = $(window).width();
			canvas.height = Height;
			canvas.width = Width;
			$(window).resize(function() {
				Height = $(window).height();
				Width = $(window).width();

				canvas.height = Height;
				canvas.width = Width;
			});
		},
		refreshBG:function(){
			//先复制透明层再绘制雨滴 雨滴就把先绘制的透明层覆盖 下一次绘制透明层
    //就会把之前绘制的雨滴覆盖 若干的透明层叠加就会越来越不透明
			  ctx.fillStyle = 'rgba(0,0,0,0.1)'; //加上一层蒙版
			  ctx.fillRect(0, 0, Width, Height);
		}
	};

	var _Draw = function() {};
	_Draw.prototype = {
		constructor: _Draw,
		drawRain: function() {
			if (this.y < this.h) {
				//绘制雨滴
				ctx.fillStyle = "#31f7f7";
				ctx.fillRect(this.x, this.y, 4, 10);
			} else {
				//绘制圆
				ctx.beginPath(); //把笔抬起来
				ctx.arc(this.x, this.h, this.r, 0, Math.PI * 2, false);
				ctx.strokeStyle = "rgba(0,255,255," + this.a + ")";
				ctx.stroke();
			}
		},
		moveRain: function() {
			/*ctx.beginPath();//把笔抬起来
				ctx.fillStyle='rgba(0,0,0,0.05)';//加上一层蒙版
				ctx.fillRect(0,0,Width,Height);*/

			if (this.y < this.h) { //雨滴小于指定高度继续降落
				this.y += this.vY;
			} else {
				//开始画圆
				if (this.a > 0.03) {//小于
					this.r += this.vr;
					if (this.r > 70) {
              this.a *= this.va;
          }
				} else {
					this.init();
				}
			}
			this.y += this.vY; //雨滴每秒下降4~5
			_drawobj.drawRain.call(this);

		}
	}

	var _bgobj, _drawobj;

	var _factory = {
		getGB: function() {
			if (!_bgobj) {
				_bgobj = new _BG();
			}
			return _bgobj;
		},
		getDraw: function() {
			if (!_drawobj) {
				_drawobj = new _Draw();
			}
			return _drawobj;
		},
		getRain: function() {
			var rain = new _Rain();
			rain.init();
			return rain;
		},
		createRain: function(num) {
			for (var i = 0; i < num; i++) {
				setTimeout(function() {
					var rain = _factory.getRain();
					rain.draw();
					rain.move();
					rainArray.push(rain);
				},
				200 * i)
			}
		},
		getRainArray: function() {
			//_.pull(rainArray, null);
			return rainArray;
		},
		getCtx:function(){
			return ctx;
		}
	};
	_bgobj = _factory.getGB();
	_drawobj = _factory.getDraw();

	function random(min, max) {
		return Math.random() * (max - min) + min;
	}
	//雨滴
	var _Rain = function() {};
	_Rain.prototype = {
		constructor: _Rain,
		init: function() {
			this.x = random(0, Width); //从0到width
			this.y = 0;
			this.vY = random(4, 5);
			this.h = random(0.8 * Height, 0.9 * Height);
			this.r = 1;
			this.vr = 1;
			//判断雨滴消失的透明度
			this.a = 1; // =>0
			this.va = 0.96; //透明度的变化系数
		},
		draw: function() {
			_drawobj.drawRain.call(this);

		},
		move: function() {
			_drawobj.moveRain.call(this);
		},
		remove: function() {
			_drawobj.clearRain.call(this);
		}
	};

	if (!window.factory) {
		window.factory = _factory;
	}

	/*
	function _myfactoryInit() {
		_that = this;
	}
*/

})(jQuery);
