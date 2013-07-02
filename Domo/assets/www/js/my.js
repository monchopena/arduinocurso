//Constantes
const SERVER_SOCKET='http://192.168.1.250:3000';
const INTERVAL=2000;
const SERVER_CAM='http://192.168.1.250:8889/img/image_snapshot.jpg?';

var socket = io.connect(SERVER_SOCKET);
                    socket.on('message', function (data) {
                   // console.log(data.message);
	  	            });

$(document).ready(function() {


          //Pedimos la situacion actual de los dispositivos:

          socket.emit('actualStatus', 'now');

          //Sincronizamos el valor del switch por broadcast.

		  socket.on('broadcast_msg', function (data) {
                    //console.log('change to: '+data);
                    $('#flip-1').val(data).trigger('create').slider("refresh");
	  	            });

          //Sincronizamos el valor del slider por broadcast.

           socket.on('broadcast_slider', function (data) {
                    $('#slider-1').val(data).slider('refresh');
	  	            });

		  socket.on('sensor_value', function (data) {
                    var sensor=data.sensor;
                    var super_value=data.super_value;
                    switch (sensor) {
  			case 0:
    				$('#sensor_00').html(data.super_value+'ºC');
    			break;
    			case 1:
    				$('#sensor_01').html(data.super_value);
    			break;
    			case 2:
    				$('#sensor_02').html(data.super_value);
    			break;
    			case 3:
    				$('#sensor_03').html(data.super_value);
    			break;

			        }

	  	        });
                  //Establecemos el valor del switch al iniciar.

                  socket.on('flip_value', function (data) {
                    if (data === 0) {
                        $('#flip-1').val('off').trigger('create').slider("refresh");
                    } else {
                        $('#flip-1').val('on').trigger('create').slider("refresh");
                    }
                  });

                  //Establecemos el valor del slider al iniciar.

                  socket.on('slider_value', function (data) {
                    $( "#slider-1" ).val( data );
                    $('#slider-1').slider("refresh");
                    });

		          //Evento cuando cambiamos el valor del switch.

		          $('#flip-1').change(function() {
			            var mode=$('#flip-1').val();
	                    socket.emit('button', mode);
		                });


                //Cuando cambiamos el valor del slider
                //enviamos el valor a Arduino.

		        $("#slider-1").change(function(){
			        var slider_value = $('#slider-1').val();
			        socket.emit('sliderToArduino', slider_value);
		            });

		         //Cuando paramos el slider
                 //enviamos el valor por broadcast a todos los dispositivos.

                 $('#slider-1').on('slidestop', function(){
                    var slider_value = $('#slider-1').val();
                 	socket.emit('sliderToBroadcast', slider_value);
                 	});

                //Cada X segundos mandamos una peticion de lectura de sensores.

		        setInterval(function() {
                    socket.emit('i_want_data', 'now');
		            }, INTERVAL);
});

            //Funciones para el manejo de la webcam:

            function LoadImages() {
                var microtime= Date.now();
                //console.log(microtime);

                $.imgpreloader({
                    paths: [ SERVER_CAM+microtime ]
                    }).done(function($allImages){
                    $("#output").html($allImages);
                    //console.log("cargada imagen");
                    });
                }


                function goCam() {
                    window.location="#webcam";
                    //console.log('Start Cam');
                    window.loading= setInterval(LoadImages, 1000);
                }

                function stopCam() {
                    clearInterval(window.loading);
                    //console.log('Stop Cam');
                    window.location="#inicio";
                }