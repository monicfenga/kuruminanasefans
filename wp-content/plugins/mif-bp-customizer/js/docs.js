//
// JS-помощник документов
//
//

jQuery( document ).ready( function( jq ) {

    var time = 200;


    //
    // Меняем стиль бокса загрузки файла при наведении новых файлов
    //

    // jq( '.docs-page' ).on( 'dragenter', '.upload-form input[type=file]', function() {
    jq( 'body' ).on( 'dragenter', 'form input[type=file].docs-upload-form', function() {

        jq( '.drop-box' ).addClass( 'active');

    } );

    // jq( '.docs-page' ).on( 'dragleave', '.upload-form input[type=file]', function() {
    jq( 'body' ).on( 'dragleave', 'form input[type=file].docs-upload-form', function() {

        jq( '.drop-box' ).removeClass( 'active');

    } );


    //
    // Показать форму для ввода ссылки
    //

    jq( '.docs-page' ).on( 'click', '.upload-form .show-link-box', function() {

        jq( '.link-box' ).fadeToggle();
        return false;

    } );


    //
    // Показать форму для удаления папки
    //

    jq( '.docs-page, .docs-page-doc' ).on( 'click', '.remove-box-toggle', function() {

        jq( '.remove-box' ).fadeToggle();
        return false;

    } );


	//
	// Отправляем файлы на сервер
	//

	// jq( '.docs-page' ).on( 'change', '.upload-form input[type=file]', function() {
	// jq( 'form' ).on( 'change', 'input[type=file].docs-upload-form', function() {
	jq( 'body' ).on( 'change', 'form input[type=file].docs-upload-form', function() {

        var form = jq( this ).closest( 'form' );
        var inputFiles = jq( 'input[type=file]', form );
        var nonce = jq( 'input[name="upload_nonce"]', form ).val();
        var action = jq( 'input[name="action"]', form ).val();
        var max_upload_size = jq( 'input[name="MAX_FILE_SIZE"]', form ).val();
        var max_file_error = jq( 'input[name="max_file_error"]', form ).val();
        var folder_id = jq( 'input[name="folder_id"]', form ).val();
        var thread_id = jq( 'input[name="thread_id"]', form ).val();

        var files = inputFiles.get( 0 ).files;

        jq.each( files, function( key, value ) { 
            
            // Отобразить блок файла на экране, клонировав его из шаблона и уточнив оформление

            var item = jq( '.template .file' ).clone();

            // Правильная иконка файла и название
            item.addClass( value['name'].split( '.' ).pop() );
            jq( '.name', item ).html( value['name'] );

            // Поставить порядок сортировки
            var order = __get_order();
            item.attr( 'data-order', order );

            // Показать блок
            jq( '.response-box' ).removeClass( 'hidden' );
            item.prependTo( '.response-box' ).hide().fadeIn();
            jq( '.folder-is-empty-msg' ).remove();

            // Скорректировать высоту формы, если это диалог
            if ( typeof message_items_height_correct == 'function') message_items_height_correct();

            // Сформировать данные для отправки

            var data = new FormData();
            data.append( 'file', value ); 
            data.append( 'action', action );
            data.append( '_wpnonce', nonce );
            if ( folder_id ) data.append( 'folder_id', folder_id );
            if ( thread_id ) data.append( 'thread_id', thread_id );
            if ( order ) data.append( 'order', order );


            if ( value['size'] > max_upload_size ) {

                item.addClass( 'error' );
                jq( '.name', item ).html( max_file_error );
                item.attr( 'title', value['name'] );
                // item.attr( 'title', max_file_error );
                
            } else {

                jq.ajax( {
                    url: ajaxurl,
                    type: 'POST',
                    contentType: false,
                    processData: false,
                    data: data,
                    success: function( response ) {

                        if ( response ) {

                            // console.log(response);
                            var data = jQuery.parseJSON( response );

                            item.removeClass( 'loading' );
                            item.replaceWith( data['item'] );
                            folder_statusbar_info_update();
                            activity_content_update( data['doc_id'] );

                            // Снова скорректировать высоту формы, если это диалог
                            if ( typeof message_items_height_correct == 'function') setTimeout( function() { message_items_height_correct(); }, 200 );

                        } else {

                            item.addClass( 'error' );

                        }

                    },
                    error: function( response ) {

                        item.addClass( 'error' );

                    },
                } );
                    
            }

        });

        inputFiles.val( '' );
        setTimeout( function() { jq( '.drop-box' ).removeClass( 'active'); }, time );

		return false;

	} );



	//
	// Сохраняем ссылку на сетевой документ
	//

	jq( '.docs-page' ).on( 'submit', '.upload-form form', function() {

        var form = jq( this );
        var link = jq( 'input[name="link"]', form ).val();
        var descr = jq( 'input[name="descr"]', form ).val();
        var nonce = jq( 'input[name="upload_nonce"]', form ).val();
        var folder_id = jq( 'input[name="folder_id"]', form ).val();

        if ( link ) {

            // Отобразить блок документа на экране, клонировав его из шаблона и уточнив оформление

            var item = jq( '.template .file').clone();
            item.addClass( link.split( '.' ).pop() );
            
            var name = ( descr ) ? descr : link;
            jq( '.name', item ).html( name );

            // Поставить порядок сортировки
            var order = __get_order();
            item.attr( 'data-order', order );

            item.prependTo( '.response-box' ).hide().fadeIn();

            // Отправить Ajax-запрос

            jq.post( ajaxurl, {
                action: 'mif-bpc-docs-network-link-files',
                link: link,
                descr: descr,
                order: order,
                folder_id: folder_id,
                _wpnonce: nonce,
            },
            function( response ) { 

                if ( response ) {

                    item.removeClass( 'loading' );
                    item.replaceWith( response );

                    jq( 'input[name="link"]', form ).val( '' );
                    jq( 'input[name="descr"]', form ).val( '' );

                } else {

                    item.addClass( 'error' );

                }

            });
        }


        return false;

    } )



	//
	// Удалить или восстановить папку или документ (через кнопку на элементе)
	//

	jq( '.docs-page' ).on( 'click', '.collection .item-remove', function() {

        var item = jq( this ).closest( '.file' );
        var item_id = jq( this ).attr( 'data-item-id' );
        var nonce = jq( '#docs-folder-nonce' ).val();
        var restore = ( jq( this ).hasClass( 'restore' ) ) ? 1 : 0;

        jq.post( ajaxurl, {
            action: 'mif-bpc-docs-remove',
            item_id: item_id,
            restore: restore,
            _wpnonce: nonce,
        },
        function( response ) { 

            if ( response == '' ) {

                item.addClass( 'error' );
                setTimeout( function() { item.removeClass( 'error' ); }, 1000 );

            } else {
                
                item.replaceWith( response );
                folder_statusbar_info_update();

            }

        });

        return false;

    } )



	//
	// Опубликовать приватный документ
	//

	jq( '.docs-page-doc' ).on( 'click', '.doc-publisher input[type="button"]', function() {

        var form = jq( this ).closest( 'form' );
        var item_id = jq( 'input[name="item_id"]', form ).val();

        var nonce = jq( '#docs-doc-nonce' ).val();

        jq.post( ajaxurl, {
            action: 'mif-bpc-docs-doc-publisher',
            item_id: item_id,
            _wpnonce: nonce,
        },
        function( response ) { 

            if ( response ) {

                jq( '.message.doc-publisher').animate( { 'opacity': 0 }, function() {

                    jq( '.message.doc-publisher').replaceWith( response );
                    jq( '.message.doc-publisher').animate( { 'opacity': 1 } );

                } )

            }

        });

        return false;

    } )



	//
	// Опубликовать приватную папку
	//

	jq( '.docs-page' ).on( 'click', '.folder-publisher input[type="button"]', function() {

        var form = jq( this ).closest( 'form' );
        var item_id = jq( 'input[name="item_id"]', form ).val();

        var nonce = jq( '#docs-folder-nonce' ).val();

        jq.post( ajaxurl, {
            action: 'mif-bpc-docs-folder-publisher',
            item_id: item_id,
            _wpnonce: nonce,
        },
        function( response ) { 

            if ( response ) {

                jq( '.message.folder-publisher').animate( { 'opacity': 0 }, function() {

                    jq( '.message.folder-publisher').replaceWith( response );
                    jq( '.message.folder-publisher').animate( { 'opacity': 1 } );

                } )

            }

        });

        return false;

    } )



	//
	// Удалить совсем или восстановить папку (через tools-панель)
	//

	jq( '.docs-page' ).on( 'click', '.folder-restore-delete input[type="button"]', function() {

        var form = jq( this ).closest( 'form' );
        var item_id = jq( 'input[name="item_id"]', form ).val();
        var restore = ( jq( this ).hasClass( 'restore' ) ) ? 1 : 0;

        var nonce = jq( '#docs-folder-nonce' ).val();

        jq.post( ajaxurl, {
            action: 'mif-bpc-docs-remove',
            item_id: item_id,
            restore: restore,
            mode: 'page',
            _wpnonce: nonce,
        },
        function( response ) { 

            folder_content_update( response );
            // console.log( response );

        });

        return false;

    } )



	//
	// Продолжить список документов или папок
	//

	jq( '.docs-page' ).on( 'click', '.docs-content .collection button', function() {

        var form = jq( this ).closest( 'form' );
        var data = new FormData( form.get( 0 ) );
        var trashed = ( jq( '#show-remove-docs' ).prop( 'checked' ) ) ? 1 : 0;
        data.append( 'trashed', trashed );
        // data.append( 'action', 'mif-bpc-docs-collection-more' );
        data.append( 'action', 'mif-bpc-docs-collection-show' );

        jq.ajax( {
            url: ajaxurl,
            type: 'POST',
            contentType: false,
            processData: false,
            data: data,
            success: function( response ) {

                jq( '.collection .more' ).remove();

                var elements = jq( response ).hide();
                jq( '.collection' ).append( elements );
                elements.fadeIn();

            }
        } );

        return false;

    } )



	//
	// Показать удаленные
	//

	jq( '.docs-page' ).on( 'change', '.statusbar #show-remove-docs', function() {

        var nonce = jq( '#docs-folder-nonce' ).val();
        var folder_id = jq( '#docs-folder-id' ).val();
        var trashed = ( jq( '#show-remove-docs' ).prop( 'checked' ) ) ? 1 : 0;
        
        jq.post( ajaxurl, {
            action: 'mif-bpc-docs-collection-show',
            folder_id: folder_id,
            trashed: trashed,
            _wpnonce: nonce,
        },
        function( response ) { 

            var elements = jq( response ).hide();
            jq( '.collection' ).replaceWith( elements );
            elements.fadeIn();
            sortable_init();

        });

        return false;

    } )



	//
	// Создаем новую папку
	//

	jq( '.docs-page' ).on( 'submit', 'form#new-folder', function() {

        var form = jq( this );
        var data = new FormData( this );
        data.append( 'action', 'mif-bpc-docs-new-folder' );

        // console.log( data );

        jq.ajax( {
            url: ajaxurl,
            type: 'POST',
            contentType: false,
            processData: false,
            data: data,
            success: function( response ) {

                window.location.href = response;

            }
        } );

		return false;

	} );



	//
	// Сохранение настроек папки
	//

	jq( '.docs-page' ).on( 'submit', 'form#folder-settings', function() {

        var form = jq( this );
        var data = new FormData( this );
        data.append( 'action', 'mif-bpc-docs-folder-settings-save' );

        // console.log( data );

        jq.ajax( {
            url: ajaxurl,
            type: 'POST',
            contentType: false,
            processData: false,
            data: data,
            success: function( response ) {

                folder_content_update( response );

            }
        } );

		return false;

	} );

  


	//
	// Редактирование папки
	//

	jq( '.docs-page' ).on( 'click', '.statusbar #folder-settings', function() {


        var nonce = jq( '#docs-folder-nonce' ).val();
        var folder_id = jq( '#docs-folder-id' ).val();

        jq.post( ajaxurl, {
            action: 'mif-bpc-docs-folder-settings',
            folder_id: folder_id,
            _wpnonce: nonce,
        },
        function( response ) { 

            folder_content_update( response );

        });

		return false;

	} );



	//
	// Сохранение настроек документа
	//

	jq( '.docs-page-doc' ).on( 'submit', 'form#doc-settings', function() {

        var form = jq( this );
        var data = new FormData( this );
        data.append( 'action', 'mif-bpc-docs-doc-settings-save' );

        jq.ajax( {
            url: ajaxurl,
            type: 'POST',
            contentType: false,
            processData: false,
            data: data,
            success: function( response ) {

                doc_content_update( response, true );
                // doc_meta_update();

            }
        } );

		return false;

	} );



	//
	// Кнопка "Удалить" (редактирование документа)
	//

	jq( '.docs-page-doc' ).on( 'click', '.doc-settings .remove', function() {

        var form = jq( this ).closest( 'form' );
        var data = new FormData( form.get( 0 ) );
        data.append( 'action', 'mif-bpc-docs-doc-settings-save' );
        data.append( 'do', 'to-trash' );

        jq.ajax( {
            url: ajaxurl,
            type: 'POST',
            contentType: false,
            processData: false,
            data: data,
            success: function( response ) {

                doc_content_update( response );

            }
        } );

    } );

   


	//
	// Редактирование документа
	//

	jq( '.docs-page-doc' ).on( 'click', '.statusbar #doc-settings', function() {

        var nonce = jq( '#docs-doc-nonce' ).val();
        var doc_id = jq( '#docs-doc-id' ).val();

        jq.post( ajaxurl, {
            action: 'mif-bpc-docs-doc-settings',
            doc_id: doc_id,
            _wpnonce: nonce,
        },
        function( response ) { 

            // console.log(response);
            doc_content_update( response );

        });

		return false;

	} );



	//
	// Удалить совсем или восстановить документ (через tools-панель)
	//

	jq( '.docs-page-doc' ).on( 'click', '.doc-restore-delete input[type="button"]', function() {

        var form = jq( this ).closest( 'form' );
        var item_id = jq( 'input[name="item_id"]', form ).val();
        var restore = ( jq( this ).hasClass( 'restore' ) ) ? 1 : 0;

        var nonce = jq( '#docs-doc-nonce' ).val();

        jq.post( ajaxurl, {
            action: 'mif-bpc-docs-remove',
            item_id: item_id,
            restore: restore,
            mode: 'page',
            _wpnonce: nonce,
        },
        function( response ) { 

            doc_content_update( response );
            // console.log( response );

        });

        return false;

    } )


	//
	// Кнопка "Отмена" (редактирование документа)
	//

	jq( '.docs-page-doc' ).on( 'click', '.doc-settings #cancel', function() {

        var form = jq( this ).closest( 'form' );
        var data = new FormData( form.get( 0 ) );
        data.append( 'action', 'mif-bpc-docs-doc-settings-save' );
        data.append( 'do', 'cancel' );

        jq.ajax( {
            url: ajaxurl,
            type: 'POST',
            contentType: false,
            processData: false,
            data: data,
            success: function( response ) {

                doc_content_update( response );

            }
        } );

    } );



	//
	// Кнопка "Отмена" (создание папки)
	//

	jq( '.new-folder' ).on( 'click', '#cancel', function() {

        var redirect = jq( '.new-folder input[name="redirect"]' ).val();
        window.location.href = redirect;

    } );



	//
	// Кнопка "Отмена" (редактирование папки)
	//

	jq( '.docs-page' ).on( 'click', '.folder-settings #cancel', function() {

        var form = jq( this ).closest( 'form' );
        var data = new FormData( form.get( 0 ) );
        data.append( 'action', 'mif-bpc-docs-folder-settings-save' );
        data.append( 'do', 'cancel' );

        jq.ajax( {
            url: ajaxurl,
            type: 'POST',
            contentType: false,
            processData: false,
            data: data,
            success: function( response ) {

                folder_content_update( response );

            }
        } );

    } );



	//
	// Кнопка "Удалить" (редактирование папки)
	//

	jq( '.docs-page' ).on( 'click', '.folder-settings .remove', function() {

        var form = jq( this ).closest( 'form' );
        var data = new FormData( form.get( 0 ) );
        data.append( 'action', 'mif-bpc-docs-folder-settings-save' );
        data.append( 'do', 'to-trash' );

        jq.ajax( {
            url: ajaxurl,
            type: 'POST',
            contentType: false,
            processData: false,
            data: data,
            success: function( response ) {

                folder_content_update( response );

            }
        } );

    } );



	//
	// Показать или скрыть форму загрузки файла в ленте активности
	//

	jq( '#item-body' ).on( 'click', '.file-form-toggle', function() {

        jq( '#docs-form .drop-box' ).slideToggle();
        // jq( '#docs-form .drop-box' ).fadeToggle();

        return false;

    } );



	//
	// Сохраняем ссылку на сетевой документ
	//

	jq( '#aw-whats-new-submit' ).on( 'click', function() {

        jq( '.response-box.attach' ).empty();
        jq( '.response-box.attach' ).hide();
        jq( '.drop-box' ).slideUp();

    })



    //
    // Обработка клавиш
    //

    jq( document ).keydown( function( e ) {

        if ( e.which == 27 ) {

            if ( jq( '.folder-settings #cancel' ).length ) jq( '.folder-settings #cancel' ).trigger( 'click' );
            if ( jq( '.doc-settings #cancel' ).length ) jq( '.doc-settings #cancel' ).trigger( 'click' );
            if ( jq( '.new-folder #cancel' ).length ) jq( '.new-folder #cancel' ).trigger( 'click' );

            return false;
        }

    });



    //
    // Обновляет содержимое страницы документа
    //

    function doc_content_update( response, meta = false )
    {
        // console.log(response);
        jq( '.docs-page-doc .content' ).animate( { 'opacity': 0 }, function() {

            jq( '.docs-page-doc .content' ).html( response );
            jq( '.docs-page-doc .content' ).animate( { 'opacity': 1 } );
            doc_statusbar_info_update();
            if ( meta ) doc_meta_update();

        } )

    }



    //
    // Обновляет содержимое страницы папки
    //

    function folder_content_update( response )
    {
        jq( '.docs-content' ).animate( { 'opacity': 0 }, function() {

            jq( '.docs-content' ).html( response );
            jq( '.docs-content' ).animate( { 'opacity': 1 } );
            folder_statusbar_info_update();
            sortable_init();

        } )

    }



    //
    // Обновляет содержимое записи при прикреплении документа
    //

    function activity_content_update( doc_id )
    {
        if ( ! doc_id ) return;
        if ( ! jq( '#whats-new-textarea #whats-new' ).length ) return;
        
        var content = jq( '#whats-new-textarea #whats-new' ).val();
        if ( content == '' ) content = '\n'; 

        jq( '#whats-new-textarea #whats-new' ).val( content + '\n[[' + doc_id + ']]' );

        jq.fn.setCursorPosition = function( pos ) {

            if ( jq( this ).get( 0 ).setSelectionRange) {

                jq( this ).get( 0 ).setSelectionRange( pos, pos );
            
            } else if ( jq( this ).get( 0 ).createTextRange ) {

                var range = jq( this ).get( 0 ).createTextRange();
                range.collapse( true );
                range.moveEnd( 'character', pos );
                range.moveStart( 'character', pos );
                range.select();

            }
        }

        jq( '#whats-new-textarea #whats-new' ).focus();
        jq( '#whats-new-textarea #whats-new' ).setCursorPosition( 0 );
  
    }



    //
    // Обновляет статусную строку папки
    //

    function folder_statusbar_info_update()
    {
        var nonce = jq( '#docs-folder-nonce' ).val();
        var folder_id = jq( '#docs-folder-id' ).val();
        var all_folders = jq( '#docs-all-folders' ).val();

        if ( nonce ) {

            jq.post( ajaxurl, {
                action: 'mif-bpc-docs-folder-statusbar-info',
                folder_id: folder_id,
                all_folders: all_folders,
                _wpnonce: nonce,
            },
            function( response ) { 

                if ( response ) jq( '.statusbar .info' ).html( response );
                // console.log( response );

            });
            
        }

    }



    //
    // Обновляет статусную строку документа
    //

    function doc_statusbar_info_update()
    {
        var nonce = jq( '#docs-doc-nonce' ).val();
        var doc_id = jq( '#docs-doc-id' ).val();

        if ( nonce ) {

            jq.post( ajaxurl, {
                action: 'mif-bpc-docs-doc-statusbar-info',
                doc_id: doc_id,
                _wpnonce: nonce,
            },
            function( response ) { 

                if ( response ) jq( '.statusbar .info' ).html( response );
                // console.log( response );

            });
            
        }

    }



    //
    // Обновляет мета-данные документа
    //

    function doc_meta_update()
    {
        var nonce = jq( '#docs-doc-nonce' ).val();
        var doc_id = jq( '#docs-doc-id' ).val();

        if ( nonce ) {

            jq.post( ajaxurl, {
                action: 'mif-bpc-docs-doc-meta',
                doc_id: doc_id,
                _wpnonce: nonce,
            },
            function( response ) { 

                if ( response ) jq( '.docs-page-doc .meta' ).html( response );

            });
            
        }

    }



    //
    // Инициализация сортировки элементов
    //

    function sortable_init()
    {

        jq( '.sortable' ).sortable( {

                // Сделать прозрачным перетаскиваемый элемент

                opacity: 0.6,

                // Событие - изменение порядка элементов

                update: function( event, ui ) {

                    var nonce = jq( '#docs-folder-nonce' ).val();
                    var folder_id = jq( '#docs-folder-id' ).val();
                    var all_folders = jq( '#docs-all-folders' ).val();

                    var order = jq( '.collection' ).sortable( 'toArray' );

                    ui.item.addClass( 'reorder-processing' );
                    // console.log(order);

                    jq.post( ajaxurl, {
                        action: 'mif-bpc-collection-reorder',
                        order: JSON.stringify( order ),
                        folder_id: folder_id,
                        all_folders: all_folders,
                        _wpnonce: nonce,
                    },
                    function( response ) { 

                        if ( response ) jq( '.reorder-processing' ).removeClass( 'reorder-processing' );
                        // doc_content_update( response );
                        // console.log( response );

                    });

                }

        } );

    }



    //
    // JS-помощник формы репоста документа
    //

    function doc_repost_helper()
    {
        if ( ! jq( '#doc-repost-id' ).length ) return;
        if ( ! jq( '#whats-new-textarea #whats-new' ).length ) return;

        jq.fn.setCursorPosition = function( pos ) {

            if ( jq( this ).get( 0 ).setSelectionRange) {

                jq( this ).get( 0 ).setSelectionRange( pos, pos );
            
            } else if ( jq( this ).get( 0 ).createTextRange ) {

                var range = jq( this ).get( 0 ).createTextRange();
                range.collapse( true );
                range.moveEnd( 'character', pos );
                range.moveStart( 'character', pos );
                range.select();

            }
        }

        var doc = jq( '#doc-repost-id' ).val();
        jq( '#whats-new-textarea #whats-new' ).val( '\n\n[[' + doc + ']]' );
        jq( '#whats-new-textarea #whats-new' ).focus();
        jq( '#whats-new-textarea #whats-new' ).setCursorPosition( 0 );
    }



    //
    // Размещение формы загрузки файлов в ленте активности
    //

    function file_form()
    {
        // jq( '#docs-form' ).appendTo( '#whats-new-content' );
        jq( '#docs-form' ).insertBefore( '#whats-new-options' );


    }



    //
    // Инициализация параметров сразу после открытия документа
    //

    folder_statusbar_info_update();
    doc_statusbar_info_update();
    sortable_init();
    doc_repost_helper();
    file_form();


    //
    // Вспомогательные функции
    //

    function __get_order()
    {
        var arr = [];
        jq( '.file' ).each( function() { arr.push( Number( jq( this ).attr( 'data-order' )) ) });
        return Math.max.apply( null, arr ) + 1;
    }

});

