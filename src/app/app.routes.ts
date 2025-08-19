import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { ListBrandComponent } from './pages/list-brand/list-brand.component';
import { FormBrandComponent } from './pages/form-brand/form-brand.component';
import { ListModelComponent } from './pages/list-model/list-model.component';
import { FormModelComponent } from './pages/form-model/form-model.component';
import { ListCarComponent } from './pages/list-car/list-car.component';
import { FormCarComponent } from './pages/form-car/form-car.component';
import { LoginComponent } from './pages/login/login.component';
export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    {path:"list-brand",component: ListBrandComponent, canActivate:[authGuard]},
    {path:"list-model",component: ListModelComponent, canActivate:[authGuard]},
    {path:"list-car",component: ListCarComponent, canActivate:[authGuard]},
    { path:'form-brand', component: FormBrandComponent, canActivate:[authGuard] },
    { path:'form-model', component: FormModelComponent, canActivate:[authGuard] },
    { path:'form-car', component: FormCarComponent, canActivate:[authGuard] },
    { path:'form-brand/:id', component: FormBrandComponent, canActivate:[authGuard] },
    { path:'form-model/:id', component: FormModelComponent, canActivate:[authGuard] },
    { path:'form-car/:id', component: FormCarComponent, canActivate:[authGuard] },
    { path:'login', component: LoginComponent },
];
