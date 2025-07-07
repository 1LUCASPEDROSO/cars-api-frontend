import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Brand } from '../../models/brand';
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
@Component({
  selector: 'app-list-brand',
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
    MatSortModule
  ],
  templateUrl: './list-brand.component.html',
  styleUrl: './list-brand.component.scss'
})
export class ListBrandComponent implements AfterViewInit{
  brandService = inject(BrandService)
  router = inject(Router);
  dialog = inject(MatDialog);
  ngx = inject(ToastrService)
  formName: string = "lista de marcas"
  entityPage: string = "/form-brand"
  buttonTooltip: string = "Registrar uma nova marca"
  displayedColumns: string[] = ['id', 'name','action']
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
    this.brandService.getAllBrands().subscribe(data =>{
      this.dataSource.data = data
      if(data == null){
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
        this.brandService.deleteBrand(id).subscribe(() => {
         this.ngx.success('marca excluída com sucesso!');
          this.loadData();
        },
        (error: any) => {
         // this.toastr.error(error.error)
         console.log(error.erro)
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
