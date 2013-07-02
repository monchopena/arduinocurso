var gcm = require('node-gcm');

function gcnStart(data){

	var message = new gcm.Message(); 
	var sender = new gcm.Sender('your_code_here'); 
	var registrationIds = [];
 
//	message.collapseKey='demo';
//        message.timeToLive=300;
	message.delayWhileIdle=true;
	message.addData('title',data.title); 
	message.addData('message',data.message); 

	// At least one token is required - each app registers a different token 
	registrationIds.push(data.tok);

	/* Parameters: message-literal, registrationIds-array, No. of retries, callback-function */ 
	sender.send(message, registrationIds, 4, function (err, result) { 
		console.log(err); 
	}); 
}
exports.gcnStart=gcnStart;
