import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PoolGameComponent } from './pool-game/pool-game.component';

const routes: Routes = [
  {
    path: "",
    component: HomeComponent
  },

  {
    path: "pool",
    component: PoolGameComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
