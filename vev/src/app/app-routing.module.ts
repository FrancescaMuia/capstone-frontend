import { NotAdminGuard } from './auth/not-admin.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuestGuard } from './auth/guest.guard';
import { HomeComponent } from './pages/home/home.component';
import { AuthGuard } from './auth/auth.guard';
import { AdminGuard } from './auth/admin.guard';
import { ProductsComponent } from './pages/products/products.component';
import { WineListComponent } from './pages/winelist/winelist.component';
import { AddVinylComponent } from './pages/add-vinyl/add-vinyl.component';
import { AddWineComponent } from './pages/add-wine/add-wine.component';
import { EditVinylComponent } from './pages/edit-vinyl/edit-vinyl.component';
//import { EditProductComponent } from './pages/edit-product/edit-product.component';
//import { AddProductComponent } from './pages/add-product/add-product.component';
//import { CartComponent } from './pages/cart/cart.component';
import { WishlistComponent } from './pages/wishlist/wishlist.component';
import { CartComponent } from './pages/cart/cart.component';
import { VinylWineAssociationComponent } from './pages/vinyl-wine-association/vinyl-wine-association.component';



const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full'
},
  {
    path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
    canActivate: [GuestGuard],
  canActivateChild: [GuestGuard],
  },
  {
    path:'home',
    component:HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'products',
    component: ProductsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'winelist',
    component: WineListComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'edit-vinyl/:id',
    component: EditVinylComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'add-vinyl',
    component: AddVinylComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'add-wine',
    component: AddWineComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path:'wishlist',
    component:WishlistComponent,
    canActivate: [AuthGuard]
  },
  {
    path:'cart',
    component:CartComponent,
    canActivate: [AuthGuard]
  },
  {
    path:'associate',
    component:VinylWineAssociationComponent,
    canActivate: [AuthGuard]
  },
  /* {
    path:'edit-product/:id',
    component:EditProductComponent,
    canActivate: [AuthGuard, AdminGuard]
  }, */
  /* {
    path:'add-product',
    component:AddProductComponent,
    canActivate: [AuthGuard, AdminGuard]
  }, */
  /* {
    path:'cart',
    component:CartComponent,
    canActivate: [AuthGuard, NotAdminGuard]
  }, */
  /* {
    path:'wishlist',
    component:WishlistComponent,
    canActivate: [AuthGuard, NotAdminGuard]
  }, */
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
