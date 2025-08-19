import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressBarModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent{
  entityForm: FormGroup;
  authService = inject(AuthService)
  router = inject(Router)
  toastr = inject(ToastrService);
  formName: string = "Login"

    constructor(private fb: FormBuilder) {
    this.entityForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  

  login() {
    if (this.entityForm.valid)
    {
      this.authService.login(this.entityForm.value).subscribe({
        next: (res) => {
          this.router.navigate(['/list-brand'])
        },
        error: (error) => {
          //this.toastr.error(error.error || error.message);
          this.toastr.error("Erro ao realizar login, email ou senha incorretos")
        },
      })
    }
  }
}
