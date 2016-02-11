/**
 * Really simple example of a CTI class that allows client side Javascript to interact
 * with a PBX
 */

/**
 * Creates a new SimpleCTI singleton and initialises it with the user info
 * that it will use to authenticate against the PBX. Plants callbacks
 * that will be used to signal API startup completion and called when
 * a call status changes on a line.
 *
 * @constructor
 *
 * @param {String|Object} Either a username: A valid PBX username for a user who owns a phone, 
 * in which case old style username/password login will be used, or an object containing functions
 * (status, ring, up, dead), in which case auth credentials won't be sent to the PBX from this page
 * but instead pop-out auth will be invoked (latter requires PBX firmware v6.1)
 * @param {String} password Password
 * @param {SimpleCTI~statusCallback} statusCB to call on error or successful API initialisation
 * @param {SimpleCTI~eventCallback} [ringCB] to call when a line on users phone rings
 * @param {SimpleCTI~eventCallback} [upCB] to call when a line on users phone is answered
 * @param {SimpleCTI~eventCallback} [deadCB] to call when a line on users phone is hung up
 */
/**
 * Status (initialisation) event callback
 * @callback SimpleCTI~statusCallback
 * @param ok {Boolean} true or false:
 *      true: API successfully started
 *      false: error condition
 * @param code {number} numeric API error code (status == false only)
 * @param text {String} textual explanation suitable for user display
 *
 */
/**
 * Call event callback
 *
 * @callback SimpleCTI~eventCallback
 * @param state
 *            {String} one of 'ring', 'up', 'dead' - new state of call
 * @param number
 *            {String} The Caller ID of the other party. Caution: may not be
 *            numeric in all cases
 * @param party
 *            {String} 'caller' or 'callee' - defines which role we are
 * @param call
 *            {Object} Raw underlying call object
 * @param line
 *            {Object} Raw underlying line object
 */

var SimpleCTI = (function(arg1, password, statusCB, ringCB, upCB, deadCB) {
    // Alternative usage function(Object callbacks);
    var CB;
    if (arg1 instanceof Object) {
        var username = password = null;
        CB = arg1;
    } else {
        var username = arg1;
        CB = {
            status: statusCB,
            ring: ringCB,
            up: upCB,
            dead: deadCB
        }
    }
    // Initialise an empty call list
    var calls = {},
        callstate = {},

        // Initialise an empty line array
        lines = [];

    /**
     * This private method is called by the API when login is initialised Just
     * checks login status and starts API polling
     *
     * @param ok
     */
    function authCB(ok) {
        console.log('SimpleCTI.authCB(' + ok + ')');

        if (ok) {
            /*
             * Request the poller starts and initial PABX config information is
             * fetched and cached. 'go' and 'error' are success/fail callbacks.
             * 'error' will be called on any error event.
             */
            IPCortex.PBX.startPoll(go, error);
        } else
            CB.status(false, -1, "Login failed");
    }

    /**
     * Handler for any error events
     *
     * @param n
     * @param m
     */
    function error(n, m) {
        CB.status(false, n, m);
        console.error('We got an error number: ' + n + ' Text: ' + m);
    }

    /**
     * Handler for API initialised event
     */
    function go() {
        console.log('SimpleCTI.go()');

        // Once initialised, request all our owned lines are returned
        IPCortex.PBX.getLines(linesCB, true);
        CB.status(true, 0, "API Initialised");
    }

    /**
     * Handler for lines list callback
     *
     * @param l
     */
    function linesCB(l) {
        console.log('SimpleCTI.linesCB(' + l.length + ')');

        // Lines are returned in a list - Hook them all
        while (l.length) {
            var line = l.shift();
            /*
             * In this example we allow the line to go out of scope once hooked
             * this is OK as a reference is passed with the callback
             */
            line.hook(lineEvent);
            lines.push(line);
        }
    }

    /**
     * Handler for PBX line event callback
     *
     * @param f
     * @param h
     * @param l
     */
    function lineEvent(f, h, l) {
        // Get a list of all calls on the line
        calls = l.get('calls');

        // For each call
        for (var x in calls) {

            // What is its new state
            var currentState = calls[x].get('state');
            console.log(l.get('name') + ' - ' + currentState);

            // for each state that we are interested in
            for (var state in {
                    'ring': '',
                    'dead': '',
                    'up': ''
                })

            // If we have a callback registered, and new call is in that
            // state and
            // saved state is different
                if (typeof CB[state] == 'function' && state == currentState && currentState != callstate[x])
                // Fire the callback
                    CB[state](state, calls[x].get('number'), calls[x]
                    .get('party'), calls[x], l, x);

                // Save current state as old state unless it is dead
            callstate[x] = currentState;
        }
    }

    // Global onAPILoadReady is a special function called by ipcortex API
    // wrapper
    // to initialiase the API. Feed it something relevant.
    onAPILoadReady = (function() {
        // Old vs new (popup) login behaviour
        if (username != null && password != null)
            IPCortex.PBX.Auth.login(username, password, null, authCB);
        else
            IPCortex.PBX.Auth.login()
            .then(function(ret) {
                authCB(true);
            })
            .catch(function(ret) {
                authCB(false);
            });

    });
    console.log('setup onAPILoadReady');

    return {

        /**
         * Dial a number, optionally specify line
         *
         * @param {number}
         *            number to dial
         * @param {number}
         *            [line=0] line index (zero based)
         */
        dial: function(number, line) {
            if (line == null || lines[line] == null)
                line = 0;
            // lines[line].enablertc();
            lines[line].dial(number, true, true);
        },

        /**
         * Hangup a call
         *
         * @param id
         *            {String} ID of call to hangup
         */
        hangup: function(id) {
            console.log('Hangup ID: ' + id);

            if (id != null || calls[id] == null)
                calls[id].hangup();
        },

        /**
         * Answer a call
         *
         * @param id
         *            {String} ID of call to answer
         */
        answer: function(id) {
            console.log('Answer ID: ' + id);

            if (id != null || calls[id] == null)
                calls[id].talk();
        }
    };
});
