class State
{
    loading = true;
    autoPlay = false;
    gameover = false;
    paused = true;
    stepping = false;

    mouseDown = false;
    mouseTapped = false;
    mouseMoved = false;
    touchAvailable = true;
    intersectPoint = new THREE.Vector3();

    players = [];
    currentPlayerIndex = 0;

    cue;
    cueArrow;
    balls = [];
    powerbar;

    arrows = false;
    stopped = false;
    sunk = false;

    currentPlayer()
    {
        return this.players[this.currentPlayerIndex % 2];
    }

    otherPlayer()
    {
        return this.players[(this.currentPlayerIndex + 1) % 2];
    }
    
    isAITurn()
    {
        return this.currentPlayer() instanceof AIPlayer;
    }

    nextPlayer()
    {
        this.currentPlayerIndex = this.currentPlayerIndex > this.players.length ? 0 : (this.currentPlayerIndex + 1);
    }
}

var STATE = new State();
