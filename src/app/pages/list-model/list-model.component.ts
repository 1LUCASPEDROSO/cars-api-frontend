import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Brand } from '../../models/brand';
import { ModelService } from '../../services/model.service';
import { BrandService } from '../../services/brand.service';
import { Router, RouterModule } from '@angular/router';
import { MatFormField } from '@angular/material/form-field';
import { MatTooltip } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationComponent } from '../../shared/confirmation/confirmation.component';
import { MatButtonModule } from '@angular/material/button';
import { ToastrService } from 'ngx-toastr';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import { CurrencyPipe } from '@angular/common';
@Component({
  selector: 'app-list-model',
  standalone: true,
  imports: [
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatFormField,
    MatTooltip,
    RouterModule,
    MatInputModule ,
    MatButtonModule,
    MatPaginatorModule,
    MatSortModule,
    CurrencyPipe
  ],
  templateUrl: './list-model.component.html',
  styleUrl: './list-model.component.scss'
})
export class ListModelComponent implements AfterViewInit{
  private modelService = inject(ModelService)
  private router = inject(Router)
  private dialog = inject(MatDialog)
  private ngx = inject(ToastrService)
  private brandService = inject(BrandService)
  brandsMap: { [key: number]: string } = {}
  formName: string = "lista de Modelos"
  entityPage: string = "/form-model"
  buttonTooltip: string = "Registrar um novo modelo"
  displayedColumns: string[] = ['id', 'name','fipe_value','brand_id','action']
  dataSource = new MatTableDataSource<Brand>()

  @ViewChild(MatPaginator)
  paginator: MatPaginator = new MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort = new MatSort;

  ngAfterViewInit(): void {
   this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  ngOnInit(){
    this.loadData()
  }

  loadData(){
    this.brandService.getAllBrands().subscribe(brands => {
    this.brandsMap = brands.reduce((acc: any, brand: any) => {
      acc[brand.id] = brand.name;
      return acc;
    }, {});
  });
    this.modelService.getAllmModels().subscribe(models =>{
      this.dataSource.data = models
      if(!models){
        this.ngx.warning("sem dados disponiveis");
      }
    })
  }
  editBrand(id: number){
    this.router.navigateByUrl(`${this.entityPage}/${id}`)
  }
  openConfirmation(id: number): void {
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      height: '180px',
      width: '300px',
      data: { id: id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.modelService.deleteModel(id).subscribe(() => {
         this.ngx.success('marca excluída com sucesso!');
          this.loadData();
        },
        (error: any) => {
          this.ngx.error(error.error)
        });
      }
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
