//
// JS-помощник кнопок исключения типов активности
//
//


jQuery( document ).ready( function( jq ) {

    time = 200;

	//
	// Отключить действие кнопки "три точки"
	//

    jq( 'a.disable-activity-type' ).on( 'click', function() { return false; });
    jq( 'a.banned-users' ).on( 'click', function() { return false; });

	//
	// Отправляем данные о новом исключенном типе активности
	//

	jq( '#activity-stream' ).on( 'click', '.disable-activity-type a.ajax.activity-exclude', function() {

        var nonce = jq( this ).attr( 'href' );
		nonce = nonce.split('?_wpnonce=');
		nonce = nonce[1].split('&');
		nonce = nonce[0];

		var exclude = jq( this ).attr( 'data-exclude' );
        // var button = jq( this );

		jq.post( ajaxurl, {
			action: 'disable-activity-type-button',
			_wpnonce: nonce,
            exclude: exclude,
		},
		function( response ) {
            if ( response ) jq( 'li.' + response ).slideUp();
		});

		return false;

	} );

	//
	// Отправляем данные о новом заблокироанном пользователе
	//

	jq( '#item-buttons' ).on( 'click', '.banned-users a.ajax', function() {

        var nonce = jq( this ).attr( 'href' );
		nonce = nonce.split('?_wpnonce=');
		nonce = nonce[1].split('&');
		nonce = nonce[0];

        // alert(nonce);
		var userid = jq( this ).attr( 'data-userid' );
        var button = jq( this );

		jq.post( ajaxurl, {
			action: 'banned-user-button',
			_wpnonce: nonce,
            userid: userid,
		},
		function( response ) {
//            alert(response);
            if ( response ) {
                button.fadeOut( time, function() { button.fadeIn( time ).html( response ) } );

                jq( '.acomment-user-' + userid ).toggleClass( 'none' );
                jq( '.like-user-' + userid ).toggleClass( 'none' );
                jq( '.repost-user-' + userid ).toggleClass( 'none' );
                jq( '.friendship-button.add' ).toggleClass( 'none' );
                jq( 'i.banned-users.icon' ).toggleClass( 'none' );
        }
		});

		return false;

	} );


	//
	// Отправляем данные о новоой поддписке на пользователя
	//

	jq( '#item-buttons' ).on( 'click', '.banned-users a.following', function() {

        var nonce = jq( this ).attr( 'href' );
		nonce = nonce.split('?_wpnonce=');
		nonce = nonce[1].split('&');
		nonce = nonce[0];

        // alert(nonce);
		var user_id = jq( this ).attr( 'data-userid' );
        var button = jq( this );
		// alert(userid);

		jq.post( ajaxurl, {
			action: 'following-user-button',
			_wpnonce: nonce,
            user_id: user_id,
		},
		function( response ) {
        //    alert(response);
            if ( response ) {
                button.fadeOut( time, function() { button.fadeIn( time ).html( response ) } );

        //         jq( '.acomment-user-' + userid ).toggleClass( 'none' );
        //         jq( '.like-user-' + userid ).toggleClass( 'none' );
        //         jq( '.repost-user-' + userid ).toggleClass( 'none' );
        //         jq( '.friendship-button.add' ).toggleClass( 'none' );
        //         jq( 'i.banned-users.icon' ).toggleClass( 'none' );
        }
		});

		return false;

	} );





});
