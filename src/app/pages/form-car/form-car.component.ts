import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatError } from '@angular/material/form-field';
import { ToastrService } from 'ngx-toastr';
import { ModelService } from '../../services/model.service';
import { CarService } from '../../services/car.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { GasType } from '../../models/gas-type';
import { Car } from '../../models/car';
@Component({
  selector: 'app-form-model',
  standalone: true,
  templateUrl: './form-car.component.html',
  styleUrl: './form-car.component.scss',
  imports: [
    ReactiveFormsModule,RouterModule,MatFormFieldModule,MatInputModule,MatCardModule,MatButtonModule,MatError,MatSelectModule,MatAutocompleteModule
  ]
})
export class FormCarComponent implements OnInit {
  entityForm: FormGroup;
  formName = 'Novo Carro';
  listPage = '/list-car';
  requiredMessage = 'Campo obrigatório';
  private modelService = inject(ModelService)
  private carService = inject(CarService)
  private route = inject(ActivatedRoute)
  private entityId?: number;
  private ngx = inject(ToastrService)
  models: any[] = [];
  modelName!: string;
  gasTypeOptions: any
  editmode: boolean = false;
  constructor(private fb: FormBuilder) {
    this.entityForm = this.fb.group({
      model_id: ['', Validators.required],
      year: ['', Validators.required],
      gas_type: ['', Validators.required],
      num_doors: ['', Validators.required],
      color: ['', Validators.required]
    });
  }
  ngOnInit() {
    this.entityId = this.route.snapshot.params["id"]
    this.getAllGasType()
    if (this.entityId) {
      this.searchCar(this.entityId)
      this.editmode = true;
      this.displayModelName
    }
    else {
      this.modelService.getAllModels().subscribe(models => {
        this.models = models;
      });
    }
  }
  displayModelName = (modelId: number): string => {
    const selected = this.models.find((m: { id: number; }) => m.id === modelId);
    return selected ? selected.name : '';
  }

  searchCar(id: number) {
    this.carService.getCarById(id).subscribe((data: any) => {
      this.modelService.getModelById(data.model_id).subscribe(model => {
        this.models = [model]
        this.modelName = this.models[0].name
        console.log(this.models)
        this.entityForm.controls['model_id'].setValue(this.models[0].id)
      })
      this.entityForm.controls['year'].setValue(data.year)
      this.entityForm.controls['gas_type'].setValue(data.gas_type)
      this.entityForm.controls['num_doors'].setValue(data.num_doors)
      this.entityForm.controls['color'].setValue(data.color)
    })
  }
  teste() {
    const raw = this.entityForm.getRawValue();
    if (this.entityForm.valid) {
     let date: string = new Date().toISOString()
      const updateCarData: Car = { id: this.entityId, registerDate: date, model_id: raw.model_id, year: this.entityForm.value.year, gas_type: this.entityForm.value.gas_type, num_doors: this.entityForm.value.num_doors, color: this.entityForm.value.color.toLowerCase() }
    }
  }

  getAllGasType(){
     this.gasTypeOptions = Object.keys(GasType)
          .filter(key => isNaN(Number(key)))
          .map(key => ({
            label: key,
            value: GasType[key as keyof typeof GasType]
          }));
  }
  Save() {
    const raw = this.entityForm.getRawValue()
    if(this.entityId && this.entityId > 0){
       let date: string = new Date().toISOString()
      const updateCarData: Car = { id: this.entityId, registerDate: date, model_id: raw.model_id, year: this.entityForm.value.year, gas_type: this.entityForm.value.gas_type, num_doors: this.entityForm.value.num_doors, color: this.entityForm.value.color.toLowerCase() }
      this.carService.updateCar(updateCarData).subscribe({
        next: () => {
          this.ngx.success("carro editado com sucesso")
        },
        error: (error) => {
          this.ngx.error(error?.message || "Erro ao editar carro")
        }
      })
    }
    else if (this.entityForm.valid) {
      let date: string = new Date().toISOString()
      const carData: Car = { registerDate: date, model_id: this.entityForm.value.model_id, year: this.entityForm.value.year, gas_type: this.entityForm.value.gas_type, num_doors: this.entityForm.value.num_doors, color: this.entityForm.value.color.toLowerCase() }
      console.log(carData)
      this.carService.addCar(carData).subscribe({
        next: () => {
          this.ngx.success("carro registrado com sucesso")
        },
        error: (error) => {
          this.ngx.error(error?.message || "Erro ao registrar carro")
        }
      })
    }
    else {
      this.entityForm.markAllAsTouched()
    }
  }


}
