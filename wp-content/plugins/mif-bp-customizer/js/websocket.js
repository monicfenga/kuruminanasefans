//
// JS-помощник всплывающих сообщений
//
//

jQuery( document ).ready( function( jq ) {

    if ( typeof websocket_param !== 'undefined' ) {

        // Подключиться к эхо-серверу

        var socket = io.connect( websocket_param['url'] + ':' + websocket_param['port'] );

        // Подключиться к своему каналу

        socket.emit( 'joinToRoom', { room: websocket_param['room'] } );


        // Обновление всплывающих уведомлений

        socket.on( 'float_notification_update', function( data ) {

            if ( typeof float_notification_update == 'function') float_notification_update( jq );
            notify_alarm( data );
            
        });


        // Обновление диалогов

        socket.on( 'dialogues_update', function( data ) {

            if ( typeof dialogues_update_page == 'function') dialogues_update_page();
            notify_alarm( data );

        });


        // Информация о том, что кто-то пишет сообщение

        socket.on( 'dialogues_write', function( data ) {

            if ( typeof writing_notification_show == 'function') writing_notification_show( data['thread_id'], data['sender_id'] );
            // console.log(data);

        });

    }

})


//
// Звуковое оповещение
//

function notify_alarm( data )
{

    var date = new Date();
    var hour = date.getHours();

    // Выводить звук, если это разрешено и сейчас подходящее время

    if ( data['notify'] == 'yes' && hour >= 8 && hour < 22 ) {

        notufy = jq( '#notification_notify' )[0];
        notufy.volume = 0.1;
        notufy.play();

    }

}

