jQuery(document).ready(function($){

	$('#drop-down').click(function(e){
		$(this).find("ul").toggleClass("hide");
		var signElement = $(this).find("i"); 
		var sign =  signElement.text().trim();
		sign = (sign == '+') ? '-' : '+'; 
		signElement.text(sign);
		return false;
	});

});

