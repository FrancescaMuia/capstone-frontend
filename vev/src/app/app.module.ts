import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './pages/header/header.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from './pages/home/home.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from './pages/footer/footer.component';
//import { ProductDetailComponent } from './components/modals/product-detail/product-detail.component';
//import { AddProductComponent } from './pages/add-product/add-product.component';
//import { EditProductComponent } from './pages/edit-product/edit-product.component';
//import { CartComponent } from './pages/cart/cart.component';
//import { WishlistComponent } from './pages/wishlist/wishlist.component';
import { ErrorInterceptor } from './interceptors/auth.interceptor';
import { ProductsComponent } from './pages/products/products.component';
import { AddVinylComponent } from './pages/add-vinyl/add-vinyl.component';
import { AddWineComponent } from './pages/add-wine/add-wine.component';
import { WineListComponent } from './pages/winelist/winelist.component';
import { EditVinylComponent } from './pages/edit-vinyl/edit-vinyl.component';





@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    //ProductDetailComponent,
    //AddProductComponent,
    //EditProductComponent,
    //CartComponent,
    //WishlistComponent,
    FooterComponent,
    ProductsComponent,
    AddVinylComponent,
    AddWineComponent,
    WineListComponent,
    EditVinylComponent
    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
