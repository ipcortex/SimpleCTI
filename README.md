# Simple CTI

SimpleCTI is an example class that provides a heavily sanitised interface to the IPCortex API which abstracts away everything that isn't needed for basic inbound call processing or click to dial.

It allows a web developer to make one Javascript call which will initialise the API and register callbacks that will fire whenever a significant call event (e.g. call ringing, answered or hung-up) occurs on the phone of the authenticated user. It also provides Javascript calls to dial, answer or hang-up calls on behalf of the user, and works like this...

## Step 1
Include both the SimpleCTI.js class and the normal IPCortex wrapper:

    <!DOCTYPE HTML>
    <html>
    <head>
    <script src="simpleCTI.js" type="text/javascript"></script>
    <!-- *** Substitute your appliance domain name below *** -->
    <script src="https://pabx.phone.voipcortex.co.uk/api/wrapper.whtm" type="text/javascript"></script>

## Step 2

Create an instance by calling the Constructor with a PBX username, password, and set of callback functions that you want to have invoked when something happens:

    <script>

    // *** Substitute a real username and password below ***
    var CTI = new SimpleCTI("user1", "password", statusCB, eventCB, eventCB, eventCB);

    // Or use this form instead for pop-out user auth on 6.1+ software
    // var CTI = new SimpleCTI([statusCB, eventCB, eventCB, eventCB]);


    // Status callback - just insert anything we get into the <h2> in the body
    function statusCB(status, code, reason){
        var status = document.getElementById('status');
        status.innerHTML=reason+" ("+code+")";

    }

    // Call event callback - we use the same callback for all three event types
    //  and key off the first state parameter to work out what to do.
    function eventCB(state, number, party, call, line){
        var callstatus = document.getElementById('callstatus');
        var statuspanel = document.getElementById('statuspanel');
        console.log('got '+state+' event to number '+number+' we are the '+party);
        switch (state){
        case 'ring':
                description = 'Ringing: ';
                break;
        case 'up':
                description = 'Answered: ';
                break;
        case 'dead':
                description = 'Nothing Doing, last call was: ';
                break;
        }
        if(party=='callee')
                description += number+' calling us';
        else
                description += 'calling '+number;
        if(state != 'dead')
                description += ' <a href="#" onClick="CTI.hangup(\''+call.attr.id+'\')">hangup</a>';
        if(state == 'ring' && party == 'callee')
                description += ' <a href="#" onClick="CTI.answer(\''+call.attr.id+'\')">answer</a>';
        callstatus.innerHTML=description;
        statuspanel.src = 'http://www.google.com/custom?q='+number;
    }

## Step 3
Wait for status and call event updates via your callbacks!

    <title>Simple CTI Test page</title>
    </head>
    <body>
        <h1>Simple CTI Test</h1>
        <p>This page displays the status and a google lookup of the phone number for any inbound or outbound call</p>

        <h2 id="status">API not initialised</h1>

        <input id="thenumber" type="text"></input>
        <button onClick="CTI.dial(document.getElementById('thenumber').value);">Dial me</button>

        <h1 id="callstatus">Nothing doing</h1>
        <iframe id="statuspanel" height="400" width="100%"></iframe>
    </body>
    </html>


# Class Documentation

<a name="SimpleCTI"></a>
## SimpleCTI
Really simple example of a CTI class that allows client side Javascript to interactwith a PBX

**Kind**: global class  

* [SimpleCTI](#SimpleCTI)
    * [new SimpleCTI(callbacks)](#new_SimpleCTI_new)
    * [new SimpleCTI(username, password, statusCB, [ringCB], [upCB], [deadCB])](#new_SimpleCTI_new)
    * _static_
        * [.dial(number, [line])](#SimpleCTI.dial)
        * [.hangup(id)](#SimpleCTI.hangup)
        * [.answer(id)](#SimpleCTI.answer)
    * _inner_
        * [~statusCallback](#SimpleCTI..statusCallback)
        * [~eventCallback](#SimpleCTI..eventCallback)

<a name="new_SimpleCTI_new"></a>
### new SimpleCTI(callbacks)
Creates a new SimpleCTI class using pop-out javascript auth.Plants callbacksthat will be used to signal API startup completion and called whena call status changes on a line.


| Param | Type | Description |
| --- | --- | --- |
| callbacks | <code>Array</code> | Array of functions (status, ring, up, dead as below), uses new form of pop-out auth (requires PBX firmware v6.1+) |

<a name="new_SimpleCTI_new"></a>
### new SimpleCTI(username, password, statusCB, [ringCB], [upCB], [deadCB])
Old usage (PBX v6.0 and below)


| Param | Type | Description |
| --- | --- | --- |
| username | <code>String</code> | A valid PBX username for a user who owns a phone |
| password | <code>String</code> | Users password |
| statusCB | <code>[statusCallback](#SimpleCTI..statusCallback)</code> | to call on error or successful API initialisation -  old style usage only, not used if first param is an array of functions |
| [ringCB] | <code>[eventCallback](#SimpleCTI..eventCallback)</code> | to call when a line on users phone rings -  old style usage only, not used if first param is an array of functions |
| [upCB] | <code>[eventCallback](#SimpleCTI..eventCallback)</code> | to call when a line on users phone is answered -  old style usage only, not used if first param is an array of functions |
| [deadCB] | <code>[eventCallback](#SimpleCTI..eventCallback)</code> | to call when a line on users phone is hung up -  old style usage only, not used if first param is an array of functions |

<a name="SimpleCTI.dial"></a>
### SimpleCTI.dial(number, [line])
Dial a number, optionally specify line

**Kind**: static method of <code>[SimpleCTI](#SimpleCTI)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| number | <code>number</code> |  | to dial |
| [line] | <code>number</code> | <code>0</code> | line index (zero based) |

<a name="SimpleCTI.hangup"></a>
### SimpleCTI.hangup(id)
Hangup a call

**Kind**: static method of <code>[SimpleCTI](#SimpleCTI)</code>  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | ID of call to hangup |

<a name="SimpleCTI.answer"></a>
### SimpleCTI.answer(id)
Answer a call

**Kind**: static method of <code>[SimpleCTI](#SimpleCTI)</code>  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | ID of call to answer |

<a name="SimpleCTI..statusCallback"></a>
### SimpleCTI~statusCallback
Status (initialisation) event callback

**Kind**: inner property of <code>[SimpleCTI](#SimpleCTI)</code>  

| Param | Type | Description |
| --- | --- | --- |
| ok | <code>Boolean</code> | true or false:      true: API successfully started      false: error condition |
| code | <code>number</code> | numeric API error code (status == false only) |
| text | <code>String</code> | textual explanation suitable for user display |

<a name="SimpleCTI..eventCallback"></a>
### SimpleCTI~eventCallback
Call event callback

**Kind**: inner property of <code>[SimpleCTI](#SimpleCTI)</code>  

| Param | Type | Description |
| --- | --- | --- |
| state | <code>String</code> | one of 'ring', 'up', 'dead' - new state of call |
| number | <code>String</code> | The Caller ID of the other party. Caution: may not be            numeric in all cases |
| party | <code>String</code> | 'caller' or 'callee' - defines which role we are |
| call | <code>Object</code> | Raw underlying call object |
| line | <code>Object</code> | Raw underlying line object |
