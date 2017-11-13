function get_numerology(name) {
	var max = 9;
	var min = 1;
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function ucwords(str) {
	return str.replace(/\w\S*/g, function (txt) {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
}

function format_names(data) {
	var result = '';
	for (var i = 0; i < data.length; i++) {
		// data[i]
		var str = '';
		str += "<a href='/baby-names/" + data[i].title.toLowerCase().replace(' ','-') + "-meaning'><div class='row link'>";
		str += '<div class="col-sm-3 col-xs-6"><p class="name">' + data[i].title + '</p></div>';
		str += '<div class="col-sm-3 col-xs-6 col-lg-push-6 col-md-push-6"><p class="center-text right-small-text"><span class="hidden-md hidden-lg">Numerology - </span>' + get_numerology(data[i].title) + '</p></div>';
		str += '<div class="col-sm-6 col-xs-12 col-lg-pull-3 col-md-pull-3"><p class="center-text left-small-text"><span class="hidden-md hidden-lg">Meaning - </span>' + ((data[i].name_meaning == null )?'-':data[i].name_meaning) + '</p></div>';
		str += '<div class="col-sm-12 col-xs-12"><p class="right-small-text hidden-md hidden-lg"><u>See More...</u></p></div></div></a>';

		result += str;
	}
	return result;
}
function babyarchive(){

jQuery(document).ready(function ($) {
	$("#load-more").click(function () {
		$.ajax({
			method: 'GET',
			data: {
				offset: $("#offset").val(),
				category_term: $("#category_term").val(),
				gender: $("#gender").val(),
				start_char:$("#start_char").val()
			},
			url: '/blog/getMoreNames',
			success: function (data) {
				$(format_names(data.names)).insertBefore("#load-more");
				if (data.newOffset == false) {
					$("#load-more").hide();
				}
				else
				{
					$("#offset").val(data.newOffset);
				}
			}
		})
	});

$(function() {
   $("li").click(function() {

    	$("li").removeClass("active");
    	$(this).addClass("active");
		var gender = $(this).attr('id');

		if(gender=="girlselect"){
			$('#gril_names').removeClass("hide");
			$('#boy_names').addClass("hide");
		}
		else{
			$('#boy_names').removeClass("hide");
			$('#gril_names').addClass("hide");
		}

   });

});

})

}

waitUntilJQueryLoaded(babyarchive);