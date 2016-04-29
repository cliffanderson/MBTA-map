var io = require('socket.io')(1235);
var fs = require('fs');
var http = require('http');

var connectedClients = 0;

var trains = ['CR-Fairmount', 'CR-Fitchburg', 'CR-Worcester', 'CR-Franklin', 'CR-Greenbush',
'CR-Haverhill', 'CR-Kingston', 'CR-Lowell', 'CR-Middleborough', 'CR-Needham',
'CR-Newburyport', 'CR-Providence'];

