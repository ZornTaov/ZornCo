/// <reference path='../../typings/globals/three/index.d.ts'/>
/// <reference path='../../typings/globals/three-orbitcontrols/index.d.ts'/>
/// <reference path="../../typings/globals/stats.js/index.d.ts" />

var stats = new Stats();
var camera, scene, ui_camera, ui_scene, renderer, controls;

var cameraPointer = new THREE.Vector3();
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var mouseInitial = new THREE.Vector2();
var mouseOffset = new THREE.Vector2();
var mousehelper;


var text = document.getElementById("text");
var floor, cubemap;
var side1, side2, end1, end2;
var pits = [];
var pitRadius = 2.5;

var ballCount = 15;
var ballRadius = 1;

var INVERSE_MAX_FPS = 1 / 120;
var clock = new THREE.Clock();
var frameDelta = 0.0;
var cameraTheta = 0.0;
var timeSinceStart;
var text2;

init();
animate();

function init() {
	stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
	stats.dom.hidden = true;
	document.body.appendChild(stats.dom);
	camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
	camera.position.x = 0;
	camera.position.y = 20;
	camera.position.z = -40;
	timeSinceStart = 0;
	scene = new THREE.Scene();
	ui_scene = new THREE.Scene();

	ui_camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, 0, 1000);
	ui_scene.add(ui_camera);

	var ui_directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
	ui_directionalLight.position.set(0, 0, 1);
	ui_camera.add(ui_directionalLight);

	var light = new THREE.AmbientLight(0x707070, 0.3); // soft white light
	scene.add(light);

	var directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);

	camera.add(directionalLight);

	mousehelper = new THREE.Object3D()

	scene.add(camera);

	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.maxPolarAngle = Math.PI * 7 / 15;
	controls.minDistance = 40;
	controls.maxDistance = 60;
	document.body.appendChild(renderer.domElement);

	makeWorld();
	handleGui();

	STATE.players.push(new Player());
	STATE.players.push(new AIPlayer());

	window.addEventListener('resize', onWindowResize, false);

	window.addEventListener('keydown', onKeyDown, false);
	window.addEventListener('keyup', onKeyUp, false);
	document.addEventListener('mousemove', onMouseMove, false);
	document.addEventListener('mousedown', onMouseDown, false);
	document.addEventListener('mouseup', onMouseUp, false);

	renderer.domElement.addEventListener("touchstart", onTouchStart, false);
	renderer.domElement.addEventListener("touchend", onTouchEnd, false);
	renderer.domElement.addEventListener("touchmove", onTouchMove, false);
	if (!(typeof document.ontouchstart != 'undefined')) {
		console.log("no Touch available");
		STATE.touchAvailable = false;
		text.style.visibility = "visible";
	}

	window.addEventListener('focus', function () {
		STATE.paused = true;
	});

	window.addEventListener('blur', function () {
		STATE.paused = false;
	});
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

/*
* Gui Setup
*/

function handleGui() {
	text2 = document.createElement('div');
	text2.id = "loading";
	text2.innerHTML = "Loading Game!";
	document.body.appendChild(text2);

	var xScreenSize = .05 * window.innerWidth;
	var yScreenSize = .75 * window.innerHeight;
	var adjustedX = getScreenX(0) + xScreenSize / 2;
	var adjustedY = getScreenY(0) + yScreenSize / 2;
	STATE.powerbar = new PowerBar(yScreenSize,
		new THREE.MeshLambertMaterial({ color: 0xffffff, wireframe: false }),
		new THREE.MeshLambertMaterial({ color: 0x0000ff, wireframe: false }));
	STATE.powerbar.position.set(adjustedX, -yScreenSize / 2, -200);
	ui_scene.add(STATE.powerbar);
}

function getScreenX(normalizedX) {
	var scaledX = normalizedX * window.innerWidth;
	return window.innerWidth / -2 + scaledX;
}

function getScreenY(normalizedY) {
	var scaledY = normalizedY * window.innerHeight;
	return window.innerHeight / -2 + scaledY;
}

/*
* World Setup
*/
function makeCubemap(manager) {
	var path = "data/PoolRoom/";
	var format = '.png';
	var urls = [
		path + 'px' + format, path + 'nx' + format,
		path + 'py' + format, path + 'ny' + format,
		path + 'pz' + format, path + 'nz' + format
	];
	var reflectionCube = new THREE.CubeTextureLoader(manager).load(urls);
	reflectionCube.format = THREE.RGBFormat;

	//This sets the background to cubmap
	scene.background = reflectionCube;

	//This creates a material that uses the cubemap that we assign to the box when it's created 
	var cubeMaterial1 = new THREE.MeshLambertMaterial({ color: 0xffffff, envMap: reflectionCube });

	return cubeMaterial1;
};

function makeWorld() {
	var materials = [];
	for (var i = 0; i < 20; i++) {
		materials.push(new THREE.MeshLambertMaterial(
			{
				color: (Math.random() * 0xffffffff)
			}));
	}

	var manager = new THREE.LoadingManager();
	manager.onLoad = function () {
		STATE.loading = false;
		text2.innerHTML = "";
	}

	//floor
	var poolTex = new THREE.TextureLoader(manager).load('data/PoolTable.jpg');
	var tableTexture = new THREE.MeshLambertMaterial({ map: poolTex });
	var woodTex = new THREE.TextureLoader(manager).load('data/woodFrame.jpg');
	var woodTexture = new THREE.MeshLambertMaterial({ map: woodTex });
	floor = new THREE.Mesh(new THREE.BoxBufferGeometry(50, 6, 30, 1, 1, 1), tableTexture);
	floor.position.set(0, -3.5, 0);
	scene.add(floor);
	var length = 50, width = 30;
	var shape = new THREE.Shape();
	shape.moveTo(-length / 2, width / 2);
	shape.lineTo(-length / 2, width / 2);
	shape.lineTo(length / 2, width / 2);
	shape.lineTo(length / 2, -width / 2);
	shape.lineTo(-length / 2, -width / 2);

	var extrudeSettings = {
		steps: 1,
		depth: 1,
		bevelEnabled: true,
		bevelThickness: 3,
		bevelSize: 2,
		bevelOffset: 0,
		bevelSegments: 1
	};
	var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
	var underside = new THREE.Mesh(geometry, woodTexture);
	underside.position.set(0, -4, 0);
	underside.rotateX(Math.PI / 2);
	scene.add(underside);
	side1 = new THREE.Mesh(new THREE.BoxBufferGeometry(50, 5, 3, 4, 4, 4), woodTexture);
	side1.position.set(0, -1.5, 16.5);
	scene.add(side1);
	side2 = new THREE.Mesh(new THREE.BoxBufferGeometry(50, 5, 3, 4, 4, 4), woodTexture);
	side2.position.set(0, -1.5, -16.5);
	scene.add(side2);

	cubemap = makeCubemap();

	end1 = new THREE.Mesh(new THREE.BoxBufferGeometry(3, 5, 30, 4, 4, 4), woodTexture);
	end1.position.set(-26.5, -1.5, 0);
	scene.add(end1);
	end2 = new THREE.Mesh(new THREE.BoxBufferGeometry(3, 5, 30, 4, 4, 4), woodTexture);
	end2.position.set(26.5, -1.5, 0);
	scene.add(end2);
	var pitcolor = new THREE.MeshLambertMaterial({ color: 0x010101 });
	for (let i = 0; i < 4; i++) {
		var pit = new THREE.Mesh(new THREE.CylinderBufferGeometry(3.4, 3.4, 1, 16), pitcolor);
		var pit2 = new THREE.Mesh(new THREE.CylinderBufferGeometry(3.5, 3.5, 5, 16, 1, false, 0, Math.PI * 3 / 2), cubemap);
		pit.position.set(25 * ((i / 2 | 0) * 2 - 1), -0.9, 15 * ((i % 2) * 2 - 1));
		pit2.position.set(25 * ((i / 2 | 0) * 2 - 1), -1.49, 15 * ((i % 2) * 2 - 1));
		pit2.rotateY(THREE.Math.degToRad(90 - 90 * (i) * ((i / 2 | 0) * 2 - 1) + 90 * (i / 2 | 0)))
		scene.add(pit);
		scene.add(pit2);
		pits.push(pit);
	}

	STATE.cue = Ball.makeCueBall(ballRadius, scene);
	scene.add(STATE.cue);
	STATE.balls.push(STATE.cue);
	for (let i = 0; i < ballCount; i++) {
		var ball = new Ball(ballRadius, materials[i], scene);
		scene.add(ball);
		STATE.balls.push(ball);
	}
	Ball.rackBalls(ballCount);

	STATE.cueArrow = new THREE.ArrowHelper(new THREE.Vector3(1), STATE.cue.position, 15, 0xffff00, 5, 5)
	var edgeGeometry = new THREE.CylinderGeometry(.5, .5, 1, 6, 4);

	var edge = new THREE.Mesh(edgeGeometry,
		new THREE.MeshBasicMaterial({ color: 0xffff00 }));
	edge.rotation = STATE.cueArrow.rotation.clone();
	edge.position.y = 0.5;
	var grp = new THREE.Object3D();
	grp.add(edge);
	STATE.cueArrow.add(grp);
	STATE.cueArrow.remove(STATE.cueArrow.line);
	STATE.cueArrow.line = grp;
	scene.add(STATE.cueArrow);
}

/*
* Update Events
*/
function animate(time) {
	requestAnimationFrame(animate);

	stats.begin();
	frameDelta += clock.getDelta();

	if (STATE.loading) {
		return;
	}

	mousehelper.position.copy(STATE.intersectPoint);

	if (STATE.paused || STATE.stepping) {

		controls.update();

		while (frameDelta >= INVERSE_MAX_FPS) {
			update(INVERSE_MAX_FPS);
			frameDelta -= INVERSE_MAX_FPS;
		}
		STATE.stepping = false;
	}
	else //ignore paused frame
	{
		frameDelta = 0;
	}

	renderer.render(scene, camera);
	renderer.autoClear = false;
	renderer.render(ui_scene, ui_camera);
	renderer.autoClear = true;
	stats.end();
}

function update(delta) {
	if (!STATE.gameover) {
		STATE.sunk = Ball.allSunk();
		if (STATE.sunk) {
			STATE.gameover = true;
			text2.innerHTML = "Game Over!";
		}
	}

	STATE.stopped = Ball.allStopped()

	if (STATE.stopped && !STATE.gameover) {
		if (STATE.cue.sunk) {
			STATE.currentPlayer().state = PlayerState.PLACINGCUE;
		}
		mousehelper.visible = STATE.currentPlayer().isAiming;
		STATE.currentPlayer().update();
		if (STATE.autoPlay || STATE.mouseTapped || STATE.isAITurn()) {
			STATE.currentPlayer().doAction();
		}
	}
	STATE.mouseTapped = false;

	STATE.balls.forEach(ball => {
		if (ball) {
			ball.handleBallMovement(delta, STATE.arrows);
			handleBallCollision(ball, delta);
		}
	});
}

/*
* Ball Interaction
*/
function checkCollision(object1, object2) {
	var object1Box = new THREE.Box3();
	object1Box.setFromObject(object1);

	var object2Box = new THREE.Box3();
	object2Box.setFromObject(object2);

	if (object1Box.intersectsBox(object2Box)) {
		return true;
	}
	else {
		return false;
	}
}

function checkCollision2(object1, object2, radius1 = 1, radius2 = 1) {
	if (object1 && object2) {
		var object1Box = new THREE.Sphere(object1.position, radius1);

		var object2Box = new THREE.Sphere(object2.position, radius2);

		if (object1Box.intersectsSphere(object2Box)) {
			return true;
		}
		else {
			return false;
		}
	}
	return false;
}

function handleBallCollision(ball, time) {
	for (let n = 0; n < STATE.balls.length; n++) {
		ball.handleBallCollision(STATE.balls[n]);
	}
	if (checkCollision(ball, side1)) {
		//console.log("ball touched side2");
		ball.speed.z = -Math.abs(ball.speed.z * 0.97);
		ball.position.z += ball.speed.z;
	}
	if (checkCollision(ball, side2)) {
		//console.log("ball touched side2");
		ball.speed.z = Math.abs(ball.speed.z * 0.97);
		ball.position.z += ball.speed.z;
	}
	if (checkCollision(ball, end1)) {
		//console.log("ball touched end");
		ball.speed.x = Math.abs(ball.speed.x * 0.97);
		ball.position.x += ball.speed.x;
	}
	if (checkCollision(ball, end2)) {
		//console.log("ball touched end");
		ball.speed.x = -Math.abs(ball.speed.x * 0.97);
		ball.position.x += ball.speed.x;
	}
	pits.forEach(pit => {

		if (checkCollision2(ball, pit, ball.ballRadius, pitRadius)) {
			ball.speed.set(0, 0, 0);
			ball.sunk = true;
			ball.position.set(0, -5, 0);
			if (ball != STATE.cue)
				STATE.currentPlayer().score++;
			else
				STATE.currentPlayer().score--;

		}
	});
}

/*
* Key Events
*/
function onKeyUp(event) {
	switch (event.keyCode) {
		case 65: /*A*/
			break;
		case char('H'): /*Help*/
			text.style.visibility = "hidden";
			break;
		case 83: /*S*/
			break;
		case 89: /*Y*/
			break;
		case 85: /*U*/
			break;
	}
}

function onKeyDown(event) {
	//console.log("keydown" + event.keyCode);
	//console.log()
	switch (event.keyCode) {
		case char('A'): /*A*/
			STATE.arrows = !STATE.arrows;
			STATE.balls.forEach(ball => {
				ball.arrow.visible = STATE.arrows;
			});
			break;
		case char('H'): /*Help*/
			text.style.visibility = "visible";
			break;
		case 191: /*Stats*/
			if (event.shiftKey) {
				stats.dom.hidden = !stats.dom.hidden;
			}
			break;
		case char('P'): /*autoPlay*/
			STATE.autoPlay = !STATE.autoPlay;
			break;
		case char('S'): /*Step*/
			STATE.stepping = true;
			break;
		case char('D'): /*pauseD*/
			STATE.paused = !STATE.paused;
			break;
		case char('R'): /*Reset*/
			STATE.gameover = false;
			STATE.powerbar.visible = STATE.cueArrow.visible = false;
			STATE.players.forEach(player => {
				player.score = 0;
				player.state = PlayerState.AIMING;
			});
			STATE.currentPlayerIndex = 0;
			Ball.rackBalls(ballCount);
		case char('C'): /*place Cue*/
			Ball.placeCueBall();
			break;
	}
}

/*
* Mouse Events
*/
function setMouse(x, y) {
	mouse.x = (x / window.innerWidth) * 2 - 1;
	mouse.y = - (y / window.innerHeight) * 2 + 1;
}

function updateIntersect(x, y) {
	setMouse(x, y);
	raycaster.setFromCamera(mouse, camera);
}

function onMouseUp(event) {
	STATE.mouseDown = false;
	var mouseDiff = new THREE.Vector2().subVectors(mouseInitial, mouseOffset);
	if (mouseDiff.length() < 1) {
		STATE.mouseTapped = true;
	}
	STATE.mouseMoved = false;
}
function onMouseDown(event) {
	STATE.mouseDown = true;
	mouseInitial.x = event.clientX;
	mouseInitial.y = event.clientY;
}

function onMouseMove(event) {
	updateIntersect(event.clientX, event.clientY);
	var intersects = raycaster.intersectObjects([floor]);
	if (intersects.length > 0 && (intersects[0].faceIndex == 5 || intersects[0].faceIndex == 4)) {
		STATE.intersectPoint.copy(intersects[0].point);
	}
	mouseOffset.x = event.clientX;
	mouseOffset.y = event.clientY;
};

/*
* Touch Events
*/
function onTouchStart(event) {
	event.preventDefault();
	updateIntersect(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
	var intersects = raycaster.intersectObjects([floor]);
	if (intersects.length > 0 && (intersects[0].faceIndex == 5 || intersects[0].faceIndex == 4)) {
		controls.enableRotate = false;
		STATE.mouseDown = true;
	}
}

function onTouchEnd(event) {
	event.preventDefault();
	if (!STATE.mouseMoved) {
		STATE.mouseTapped = true;
	}
	controls.enableRotate = true;
	STATE.mouseDown = false;
	STATE.mouseMoved = false;
}

function onTouchMove(event) {
	event.preventDefault();
	event.stopPropagation();
	STATE.mouseMoved = true;
	updateIntersect(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
	var intersects = raycaster.intersectObjects([floor]);
	if (intersects.length > 0 && (intersects[0].faceIndex == 5 || intersects[0].faceIndex == 4)) {
		STATE.intersectPoint.copy(intersects[0].point);
	}
}