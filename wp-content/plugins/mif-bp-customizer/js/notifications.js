//
// JS-помощник раздела уведомлений
//
//

jQuery( document ).ready( function( jq ) {

	var time = 200;
    


    //
	// Отметить всё на странице
	//

	jq( '.custom-notifications' ).on( 'change click', '#select-all-notifications', function() {

		var input = '.custom-notifications tbody input:checkbox';
		
		jq( input ).map( function() {
			if ( jq( '#select-all-notifications' ).prop("checked") ) {
				jq( this ).attr( 'checked', 'checked' ); 
			} else {
				jq( this ).removeAttr( 'checked' ); 
			}
		} );

	} );


    //
	// Удалить отмеченное
	//

	jq( '.custom-notifications' ).on( 'click', 'a.notification-bulk-delete', function() {

        var href = jq( this ).attr( 'href' );
		var form = jq( this ).closest( 'form' );
		var input = '.custom-notifications tbody input:checkbox:checked';
		var arr = jq( input ).map( function() { return this.value; } ).get();


		var nonce = href.split( '_wpnonce=' );
		nonce = nonce[1].split( '&' );
		nonce = nonce[0];

		jq.post( ajaxurl, {
			action: 'mif-bpc-notification-bulk-delete',
            arr: arr,
			_wpnonce: nonce,
		},
		function( response ) {

			if ( response ) {

				jq( input ).map( function() { 
					jq( this ).parent().parent().fadeOut();
				} );
				
				new_notifotation_updated( jq, response );
			}

		});

		return false;

	} );


    //
	// Отметить отмеченное как прочитанное
	//

	jq( '.custom-notifications' ).on( 'click', 'a.notification-bulk-not-is-new', function() {

        var href = jq( this ).attr( 'href' );
		var form = jq( this ).closest( 'form' );
		var input = '.custom-notifications tbody input:checkbox:checked';
		var arr = jq( input ).map( function() { return this.value; } ).get();


		var nonce = href.split( '_wpnonce=' );
		nonce = nonce[1].split( '&' );
		nonce = nonce[0];

		jq.post( ajaxurl, {
			action: 'mif-bpc-notification-bulk-not-is-new',
            arr: arr,
			_wpnonce: nonce,
		},
		function( response ) {
			
			if ( response ) {

				jq( input ).map( function() { 
					jq( this ).parent().parent().removeClass( 'new' );
					jq( this ).removeAttr( 'checked' );
					jq( '#div-notification-' + this.value ).fadeOut();
					jq( '#select-all-notifications' ).removeAttr( 'checked' );
				} );

				new_notifotation_updated( jq, response );
			}

		});

		return false;

	} );


    //
	// Отметить как прочитанное
	//

	jq( '.custom-notifications, .float-notification' ).on( 'click', 'a.notification-to-not-new', function() {

		// var tr = jq( this ).parent().parent().parent();
        var href = jq( this ).attr( 'href' );
        var id = jq( this ).attr( 'id' );

		var nonce = href.split( '_wpnonce=' );
		nonce = nonce[1].split( '&' );
		nonce = nonce[0];

		id = id.split( '-' );
		id = id[2];

		jq.post( ajaxurl, {
			action: 'mif-bpc-notification-to-not-new',
            id: id,
			_wpnonce: nonce,
		},
		function( response ) {

			if ( response ) {
				// tr.removeClass( 'new' );
				jq( '#tr-notification-' + id ).removeClass( 'new' );
				jq( '#div-notification-' + id ).fadeOut();

				new_notifotation_updated( jq, response );

			}

		});

		return false;

	} );



    //
	// Отметить как непрочитанное
	//

	jq( '.custom-notifications' ).on( 'click', 'a.notification-to-new', function() {

		// var tr = jq( this ).parent().parent().parent();
        var href = jq( this ).attr( 'href' );
        var id = jq( this ).attr( 'id' );

		var nonce = href.split( '_wpnonce=' );
		nonce = nonce[1].split( '&' );
		nonce = nonce[0];

		id = id.split( '-' );
		id = id[2];

		jq.post( ajaxurl, {
			action: 'mif-bpc-notification-to-new',
            id: id,
			_wpnonce: nonce,
		},
		function( response ) {

			if ( response ) {
				// tr.addClass( 'new' );
				jq( '#tr-notification-' + id ).addClass( 'new' );
				jq( '#div-notification-' + id ).fadeIn();

				new_notifotation_updated( jq, response );

			}

		});

		return false;

	} );



    //
	// Удалить активность
	//

	jq( '.custom-notifications' ).on( 'click', 'a.notification-delete', function() {

		// var tr = jq( this ).parent().parent().parent();
        var href = jq( this ).attr( 'href' );
        var id = jq( this ).attr( 'id' );

		var nonce = href.split( '_wpnonce=' );
		nonce = nonce[1].split( '&' );
		nonce = nonce[0];

		id = id.split( '-' );
		id = id[2];

		
		jq.post( ajaxurl, {
			action: 'mif-bpc-notification-delete',
            id: id,
			_wpnonce: nonce,
		},
		function( response ) {

			if ( response ) {
				// tr.fadeOut();
				jq( '#tr-notification-' + id ).fadeOut();
				jq( '#div-notification-' + id ).fadeOut();

				new_notifotation_updated( jq, response );

			}
			
		});

		return false;

	} );



    //
	// Отправляем запрос "читать далее"
	//

	jq( '.custom-notifications' ).on( 'click', 'a.load-more', function() {

        // alert('12');

		var button = jq( this ).parent();
		var tr = jq( this ).parent().parent().parent();
		var tbody = jq( this ).parent().parent().parent().parent();
        var href = jq( this ).attr( 'href' );

		nonce = href.split( '_wpnonce=' );
		nonce = nonce[1].split( '&' );
		nonce = nonce[0];

		page = href.split( 'page=' );
		page = page[1].split( '&' );
		page = page[0];

		// alert(page);

		tr.addClass( 'loading' );
		
		jq.post( ajaxurl, {
			action: 'mif-bpc-notifications-load-more',
            page: page,
			_wpnonce: nonce,
		},
		function( response ) {

			var elem = jq( response );
			
			tr.remove();

			elem.hide();
			tbody.append( elem );
			elem.slideDown();

			if ( jq( '#select-all-notifications' ).prop("checked") ) {
				jq( '.custom-notifications tbody input:checkbox' ).map( function() { jq( this ).attr( 'checked', 'checked' ); } );
			}

		});

		return false;

	} );


});



//
// Обновить данные виджета новых уведомлений
//

function new_notifotation_updated( jq, count )
{
	var wrap = jq( '.notifications-info' );
	var span = jq( '.notifications-info span' );

	if ( count > 0 ) {

		if ( span.html() != count ) {

			wrap.fadeIn( 'fast' );
			span.fadeOut( 'fast', function() { 
				span.html( count ); 
				span.show() 
			});

		}

	} else {

		wrap.fadeOut();

	}
}

//
// Обновить всплывающие подсказки
//

function float_notification_update( jq ) 
{

	jq.post( ajaxurl, {
		action: 'mif-bpc-float-notification-update'
	},
	function( response ) {

		if ( response ) {

			// объект с номерами и html-кодом уведомлений, которые надо показать
			var obj = jQuery.parseJSON( response );

			// обновить общее число уведомлений
			new_notifotation_updated( jq, obj[0] );
			delete obj[0];

			// id всплывающих уведомлений, которые сейчас есть на странице (открытые или скрытые)
			var arr = jq( '.float-notification>div' ).map( function() { 
				return jq( this ).attr( 'id' );
				// return jq( this ).attr( 'id' ); 
			} ).get();


			// Удалим из массивов то, что на странице не меняется
			for ( var key in obj ) {

				var pos = jq.inArray( 'div-notification-' + key, arr );
				if ( pos == -1 ) continue;

				jq( '#' + arr[pos] ).fadeIn( time );

				arr.splice( pos, 1 );
				delete obj[key];

			}

			// Удалим то, что показывать больше не надо
			for ( var key in arr ) {
				jq( '#' + arr[key] ).fadeOut( time );
			}

			// Покажем то, что надо показать
			setTimeout( function() {
				for ( var key in obj ) {
					jq( obj[key] ).prependTo( jq( '.float-notification' ) ).hide().fadeIn();
				}
			}, time * 2 );

		}


	});

	return false;
}
