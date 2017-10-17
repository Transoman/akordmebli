jQuery(document).ready(function($) {

	// Header slider
	$('.header-slider').owlCarousel({
		items: 1,
		mouseDrag: false,
		dotsClass: 'slider-dots',
		dotClass: 'slider-dots__item'
	});

	// Features counter numbers
	$('.counter').counterUp();

	// Search modal
	$('.search__btn').click(function(e) {
		e.preventDefault();
		$('.search-wrapp').addClass('open');

		// Close search by pressing Esc
		document.onkeydown = function(evt) {
			evt = evt || window.event;
			if (evt.keyCode == 27) {
				$('.search-wrapp').removeClass('open');
			}
		};
	});

	$('.search-wrapp__close').click(function(e) {
		e.preventDefault();
		$('.search-wrapp').removeClass('open');
	});


	// Fancybox
	$('.fancybox').fancybox();

	//
	$('.order-metering-form__input, .order-metering-form__textarea').on('focus', function(e) {
		$(this).parent().addClass('is-focused');
	});

	$('.order-metering-form__input, .order-metering-form__textarea').on('focusout', function() {
		if($(this).val() === '') {
			$(this).parent().removeClass('is-focused');
		}
	});

	// Mask phone
	$('#phone').mask('+38 (000) 00 00 000');

	// Navigate toggle
	$('.nav-toggle').click(function(e) {
		if($('.nav-toggle').hasClass('active')) {
			$('.nav-toggle').removeClass('active');
		}
		else {
			$('.nav-toggle').addClass('active');
		}
	});

});

// Svg-sprite LocalStorage
;( function( window, document )
{
	'use strict';

	var file     = 'img/symbols.html',
			revision = 1;

	if( !document.createElementNS || !document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' ).createSVGRect )
			return true;

	var isLocalStorage = 'localStorage' in window && window[ 'localStorage' ] !== null,
			request,
			data,
			insertIT = function()
			{
					document.body.insertAdjacentHTML( 'afterbegin', data );
			},
			insert = function()
			{
					if( document.body ) insertIT();
					else document.addEventListener( 'DOMContentLoaded', insertIT );
			};

	if( isLocalStorage && localStorage.getItem( 'inlineSVGrev' ) == revision )
	{
		data = localStorage.getItem( 'inlineSVGdata' );
		if( data )
		{
				insert();
				return true;
		}
	}

	try
	{
		request = new XMLHttpRequest();
		request.open( 'GET', file, true );
		request.onload = function()
			{
				if( request.status >= 200 && request.status < 400 )
					{
						data = request.responseText;
						insert();
						if( isLocalStorage )
						{
							localStorage.setItem( 'inlineSVGdata',  data );
							localStorage.setItem( 'inlineSVGrev',   revision );
						}
				}
		}
		request.send();
	}
	catch( e ){}

}( window, document ) );