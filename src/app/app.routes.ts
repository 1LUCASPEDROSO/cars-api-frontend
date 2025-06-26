import { Routes } from '@angular/router';
import { ListBrandComponent } from './pages/list-brand/list-brand.component';
import { FormBrandComponent } from './pages/form-brand/form-brand.component';
import { ListModelComponent } from './pages/list-model/list-model.component';
import { FormModelComponent } from './pages/form-model/form-model.component';

export const routes: Routes = [
    { path: '', redirectTo: 'list-brand', pathMatch: 'full' },
    {path:"list-brand",component: ListBrandComponent},
    {path:"list-model",component: ListModelComponent},
    { path:'form-brand', component: FormBrandComponent },
    { path:'form-model', component: FormModelComponent },
    { path:'form-brand/:id', component: FormBrandComponent },
    { path:'form-model/:id', component: FormModelComponent },
];
