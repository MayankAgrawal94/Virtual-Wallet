import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { AboutComponent } from './about/about.component';
import { ServicesComponent } from './services/services.component';
import { AuthGuard } from '../shared/gaurd/auth.guard';

const routes: Routes = [
  {
      path: '',
      component: LayoutComponent,
      children: [
          { path: 'wallet',component: AboutComponent },
          { path: 'transation',component: ServicesComponent },
      ],
      canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes,{ useHash: true }),
  ],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
