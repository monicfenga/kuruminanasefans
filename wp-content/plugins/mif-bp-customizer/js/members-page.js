//
// JS-помощник формы добавления пользователя
//
//



jQuery( document ).ready( function( jq ) {

    var time = 200;

	//
	// Меняем кнопку "Добавить пользователей" на форму добавления
	//

	jq( '.members-page .add-btn button' ).on( 'click', function() {

        jq( '.members-page .add-btn' ).slideUp( time, function() { jq( '.members-page .add-form' ).slideDown( time ) } );		
		return false;

	} );


	//
	// Отправляем данные о новых пользователях
	//

	jq( '.members-page .submit-btn button' ).on( 'click', function() {

		var _wpnonce = jq( this ).parent().parent().find( "[name='_wpnonce']" ).attr('value');
		var slug = jq( this ).parent().parent().find( "[name='slug']" ).attr('value');
		var memberlist = jq( this ).parent().parent().find( "[name='memberlist']" ).val();
		// user_id = jq( this ).parent().parent().find( "[name='user_id']" ).val();
		var response_box = jq( this ).parent().parent().find( ".response-box" );
        // var time = 200;

		jq.post( ajaxurl, {
			action: 'members-page-submit-' + slug,
			_wpnonce: _wpnonce,
			memberlist: memberlist,
			// user_id: user_id,
		},
		function( response ) {
			response_box.slideUp( time, function() { response_box.slideDown( time ).html( response ) } );
		} );	

		return false;

	} );


	//
	// Удаляем или добавляем пользователя в списке пользователей
	//

	jq( '.members-page' ).on( 'click', 'a.banned-button', function() {

        var nonce = jq( this ).attr( 'href' );
		nonce = nonce.split('?_wpnonce=');
		nonce = nonce[1].split('&');
		nonce = nonce[0];

		var user_id = jq( this ).attr( 'id' );
		user_id = user_id.split('-');
		user_id = user_id[1];

		var rel = jq( this ).attr( 'rel' );

        var button = jq( this ).parent().parent();

		jq.post( ajaxurl, {
			action: 'members-page-add-remove-button',
			_wpnonce: nonce,
            user_id: user_id,
            rel: rel,
		},
		function( response ) {
            // alert(response);
			button.fadeOut( time, function() { button.fadeIn( time ).html( response ) } );
		});

		return false;

	} );
});
