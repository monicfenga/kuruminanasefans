//
// JS-помощник кнопки "Избранное", строки меню "Удалить запись"
//
//


jQuery( document ).ready( function( jq ) {

    time = 200;

	//
	// Отправляем данные о новом нажатии "Избранное"
	//

	jq( '#activity-stream' ).on( 'click', '.button.favorite', function() {

		var target = jq( this ),
        wrap = target.closest('div');
        parent = target.closest('.activity-item');
        activity_id = parent.attr('id').substr( 9, parent.attr( 'id' ).length );

        var nonce = jq( this ).attr( 'href' );
		nonce = nonce.split('?_wpnonce=');
		nonce = nonce[1].split('&');
		nonce = nonce[0];

		jq.post( ajaxurl, {
			action: 'favorite-button-press',
			_wpnonce: nonce,
            activity_id: activity_id,
		},
		function( response ) {
            
            if ( response == 'fav' ) {
                wrap.addClass( 'active' );
            }

            if ( response == 'unfav' ) {
                wrap.removeClass( 'active' );
            }

		});

		return false;

	} );



	//
	// Строка меню "Удалить запись"
	//

	jq( '#activity-stream' ).on( 'click', '.disable-activity-type a.ajax.activity-remove', function() {

        var nonce = jq( this ).attr( 'href' );
		nonce = nonce.split('?_wpnonce=');
		nonce = nonce[1].split('&');
		nonce = nonce[0];

		var activity_id = jq( this ).attr( 'data-aid' );
        // var button = jq( this );

        // alert(activity_id);

		jq.post( ajaxurl, {
			action: 'remove-button-press',
			_wpnonce: nonce,
            activity_id: activity_id,
		},
		function( response ) {

            if ( response == 'removed' ) jq( '#activity-' + activity_id ).slideUp();

		});

		return false;

	} );

    

});
