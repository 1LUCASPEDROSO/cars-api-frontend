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
import { BrandService } from '../../services/brand.service';
import { Model } from '../../models/model';
import { CommonModule } from '@angular/common';
import { CurrencyMaskModule } from "ng2-currency-mask";

@Component({
  selector: 'app-form-model',
  standalone: true,
  templateUrl: './form-model.component.html',
  styleUrl: './form-model.component.scss',
  imports: [
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatError,
    MatSelectModule,
    CommonModule,
    CurrencyMaskModule
  ]
})
export class FormModelComponent implements OnInit {
  entityForm: FormGroup;
  formName = 'Novo Modelo';
  listPage = '/list-form';
  requiredMessage = 'Campo obrigatório';
  private modelService = inject(ModelService)
  private brandService = inject(BrandService)
  private route = inject(ActivatedRoute)
  private entityId?: number;
  private ngx = inject(ToastrService)
  brands: any;

  constructor(private fb: FormBuilder) {
    this.entityForm = this.fb.group({
      name: ['', Validators.required],
      fipe_value: ['', Validators.required],
      brand_id: ['', Validators.required]
    });
  }
  ngOnInit() {
    this.entityId = this.route.snapshot.params["id"]
    if (this.entityId) {
      this.searchModel(this.entityId)
    }
    else {
      this.brandService.getAllBrands().subscribe(data => {
        this.brands = data;
      });
    }
  }
  searchModel(id: number) {

    this.modelService.getModelById(id).subscribe((data: any) => {
      this.brandService.getBrandById(data.brand_id).subscribe(brand => {
        this.brands = [brand]
      })
      this.entityForm.controls['name'].setValue(data.name.toLowerCase())
      this.entityForm.controls['fipe_value'].setValue(data.fipe_value)
      this.entityForm.controls['brand_id'].setValue(data.brand_id)
      this.entityForm.get('brand_id')?.disable()
    })
  }
  Save() {
    const raw = this.entityForm.getRawValue();
    if (this.entityId && this.entityId > 0) {
      const updateModelData: Model = { id: this.entityId, name: this.entityForm.value.name.toLowerCase(), fipe_value: this.entityForm.value.fipe_value, brand_id: raw.brand_id };
      this.modelService.updateModel(updateModelData).subscribe({
        next: () => {
          this.ngx.success("modelo editado com sucesso");
        },
        error: (error) => {
          this.ngx.error(error?.message || "Erro ao editar modelo");
        }
      });
    }
    else if (this.entityForm.valid) {
      const modelName = this.entityForm.value.name.trim().toLowerCase();
      this.modelService.getModelByName(modelName).subscribe({
        next: (existingModel) => {
          if (existingModel) {
            this.ngx.warning("Esse modelo já está registrado.");
          } else {
            const ModelData: Model = { name: modelName, fipe_value: this.entityForm.value.fipe_value, brand_id: this.entityForm.value.brand_id };
            this.modelService.addModel(ModelData).subscribe({
              next: () => {
                this.ngx.success("Modelo registrado com sucesso");
              },
              error: (error) => {
                this.ngx.error(error?.message || "Erro ao registrar modelo");
              }
            });
          }
        },
        error: () => {
          this.ngx.error("Erro ao verificar se modelo já existe");
        }
      });
    }
    else {
      this.entityForm.markAllAsTouched();
    }
  }


}
