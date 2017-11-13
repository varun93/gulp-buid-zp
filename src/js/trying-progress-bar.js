!function($) {

	function drawTextAlongArc(ctx, str, radius, fontSize, startPos) {
	  var char;
	  var length = str.length;
	  var rotation_angle = 0.8*fontSize/radius;
	  ctx.beginPath();
	  ctx.rotate(Math.PI/2+startPos);
	  for(var i = 0; i < length; i++) {
	    char = str[i];
	    ctx.rotate(rotation_angle);
	    ctx.fillText(char,0,-1*radius);
	  }
	  ctx.restore();
	  ctx.save();
	}


	$.fn.tryingProgressBar = function(options) {
		var element = this[0];
		var elementId = element.id;

		var setting = $.extend({
			circleWidth: 18,
			radius: 80,
			period_end: 1.03, // 60 degree
			fertile_start: 2.62, // 150 degree
			fertile_end: 3.7, // 210 degree
			current_location: 5.23, // 300 degree
			days_left: 10,
			next_period: 'June 1',
			next_fertile_window: 'June 8',
			day_in_cycle: 22
		},options);

		var canvasDim = 2*setting.radius+setting.circleWidth+20;

		$('<canvas id="' + elementId + '-canvas" width="' + canvasDim +'" height="' + canvasDim +'">HTML5 canvas not supported.</canvas>').appendTo(element);
		var canvasElement = $('#'+elementId+'-canvas')[0];

		//circle parameter
		var centerX = canvasDim/2;
		var centerY = centerX;
		var radius = setting.radius;
		var pi = Math.PI;

		var ctx = canvasElement.getContext("2d");
		ctx.translate(centerX, centerY);
		ctx.rotate(-1*pi/2);
		ctx.save();

		ctx.strokeStyle = "#B8B8B8";
		ctx.lineWidth = setting.circleWidth;
		ctx.arc(0, 0, radius, 0, 2*pi);
		ctx.stroke();

		ctx.beginPath();
		var grd = ctx.createLinearGradient(radius,0,radius*Math.cos(setting.period_end),radius*Math.sin(setting.period_end));
		grd.addColorStop(0,"red");
		grd.addColorStop(1,"#ff7f7f");
		ctx.strokeStyle = grd;
		ctx.arc(0, 0, radius, 0, setting.period_end);
		ctx.stroke();

		ctx.beginPath();
		grd = ctx.createLinearGradient(radius*Math.cos(setting.fertile_start), radius*Math.sin(setting.fertile_start),radius*Math.cos(setting.fertile_end),radius*Math.sin(setting.fertile_end));
		grd.addColorStop(0,"#f1ffd6");
		grd.addColorStop(1,"#aaff00");
		ctx.strokeStyle = grd;
		ctx.arc(0, 0, radius, setting.fertile_start, setting.fertile_end);
		ctx.stroke();

		//edit data line
		ctx.beginPath();
		ctx.lineCap = "round";
		ctx.lineWidth = 22;
		ctx.moveTo(0, 32);
		ctx.lineTo(0, -32);
		ctx.strokeStyle = "#8675A1";
		ctx.stroke();

		ctx.rotate(pi/2);
		
		//center text
		ctx.font = "12px Arial";
		ctx.textAlign = "center";
		ctx.textBaseline="middle";
		ctx.fillStyle = "#ffffff";
		ctx.fillText("EDIT DATA", 0, 0);
		
		ctx.fillStyle = "#8675A1";
		ctx.fillText(setting.days_left+" days to", 0, -1*radius+30);
		
		ctx.fillText("Next Period", 0, -1*radius+43);
		ctx.fillText(setting.next_period, 0, -1*radius+56);
		
		ctx.fillText("Next Fertile Window", 0, 30);
		ctx.fillText(setting.next_fertile_window, 0, 43);

		ctx.restore();

		ctx.beginPath();
		ctx.font="10px Arial";
		ctx.textAlign = "center";
		ctx.strokeStyle = "#000000";
		ctx.textBaseline="middle";
		ctx.save();

		drawTextAlongArc(ctx, "THE PERIOD", radius, 9, 0);
		drawTextAlongArc(ctx, "FERTILE WINDOW", radius, 9, parseFloat(setting.fertile_start));
		drawTextAlongArc(ctx, "PMS", radius, 9, parseFloat(setting.fertile_end)+pi/2);


		//draw for current day
		var current_x = radius*Math.cos(setting.current_location);
		var current_y = radius*Math.sin(setting.current_location);
		ctx.beginPath();
		ctx.translate(current_x, current_y);
		var cur_rad = setting.circleWidth/2;
		ctx.arc(0, 0, cur_rad+8, 0, 2*pi);
		ctx.fillStyle = "#8675A1";
		ctx.fill();
		
		ctx.beginPath();
		ctx.arc(0, 0, cur_rad+6, 0, 2*pi);
		ctx.lineWidth = 2;
		ctx.strokeStyle = "#ffffff";
		ctx.stroke();
		ctx.fillStyle = "#fff";
		ctx.font="12px Arial";
		ctx.rotate(pi/2);
		ctx.fillText(setting.day_in_cycle,0,0);
	};
}(jQuery);