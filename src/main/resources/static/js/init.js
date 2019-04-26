var init = (function () {
	var roomADibujar;
	var updateRoom;
	var nickNamePlayer;
	class Room {
		constructor(num, ancho, alto) {
			this.num = num;
			this.ancho = ancho;
			this.alto = alto;
		}

		setPlayers(playersJson) {
			this.players;
			for (var i = 0; i < playersJson.length; i++) {
				var p = new Player(playersJson.nickName, playersJson.posX, playersJson.posY);
				players.add(p);
			}
		}
	}

	class Player {
		constructor(nickName, posX, posY, angle, numRoomP) {
			this.nickName = nickName;
			this.posX = posX;
			this.posY = posY;
			this.numRoom = numRoomP;
			this.angle = angle;
		}

		setPosX(posx){
			this.posX = posx;
		}
		setPosY(posy){
			this.posY = posy;
		}
		setAngle(angle){
			this.angle = angle;
		}


		setGraphic(graphic) {
			this.graphic = graphic;
		}
	}	

	const config = {		
		type: Phaser.AUTO,
		width: document.documentElement.clientWidth - 20,
		height: document.documentElement.clientHeight - 20,		
		parent: 'container',
		transparent: true,
		"render.transparent": true,
		"render.autoResize": true,		
		scene: {
			preload: preload,
			create: create,
			update: update
		},
		physics: {
			default: "arcade",
			arcade: {
			}
		},
	};
	var mapJugadores = new Map();
	var player;
	var game;
	var score = 0;
	var scoreText;
	var foods;
	var activo;

	function preload() {	
		this.load.image('dragonImg', 'images/dragon3.png');
		this.load.image('foodImg', 'images/esfera3.png');
		this.load.atlas('dragonesAtlas', 'images/dragones.png', 'images/dragones.js');
		this.load.atlas('fireAtlas', 'images/fuego1.png', 'images/fuego.js');
	}

	function create() {		
		this.anims.create({ key: 'dragonSprite', frames: this.anims.generateFrameNames('dragonesAtlas', { prefix: 'dragon1_', end: 100, zeroPad: 4 }), repeat: -1 });		
		alert("CREANDO");
		this.listaDragones = this.physics.add.group();		
		console.log(roomADibujar);
		alert(roomADibujar[0].nickName);
		for (var i = 0; i < roomADibujar.length; i++) {
			console.log("for");			
			if(roomADibujar[i].nickName == nickNamePlayer){
				this.dragon = this.physics.add.sprite(roomADibujar[i].posX, roomADibujar[i].posY, 'dragonesAtlas').play('dragonSprite');
				this.dragon.setCollideWorldBounds(true);
			}else{
				var graphicDragon = this.physics.add.sprite(roomADibujar[i].posX, roomADibujar[i].posY, 'dragonesAtlas').play('dragonSprite');
				graphicDragon.setCollideWorldBounds(true); //para que el dragon n os salga de la pantalla
				//mapJugadores[roomADibujar[i].nickName] = graphicDragon;
				mapJugadores.set(roomADibujar[i].nickName,graphicDragon);
			}
			console.log("despues de grafica");
			this.listaDragones.create(graphicDragon);
			//roomADibujar[i].setGraphic(graphicDragon);
		}
	}
	/*
	function updateDragones (dragons){
		for (var i = 0; i < updateRoom.length; i++){
			//alert ("updaste dragons");
			if (updateRoom[i].nickName != nickNamePlayer){
				this.dragonMove = mapJugadores.get(updateRoom[i].nickName);
				this.physics.moveTo(this.dragonMove, this.input.mousePointer.x, this.input.mousePointer.y , 200);
				//alert (dragonMove.y);
			}
			
			//this.physics.moveTo(this.dragonMove, 300,  + 32, 200);
		}
	}*/



	function update(time, delta) {		
		//movimiento del dragon que siga el mouse
		this.physics.moveTo(this.dragon, this.input.mousePointer.x, this.input.mousePointer.y + 32, 200);
		
		
		//alert(nickNamePlayer);
		//stompClient.send("/topic/dragon", {}, JSON.stringify(this.dragon.x));
		this.input.on('pointermove', function (pointer) {
			let cursor = pointer;
			//calcular el angulo entre el dragon y el mouse (tomando la esquina del sprite (--arreglar eso))
			let angleNow = (Math.atan2(this.dragon.y - cursor.y, this.dragon.x - cursor.x) * 180 / Math.PI);
			this.dragon.angle = angleNow;
			
		}, this);
		player.setAngle(this.dragon.angle);
		player.setPosX(this.dragon.x);
		player.setPosY(this.dragon.y);
		
		appGame.moveDragon(player);

		if(typeof updateRoom !== 'undefined'){
			for (var i = 0; i < updateRoom.length; i++){
				if(updateRoom[i].nickName != nickNamePlayer){
					diseñoDeDragonI=mapJugadores.get(updateRoom[i].nickName);					
					this.physics.moveTo(diseñoDeDragonI, updateRoom[i].posX, updateRoom[i].posY, 200);
					diseñoDeDragonI.setAngle(updateRoom[i].angle);
					
				}
			}
		}
	}

	return {
		initializeGame: function (numRoomInit) {
			var ancho = config.width;
			var alto = config.height;
			var room = new Room(numRoomInit, ancho, alto);			
			var posX = Phaser.Math.FloatBetween(32, config.width - 32);
			var posY = Phaser.Math.FloatBetween(32, config.height - 32);
			player = new Player(nickName, posX, posY, 0, numRoomInit);
			appGame.initializeGame(numRoomInit, player, room);
		},
		startGame: function(room){
			roomADibujar = room;
			$('#divInicio').hide();
			game = new Phaser.Game(config);
		}, 
		getNickName: function(nickNameP){
			nickNamePlayer = nickNameP;
		},
		updateDragons: function (dragons){
			updateRoom = dragons;
			//updateDragones(dragons);
		}	
	};
})();
