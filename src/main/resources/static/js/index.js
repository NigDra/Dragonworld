var nickName;
var numRoom;
var objPlayer;

apimock = (function () {
    return {
        getNicknameIndex: function (callback) {
            var nickName;
            nickName = document.getElementById("nickname").value;
            callback(nickName);
        },
        getRoom: function (callback) {
            var room;
            room = document.getElementById("sala").value;
            callback(room);
        }
    };

})();
/*
ClosingVar =true
window.onbeforeunload = ExitCheck();
function esxitCheck()
{
 if(ClosingVar == true) 
  { 
      alert("cerrando");
    ExitCheck = false
    return "Si decide continuar,abandonará la página pudiendo perder los cambios si no ha GRABADO ¡¡¡";
  }
}
var customWindow = window.open('', '_blank', '');
    */
function cerrarWindow() {
    alert("cerrando");
    appGame.cerrar();
}

var appGame = (function () {
    var stompClient = null;
    var nickName1;
    var addGameToCanvas = function (game) {
        var room = new Room(game.id, game.ancho, game.alto);
        room.setPlayers(game.players);
        createDragons(room);
    };

    var connectAndSubscribe = function () {
        console.info('Connecting to WS...');
        var socket = new SockJS('/stompDragon');
        stompClient = Stomp.over(socket);
        //stompClient.connect("skieprkh", "3qg80KHy7MJAC9MH4kWzFANGNbg-Qjki", function (frame) {
        stompClient.connect({}, function (frame) {
            console.log('Connected: ' + frame);
            stompClient.subscribe('/topic/newGame.' + numRoom, function (eventbody) {
                var gameObj = JSON.parse(eventbody.body);
                // Se cambiaba de página cuando empezaba el juego. Por el momento e ovuta el vdiv de inicio y se muestra en el index
                setTimeout(function () {
                    init.startGame(gameObj);
                }, 50);
            });
            stompClient.subscribe('/topic/movePlayer.' + numRoom, function (eventbody) {
                //console.log("moviendo");
                var gameObj = JSON.parse(eventbody.body);
                init.updateDragons(gameObj);

            });
            stompClient.subscribe('/topic/disconnectPlayer.' + numRoom, function (eventbody) {
                var gameObj = JSON.parse(eventbody.body);
                init.endGame(gameObj);
                //init.updateDragons(gameObj);
                //appGame.disconnect();
            });
            stompClient.subscribe('/topic/deletePlayer.' + numRoom, function (eventbody) {                
                var gameObj = JSON.parse(eventbody.body);
                init.endGame(gameObj);
                //init.updateDragons(gameObj);
                appGame.disconnect();
            });
            init.initializeGame(numRoom);
        });
    };

    function mostrar(gameJSON, callback) {
        callback(gameJSON);
    }

    return {
        /*init: function () {
        },*/

        conectar: function () {
            nickName = document.getElementById("nickname").value;
            numRoom = document.getElementById("sala").value;
            connectAndSubscribe();
        },

        disconnect: function () {
            if (stompClient !== null) {
                stompClient.disconnect();
            }
            //alert("Disconnected");           
        },

        initializeGame: function (numRoomSend, player, room) {
            objPlayer = player;
            stompClient.send("/app/newRoom", {}, JSON.stringify(room));
            setTimeout(function () {
                stompClient.send("/app/newPlayer." + numRoomSend, {}, JSON.stringify(player)); //convierte obje
                init.getNickName(nickName);
            }, 50);
        },

        moveDragon: function (player) {
            stompClient.send("/app/movePlayer." + numRoom, {}, JSON.stringify(player)); //convierte obje
        },

        cerrar: function () {
            stompClient.send("/app/disconnect." + numRoom, {}, JSON.stringify(objPlayer));

        },

        deletePlayer: function () {
            stompClient.send("/app/delete." + numRoom, {}, JSON.stringify(objPlayer));
            
        },

        connectTopic: function () {
            connectAndSubscribe();
        }
    };
})();