## Classes

<dl>
<dt><a href="#SimpleCTI">SimpleCTI</a></dt>
<dd></dd>
<dt><a href="#SimpleCTI">SimpleCTI</a></dt>
<dd></dd>
</dl>

<a name="SimpleCTI"></a>
## SimpleCTI
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
Creates a new SimpleCTI singleton and initialises it with the user infothat it will use to authenticate against the PBX. Plants callbacksthat will be used to signal API startup completion and called whena call status changes on a line.


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

<a name="SimpleCTI"></a>
## SimpleCTI
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
Creates a new SimpleCTI singleton and initialises it with the user infothat it will use to authenticate against the PBX. Plants callbacksthat will be used to signal API startup completion and called whena call status changes on a line.


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

