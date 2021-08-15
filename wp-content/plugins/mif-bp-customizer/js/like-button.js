//
// JS-помощник кнопки "Нравится"
//
//


jQuery( document ).ready( function( jq ) {

    time = 200;

	//
	// Отправляем данные о новом нажатии "Нравится"
	//

	jq( '#activity-stream' ).on( 'click', '.button.like', function() {

		var target = jq( this ),
        wrap = target.closest('div');
        parent = target.closest('.activity-item');
        activity_id = parent.attr('id').substr( 9, parent.attr( 'id' ).length );

        var nonce = jq( this ).attr( 'href' );
		nonce = nonce.split('?_wpnonce=');
		nonce = nonce[1].split('&');
		nonce = nonce[0];

		jq.post( ajaxurl, {
			action: 'like-button-press',
			_wpnonce: nonce,
            activity_id: activity_id,
		},
		function( response ) {
            
            if ( response == 'liked' ) {
                wrap.addClass( 'active' );
                n = target.find( "span" ).html();
                n++;
                target.find( "span" ).html( n )
            }

            if ( response == 'unliked' ) {
                wrap.removeClass( 'active' );
                n = target.find( "span" ).html();
                n--;
                target.find( "span" ).html( n )
            }

		});

		return false;

	} );

});
