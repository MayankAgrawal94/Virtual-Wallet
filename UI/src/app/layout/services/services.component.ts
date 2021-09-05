import {Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { WebsiteService } from '../../shared/service/website.service';
// import * as io from "socket.io-client";
import {environment} from '../../../environments/environment.prod';
import { ExportToCsv } from 'export-to-csv';

export interface StockData {
  amount: number;
  description: string;
  type: string;
  balance: number;
  date: string;
}

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {
  displayedColumns: string[] = [ 'amount', 'type', 'balance', 'description', 'date' ];
  dataSource: MatTableDataSource<StockData>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  
  serviceData:any;

  walletId = null

  pageEvent: PageEvent;
  Page: number=0;
  Size: number=5;
  recordCount: number;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  constructor(
    private webService:WebsiteService,
  ) { 
    this.serviceData = {}
    this.serviceData.tableList = []
    if(localStorage['wallet_id']){
      this.walletId = localStorage['wallet_id']
    }
  }

  ngOnInit() {
    this._getTableRecordCount();
    this.reloadData();
    
    // this.socket.emit('stock_update', {})

    // this.socket.on('stock_update', (msg: any) => {
    //   this.UpdateStock(msg)
    // })
    // this.downloadCSV();

  }

  updateTable(){
    this.dataSource = new MatTableDataSource(this.serviceData.tableList);
    // this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  _getTableRecordCount(){
    this.webService._getTransactionCount(this.walletId).subscribe(res => {
      this.recordCount = Number(res.count);
    },err=>{
      console.log(err)
    });
  }

  _getTableData(){
    this.webService._getTransaction(this.walletId, this.Page*this.Size, this.Size)
    .subscribe(res=>{
      // console.log(res)
      if(res.length && res.length > 0){
        this.serviceData.tableList = res
        this.updateTable();
      }
    },err=>{
      console.log(err)
      this.webService.openSnackBar('Server encountered with some error, please try after some time.', 'Error!', 2000);
    })
  }

  pageNavigations(event){
    // console.log(event);
    this.Page = event.pageIndex;
    this.Size = event.pageSize;
    this.reloadData();
    return event;
  }

  reloadData() {
    this._getTableData()
  }

  downloadCSV(){
    if(this.recordCount <= 0){
      this.webService.openSnackBar('Nothing for download!', 'Oops!', 2000);
      return;
    }
    this.webService._getTransaction(this.walletId, 0, this.recordCount)
    .subscribe(reponse=>{
      // console.log(reponse)
      if(reponse.length && reponse.length > 0){
        this._exportingCSV(reponse);
      }else{
        this.webService.openSnackBar('Nothing for download!', 'Oops!', 2000);
      }
    },err=>{
      console.log(err)
      this.webService.openSnackBar('Server encountered with some error, please try after some time.', 'Error!', 2000);
    })
  }

  _exportingCSV(rawData){

    var data = []

    rawData.forEach( loopData => {
      data.push({
        Amount: loopData.amount,
        Type: loopData.type,
        Balance: loopData.balance,
        Description: loopData.description ? loopData.description :'N/A',
        Date: new Date(loopData.date).toLocaleString("en-US", {timeZone: 'Asia/Kolkata'})
      })
    })
    const options = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true, 
      showTitle: false,
      // title: 'My Awesome CSV',
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
      // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
    };
 
    const csvExporter = new ExportToCsv(options);
     
    csvExporter.generateCsv(data);
  }

  ngOnDestroy() {
  }

}