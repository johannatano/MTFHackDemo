
var App = function(){
	this.init();
}

var p = App.prototype;



App.solfeggio = {'root': 396, 'sacral': 417, 'solar': 528, 'heart': 639, 'throat': 741, 'third Eye': 852, 'crown': 963};

App.planetaryData = 
{
	mercury: {
		index: 0,
		name: 'Mercury',
		scale: 1,
		angle: 0,
		radius: 36800000,
		speed: 3,
		freq: 0.01
	},
	venus: {
		index: 1,
		name: 'Venus',
		scale: 1,
		angle: 0,
		radius: 67200000,
		speed: 7,
		freq: 417
	},
	earth: {
		index: 2,
		name: 'Earth',
		scale: 1,
		angle: 0,
		radius: 93000000,
		speed: 12,
		freq: 528
	},
	mars: {
		index: 3,
		name: 'Mars',
		scale: 1,
		angle: 0,
		radius: 141600000,
		speed: 23,
		freq: 639
	},
	jupiter: {
		index: 4,
		name: 'Jupiter',
		scale: 0.5,
		angle: 0,
		radius: 483600000,
		speed: 142,
		freq: 5

	},
	saturn: {
		index: 5,
		name: 'Saturn',
		scale: 0.2,
		angle: 0,
		radius: 886500000,
		speed: 354,
		freq: 4
	},
	uranus: {
		index: 6,
		name: 'Uranus',
		scale: 0.1,
		angle: 0,
		radius: 1783700000,
		speed: 1009,
		freq: 4
	},
	neptune: {
		index: 7,
		name: 'Neptune',
		scale: 0.08,
		angle: 0,
		radius: 2795200000,
		speed: 1979,
		freq: 4
	},
	pluto: {
		index: 8,
		name: 'Pluto',
		scale: 0.05,
		angle: 0,
		radius: 3670100000,
		speed: 2977,
		freq: 4
	}
}

p.init = function(){

	// this.socket = io('http://localhost:3000');
	// this.socket.on('connect', this.onConnected.bind(this));
	// this.socket.on('disconnect', this.onDisconnect.bind(this));

	this.settings = {
		frequency: 1,
		timescale: 1,
		showSun: true,
		showEarth: true,
		showPlanet: true,
		globalScale: 1
	}

	var gui = new dat.gui.GUI();

	var frequency = gui.add(this.settings, 'frequency').min(1).max(1000).step(1).listen()
	// var timescale = gui.add(this.settings, 'timescale').min(1).max(1000).step(1)

	var obj = {showEarth: false, solfeggio: '', other: '', planets: '', clear: function(){ this.clear() }.bind(this)};

	var solfeggio = gui.add(obj, 'solfeggio', {Choose: '', 'Root': 396, 'Sacral': 417, 'Solar': 528, 'Heart': 639, 'Throat': 741, 'Third Eye': 852, 'Crown': 963}).name('Solfeggio');

	var other = gui.add(obj, 'other', { Choose: '', Root: 432, Sacral: 480, Solar: 528, Heart: 594, Throat: 672, 'Third Eye': 720, Crown: 768 } ).name('Mercury');
	
	// App.solfeggioFrequencies = [396, 417, 528, 639, 715, 852]


	var planets = gui.add(obj, 'planets', { Choose:'', Mercury: 0, Venus: 1, Mars: 3, Jupiter: 4, Saturn: 5, Uranus: 6, Neptunus: 7, Pluto: 8 } );
	gui.add(obj, 'clear');

	
	// var sun = gui.add(this.settings,'showSun').name('Show Sun');
	// var earth = gui.add(this.settings,'showEarth').name('Show Earth');
	// var planet = gui.add(this.settings,'showPlanet').name('Show Planet');

	// sun.onChange(function(val){
	// 	this.clear();
	// }.bind(this));

	// earth.onChange(function(val){
	// 	this.clear();
	// }.bind(this));

	// planet.onChange(function(val){
	// 	this.clear();
	// }.bind(this));

	frequency.onChange(function(){
		this.changeFrequency(this.settings.frequency);
	}.bind(this));


	solfeggio.onChange(function(val){
		this.changeFrequency(val);
		this.clear();
	}.bind(this));

	other.onChange(function(val){
		this.changeFrequency(val);
		this.clear();
	}.bind(this));

	

	planets.onChange(function(val){
		this.setCurrentPlanet(val);
	}.bind(this));


	this.viewport = {w: window.innerWidth, h: window.innerHeight};

	var canvas = document.getElementById("layer1");
	canvas.width = this.viewport.w;
	canvas.height = this.viewport.h;
	this.ctx = canvas.getContext("2d");
	this.ctx.strokeStyle="#fff";

	canvas = document.getElementById("layer2");
	canvas.width = this.viewport.w;
	canvas.height = this.viewport.h;

	this.ctx2 = canvas.getContext("2d");

	canvas = document.getElementById("layer3");
	canvas.width = this.viewport.w;
	canvas.height = this.viewport.h;

	this.ctx3 = canvas.getContext("2d");
	this.ctx3.strokeStyle="#fff";
	this.ctx3.fillStyle="#000";
	this.ctx3.lineWidth=1;
	// this.ctx3.globalAlpha = 0.5;

	this.setCurrentPlanet(0);
	this.changeFrequency(1);



	this.chakras = [];
	this.chakraIndex = 0;

	for(var i in App.solfeggio){
		this.chakras.push(i);
	}
	// this.chakras = [''];

	$(document).on('keydown', function(e){
		console.log(e.which);

		switch(e.which){


			case 77:
				this.setCurrentPlanet(0);
				// this.set(0);
			break;


			case 38:
				if(e.shiftKey){
					if(this.chakraIndex < this.chakras.length - 1) this.chakraIndex++;
					else this.chakraIndex = 0;
					var chakra = this.chakras[this.chakraIndex];
					this.changeFrequency(App.solfeggio[chakra]);
					this.clear();
				}else{
					this.changeFrequency(Number(this.settings.frequency)+1);
				}
			break;
			case 40:

			if(e.shiftKey){
					if(this.chakraIndex > 0) this.chakraIndex--;
					else this.chakraIndex = this.chakras.length - 1;
					var chakra = this.chakras[this.chakraIndex];
					this.changeFrequency(App.solfeggio[chakra]);
					this.clear();
				}else{
					if(this.settings.frequency > 0) this.changeFrequency(Number(this.settings.frequency)-1);
				}

			
			break;
			case 39:
				if(this.currentPlanet < 8) this.setCurrentPlanet(this.currentPlanet+1);
				else this.setCurrentPlanet(0);
			break;
			case 37:
				if(this.currentPlanet > 0) this.setCurrentPlanet(this.currentPlanet-1);
				else this.setCurrentPlanet(8);
			break;
		}
	}.bind(this));

	this.scaleVal = 1;
	this.time = 0;
	this.clear();
	this.tick();
}

p.getPlanetByIndex = function(index){
	for(var i in App.planetaryData){
		if(index == App.planetaryData[i].index) return App.planetaryData[i];
	}
}
p.getIndexOfPlanet = function(id){
	for(var i in App.planetaryData){
		if(i == id) return App.planetaryData[i].index;
	}
}

p.setCurrentPlanet = function(index){
	this.clear();
	this.currentPlanet = index;
	var planet = this.getPlanetByIndex(this.currentPlanet);
	this.scaleVal = planet.scale;
	$('h1').text(planet.name);
}


p.changeFrequency = function(val){
	this.settings.frequency = val;

	var chakraStr = '';

	for(var i in App.solfeggio){
		var chakra = App.solfeggio[i]
		if(val == chakra) chakraStr = ' (' + i + ')';
	}
	$('p').text(this.settings.frequency + 'Hz' + chakraStr);
}

p.clear = function(){

	for(var i in App.planetaryData){
		App.planetaryData[i].angle = 0;//
	}

	this.ctx.fillStyle = "black";

	this.ctx.clearRect(0, 0, this.viewport.w, this.viewport.h);
	this.ctx.fillRect(0, 0, this.viewport.w, this.viewport.h);
	this.ctx2.clearRect(0, 0, this.viewport.w, this.viewport.h);
}


p.tick = function(){

	var positions = this.calculatePositions(this.time);


	var earthPos = positions[2];
	var currentPlanetPos = positions[this.currentPlanet];

	//draw the white markers formin the oatterns  LAYER 1
	this.draw(this.ctx, earthPos, currentPlanetPos);


	//show marekrs for current position of planets / sun - LAYER 2
	if(this.settings.showSun){
		this.mark(this.ctx2, {x: 0, y: 0}, this.viewport.w * (0.111/2) * this.scaleVal);
	}
	if(this.settings.showEarth){
		this.mark(this.ctx2, positions[2], 10);
	}
	if(this.settings.showPlanet){
		this.mark(this.ctx2, positions[this.currentPlanet], 5);
	}


	//draw the white markers formin the oatterns
	this.ctx3.clearRect(0, 0, this.viewport.w, this.viewport.h);
	this.draw(this.ctx3, earthPos, currentPlanetPos);


	//send data to music generation
	var dist = Math.sqrt( Math.pow((earthPos.x-currentPlanetPos.x), 2) + Math.pow((earthPos.y-currentPlanetPos.y), 2) );
	if(this.socket)this.socket.emit('data', {dist: dist, freq: this.settings.frequency});
	//loop
	requestAnimationFrame(this.tick.bind(this));
}


p.calculatePositions = function(t){
	var data = App.planetaryData;
	var positions = [];
	var multiplierRad = 0.0000015;//maybe dynamic
	var radOffset = this.viewport.w * .111;
	var currentPlanet = this.getPlanetByIndex(this.currentPlanet);
	var m = (1/(60*this.settings.timescale)) * this.settings.frequency
	for(var i in data){
		var planet = data[i];
		planet.angle += ( Math.PI * 2 / ( planet.speed / m) );
		var x = Math.cos(planet.angle) * ( (planet.radius * multiplierRad) + radOffset );
		var y = Math.sin(planet.angle) * ( (planet.radius * multiplierRad) + radOffset );
		var pos = {x: x, y: y};
		positions.push(pos);
	}
	return positions;
}


p.mark = function(ctx, p, size){
	ctx.beginPath();
	var x =  ( this.viewport.w * .5 ) + ( this.scaleVal * p.x );
	var y = ( this.viewport.h * .5 ) + ( this.scaleVal * p.y );
	ctx.arc(x, y, size, 2 * Math.PI, false);
	ctx.fillStyle = 'black';
	ctx.strokeStyle = 'white';
	ctx.fill();
	ctx.stroke();
	ctx.closePath();
}

p.draw = function(ctx, p1, p2){
	ctx.beginPath();
	var x =  ( this.viewport.w * .5 ) + ( this.scaleVal * p1.x );
	var y =  ( this.viewport.h * .5 ) + ( this.scaleVal * p1.y );
	var x2, y2;

	if(p2){//draw line between 2 points
		x2 =  ( this.viewport.w * .5 ) + ( this.scaleVal * p2.x );
		y2 =  ( this.viewport.h * .5 ) + ( this.scaleVal * p2.y );
	}else{//just draw one point
		x2 = ( x + 1 );
		y2 = ( y + 1 );
	}

	ctx.moveTo(x, y);
	ctx.lineTo(x2, y2);
	ctx.stroke();
	ctx.closePath();
}

p.onConnected = function(){	


	var chakraIndex;

	this.socket.on('data', function(data){

		var f = Math.min(data.freq, 1);
		var index = 0;
		for(var i in App.solfeggio){
			if(App.solfeggio[i] > f) chakraIndex = 0;
		}
		// this.changeFrequency(Math.round(1000*f));
	}.bind(this));
}

p.onDisconnect = function(){	
}

p.addEventListeners = function(){
}

p.removeEventListeners = function(){
	this.socket.off();
}


