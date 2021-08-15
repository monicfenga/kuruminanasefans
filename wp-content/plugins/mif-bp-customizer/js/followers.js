//
// JS-помощник кнопки "Нравится"
//
//


jQuery( document ).ready( function( jq ) {

	time = 200;
    
    //
	// Отправляем данные о подтверждении дружбы
	//

	jq( '#item-buttons, .action' ).on( 'click', '.custom-friendship-button a.friendship-button', function() {

		// var button = jq( this ).parent().parent();
		var button = jq( this ).parent();
		var id = jq( this ).attr( 'id' );
        var nonce = jq( this ).attr( 'href' );
        var cls = jq( this ).attr( 'class' );
        var link = jq( this );

		id = id.split( '-' );
        var action_id = id[0];
		var user_id = id[1];

		nonce = nonce.split( '?_wpnonce=' );
		nonce = nonce[1].split( '&' );
		nonce = nonce[0];

		// button.addClass( 'loading' );
		
		jq.post( ajaxurl, {
			action: 'mif-bpc-friendship-actions',
            action_id: action_id,
			_wpnonce: nonce,
            user_id: user_id,
		},
		function( response ) {
            
            if ( response ) {

                // button.fadeOut( time, function() { button.fadeIn( time ).html( response ) } );
                button.fadeOut( time, function() { button.replaceWith( response ).fadeIn( time ) } );
                // button.replaceWith( response );
            }
            
            // jq( '#not-now-button-' + user_id ).fadeOut( time, function () { jq( '#friendship-button-' + user_id ).addClass( 'secondary' ) } );
            jq( '#not-now-button-' + user_id ).fadeOut( time );
                // alert('#not-now-button-' + user_id);
            // alert(response);


		});

		return false;

	} );

});
