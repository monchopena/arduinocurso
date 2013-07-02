gApp = new Array();

gApp.deviceready = false;
gApp.gcmregid = '';

window.onbeforeunload  =  function(e) {

    if ( gApp.gcmregid.length > 0 )
    {
      // The same routines are called for success/fail on the unregister. You can make them unique if you like
      window.GCM.unregister( GCM_Fail );      // close the GCM

    }
};


document.addEventListener('deviceready', function() {

  gApp.DeviceReady = true;
  window.plugins.GCM.register("483551582202", "GCM_Event", GCM_Fail );

}, false );


function
GCM_Event(e)
{
  switch( e.event )
  {
  case 'registered':
    gApp.gcmregid = e.regid;
    if ( gApp.gcmregid.length > 0 )
    {
      socket.emit('token', e.regid);
    }

    break

  case 'message':
    $("#app-status-ul").append('<li>MENSAJE: ' + e.message + '</li>');
    	window.plugins.statusBarNotification.notify(e.title);
        navigator.notification.vibrate(1000);
        navigator.notification.beep(1);
    break;

  case 'error':
    $("#app-status-ul").append('<li>ERROR -> MSG:' + e.msg + '</li>');

    break;

  default:
    //$("#app-status-ul").append('<li>EVENT -> Unknown, an event was received and we do not know what it is</li>');

    break;
  }
}

function
GCM_Fail(e)
{
  $("#app-status-ul").append('<li>GCM_Fail -> GCM plugin failed to register</li>');
  $("#app-status-ul").append('<li>GCM_Fail -> ' + e.msg + '</li>');
}