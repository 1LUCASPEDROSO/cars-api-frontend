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
        const brandData = {...this.entityForm.value, name: this.entityForm.value.name.toLowerCase()
    };
     this.brandService.addBrand(brandData).subscribe(() => {
          this.ngx.success("marca registrada com sucesso")
        },
        (error: any) => {
        this.ngx.error(error.erro)
        });
    } else {
      this.entityForm.markAllAsTouched();
    }
  }
  
}
