import { Component, OnInit } from '@angular/core';

import "js/libs/three.js";
import "js/libs/OrbitControls.js";
import "js/libs/stats.min.js";
import "js/libs/util.js";
import "js/state.js";
import "js/player.js";
import "js/ball.js";
import "js/powerbar.js";
import "js/game.js";

@Component({
  selector: 'zornco-pool-game',
  templateUrl: './pool-game.component.html',
  styleUrls: ['./pool-game.component.scss']
})
export class PoolGameComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
