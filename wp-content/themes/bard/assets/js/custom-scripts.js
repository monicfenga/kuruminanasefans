jQuery(document).ready(function( $ ) {
	"use strict";

/*
** Header Image & Video =====
*/
	var entryHeader = $('.entry-header');

	// Parallax Effect
	/*
	if ( entryHeader.attr('data-image') ) {
		entryHeader.parallax({ imageSrc: entryHeader.attr('data-image') });
	}
	*/
	// Video Background
	if ( entryHeader.attr('data-bg-type') === 'video' ) {
		entryHeader.vide({
			mp4: entryHeader.attr('data-video-mp4'),
			webm: entryHeader.attr('data-video-webm')
		});

		// Safari Fix
		$(window).load(function() {
			if ( /^((?!chrome|android).)*safari/i.test(navigator.userAgent) ) {
				$('.entry-header').data('vide').getVideoObject().play();
				$('.entry-header video').css({ 'visibility' : 'visible', 'opacity' : '1' });
			}
		});
	}

	$('.entry-header-slider').slick({
		prevArrow: '<span class="header-slider-prev-arrow icon-angle-left"></span>',
		nextArrow: '<span class="header-slider-next-arrow icon-angle-right"></span>',
		dotsClass: 'header-slider-dots',
		adaptiveHeight: true,
		fade: true,
		rtl: RTL,
		speed: 750,
  		customPaging: function(slider, i) {
            return '';
        }
	});


/*
** Main Navigation =====
*/
	// Navigation Hover
	$('#top-menu, #main-menu').find('li').hover(function () {
	    $(this).children('.sub-menu').stop().fadeIn( 200 );
	}, function() {
		$(this).children('.sub-menu').stop().fadeOut( 200 );
	});

	// Mobile Menu
	$('.mobile-menu-btn').on( 'click', function() {
		$('.mobile-menu-container').slideToggle();
	});

	// Mobile Menu Height
	if ( $('#mobile-menu').length ) {
		var mobileMenuHeight = ( $('#mobile-menu > li').css('line-height').slice(0, -2) * $('#mobile-menu > li').length ) + 15;
		//$('.mobile-menu-container').css( 'height', mobileMenuHeight + 'px' );
	}

	// Responsive Menu 
	$( '#mobile-menu .menu-item-has-children' ).prepend( '<div class="sub-menu-btn"></div>' );
	$( '#mobile-menu .sub-menu' ).before( '<span class="sub-menu-btn-icon icon-angle-down"></span>' );

	// Responsive sub-menu btn
	$('.sub-menu-btn').click(function(){
		$(this).closest('li').children('.sub-menu').slideToggle();
		$(this).closest('li').children('.sub-menu-btn-icon').toggleClass( 'fa-rotate-270' );
	});

	// Sticky Main Navigation
	function stickyMenu() {
		if ( $( '#main-nav' ).attr( 'data-fixed' ) === '1' ) {
			var wpadminbar = $('#wpadminbar').length ? $('#wpadminbar').outerHeight() : 0;
			$( '#main-nav' ).sticky({ topSpacing: wpadminbar });
		} else {
			$( '#main-nav' ).unstick();
		}
	}

	// Search Form
	$('.main-nav-icons').after($('.main-nav-search #searchform').remove());
	var mainNavSearch = $('#main-nav #searchform');
	
	mainNavSearch.find('#s').attr( 'placeholder', mainNavSearch.find('#s').data('placeholder') );

	$('.main-nav-search').click(function() {
		if ( mainNavSearch.css('display') === 'none' ) {
			mainNavSearch.show();
			$('.main-nav-search .svg-inline--fa:last-of-type').show();
			$('.main-nav-search .svg-inline--fa:first-of-type').hide();
			$('.main-nav-socials').css( 'visibility', 'hidden');
			$('.main-nav-socials-trigger').css( 'z-index', '-1');
		} else {
			mainNavSearch.hide();
			$('.main-nav-search .svg-inline--fa:last-of-type').hide();
			$('.main-nav-search .svg-inline--fa:first-of-type').show();
			$('.main-nav-socials').css( 'visibility', 'visible');
			$('.main-nav-socials-trigger').css( 'z-index', '3');
		}
	});

	mainNavSearch.find('#s').on( 'focus', function() {
		$(this).attr( 'placeholder', '' );
	});

	mainNavSearch.find('#s').on( 'blur', function() {
		$(this).attr( 'placeholder', mainNavSearch.find('#s').data('placeholder') );
	});

	// Responsive Social Icons
	$('.main-nav-socials-trigger').on( 'click', function() {
		if ( $('.main-nav-socials').css('display') === 'none' ) {
			$('.main-nav-socials').show();
			$(this).children('svg').first().hide();
			$(this).children('svg').last().show();
			$('.mobile-menu-btn').css( 'opacity', '0');
			$('.main-nav-icons').addClass('main-nav-socials-mobile');
		} else {
			$('.main-nav-socials').hide();
			$(this).children('svg').last().hide();
			$(this).children('svg').first().show();
			$('.mobile-menu-btn').css( 'opacity', '1');
			$('.main-nav-icons').removeClass('main-nav-socials-mobile');
		}
	});

	$(window).on( 'resize', function(){
		if ( $('.mobile-menu-btn').css('display') === 'none' ) {
			if ( $('.main-nav-icons').hasClass('main-nav-socials-mobile') ) {
				$('.main-nav-socials-trigger').trigger('click');
			}
			$('.main-nav-socials').show();
		} else {
			$('.main-nav-socials').hide();
		}
	});


/*
** Featured Slider =====
*/
	var RTL = false;
	if ( $('html').attr('dir') == 'rtl' ) {
		RTL = true;
	}

	$('#featured-slider').slick({
		prevArrow: '<span class="prev-arrow icon-angle-left"></span>',
		nextArrow: '<span class="next-arrow icon-angle-right"></span>',
		dotsClass: 'slider-dots',
		adaptiveHeight: true,
		rtl: RTL,
		speed: 750,
  		customPaging: function(slider, i) {
            return '';
        }
	});


/*
** Gallery Slideshow =====
*/

	function bardPostFormatGallery() {

		$('.post-slider').each(function() {
			if ( ! $(this).hasClass( 'slick-slider' ) ) {
				$(this).slick({
					slidesToShow: 1,
					prevArrow: '<span class="prev-arrow icon-angle-left"></span>',
					nextArrow: '<span class="next-arrow icon-angle-right"></span>',
					dotsClass: 'slider-dots',
					adaptiveHeight: true,
					fade: true,
					rtl: RTL,
					speed: 750,
			  		customPaging: function(slider, i) {
			            return '';
			        }
				});
			}
		});

	}

	bardPostFormatGallery();


/*
** Infinite Scroll/Load More =====
*/

	if ( $('.blog-pagination').length ) {
		
		var paginationType = $('.blog-pagination').attr('class'),
			loadMoreText = $('.load-more').text();

		if ( paginationType.indexOf( 'load-more' ) > 0 || paginationType.indexOf( 'infinite' ) > 0 ) {

			if ( paginationType.indexOf( 'infinite' ) > 0 ) {
				paginationType = 'facebook';
			} else {
				paginationType = 'twitter';
				$('body').addClass('infscr-loading-disabled');
			}

			$('.blog-grid').infinitescroll({
				navSelector: '.blog-pagination',
				nextSelector: '.blog-pagination a',
				itemSelector: '.blog-grid li',	
				behavior: paginationType,
				loading: {
					img: '',
					finishedMsg: '',
					msgText  : '<div class="cv-container"><div class="cv-outer"><div class="cv-inner">'+ $('.blog-pagination').data('loading') +'</div></div></div>'
				}
					 
			}, function( newElements ) {

				$(newElements).waitForImages({
					  finished: function() {

						// Appand New Element
					  	$('.blog-grid').append(newElements);

					  	// Run Post Gallery
					  	bardPostFormatGallery();
						$('.post-slider').slick('refresh');
   		
					  	// Run FitVids
						$('.post-media').fitVids();

						// remove Loading icon	
						$('.load-more a').text( loadMoreText );
						
					},
					waitForAll: true
				});
			});
		}

		$('.load-more').click( function() {
			$(this).find('a').text( $('.blog-pagination').data('loading') );
		});

		var pageCount = 1,
			maxPages  =  $('.load-more').data('max-pages');

		$('.load-more').on( 'click', function() {	
			pageCount++;
			if ( maxPages === pageCount ) {
				$(this).delay(1000).fadeOut(500);
			}
		});
	
	}


/*
** Sidebars =====
*/

	// Sticky Sidebar
	function stickySidebar() {
		if ( $( '.main-content' ).data('sidebar-sticky') === 1 ) {

			var SidebarOffset = 0;
			
			if ( $("#main-nav").attr( 'data-fixed' ) === '1' ) {
				SidebarOffset = 40;
			}

			$('.sidebar-left,.sidebar-right').stick_in_parent({
				parent: ".main-content",
				offset_top: SidebarOffset,
				spacer: '.sidebar-left-wrap,.sidebar-right-wrap'
			});

			if ( $('.mobile-menu-btn').css('display') !== 'none' ) {
				$('.sidebar-left,.sidebar-right').trigger("sticky_kit:detach");
			}
		}
	}

	// Sidebar Alt Scroll
	$('.sidebar-alt').perfectScrollbar({
		suppressScrollX : true,
		includePadding : true,
		wheelSpeed: 3.5
	});

	// Sidebar Alt
	$('.main-nav-sidebar').on('click', function () {
		$('.sidebar-alt').css( 'left','0' );
		$('.sidebar-alt-close').fadeIn( 500 );
	});

	// Sidebar Alt Close
	function bardAltSidebarClose() {
		var leftPosition = parseInt( $( ".sidebar-alt" ).outerWidth(), 10 ) + 30;
		$('.sidebar-alt').css( 'left','-'+ leftPosition +'px' );
		$('.sidebar-alt-close').fadeOut( 500 );
	}

	$('.sidebar-alt-close, .sidebar-alt-close-btn').on('click', function () {
		bardAltSidebarClose();
	});

	// Instagram Columns
	var instagram = $( '.footer-instagram-widget .null-instagram-feed li a' ),
	instagramColumn = $( '.footer-instagram-widget .null-instagram-feed li' ).length;
	instagram.css({
		 'width'	: '' + 100 / instagramColumn +'%',
		 'opacity'	: '1'
	});


/*
** Scroll Top Button =====
*/

	$('.scrolltop').on( 'click', function() {
		$('html, body').animate( { scrollTop : 0 }, 800 );
		return false;
	});

	$( window ).on( 'scroll', function() {
		if ($(this).scrollTop() >= 800 ) {
			$('.scrolltop').fadeIn(350);
		} else {
			$('.scrolltop').fadeOut(350);
		}
	});


/*
** Preloader =====
*/
	if ( $('.bard-preloader-wrap').length ) {

		$( window ).on( 'load', function() {
			setTimeout(function(){
				$('.bard-preloader-wrap > div').fadeOut( 600 );
				$('.bard-preloader-wrap').fadeOut( 1500 );
			}, 300);
		});

		if ( $('body').hasClass('elementor-editor-active') ) {
			setTimeout(function(){
				$('.bard-preloader-wrap > div').fadeOut( 600 );
				$('.bard-preloader-wrap').fadeOut( 1500 );
			}, 300);
		}

	}


/*
** Window Resize =====
*/

	$( window ).on( 'resize', function() {	
		
		if ( $('.mobile-menu-btn').css('display') === 'none' ) {
			$( '.mobile-menu-container' ).css({ 'display' : 'none' });
		}

		stickyMenu();

		stickySidebar();

		bardAltSidebarClose();
		
	});


/*
** Window Load =====
*/

	$( window ).on( 'load', function() {
		stickySidebar();
		stickyMenu();
	});


/*
** Run Functions =====
*/
	// FitVids
	$('.slider-item, .post-media').fitVids();


}); // end dom ready