int buttonPin = 2;     // Pin donde conectamos el switch.
int ledPin =  13;      // Pin donde conectamos el led.

int buttonState = 0;  // variable para almacenar el estado del boton.

void setup() {
  pinMode(ledPin, OUTPUT); //Inicializamos el led como salida.
  pinMode(buttonPin, INPUT); //Inicializamos el boton como entrada.
}

void loop(){
  // leemos el estado del pin digital 2 y lo almacenamos
  // en la variable.
  buttonState = digitalRead(buttonPin);

  //Comprobamos si el boton esta pulsado.
  if (buttonState == HIGH) {     
    // Si es verdadero, encendemos el led.    
    digitalWrite(ledPin, HIGH);  
  } 
  else {
    // de lo contrario, lo apagamos.
    digitalWrite(ledPin, LOW); 
  }
}

