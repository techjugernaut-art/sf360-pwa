(function($) {
	'use strict';
	
	// ______________ headerfixed
	$(window).on("scroll", function(e){
		if ($(window).scrollTop() >= 75) {
			$('.horizontal-main').addClass('fixedheader');
			$('.horizontal-main').addClass('visible-title');
		}
		else {
			$('.horizontal-main').removeClass('fixedheader');
			$('.horizontal-main').removeClass('visible-title');
		}
    });
	
})(jQuery);