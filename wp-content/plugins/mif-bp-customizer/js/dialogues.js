//
// JS-помощник диалогов
//
//

jQuery( document ).ready( function( jq ) {

    var time = 200;

    // Переменные для уведомлений о том, что пользователь пишет сообщение

    var recently_flag = false;
    var write_notification_timeout;

    //
	// Показать диалог
	//

	jq( '.thread-wrap' ).on( 'click', '.thread-item', function() {

        var thread_id = jq( this ).attr( 'data-thread-id' );
        var nonce = jq( '#dialogues_thread_nonce' ).val();

        jq.post( ajaxurl, {
            action: 'mif-bpc-dialogues-messages',
            thread_id: thread_id,
            _wpnonce: nonce,
        },
        function( response ) {

            modify_page( response ); 
            setTimeout( function() { jq( '#thread-item-' + thread_id + ' .unread_count' ).fadeOut( function() { jq( '#thread-item-' + thread_id ).removeClass( 'unread' ) } ) }, 600 );
            recently_flag = false;

        });

    })


    //
	// Вывести продолжение списка диалогов
	//

	jq( '.thread-scroller' ).on( 'scroll',  function() {

        var container = jq( '.thread-scroller' );
        var loader = jq( '.thread-scroller .loader' );
        var loader_top = loader.offset().top;
        var scroller_bottom = jq( '.scroller' ).offset().top + ( jq( '.scroller' ).height() * 2 );
        var search = jq( '#search' ).val();
        
        if ( loader_top < scroller_bottom && loader.hasClass( 'ajax-ready' ) ) {

            loader.removeClass( 'ajax-ready' );

            var page = loader.attr( 'data-page' );
            var nonce = loader.attr( 'data-nonce' );
            var mode = loader.attr( 'data-mode' );

            var action = ( mode == 'compose' ) ? 'mif-bpc-dialogues-member-items-more' : 'mif-bpc-dialogues-thread-items-more';

            jq.post( ajaxurl, {
                action: action,
                page: page,
                s: search,
                _wpnonce: nonce,
            },
            function( response ) { 

                modify_page( response ); 

            });

        }
        
    });


    //
	// Поиск пользователей и диалогов
	//

    jq( '.dialogues-page' ).on( 'input', '.search', function() {

        var search = jq( '#search' ).val();
        var nonce = jq( '#dialogues_search_nonce' ).val();
        var mode = jq( '#threads_mode' ).val();

        var action = ( mode == 'compose' ) ? 'mif-bpc-dialogues-member-search' : 'mif-bpc-dialogues-thread-search';

        jq.post( ajaxurl, {
            action: action,
            s: search,
            _wpnonce: nonce,
        },
        function( response ) { 

            modify_page( response ); 

        });

    } )


    //
	// Уведомление о вводе сообщения
	//

    jq( '.dialogues-page' ).on( 'input', '#message', function() {

        if ( ! recently_flag ) {

            var nonce = jq( '#dialogues_write_notification_nonce' ).val();
            var thread_id = jq( '.messages-form #thread_id' ).val();

            jq.post( ajaxurl, {
                action: 'mif-bpc-dialogues-write-notification',
                thread_id: thread_id,
                _wpnonce: nonce,
            },
            function( response ) { 

            });

            recently_flag = true;
            clearTimeout( write_notification_timeout );
            write_notification_timeout = setTimeout( function(){ recently_flag = false }, 5000 );

        }

    } )


    //
	// Выбрать пользователя для диалога
	//

	jq( '.thread-wrap' ).on( 'click', '.member-item', function() {

        var item = jq( this ).closest( '.member-item' );
        var user_id = item.attr( 'data-uid' );
        var length = jq( '.messages-wrap .recipients .member-item' ).length;

        if ( item.hasClass( 'checked' ) ) {

            jq( '.messages-wrap .recipients .member-' + user_id ).fadeOut( function() { jq( '.messages-wrap .recipients .member-' + user_id ).remove() } );
            item.removeClass( 'checked' );

            if ( length == 2 ) jq( '.compose-wrap .subject' ).slideUp();

        } else {

            jq( '.messages-wrap .recipients' ).append( item.clone() );
            jq( '.messages-wrap .recipients' ).removeClass( 'warning' );
            item.addClass( 'checked' );

            if ( length == 1 ) jq( '.compose-wrap .subject' ).slideDown();

        }

        return false;

    });



    //
	// Удалить пользователя из списка выбранных
	//

	jq( '.messages-wrap' ).on( 'click', 'a.member-remove', function() {

        var item = jq( this ).closest( '.member-item' );
        var user_id = item.attr( 'data-uid' );
        var length = jq( '.messages-wrap .recipients .member-item' ).length;

        jq( this ).closest( '.member-item' ).fadeOut( function() { jq( this ).closest( '.member-item' ).remove() } );
        jq( '.thread-wrap .member-' + user_id ).removeClass( 'checked' );

        if ( length == 2 ) jq( '.compose-wrap .subject' ).slideUp();

        return false;

    });


    //
	// Отправить новое сообщение
	//

	jq( '.messages-wrap' ).on( 'submit', '.compose-wrap form', function() {

        var recipients = jq( '.messages-wrap .recipients' );
        var message = jq( '#message', this ).val();
        var nonce = jq( '#nonce', this ).val();
        var email = ( jq( '#email', this ).prop( 'checked' ) ) ? 1 : 0;
        var subject = jq( '#subject', this ).val();
        var recipient_ids = [];

        if ( recipients.html().trim() === '' ) {

            jq( '.messages-wrap .recipients' ).addClass( 'warning' );

        } else if ( message.trim() === '' ) {

            jq( '.messages-wrap .textarea' ).addClass( 'warning' );

        } else {

            jq( '.messages-wrap .recipients .member-item' ).each( function( i, elem ) { recipient_ids.push( jq( elem ).attr( 'data-uid' ) ); } );
            
            jq.post( ajaxurl, {
                action: 'mif-bpc-dialogues-compose-send',
                _wpnonce: nonce,
                email: email,
                message: message,
                subject: subject,
                recipient_ids: recipient_ids,
            },
            function( response ) {

                modify_page( response ); 
                jq( '.thread-wrap .member-item' ).removeClass( 'checked' );
                // console.log(response);

            });

            recently_flag = false;
        }

        return false;

    });


    //
	// Убрать рамку предупреждения с текстового поля при его выборе
	//

	jq( '.messages-wrap' ).on( 'focus', '.compose-wrap textarea', function() { jq( '.messages-wrap .textarea' ).removeClass( 'warning' ); } )


    //
	// Закрепить форму диалогов на странице
	//

	jq( '.dialogues-page' ).on( 'click', 'a.dialogues-fix', function() {

        jq( 'body' ).animate( { scrollTop: jq( '.dialogues-page' ).offset().top }, time * 2, function() { jq( 'body' ).toggleClass( 'fix ') } );

        return false;

    });


    //
	// Новое сообщение
	//

	jq( '.dialogues-page' ).on( 'click', 'a.dialogues-compose', function() {

        var nonce = jq( '#dialogues_compose_form_nonce' ).val();

        jq.post( ajaxurl, {
            action: 'mif-bpc-dialogues-compose-form',
            _wpnonce: nonce,
        },
        function( response ) {

            modify_page( response ); 

        });

        return false;

    });



    //
	// Обновить диалоги
	//

	jq( '.dialogues-page' ).on( 'click', 'a.dialogues-refresh', function() {

        dialogues_update_page();

        return false;

    });


    //
	// Группировать диалоги
	//

	jq( '.dialogues-page' ).on( 'click', 'a.dialogues-join', function() {

        var nonce = jq( '#dialogues_join_nonce' ).val();

        jq.post( ajaxurl, {
            action: 'mif-bpc-dialogues-join',
            _wpnonce: nonce,
        },
        function( response ) {

            modify_page( response ); 
            scroll_threads_to_top();

        });

        return false;

    });


    //
	// Удалить сообщение
	//

	jq( '.dialogues-page' ).on( 'click', 'a.message-remove', function() {

        var nonce = jq( '#dialogues_message_remove_nonce' ).val();
        var item = jq( this ).closest( '.message-item' );
        var message_id = item.attr( 'data-message-id' );
        var threads_update_timestamp = jq( '#threads_update_timestamp' ).val();

        jq.post( ajaxurl, {
            action: 'mif-bpc-message-remove',
            message_id: message_id,
            threads_update_timestamp: threads_update_timestamp,
            _wpnonce: nonce,
        },
        function( response ) {

            jq( '.messages-items #message-' + message_id ).fadeOut();
            modify_page( response ); 
            // console.log( response );

        });

        return false;

    });


    //
	// Удалить диалог (вызов окна)
	//

	jq( '.thread-wrap' ).on( 'click', '.thread-item a.thread-remove', function() {

        var nonce = jq( '#dialogues_thread_remove_window_nonce' ).val();
        var item = jq( this ).closest( '.thread-item' );
        var thread_id = item.attr( 'data-thread-id' );
        var threads_update_timestamp = jq( '#threads_update_timestamp' ).val();

        jq.post( ajaxurl, {
            action: 'mif-bpc-thread-remove-window',
            thread_id: thread_id,
            threads_update_timestamp: threads_update_timestamp,
            _wpnonce: nonce,
        },
        function( response ) {

            modify_page( response ); 

        });
        
        return false;
    });


    //
	// Удалить диалог (собственно удаление)
	//

	jq( '.messages-wrap' ).on( 'click', '.remove-window a.thread-remove', function() {

        var thread_id = jq( '.messages-form #thread_id' ).val();
        var nonce = jq( '#dialogues_thread_remove_nonce' ).val();

        jq.post( ajaxurl, {
            action: 'mif-bpc-thread-remove',
            thread_id: thread_id,
            _wpnonce: nonce,
        },
        function( response ) {

            modify_page( response ); 
            jq( '#thread-item-' + thread_id ).fadeOut();

        });
        
        return false;
    });


    //
	// Отмена удаления диалога
	//

	jq( '.messages-wrap' ).on( 'click', '.remove-window a.thread-no-remove', function() {

        var thread_id = jq( '.messages-form #thread_id' ).val();
        var nonce = jq( '#dialogues_thread_nonce' ).val();

        jq.post( ajaxurl, {
            action: 'mif-bpc-dialogues-messages',
            thread_id: thread_id,
            _wpnonce: nonce,
        },
        function( response ) {

            modify_page( response ); 

        });
        
        return false;
    });


    //
	// Открыть или закрыть форму прикрепления файлов
	//

	jq( '.messages-form' ).on( 'click', 'a.clip', function() {

        // message_items_height_correct();
        jq( '.response-box .docs-item' ).remove();
        jq( '.response-box' ).addClass( 'hidden' );

        
        if ( jq( '#attachment-form' ).is( ':visible' ) ) {

            jq( '#attachment-form' ).fadeOut( function() { message_items_height_correct(); } );

        } else {

            jq( '#attachment-form' ).show( 0, function() { 

                message_items_height_correct();
                jq( '#attachment-form' ).hide( 0, function() { jq( '#attachment-form' ).fadeIn(); } );

            } );

        }

        return false;

    } )


    //
	// Отправить сообщение
	//

	jq( '.messages-form' ).on( 'click', 'a.send.button', function() {

        var form = jq( this ).closest( 'form' );
        var thread_id = jq( '#thread_id', form ).val();
        var last_message_id = jq( '#last_message_id', form ).val();
        var nonce = jq( '#nonce', form ).val();
        var message = jq( '#message', form ).val();
        var threads_update_timestamp = jq( '#threads_update_timestamp' ).val();
        var attachments = jq( 'input.attachment', form ).serialize();

        if ( ! ( message || attachments ) ) return false;

        // Очистить форму
        jq( '#message', form ).val( '' );

        // Закрыть форму прикрепления файлов, если она открыта
        if ( jq( '#attachment-form' ).is( ':visible' ) ) jq( '.messages-form a.clip' ).trigger( 'click' );

        // Временно вывести новое сообщение
        var rand =  Math.floor( Math.random() * 9999 );
        jq( '.messages-scroller-container #message-' + last_message_id + ' .content .message' ).append( '<p class="sended ' + rand + '"><i class="fa fa-clock-o"></i>' + message + '</p>' );
        setTimeout( function( rand ){ jq( '.messages-scroller-container .sended.' + rand ).addClass( 'clock' ) }, 1000, rand );

        // Установить обычную высоту текстового поля
        jq( '#message', form ).css( {'height': 'auto'} );
        message_items_height_correct();

        // Пролистать в самый низ
        scroll_message_to_bottom();

        // Снять отметки о непрочитанных
        jq( '.messages-scroller .message-item.new' ).removeClass( 'new' );

        jq.post( ajaxurl, {
            action: 'mif-bpc-dialogues-messages-send',
            thread_id: thread_id,
            last_message_id: last_message_id,
            threads_update_timestamp: threads_update_timestamp,
            message: message,
            attachments: attachments,
            _wpnonce: nonce,
        },
        function( response ) {

            modify_page( response ); 

        });

        return false;

    });

    jq( '.messages-form' ).keypress( 'a.send.button', function( e ) {

        if ( e.which == 13 ) {

            jq( '.messages-form a.send.button' ).trigger( 'click' );
            return false;
            
        }

    });


    //
    // Обработка клавиш на странице диалога
    //

    // jq( document ).keydown ( function( e ) {
    jq( '.dialogues-page' ).keydown ( function( e ) {

        if ( e.which == 27 ) {

            var nonce = jq( '#dialogues_refresh_nonce' ).val();
            var threads_mode = jq( '#threads_mode' ).val();

            jq.post( ajaxurl, {
                action: 'mif-bpc-dialogues-refresh',
                _wpnonce: nonce,
                threads_mode: threads_mode,
            },
            function( response ) {

                modify_page( response ); 
                jq( '.dialogues-page' ).removeClass( 'compose' );

            });

            return false;
        }

    });

    // Включить кастомный скроллинг для списка диалогов

    threads_scroll();

});



// 
// Включить кастомный скроллинг для списка диалогов
// 

function threads_scroll()
{
    baron( jq( '.thread-scroller-wrap' ), {
                    scroller: '.thread-scroller',
                    container: '.thread-scroller-container',
                    bar: '.thread-scroller__bar',
                    barTop: 0,
                    barOnCls: 'thread-scroller__bar_state_on',
                } );
}



// 
// Включить кастомный скроллинг для списка сообщений
// 

function messages_scroll()
{
    baron( jq( '.messages-scroller-wrap' ), {
                    scroller: '.messages-scroller',
                    container: '.messages-scroller-container',
                    bar: '.messages-scroller__bar',
                    barTop: 0,
                    barOnCls: 'messages-scroller__bar_state_on',
                    drag: 50,
                } );
}



// 
// Корректировать высоту страницы в зависимости от высоты формы ввода
// 

function message_items_height_correct()
{
    var h_form = jq( '.dialogues-page .messages-form' ).height();
    var margin = h_form + 50;
    var padding = margin + 30;

    jq( '.dialogues-page .messages-form' ).css( 'margin-top', '-' + margin + 'px' );
    jq( '.dialogues-page .messages-wrap' ).css( 'padding-bottom', padding + 'px' );
    jq( '.messages-scroller' ).scrollTop( jq( '.messages-scroller-container' ).height() );

}


// 
// Инициализировать действия для страницы сообщений
// 

function messages_actions_init()
{

    // Показать кастомный скроллинг для сообщений

    messages_scroll();

    // Вывести продолжение списка сообщений

    jq( '.messages-scroller' ).on( 'scroll', function() {  

        var loader = jq( '.messages-scroller .loader' );
        var container = jq( '.messages-scroller' );
        var loader_top = loader.offset().top;
        var container_top = container.offset().top;
        var container_height = container.height();

        if ( loader_top > container_top -  container_height && loader.hasClass( 'ajax-ready' ) ) {

            loader.removeClass( 'ajax-ready' );

            var page = loader.attr( 'data-page' );
            var nonce = loader.attr( 'data-nonce' );
            var tid = loader.attr( 'data-tid' );

            jq.post( ajaxurl, {
                action: 'mif-bpc-dialogues-messages-items-more',
                page: page,
                tid: tid,
                _wpnonce: nonce,
            },
            function( response ) { 

                modify_page( response ); 

            });

        }
    
    });

}



//
// Внести изменения на страницу на основе полученных данных
//

function modify_page( response )
{

    if ( ! response ) return;

    var data = jQuery.parseJSON( response );
    
    // Загрузка продолжения заголовков диалогов

    if ( data['threads_more'] ) {

        jq( '.thread-scroller-container .loader' ).remove();
        jq( '.thread-scroller-container' ).append( data['threads_more'] );

    }


    // Загрузка продолжения списка сообщений

    if ( data['messages_more'] ) {

        jq( '.messages-scroller-container .loader' ).remove();
        jq( '.messages-scroller-container' ).prepend( data['messages_more'] );

    }


    // Загрузка заголовка списка сообщений

    if ( data['messages_header'] ) {

        jq( '.messages-header-content').animate( { 'opacity': 0 }, function() {

            jq( '.messages-header-content').html( data['messages_header'] );
            jq( '.messages-header-content').animate( { 'opacity': 1 } );

        } )
    }


    // Обновление заголовка списка сообщений

    if ( data['messages_header_update'] ) {

        jq( '.messages-header-content').html( data['messages_header_update'] );

    }


    // Обновление списка сообщений

    if ( data['threads_update'] ) {

        var arr = data['threads_update'];
        var thread_id = jq( '.messages-form #thread_id' ).val();


        for ( var key in arr ) {

            var elem = jq( '.thread-scroller-container #thread-item-' + arr[key]['id'] );

            if ( elem.length ) {
                
                // Элемент существует - заменить его
                elem.remove();
                jq( '.thread-scroller-container' ).prepend( arr[key]['item'] );

            } else {

                // Элемент не существует - добавить новый в начало
                jq( '.thread-scroller-container' ).prepend( arr[key]['item'] );

            }

            if ( arr[key]['id'] == thread_id ) jq( '.thread-scroller-container #thread-item-' + thread_id ).addClass( 'current' );            

        }

        scroll_threads_to_top();

    }


    // Обновление метки времени списка сообщений

    if ( data['threads_update_timestamp'] ) {

        jq( '#threads_update_timestamp' ).val( data['threads_update_timestamp'] );

    }


    // Обновление количества непрочитанных сообщений

    if ( data['threads_unread_count'] ) {

        var current_unread_count = jq( '#user-messages .count' ).html();
        
        if ( current_unread_count != data['threads_unread_count'] ) {

            jq( '#user-messages .count' ).html( data['threads_unread_count'] );
   
        }

    }


    // Загрузка формы списка сообщений

    if ( data['messages_form'] ) {

        jq( '.messages-form-content').animate( { 'opacity': 0 }, function() {

            jq( '.messages-form-content').html( data['messages_form'] );
            jq( '.messages-form-content').animate( { 'opacity': 1 } );

            jq( '.messages-form-content textarea').focus();

            // Уточнить высоту формы и диалога
            message_items_height_correct();

            // Увеличивать текстовое поле при появлении новых строк
            autosize( jq( '.messages-form textarea' ) );

            // Корректировать положение формы и высоту диалога при изменении размера формы
            jq( '.messages-form textarea' ).on( 'autosize:resized', function() {
                message_items_height_correct();
            });

            // Выделить блок текущего диалога
            var thread_id = jq( '.messages-form #thread_id' ).val();
            jq( '.thread-scroller-container .current' ).removeClass( 'current' );
            jq( '.thread-scroller-container #thread-item-' + thread_id ).addClass( 'current' );

        } )
    }


    // Загрузка страницы сообщений

    if ( data['messages_page'] ) {

        jq( '.messages-items').animate( { 'opacity': 0 }, function() {

            jq( '.messages-items').html( data['messages_page'] );

            // Увеличить начало списка сообщений, если список слишком короткий
            var h1 = jq( '.messages-scroller-container' ).height();
            var h2 = jq( '.messages-scroller' ).height();
            var delta = h2 - h1;
            if ( delta > 0 ) jq( '.message-item.loader' ).height( delta );

            // Пролистать в самый низ
            scroll_message_to_bottom();

            // Показать
            jq( '.messages-items').animate( { 'opacity': 1 } );

            // Инициализировать действия со страницей сообщений
            messages_actions_init();

        })

    }


    // Отображение новых сообщений

    if ( data['messages_update'] ) {

        var arr = data['messages_update'];

        for ( var key in arr ) {

            if ( jq( '.messages-scroller-container #message-' + key ).length ) {
                
                // Элемент существует - заменить его
                jq( '.messages-scroller-container #message-' + key ).replaceWith( arr[key] );

            } else {

                // Элемент не существует - добавить новый в конец
                jq( '.messages-scroller-container' ).append( arr[key] );

            }

        }


        // Обновить информацию об ID последнего сообщения
        jq( '.messages-form #last_message_id' ).val( key );

        // Убрать уведомление, что пользователь набирает сообщение
        jq( '.messages-wrap .writing' ).removeClass( 'show' )

        // Пролистать в самый низ
        scroll_message_to_bottom();

    }


    // Загрузка в окно сообщений диалога

    if ( data['messages_window'] ) {

        jq( '.messages-items').animate( { 'opacity': 0 }, function() {

            jq( '.messages-items').html( data['messages_window'] );
            jq( '.messages-items').animate( { 'opacity': 1 } );

        })

    }

    // Загрузка в окно списка диалогов

    if ( data['threads_window'] ) {

        jq( '.thread-scroller-container').animate( { 'opacity': 0 }, function() {

            jq( '.thread-scroller-container').html( data['threads_window'] );
            jq( '.thread-scroller-container').animate( { 'opacity': 1 } );

        })

        jq( '#threads_mode' ).val( 'threads' );
        jq( '.dialogues-page' ).removeClass( 'compose' );

    }

    // Обновить окно списка диалогов

    if ( data['threads_window_update'] ) {

        jq( '.thread-scroller-container').html( data['threads_window_update'] );
        jq( '#threads_mode' ).val( 'threads' );
        jq( '.dialogues-page' ).removeClass( 'compose' );

    }

    // Форма написания нового сообщения

    if ( data['compose_form'] ) {

        jq( '.messages-items').animate( { 'opacity': 0 }, function() {

            jq( '.dialogues-page' ).addClass( 'compose' );
            jq( '.messages-items').html( data['compose_form'] );
            jq( '.messages-items').animate( { 'opacity': 1 } );

        })

        jq( '#threads_mode' ).val( 'compose' );

    }

    // Список пользователей

    if ( data['compose_members'] ) {

        jq( '.thread-scroller-container' ).animate( { 'opacity': 0 }, function() {

            jq( '.dialogues-page' ).addClass( 'compose' );
            jq( '.thread-scroller-container' ).html( data['compose_members'] );
            jq( '.thread-scroller-container' ).animate( { 'opacity': 1 } );

        })

        jq( '#threads_mode' ).val( 'compose' );

    }

    // Обновить список пользователей

    if ( data['compose_members_update'] ) {

        jq( '.thread-scroller-container' ).html( data['compose_members_update'] );
        jq( '.dialogues-page' ).addClass( 'compose' );
        jq( '#threads_mode' ).val( 'compose' );

    }

}



//
// Пролистать сообщения в самый низ
//

function scroll_message_to_bottom()
{
    jq( '.messages-scroller' ).scrollTop( jq( '.messages-scroller-container' ).height() );
}


//
// Пролистать диалоги в самый верх
//

function scroll_threads_to_top()
{
    jq( '.thread-scroller' ).scrollTop( 0 );
}


//
// Показать сообщение о том, что пользователь набирает сообщение
//

var write_show_timeout = [];

function writing_notification_show( thread, user )
{
    // console.log(thread)
    var slug = '.thread-' + thread + '.user-' + user;
    jq( slug ).addClass( 'show' );

    clearTimeout( write_show_timeout[slug] );
    write_show_timeout[slug] = setTimeout( function(){ jq( slug ).removeClass( 'show' ) }, 6000 );
}


//
// Обновить страницу диалогов
//

function dialogues_update_page()
{
    var thread_id = jq( '.messages-form #thread_id' ).val();
    var last_message_id = jq( '.messages-form #last_message_id' ).val();
    var nonce = jq( '#dialogues_refresh_nonce' ).val();
    var threads_update_timestamp = jq( '#threads_update_timestamp' ).val();
    var threads_mode = jq( '#threads_mode' ).val();

    jq.post( ajaxurl, {
        action: 'mif-bpc-dialogues-refresh',
        thread_id: thread_id,
        last_message_id: last_message_id,
        threads_update_timestamp: threads_update_timestamp,
        threads_mode: threads_mode,
        _wpnonce: nonce,
    },
    function( response ) {

        modify_page( response ); 
        jq( '.dialogues-page' ).removeClass( 'compose' );

    });

}
