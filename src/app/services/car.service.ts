import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Car } from '../models/car';

@Injectable({
  providedIn: 'root'
})
export class CarService {
  apiUrl: string = environment.apiUrl
  http = inject(HttpClient)
  constructor() { }
  getAllCars(){
      return this.http.get<Car[]>(this.apiUrl+"api/cars")
    }
    getCarById(id: number){
      return this.http.get<Car>(this.apiUrl+"api/cars/id/"+id)
    }
    addCar(entity:Car){
      return this.http.post(this.apiUrl+"api/cars/",entity)
    }
    updateCar(entity:Car){
      return this.http.put(this.apiUrl+"api/cars/",entity)
    }
    deleteCar(id:number){
      return this.http.delete(this.apiUrl+"api/cars/"+id)
    }
}
