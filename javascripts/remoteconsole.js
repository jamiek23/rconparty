'use strict';

function RemoteConsole(host, pass, port) {	
	this.host = host;
	this.password = pass;
	this.port = parseInt(port) || 28016;
}

RemoteConsole.prototype.connect = function(connectCallback, msgCallback) {
	var opened = false;
	this.socket = new WebSocket("ws://" + this.host + ":" + this.port + '/' + encodeURIComponent(this.password));
	this.socket.onerror = function() {
		if(opened) {
			msgCallback(false);
		}
		else {
			opened = true;
			connectCallback(false);
		}
	};
	this.socket.onopen = function() {
		opened = true;
		connectCallback(true);
	};
	this.socket.onmessage = function(e) {
		msgCallback(true, JSON.parse(e.data));
	};
};

RemoteConsole.prototype.command = function(data, id) {
	if(!this.socket || this.socket.readyState != WebSocket.OPEN) {
		return false;
	}
	var id = id || -1;
	this.socket.send(JSON.stringify({ Identifier: id, Message: data, Name: 'WebRcon' }));
	return true;
};