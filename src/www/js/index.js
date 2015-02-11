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
//        app.reversiStart();
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
        app.reversiStart();
    },

    create_session: function(ds, cb) {
        var ts = new Date().getTime();
        var n = 2;
        ds.child("session").on("set", function(e) {
            if(e.id == "de") {
                if(ts != e.value.ts) {
                    //２番目に待っていた人
                    cb(e.value.n);
                }
            }else if(e.id == "p1") {
                if(ts != e.value.ts) {
                    //最初に待っていた人
                    ds.child("session").set("de", {ts : ts, n : n});
                    n++;
                    cb(1);
                }
            }
        });
        ds.child("session").set("p1", {ts : ts});

    },

    reversiStart: function() {
        /* main.jsから移植 */
        var milkcocoa = new MilkCocoa("https://io-ri5xv824j.mlkcca.com");
        var ds = milkcocoa.dataStore('reversi').child('game1');
        var map = new ReversiMap(ds);
        app.create_session(ds, function(index) {
            var parentElement = document.getElementById('deviceready');
            parentElement.setAttribute('style', 'display:none;');
            if(index == 1) {
                map.init(ReversiMap.WHITE);
            }else if(index == 2) {
                map.init(ReversiMap.BLACK);
            }else{
                alert("３人目です");
            }
        });
    }
};

app.initialize();