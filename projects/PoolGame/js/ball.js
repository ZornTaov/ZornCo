/*
* Ball(pucks)
*/
class Ball extends THREE.Mesh
{
	arrow;
	hasStopped = true;
	ballRadius = 2;
	speed = new THREE.Vector3();
	sunk = false;

	constructor(ballradius, material, scene)
	{
		super(new THREE.CylinderBufferGeometry( ballradius, ballradius, 1, 16 ), material);	
	
		var helper = new THREE.ArrowHelper(new THREE.Vector3( 1, 0, 0 ), this.position, 1);
		this.arrow = helper;
		this.arrow.visible = false;
		scene.add(helper);
		this.name = (Ball.index++).toString();
		this.ballRadius = ballradius;
	}
	
};

Ball.MaxSpeed = 1;
Ball.index = 0;

Ball.prototype = Object.create(THREE.Mesh.prototype);
Ball.prototype.constructor = Ball;

Ball.makeCueBall = function(ballRadius, scene)
{
	//cue ball
	var ball = new Ball(ballRadius, new THREE.MeshBasicMaterial({color: 0xFFFFFF}), scene );
	ball.name = "cue";
	ball.position.set(15, 0, 0 );
	return ball;
}

/*
* Logic
*/
Ball.allStopped = function()
{
	for (const ball of STATE.balls)
	{
		if(!ball.hasStopped)
			return false;
	}
	return true;
}

Ball.allSunk = function()
{
	for (const ball of STATE.balls)
	{
		if(!ball.sunk && ball.name != "cue")
			return false;
	}
	return true;
}

Ball.rackBalls = function(ballCount)
{
	var rowCount = 1;
	var total = ballCount;
	var index = 1;
	while (index < ballCount){
		for (var i = 0; i < rowCount; i++)
		{
			//ball
			STATE.balls[index].position.set(-10-(rowCount-1)*Math.tan(THREE.Math.degToRad(33))*3*STATE.balls[index].ballRadius, 
											0, 
											((rowCount-1)- i*2)*STATE.balls[index].ballRadius 
											);
			STATE.balls[index].speed.set(0,0,0);
			STATE.balls[index].sunk = false;
			if (index++ == ballCount)
			{
				break;
			}
		}
		rowCount ++;
	}
}

Ball.placeCueBall = function(pos = new THREE.Vector3(15, 0, 0))
{
	STATE.cue.sunk = false;
	STATE.cue.position.copy(pos);
	STATE.cue.position.y = 0;
	STATE.cue.speed.set( 0, 0, 0 );
}

Ball.getRandomBall = function()
{
	do {
		var num = THREE.Math.randInt(1,15);
	} while (STATE.balls[num].sunk);
	return STATE.balls[num];
}

/*
* Movement
*/
Ball.prototype.handleBallMovement =function (time)
{
	if (!this.sunk)
	{
		//move
		this.position.add(this.speed);
		this.position.y = 0;
		//arrowhelper
		if(STATE.arrows){
			this.arrow.position.copy(this.position);
			var vec = new THREE.Vector3().copy(this.speed).normalize();
			this.arrow.setDirection(vec);
			this.arrow.setLength(this.speed.length()*5+1, 1, 1);
		}
		//friction
		this.speed.multiplyScalar(0.99);
		//stop if slow enough
		if(this.speed.length() < 0.001)
			this.speed.set(0,0,0);
		//limit speed
		if(this.speed.length() > 1)
			this.speed.divideScalar(this.speed.length());
	}
	this.hasStopped = this.speed.lengthSq() == 0;
}

/*
* Collision
*/
Ball.prototype.handleBallCollision = function(otherBall)
{
    if (!otherBall.sunk || !this.sunk)
	{
        
		if (otherBall != this)
		{
			if (this.position.x + this.ballRadius + otherBall.ballRadius > otherBall.position.x 
				&& this.position.x < otherBall.position.x + this.ballRadius + otherBall.ballRadius
				&& this.position.z + this.ballRadius + otherBall.ballRadius > otherBall.position.z 
				&& this.position.z < otherBall.position.z + this.ballRadius + otherBall.ballRadius)
			{
				var dist = this.position.distanceTo(otherBall.position);
				if (dist < this.ballRadius + otherBall.ballRadius)
				{
					this.calculateNewVelocities(otherBall);
				}
			}
		}
    }
}

Ball.prototype.calculateNewVelocities = function(secondBall)
{
	var mass1 = this.ballRadius;
	var mass2 = secondBall.ballRadius;
	var pos1 =  this.position;
	var pos2 =  secondBall.position;
	var vel1  = new THREE.Vector3().copy(this.speed);
	var vel2  = new THREE.Vector3().copy(secondBall.speed);
	var subpos1 = new THREE.Vector3().subVectors(pos1, pos2);
	var subpos2 = new THREE.Vector3().subVectors(pos2, pos1);
	var subvel1 = new THREE.Vector3().subVectors(vel1, vel2);
	var subvel2 = new THREE.Vector3().subVectors(vel2, vel1);
	var dot1 = (2*mass2/(mass1+mass2))*(subvel1.dot(subpos1)/subpos1.lengthSq());
	var dot2 = (2*mass1/(mass1+mass2))*(subvel2.dot(subpos2)/subpos2.lengthSq());
	var vecP1 = vel1.sub(subpos1).multiplyScalar(dot1);
	var vecP2 = vel2.sub(subpos2).multiplyScalar(dot2);
	
	this.speed.x = vecP1.x * 0.90;
	this.speed.z = vecP1.z * 0.90;
	secondBall.speed.x = vecP2.x * 0.90;
	secondBall.speed.z = vecP2.z * 0.90;
	if(this.speed.length() > Ball.MaxSpeed)
		this.speed.multiplyScalar(Ball.MaxSpeed/this.speed.length());
	if(secondBall.speed.length() > Ball.MaxSpeed)
		secondBall.speed.multiplyScalar(Ball.MaxSpeed/secondBall.speed.length());
	var times = 15;
	while (this.position.distanceTo(secondBall.position) < this.ballRadius + secondBall.ballRadius && times-- > 0)
	{
		this.position.x =  this.position.x + vecP1.x;
		this.position.z =  this.position.z + vecP1.z;
		secondBall.position.x = secondBall.position.x + vecP2.x;
		secondBall.position.z = secondBall.position.z + vecP2.z;
	}
}