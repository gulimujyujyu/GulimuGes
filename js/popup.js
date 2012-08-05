$("body").ready(function(){
	
	//global storage
	var GS = {
		canvas: $("#panel")[0],
		points: [],
		dollar: new DollarRecognizer(),
		is_move: false,
		is_down: false
	};
	GS.g = GS.canvas.getContext('2d');
	GS.g.fillStyle = "rgb(0,0,225)";
	GS.g.strokeStyle = "rgb(0,0,225)";
	GS.g.lineWidth = 3;
	
	console.log(GS);

	//some utils function
	var Utils = {
		GetMousePosition: function(e, ele) {
			var x = e.pageX - ele.offsetLeft;
			var y = e.pageY - ele.offsetTop;
			console.log(e.pageX+"\t"+e.pageY);
			console.log(ele.offsetLeft);
			return {"x":x,"y":y};
		},
		GetRectangle: function(ele) {
			var os = $(ele).offset()
			var w = $(ele).width();
			var h = $(ele).height();
			return {"x":os.left,"y":os.top,"w":w,"h":h};
		},
		DrawConnectedPoint: function(g,pt,from,to) {
			g.beginPath();
			g.moveTo(pt[from].X, pt[from].Y);
			g.lineTo(pt[to].X, pt[to].Y);
			g.closePath();
			g.stroke();
		},
		SetPrecision: function(val,digit) {
			return Math.floor(val*Math.pow(10,digit))/Math.pow(10,digit);
		}
	};
	
	//add three listeners
	$("#panel").mousedown(function(e) {
		var pos = Utils.GetMousePosition(e,this);
		var rect = Utils.GetRectangle(this);
		GS.is_down = true;
		GS.is_move = false;
		GS.g.clearRect(0,0,rect.w,rect.h);
		GS.points.length = 1;
		GS.points[0] = new Point(pos.x,pos.y);
		$("#debug").text("start");
	});
	
	$("#panel").mousemove(function(e) {
		if (GS.is_down) {
			var pos = Utils.GetMousePosition(e,this);
			GS.points[GS.points.length] = new Point(pos.x,pos.y);
			//console.log(GS.points);
			Utils.DrawConnectedPoint(GS.g,GS.points,GS.points.length-2,GS.points.length-1);
			GS.is_move = true;
			$("#debug").text("moving");
		}
	});
	
	$("#panel").mouseup(function(e) {
		console.log("mouse up");
		if (GS.is_down) {
			GS.is_down = false;
			GS.is_move = false;
			if (GS.points.length >= 10) {
				var result = GS.dollar.Recognize(GS.points,false);
				$("#debug").text(result.Name+"\t"+Utils.SetPrecision(result.Score,2));
				console.log(result);
			} else {
				//
			}
		}
	});
});