import { Routes } from '@angular/router';
import { ListBrandComponent } from './pages/list-brand/list-brand.component';
import { FormBrandComponent } from './pages/form-brand/form-brand.component';

export const routes: Routes = [
    { path: '', redirectTo: 'list-brand', pathMatch: 'full' },
    {path:"list-brand",component: ListBrandComponent},
    { path:'form-brand', component: FormBrandComponent },
    { path:'form-brand/:id', component: FormBrandComponent },
];
