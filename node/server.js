function serverStart() {

var gcn = require('./notifications');
var firmata = require('firmata');

//Variables:

var arduinoDev = '/dev/ttyACM0';
var ledPin = 12;
var pwmPin = 6;
var servoPin = 9;
var sliderValue=0;
var sensor_00=0;
//var sensor_01=1;
//var sensor_02=2;
var token = '';


var board = new firmata.Board(arduinoDev, function(err) {

    if (err) {
        console.log(err);
        return;
    }
    console.log('connected');

    console.log('Firmware: ' + board.firmware.name + '-' + board.firmware.version.major + '.' + board.firmware.version.minor);
    
    //Configure pinModes.
    board.pinMode(ledPin, board.MODES.OUTPUT);
    board.pinMode(pwmPin, board.MODES.PWM);
    board.pinMode(servoPin, board.MODES.SERVO);

    //Init sensors.
    board.pinMode(sensor_00, board.MODES.INPUT);
    //board.pinMode(sensor_01, board.MODES.INPUT);
    //board.pinMode(sensor_02, board.MODES.INPUT);

});


var io = require('socket.io').listen(3000);
io.set('log level', 1);
io.sockets.on('connection', function (socket) {
    
    socket.emit('message', { message: 'welcome to the socket' });
    
    //Respondemos con la situacion actual de los dispositivos.
    socket.on('actualStatus', function() {
        //Para el slider el valor lo almacenamos en la variable sliderValue.
        socket.emit('slider_value',  sliderValue);
        //Para el switch lo preguntamos a Arduino.
        var sw = board.pins[ledPin].value;
	socket.emit('flip_value', sw);
//	console.log(sw);
    });

    socket.on('button', function (data) {

        socket.broadcast.emit('broadcast_msg',data);
        //console.log('datax: '+data);

        if (data==="on") {
          board.digitalWrite(ledPin, board.HIGH);
        }
        if (data==="off") {
          board.digitalWrite(ledPin, board.LOW);
        }

    });

    socket.on('sliderToArduino', function (data) {
	sliderValue = data;
        board.servoWrite(servoPin, data);
      // board.analogWrite(3,data);
    });

   socket.on('sliderToBroadcast', function (data) {
	socket.broadcast.emit('broadcast_slider', data);
	});

    socket.on('i_want_data', function (data) {

        //Leemos el valor del sensor de temperatura:
        value_sensor_00 = board.pins[board.analogPins[sensor_00]].value;
        
        //Convertimos el valor a grados centigrados:
        value_sensor_00 = ((value_sensor_00 * 5) / 10);
        
        //console.log("value_sensor_00: "+value_sensor_00);
        socket.emit('sensor_value',  { sensor: 0, super_value: value_sensor_00});

       // var digitalRead = board.pins[12].value;
       // console.log("digitalRead: "+digitalRead);
       // socket.emit('sensor_value',  { sensor: 3, super_value: digitalRead });
       
    });

	//Notificamos que estamos registrados en Google GCN.	
	socket.on('token', function (data) {
		token = data;
		var datagcn = { tok: token, title: "Register", message: "Device registered in GCN" }
		gcn.gcnStart(datagcn);
	
	});

	//Enviamos una notificación por GCN al cambiar el valor del switch.
	socket.on('button', function(data) {
		if(data==="on" && token != '') {
			var dataS = { tok: token, title: "SwitchOn", message: "Switch On" }
			gcn.gcnStart(dataS);
		} 
		if(data==="off" && token != '') {
			var dataS = { tok: token, title: "SwitchOff", message: "Switch Off" }
			gcn.gcnStart(dataS);
		}
	});

});
}

exports.serverStart=serverStart;
