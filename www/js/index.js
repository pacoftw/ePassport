/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.querySelector('#scanQR').addEventListener("touchend", startScan, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();

var resultDiv;

document.addEventListener("deviceready", init, false);
function init() {
	document.querySelector("#scanQR").addEventListener("touchend", startScan, false);
	resultDiv = document.querySelector("#results");
}

function startScan() {

	cordova.plugins.barcodeScanner.scan(
		function (result) {
			var s = "Result: " + result.text + "<br/>" +
			"Format: " + result.format + "<br/>" +
			"Cancelled: " + result.cancelled;
			resultDiv.innerHTML = s;
		}, 
		function (error) {
			alert("Scanning failed: " + error);
		}
	);

}

function sendEmail() {
    var to = document.getElementById('toAddress').value;
    if (to.length == 0 || !validateEmail(to)) {
        alert('email address is not valid, please try again.');
        return;
    }
    
    var last = document.getElementById('lastName').value;
    var first = document.getElementById('firstName').value;
    var course = document.getElementById('course').value;
    var section = document.getElementById('section').value;
    var body = "<h1>" + last + "," + first + ", " + course + "-" + section + "</h1><br/><br/>";
    $('#myList li').each(function() {
        body += $(this).find('a').text() + '<br/>';
    });
    
    cordova.plugins.email.open({
        to: to,
        subjects:   'STaRS ePassport Report',
        body:   body,
        isHtml: true
    });
}
    
exports.open = function (options, callback, scope) {
    var fn = this.createCallbackFn(callback, scope);
    var isAndroidApp = this.aliases.hasOwnProperty(options.app);
    options = this.mergeWithDefaults(options || {});

    var onAvailable = function(isPossible,withScheme) {
        if (withScheme && options.app!=='mailto'
                && !isAndroidApp){
            this.registerCallbackForScheme(fn);
            exec(fn, null, 'EmailComposer', 'open', [options]);
        }else if(isPossible){
            options.app = 'mailto';
            exec(fn, null, 'EmailComposer', 'open', [options]);
        }else {
            fn();
        }
    }
    exec(onAvailable, null, 'EmailComposer', 'isAvailable', [options.app]);
};