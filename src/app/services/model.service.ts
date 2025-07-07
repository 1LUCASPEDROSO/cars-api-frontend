import { inject, Injectable } from '@angular/core';
import { Model } from '../models/model';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ModelService {
apiUrl: string = environment.apiUrl
  http = inject(HttpClient)
  constructor() { }

  getAllModels(){
    return this.http.get<Model[]>(this.apiUrl+"api/models")
  }
  getModelById(id: number){
    return this.http.get<Model>(this.apiUrl+"api/models/id/"+id)
  }
  getModelByName(name: string){
    return this.http.get<Model>(this.apiUrl+"api/models/name/"+name)
  }
  addModel(entity:Model){
    return this.http.post(this.apiUrl+"api/models/",entity)
  }
  updateModel(entity:Model){
    return this.http.put(this.apiUrl+"api/models/",entity)
  }
  deleteModel(id:number){
    return this.http.delete(this.apiUrl+"api/models/"+id)
  }
}
