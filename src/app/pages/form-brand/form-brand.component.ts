import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule,Router,ActivatedRoute  } from '@angular/router';
import { OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatError } from '@angular/material/form-field';
import { BrandService } from '../../services/brand.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-form-brand',
  standalone: true,
  templateUrl: './form-brand.component.html',
  styleUrl: './form-brand.component.scss',
  imports: [
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatError
  ]
})
export class FormBrandComponent implements OnInit {
  entityForm: FormGroup;
  formName = 'Nova Marca';
  listPage = '/list-brand';
  requiredMessage = 'Campo obrigatório';
  private brandService = inject(BrandService)
  private route = inject(ActivatedRoute)
  private entityId?: number;
  private ngx = inject(ToastrService)

  constructor(private fb: FormBuilder) {
    this.entityForm = this.fb.group({
      name: ['', Validators.required],
    });
  }
  ngOnInit(){
    this.entityId = this.route.snapshot.params["id"]
    if (this.entityId){
      this.searchBrand(this.entityId)
    }
  }
  searchBrand(id: number){
    this.brandService.getBrandById(id).subscribe((data:any) =>{
      if(data == null){
        console.log("erro")
      }
      this.entityForm.controls['name'].setValue(data.name.toLowerCase())
    })
  }
  Save() {
  if (this.entityForm.valid) {
    const brandName = this.entityForm.value.name.trim().toLowerCase();

    this.brandService.getBrandByName(brandName).subscribe({
      next: (existingBrand) => {
        if (existingBrand) {
          this.ngx.warning("Essa marca já está registrada.");
        } else {
          const brandData = { name: brandName };
          this.brandService.addBrand(brandData).subscribe({
            next: () => {
              this.ngx.success("Marca registrada com sucesso");
            },
            error: (error) => {
              this.ngx.error(error?.message || "Erro ao registrar marca");
            }
          });
        }
      },
      error: () => {
        this.ngx.error("Erro ao verificar se a marca já existe");
      }
    });
  } else {
    this.entityForm.markAllAsTouched();
  }
}

  
}
