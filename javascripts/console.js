'use strict';

var $connect = $('#connect');
var $connectWrap = $('#connect-wrap');
var $console = $('#console');
var $consoleWrap = $('#console-wrap');
var $consoleInput = $('#console-input');
var $consoleOutput = $('#console-output');
var rconSession;

$connect.submit(function(e) {
	e.preventDefault();
	$connect.prop('disabled', true);
	rconSession = new RemoteConsole($('#connect-host').val(), $('#connect-password').val(), $('#connect-port').val());
	rconSession.connect(function(success) {
		if(!success) {
			var $alert = $('<div class="alert alert-danger"><strong>Connection failed:</strong> check settings and try again.</div>');
			$('#connect-wrap').prepend($alert);
			setTimeout(function(){ $alert.fadeOut(); }, 3000);
			$connect.prop('disabled', false);
			return;
		}
		$connectWrap.fadeOut(function(){
			$consoleWrap.hide();
			$consoleWrap.removeClass('hidden');
			$consoleWrap.fadeIn();
		});
	}, function(socketOkay, data){
		if(!socketOkay) {
			return;
		}
		//var id = data.Identifier;
		var msg = data.Message;
		msg = he.encode(msg);
		msg.replace(/\r?\n/g, '<br />');
		$consoleOutput.append(msg + '<br />');
		$consoleOutput.animate({ scrollTop: $consoleOutput.prop('scrollHeight') });
	});
});

$console.submit(function(e) {
	e.preventDefault();
	if(rconSession.command($consoleInput.val())) {
		$consoleInput.val('');
	}
	else {
		$consoleOutput.append('<span class="text-danger"><strong>Command sending failed</strong> - lost connection?<br /></span>');
	}
});