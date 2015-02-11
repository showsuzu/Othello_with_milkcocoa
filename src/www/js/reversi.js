(function() {
	var s = Snap("#canvas").attr({
		width:$(window).width(),
		height:$(window).height(),
		viewBox:[0,0,400,400]});

	window.ReversiMap = ReversiMap;

	function setText(id, text) {
		$("#" + id).html(text);
	}

	function ReversiMap(dataStore) {
		var self = this;
		this.dataStore = dataStore;
	}

	ReversiMap.BLOCK = 0;
	ReversiMap.EMPTY = 1;
	ReversiMap.WHITE = 2;
	ReversiMap.BLACK = 3;

	ReversiMap.prototype.enemy = function(cb) {
		this.ai_script = cb;
	}

	ReversiMap.prototype.turn = function() {
		if(this.current_color == ReversiMap.WHITE) {
			this.current_color = ReversiMap.BLACK;
			setText("turn", "黒の番");
		}else if(this.current_color == ReversiMap.BLACK) {
			this.current_color = ReversiMap.WHITE;
			setText("turn", "白の番");
		}
	}

	ReversiMap.prototype.init = function(my_color) {
		var self = this;
		this.map = new Map();
		this.map.init();
		this.data = [];
		this.current_color = ReversiMap.WHITE;
		for(var i=0;i < 8*8;i++) this.data[i] = ReversiMap.EMPTY;
		this.map.click = function(x, y) {
			if(self.my_color == self.current_color)
				self.dataStore.set(x + "-" + y, {color : self.current_color});
		}
		this.dataStore.on("set", function(e) {
			var pos = e.id.split('-');
			self.put(Number(pos[0]), Number(pos[1]), e.value.color);
		});		this.my_color = my_color;
		if(this.my_color == ReversiMap.WHITE) setText("my-color", "あなたは白です。");
		else if(this.my_color == ReversiMap.BLACK) setText("my-color", "あなたは黒です。");
		this.change_color(3, 3, ReversiMap.BLACK);
		this.change_color(3, 4, ReversiMap.WHITE);
		this.change_color(4, 3, ReversiMap.WHITE);
		this.change_color(4, 4, ReversiMap.BLACK);
	}

	ReversiMap.prototype.put = function(x, y, color, fire) {
		if(this.check(x, y, color)) {
			this.change_color(x, y, color);
			this.turn();
		}
	}

	ReversiMap.prototype.check = function(x, y, color) {
		var ret = 0;
		/* 8方向をチェックし、色を変更する */
		/* check_part()は再帰呼び出しされる（最大8回) */
		ret =        this.check_part(x-1, y,   color, [-1, 0]) > 1; // -x方向のチェック
		ret = ret | this.check_part(x+1, y,   color, [1, 0]) > 1;  // +x方向のチェック
		ret = ret | this.check_part(x,   y+1, color, [0, 1]) > 1;  // +y方向のチェック
		ret = ret | this.check_part(x,   y-1, color, [0, -1]) > 1; // -y方向のチェック
		ret = ret | this.check_part(x-1, y-1, color, [-1, -1]) > 1;// -x-y方向のチェック
		ret = ret | this.check_part(x+1, y+1, color, [1, 1]) > 1;  // +x+y方向のチェック
		ret = ret | this.check_part(x-1, y+1, color, [-1, 1]) > 1; // -x+y方向のチェック
		ret = ret | this.check_part(x+1, y-1, color, [1, -1]) > 1; // +x-y方向のチェック
		return ret;
	}

	ReversiMap.prototype.check_part = function(x, y, color, d) {
		var col = this.get_color(x, y);
		if(col == ReversiMap.BLOCK) {
			return 0;
		}else if(col == ReversiMap.EMPTY) {
			return 0;
		}else{
			if(col == color) {
				return 1;
			}else{
				var c = this.check_part(x + d[0], y + d[1], color, d);
				if(c > 0) {
					this.change_color(x, y, color);
					return c + 1;
				}
			}
		}
		return 0;
	}

	ReversiMap.prototype.change_color = function(x, y, color) {
	    this.map.put(x, y, color);
		this.set_color(x, y, color);
	}

	ReversiMap.prototype.get_color = function(x, y) {
		if(x >= 0 && y >= 0 && x < 8 && y < 8)
			return this.data[x + y * 8];
		else
			return ReversiMap.BLOCK;
	}

	ReversiMap.prototype.set_color = function(x, y, color) {
		if(x >= 0 && y >= 0 && x < 8 && y < 8) {
			this.data[x + y * 8] = color;
			return color;
		}else{
			return ReversiMap.BLOCK;
		}
	}

	function Map() {

	}

	Map.prototype.init = function() {
		for(var i=0;i < 8;i++)
			for(var j=0;j < 8;j++)
				this.putEmpty(i, j);
	}

	Map.prototype.put = function(x, y, color) {
		var elem = s.circle(25, 25, 25);
		elem.attr({
		    fill: color==ReversiMap.WHITE ? "#fff" : "#000",
		    stroke: "#000",
		    strokeWidth: 5
		});
		elem.transform("translate("+x*50+","+y*50+")");
	}

	Map.prototype.putEmpty = function(x, y) {
		var self = this;
		var elem = s.rect(0, 0, 50, 50);
		elem.attr({
		    fill: "#0f0",
		    stroke: "#000",
		    strokeWidth: 5
		});
		elem.transform("translate("+x*50+","+y*50+")");
		elem.click(function() {
			self.click(x, y);
		});
	}


} ())
