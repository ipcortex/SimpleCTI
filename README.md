<a name="SimpleCTI"></a>
#class: SimpleCTI
**Members**

* [class: SimpleCTI](#SimpleCTI)
  * [new SimpleCTI(username, password, statusCB, [ringCB], [upCB], [deadCB])](#new_SimpleCTI)
  * [simpleCTI.dial(number, [line])](#SimpleCTI#dial)
  * [simpleCTI.hangup(id)](#SimpleCTI#hangup)
  * [simpleCTI.answer(id)](#SimpleCTI#answer)
  * [callback: SimpleCTI~statusCallback](#SimpleCTI..statusCallback)
  * [callback: SimpleCTI~eventCallback](#SimpleCTI..eventCallback)

<a name="new_SimpleCTI"></a>
##new SimpleCTI(username, password, statusCB, [ringCB], [upCB], [deadCB])
Creates a new SimpleCTI instance and initialises it with the user infothat it will use to authenticate against the PBX. Plants callbacksthat will be used to signal API startup completion and called whena call status changes on a line.

**Params**

- username `String` - A valid PBX username for a user who owns a phone  
- password `String` - Password  
- statusCB <code>[statusCallback](#SimpleCTI..statusCallback)</code> - to call on error or successful API initialisation  
- \[ringCB\] <code>[eventCallback](#SimpleCTI..eventCallback)</code> - to call when a line on users phone rings  
- \[upCB\] <code>[eventCallback](#SimpleCTI..eventCallback)</code> - to call when a line on users phone is answered  
- \[deadCB\] <code>[eventCallback](#SimpleCTI..eventCallback)</code> - to call when a line on users phone is hung up  

<a name="SimpleCTI#dial"></a>
##simpleCTI.dial(number, [line])
Dial a number, optionally specify line

**Params**

- number `number` - to dial  
- \[line=0\] `number` - line index (zero based)  

<a name="SimpleCTI#hangup"></a>
##simpleCTI.hangup(id)
Hangup a call

**Params**

- id `String` - ID of call to hangup  

<a name="SimpleCTI#answer"></a>
##simpleCTI.answer(id)
Answer a call

**Params**

- id `String` - ID of call to answer  

<a name="SimpleCTI..statusCallback"></a>
##callback: SimpleCTI~statusCallback
**Params**

- ok `Boolean` - true or false:	true: API successfully started	false: error condition  
- code `number` - numeric API error code (status == false only)  
- text `String` - extual explanation suitable for user display  

**Scope**: inner typedef of [SimpleCTI](#SimpleCTI)  
**Type**: `function`  
<a name="SimpleCTI..eventCallback"></a>
##callback: SimpleCTI~eventCallback
This callback is displayed as a global member.

**Params**

- state `String` - one of 'ring', 'up', 'dead' - new state of call  
- number `String` - The Caller ID of the other party. Caution: may not be numeric in all cases  
- party `String` - 'caller' or 'callee' - defines which role we are  
- call `Object` - Raw underlying call object  
- line `Object` - Raw underlying line object  

**Scope**: inner typedef of [SimpleCTI](#SimpleCTI)  
**Type**: `function`  
