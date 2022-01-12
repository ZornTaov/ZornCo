const PlayerState = {
    PLACINGCUE: 0,
    AIMING: 1,
    CHARGING: 2,
    SHOOTING: 3
}

/*
* Player Object
*/
class Player {
    _score = 0;
    power = 0;
    powerDirection = 1;
    maxPower = 1;
    position = new THREE.Vector3();
    target = new THREE.Vector3();
    state = PlayerState.AIMING;
    name = "player 1";

    constructor()
    {

    }

    set score(sc)
    {
        this._score = sc;
        var score = document.getElementById(STATE.isAITurn()?"Score1":"Score2");
        score.innerHTML = (STATE.isAITurn()?"Player 1: ":"AI: ") + this._score;
    }

    get score()
    {
        return this._score;
    }

    get isAiming()
    {
        return this.state == PlayerState.AIMING;
    }

    update()
    {
        switch (this.state)
        {
            case PlayerState.PLACINGCUE:
                this.moveCue();
                break;
            case PlayerState.AIMING:
                this.aim();
                break;
            case PlayerState.CHARGING:
                this.doCharge();
                break;

            default:
                break;
        }
    }

    doAction()
    {
        switch (this.state)
        {
            case PlayerState.PLACINGCUE:
                this.placeCue()
                break;
            case PlayerState.AIMING:
                this.doAiming();
                break;
            case PlayerState.CHARGING:
                this.doShoot();
                STATE.nextPlayer();
                break;
            default:
                break;
        }
        this.nextState();
    }

    nextState()
    {
        switch (this.state)
        {
            case PlayerState.PLACINGCUE:
                this.state = PlayerState.AIMING;
                break;
            case PlayerState.AIMING:
                this.state = PlayerState.CHARGING;
                break;
            case PlayerState.CHARGING:
                this.state = PlayerState.AIMING;
                break;
        
            default:
                break;
        }
    }

    moveCue()
    {
        this.target.copy(STATE.intersectPoint);
        STATE.cue.position.copy(this.target);
    }

    placeCue()
    {
        Ball.placeCueBall(this.target);
    }

    aim()
    {
        if (!STATE.autoPlay)
        {
            STATE.cueArrow.visible = true;
        }
        STATE.cueArrow.position.copy(STATE.cue.position);
        var dir = new THREE.Vector3().subVectors(STATE.intersectPoint.clone().setY(0), STATE.cue.position);

        STATE.cueArrow.setDirection(dir);
        STATE.cueArrow.setLength(dir.length(), 2, 2);
    }

    doAiming()
    {
        this.target.copy(STATE.autoPlay ? Ball.getRandomBall().position : STATE.intersectPoint);
        if (!STATE.autoPlay)
        {
            STATE.powerbar.visible = true;
        }
        this.power = 0;
        this.powerDirection = 1;
    }

    doCharge()
    {
        this.tickPower();
    }

    doShoot()
    {
        STATE.powerbar.visible = STATE.cueArrow.visible = false;
        STATE.cue.speed.subVectors(this.target, STATE.cue.position).normalize().multiplyScalar(STATE.autoPlay ? 1 : this.power);
        STATE.cue.speed.y = 0;
        if(STATE.cue.speed.length() > 1)
            STATE.cue.speed.multiplyScalar(1/STATE.cue.speed.length());

    }

    tickPower()
    {
        this.power += 0.005 * this.powerDirection;
        if (this.power < 0.01)
        {
            this.power = 0.01;
            this.powerDirection *= -1;
        } 
        else if (this.power > this.maxPower)
        {
            this.power = this.maxPower;
            this.powerDirection *= -1;
        }
        STATE.powerbar.power(this.power);
    }
}
/*
* AI Object
*/
class AIPlayer extends Player 
{
    name = "player 2(AI)";

    constructor()
    {
        super();
    }

    aim()
    {

    }

    doAiming()
    {
		this.target.copy(Ball.getRandomBall().position);
    }

    doCharge()
    {
        this.power = Math.random()/3 + 0.66;
    }
    
    placeCue()
    {
        Ball.placeCueBall();
    }
}
