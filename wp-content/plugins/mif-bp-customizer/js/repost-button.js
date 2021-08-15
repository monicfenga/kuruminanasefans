//
// JS-помощник кнопки "Поделиться"
//
//


jQuery( document ).ready( function( jq ) {

    time = 200;

	//
    // Применить особый стиль для активной textarea
    //
    
    jq( 'textarea#whats-new' ).focus( function() {

        jq( "textarea#whats-new" ).addClass( 'active' );

    } );
    
    jq( 'textarea#whats-new' ).focusout( function() {

        setTimeout( function() { jq( "textarea#whats-new" ).removeClass( 'active' ) }, 1000 );

    } );
    
    
    //
	// Публикация новой repost-записи
	//

	jq( 'input#repost-submit' ).click( function() {

		var button = jq( this );
		var form = button.parent().parent().parent().parent();

		// form.children().each( function() {
		// 	if ( jq.nodeName(this, "textarea") || jq.nodeName(this, "input") )
		// 		jq(this).prop( 'disabled', true );
		// });

		jq( 'div.error' ).remove();
		button.addClass( 'loading' );
		// button.prop('disabled', true);

		var item_id = jq( "#whats-new-post-in" ).val();
		var content = jq( "textarea#whats-new" ).val();
        var object = jq( "#whats-new-post-object" ).val();

        if ( content == '' ) content = '<!-- none -->';

		jq.post( ajaxurl, {
			action: 'post_update',
			'cookie': encodeURIComponent( document.cookie ),
			'_wpnonce_post_update': jq( "input#_wpnonce_post_update" ).val(),
			'content': content,
			'object': object,
			'item_id': item_id,
			'_bp_as_nonce': jq( '#_bp_as_nonce' ).val() || ''
		},
		function( response ) {

            

			// form.children().each( function() {
			// 	if ( jq.nodeName(this, "textarea") || jq.nodeName(this, "input") ) {
			// 		jq(this).prop( 'disabled', false );
			// 	}
			// });

                // alert( response );
			if ( response[0] + response[1] == '-1' ) {
				form.prepend( response.substr( 2, response.length ) );
				jq( 'form#' + form.attr( 'id' ) + ' div.error' ).hide().fadeIn( time );
			} else {
				if ( 0 == jq( "ul.activity-list" ).length ) {
					jq( "div.error" ).slideUp( time ).remove();
					jq( "div#message" ).slideUp( time ).remove();
					jq( "div.activity" ).append( '<ul id="activity-stream" class="activity-list item-list">' );
				}

				jq( "ul#activity-stream" ).prepend( response );
				jq( "ul#activity-stream li:first" ).addClass( 'new-update' );

				// if ( 0 != jq("#latest-update").length ) {
				// 	var l = jq("ul#activity-stream li.new-update .activity-content .activity-inner p").html();
				// 	var v = jq("ul#activity-stream li.new-update .activity-content .activity-header p a.view").attr('href');

				// 	var ltext = jq("ul#activity-stream li.new-update .activity-content .activity-inner p").text();

				// 	var u = '';
				// 	if ( ltext != '' )
				// 		u = l + ' ';

				// 	u += '<a href="' + v + '" rel="nofollow">' + BP_DTheme.view + '</a>';

				// 	jq("#latest-update").slideUp(300,function(){
				// 		jq("#latest-update").html( u );
				// 		jq("#latest-update").slideDown(300);
				// 	});
				// }

				jq( "li.new-update" ).hide().slideDown( time );
				jq( "li.new-update" ).removeClass( 'new-update' );
                jq( "textarea#whats-new" ).removeClass( 'active' );
				jq( "textarea#whats-new" ).val( '' );

                jq( '#whats-new-options .activity-list' ).remove();
                jq( '#whats-new-options #repost-submit-wrap' ).remove();
                jq( '#whats-new-options #whats-new-post-object' ).remove();
                jq( '#whats-new-options #whats-new-post-in' ).remove();
                jq( "body" ).removeClass( 'repost-activity-form' );

			}



            // alert(response);

			// jq("#whats-new-options").animate({
			// 	height:'0px'
			// });
			// jq("form#whats-new-form textarea").animate({
			// 	height:'20px'
			// });
			// jq("#aw-whats-new-submit").prop("disabled", true).removeClass('loading');

    		button.removeClass( 'loading' );


		});



        // alert('123');

		// var target = jq( this ),
        // wrap = target.closest('div');
        // parent = target.closest('.activity-item');
        // activity_id = parent.attr('id').substr( 9, parent.attr( 'id' ).length );

        // var nonce = jq( this ).attr( 'href' );
		// nonce = nonce.split('?_wpnonce=');
		// nonce = nonce[1].split('&');
		// nonce = nonce[0];

		// jq.post( ajaxurl, {
		// 	action: 'repost-button-press',
		// 	_wpnonce: nonce,
        //     activity_id: activity_id,
		// },
		// function( response ) {
            
        //     // if ( response == 'fav' ) {
        //     //     wrap.addClass( 'active' );
        //     // }

        //     // if ( response == 'unfav' ) {
        //     //     wrap.removeClass( 'active' );
        //     // }

        //     alert(response);
        //     // if ( response ) jq( 'li.' + response ).slideUp();
		// });

		return false;

	} );


	// jq( '#activity-stream' ).on( 'click', '.button.repost', function() {

	// 	var target = jq( this ),
    //     wrap = target.closest('div');
    //     parent = target.closest('.activity-item');
    //     activity_id = parent.attr('id').substr( 9, parent.attr( 'id' ).length );

    //     var nonce = jq( this ).attr( 'href' );
	// 	nonce = nonce.split('?_wpnonce=');
	// 	nonce = nonce[1].split('&');
	// 	nonce = nonce[0];

	// 	jq.post( ajaxurl, {
	// 		action: 'repost-button-press',
	// 		_wpnonce: nonce,
    //         activity_id: activity_id,
	// 	},
	// 	function( response ) {
            
    //         // if ( response == 'fav' ) {
    //         //     wrap.addClass( 'active' );
    //         // }

    //         // if ( response == 'unfav' ) {
    //         //     wrap.removeClass( 'active' );
    //         // }

    //         alert(response);
    //         // if ( response ) jq( 'li.' + response ).slideUp();
	// 	});

	// 	return false;

	// } );

});
