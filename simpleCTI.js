
/**
 * 
 * Really simple example of a CTI class that allows client side Javascript to interact
 * with a PBX
 */

/**
 * Creates a new SimpleCTI instance and initialises it with the user info
 * that it will use to authenticate against the PBX. Plants callbacks
 * that will be used to signal API startup completion and called when
 * a call status changes on a line.
 * 
 * @constructor
 * 
 * @param {String} username A valid PBX username for a user who owns a phone
 * @param {String}	password Password
 * @param {SimpleCTI~statusCallback} statusCB to call on error or successful API initialisation 
 * @param {SimpleCTI~eventCallback} [ringCB] to call when a line on users phone rings
 * @param {SimpleCTI~eventCallback} [upCB] to call when a line on users phone is answered
 * @param {SimpleCTI~eventCallback} [deadCB] to call when a line on users phone is hung up
 */
SimpleCTI = function(username, password, statusCB, ringCB, upCB, deadCB) {
	var _this = this;
	// Global onAPILoadReady is a special function called by ipcortex API wrapper
	// to initialiase the API. Feed it something relevant.
	onAPILoadReady = (function(){_this.Init();});
	
	// Save username and password within this instance
	this.username = username;
	this.password = password;
	
	// Register any callbacks
	this.CB = {status: statusCB, ring:ringCB, up:upCB, dead:deadCB};
	
	
	// Initialise an empty call list
	this.calls = {};
	this.callstate = {};
	console.log('setup onAPILoadReady');
};


/**
 * @callback SimpleCTI~statusCallback
 * @param ok {Boolean} true or false:
 *	true: API successfully started
 * 	false: error condition
 * @param code {number} numeric API error code (status == false only)
 * @param text {String} extual explanation suitable for user display
 * 
 */

/**
 * This callback is displayed as a global member.
 * @callback SimpleCTI~eventCallback
 * @param state {String} one of 'ring', 'up', 'dead' - new state of call
 * @param number {String} The Caller ID of the other party. Caution: may not be numeric in all cases
 * @param party {String} 'caller' or 'callee' - defines which role we are
 * @param call {Object} Raw underlying call object
 * @param line {Object} Raw underlying line object
 */


/**
 * Just used to feed to the IPCortex API as onAPILoadReady
 * @private
 */
SimpleCTI.prototype.Init = function() {
	var _this = this;
	IPCortex.PBX.Auth.login(_this.username, _this.password, true, (function(ok){_this.authCB(ok);}));
};

/**
 * Dial a number, optionally specify line
 * 
 * @param {number} number to dial
 * @param {number} [line=0] line index (zero based)
 */
SimpleCTI.prototype.dial = function(number, line){
	if(line == null || this.lines[line] == null)
		line = 0;
		
	this.lines[line].dial(number, true, true);
		
};
/**
 * Hangup a call
 * @param id {String} ID of call to hangup
 */

SimpleCTI.prototype.hangup = function(id){
	console.log('Hangup ID: ' + id);

	if(id != null || this.calls[id] == null)
		this.calls[id].hangup();
		
		
};

/**
 * Answer a call
 * @param id {String} ID of call to answer
 */
SimpleCTI.prototype.answer = function(id){
	console.log('Answer ID: ' + id);
	if(id != null || this.calls[id] == null)
		this.calls[id].talk();
};



/**
 * This private method is called by the API when login is initialised
 * Just checks login status and starts API polling
 * @param ok
 * @private
 */
SimpleCTI.prototype.authCB = function(ok) {
	var _this = this;
	console.log('SimpleCTI.authCB('+ok+')');
	if (ok) {
		/* Request the poller starts and initial PABX
		 * config information is fetched and cached.
		 * 'go' and 'error' are success/fail callbacks.
		 * 'error' will be called on any error event.
		 */
		IPCortex.PBX.startPoll((function(){_this.go();}), (function(n, m){_this.error(n, m);}));
	}
	else
		this.CB.status(false, -1, "Login failed");
};


/**
 * Handler for any error events
 * @private
 * @param n
 * @param m
 */
SimpleCTI.error = function(n, m) {
	this.CB.status(false, n, m);
	console.error('We got an error number: ' + n + ' Text: ' + m);
};

/**
 * Handler for API initialised event
 * @private
 */
SimpleCTI.prototype.go = function() {
	var _this = this;
	console.log('SimpleCTI.go()');

	// Once initialised, request all our owned lines are returned
	IPCortex.PBX.getLines((function(l){_this.linesCB(l);}), true);
	this.CB.status(true, 0, "API Initialised");
};


/**
 * Handler for lines list callback
 * @private
 * @param l
 */
SimpleCTI.prototype.linesCB = function(l) {
	var _this = this;
	console.log('SimpleCTI.linesCB('+l.length+')');
	this.lines = [];
	
	// Lines are returned in a list - Hook them all
	while (l.length) {
		var line = l.shift();
		this.lines.push(line);
		/* In this example we allow the line to go out of scope once hooked
		 * this is OK as a reference is passed with the callback
		 */
		line.hook((function(f, h, l){_this.lineEvent(f, h, l);}));
	}
}; 


/**
 * Handler for PBX line event callback
 * @private
 * @param f
 * @param h
 * @param l
 */
SimpleCTI.prototype.lineEvent = function(f, h, l) {
	// Get a list of all calls on the line
	var calls = l.get('calls');
	
	// For each call
	for (var x in calls) {
		
		// What is it's new state
		var callstate = calls[x].get('state');
		console.log(l.get('name')+' - '+callstate);
		
		// for each state that we are interested in
		for(var state in {'ring':'', 'dead':'', 'up':''})
			
			// If we have a callback registered, and new call is in that state and 
			// saved state is different
			if(typeof this.CB[state] == 'function' &&
					state == callstate && 
					callstate != this.callstate[x])
				// Fire the callback
				this.CB[state](callstate, calls[x].get('number'), calls[x].get('party'), calls[x], l);
		
		// Save current state as old state unless it is dead
		this.calls[x] = (callstate != 'dead')?calls[x]:null;
		this.callstate[x] = callstate;
	}

};
