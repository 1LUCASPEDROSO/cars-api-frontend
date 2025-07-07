import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ModelService } from '../../services/model.service';
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
import { Car } from '../../models/car';
import { CarService } from '../../services/car.service';
import { DatePipe } from '@angular/common';
import { GasType } from '../../models/gas-type';
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
    DatePipe
  ],
  templateUrl: './list-car.component.html',
  styleUrl: './list-car.component.scss'
})
export class ListCarComponent implements AfterViewInit{
  private modelService = inject(ModelService)
  private carService = inject(CarService)
  private router = inject(Router)
  private dialog = inject(MatDialog)
  private ngx = inject(ToastrService)
  modelMap: { [key: number]: string } = {}
  formName: string = "lista de Carros"
  entityPage: string = "/form-car"
  buttonTooltip: string = "Registrar um novo Carro"
  displayedColumns: string[] = ['id', 'registerDate','model_id','year','gas_type','num_doors','color','action']
  dataSource = new MatTableDataSource<Car>()

  @ViewChild(MatPaginator)
  paginator: MatPaginator = new MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort = new MatSort;
  gasTypeOptions: any

  ngAfterViewInit(): void {
   this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  ngOnInit(){
    this.loadData()
    this.getAllGasType()
  }
  getAllGasType(){
       this.gasTypeOptions = Object.keys(GasType)
            .filter(key => isNaN(Number(key)))
            .map(key => ({
              label: key,
              value: GasType[key as keyof typeof GasType]
            }));
    }
  getGasTypeLabel(value: number): string {
  const option = this.gasTypeOptions.find((opt: { value: number; }) => opt.value === value);
  return option ? option.label : 'Desconhecido';
  }

  loadData(){
    this.modelService.getAllModels().subscribe(cars => {
    this.modelMap = cars.reduce((acc: any, model: any) => {
      acc[model.id] = model.name;
      return acc;
    }, {});
  });
    this.carService.getAllCars().subscribe(cars =>{
      this.dataSource.data = cars
      if(!cars){
        this.ngx.warning("sem dados disponiveis");
      }
    })
  }
  editCar(id: number){
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
        this.carService.deleteCar(id).subscribe(() => {
         this.ngx.success('carro excluída com sucesso!');
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
