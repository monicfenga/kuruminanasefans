//
// Эхо-сервер для всплывающих сообщений
//

//
// Алексей Н. Сергеев для проекта mif-bp-customizer
// MIT License
//

//
// Настройки сервера. Должны совпадать с аналогичными настройками веб-сервера (сайта).
//


// Порт

var port = 8080;


// Адрес веб-сервера
// Только с этого адреса будут инициироваться рассылки клиентам

var webserver_ip = '::ffff:127.0.0.1';


// Общий ключ с веб-сервером
// Поменяйте этот ключ здесь и в настройках веб-сервера для лучшей защиты

var secure_key = 'A4nYoRiq0dispfmCkFzfUAtAnV6wBglC';



//
// Далее не трогаем
//

var local_ip = '::ffff:127.0.0.1';

var io = require( 'socket.io' );
var http = require( 'http' );

var app = http.createServer( function( req, res ) {

	// Обработка HTTP-соединений

	req.on( 'end', function () {

		url = require( 'url' );
		var data = url.parse( req.url, true ).query;

		// Подключаться может только правильный клиент

		if ( data['key'] == secure_key && req.connection.remoteAddress == webserver_ip ) {

			var local_io = require( 'socket.io-client' );
			var socket = local_io( 'http://localhost:' + port );

			// Новое уведомление

			if ( data['event'] == 'float_notification_update' ) {

				// Инициировать рассылку уведомлений через 1 секунду
				setTimeout( function() { socket.emit( 'sendNotification', data ) }, data['delay'] );
				console.log( 'Info 005: Emited event ' + data['event'] + ' to room ' + data['room'] );

			}

			// Обновление диалога

			if ( data['event'] == 'dialogues_update' ) {

				socket.emit( 'sendNotification', data );
				console.log( 'Info 006: Emited event ' + data['event'] + ' to room ' + data['room'] );

			}


			// Уведомление о вводе нового сообщения

			if ( data['event'] == 'dialogues_write' ) {

				socket.emit( 'sendNotification', data );
				console.log( 'Info 008: Emited event ' + data['event'] + ' to room ' + data['room'] );

			}

		}

	});

	res.writeHead( 200 );
	res.end( 'ok' );

	console.log( 'Info 004: Client connect to http - ' + req.connection.remoteAddress );
});


var io = io.listen( app );
app.listen( port );



// Обработка websocket-соединений
 
io.sockets.on( 'connection', function( socket ) {


	// Подключиться к своему каналу

	socket.on( 'joinToRoom', function( data ) {

	        socket.join( data['room'] );
		console.log( 'Info 003: Client connect to room - ' + data['room'] );

	});


	// Отправить уведомление клиентам о появлении нового события

	socket.on( 'sendNotification', function( data ) {

		// Сделать проверку - такие уведомления может инициировать только с локального сервера

		if ( socket.client.conn.remoteAddress == local_ip && data['key'] == secure_key ) {

//			console.log(data);

			if ( data['event'] == 'float_notification_update' ) {

				socket.broadcast.to( data['room'] ).emit( data['event'], { notify: data['notify'], data: data['data'] } );
				console.log( 'Info 001: Sevrer notification to room ' + data['room'] + ' success. Event: ' + data['event'] + ', data: ' + data['data'] + ', notify: ' + data['notify'] );

			}


			if ( data['event'] == 'dialogues_update' ) {

				socket.broadcast.to( data['room'] ).emit( data['event'], { notify: data['notify'], data: data['data'] } );
				console.log( 'Info 007: Sevrer notification to room ' + data['room'] + ' success. Event: ' + data['event'] + ', data: ' + data['data'] + ', notify: ' + data['notify'] );

			}
		

			if ( data['event'] == 'dialogues_write' ) {

				socket.broadcast.to( data['room'] ).emit( data['event'], { thread_id: data['thread_id'], sender_id: data['sender_id'] } );
				console.log( 'Info 009: Sevrer notification to room ' + data['room'] + ' success. Event: ' + data['event'] + ', thread_id: ' + data['thread_id'] + ', sender_id: ' + data['sender_id'] );

			}
		

		} else {

			console.log( 'Error 002: Server authorization error - ' + socket.client.conn.remoteAddress );

		}
	});





});