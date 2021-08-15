//
// JS-помощник кнопки "Избранное"
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

            // alert(response);
            // if ( response ) jq( 'li.' + response ).slideUp();
		});

		return false;

	} );

});
