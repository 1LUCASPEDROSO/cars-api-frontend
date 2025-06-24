import { inject, Injectable } from '@angular/core';
import { Brand } from '../models/brand';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BrandService {
  apiUrl: string = environment.apiUrl
  http = inject(HttpClient)
  constructor() { }

  getAllBrands(){
    return this.http.get<Brand[]>(this.apiUrl+"api/brands")
  }
  getBrandById(id: number){
    return this.http.get<Brand>(this.apiUrl+"api/brands/id/"+id)
  }
  getBrandByName(name: string){
    return this.http.get<Brand>(this.apiUrl+"api/brands/name/"+name)
  }
  addBrand(entity:Brand){
    return this.http.post(this.apiUrl+"api/brands/",entity)
  }
  updateBrand(entity:Brand){
    return this.http.put(this.apiUrl+"api/brands/",entity)
  }
  deleteBrand(id:number){
    return this.http.delete(this.apiUrl+"api/brands/"+id)
  }
}
