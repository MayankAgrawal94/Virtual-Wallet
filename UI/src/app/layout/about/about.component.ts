import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { WebsiteService } from '../../shared/service/website.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  CstmForm: FormGroup;
  CstmForm2: FormGroup;
  formType: string = 'add';
  walletData = {
    name: '',
    balance: 0,
    id: ''
  }
  constructor(
    private formbulider: FormBuilder,
    private webService:WebsiteService,
  ) { 

       this.CstmForm = this.formbulider.group({
        name: [null, [Validators.required]],
        balance: [null],
      });

      this.CstmForm2 = this.formbulider.group({
        amount: [null, [Validators.required]],
        type : [false],
        description: [null],
      });
  }

  ngOnInit() {

    this.checkWalletexists();
    // this.webService._product.subscribe(data=>{
    //   this.receivingData(data);
    // })
  }

  checkWalletexists(){
    if(localStorage['wallet_id']){
      this.formType = 'transation'
      this.webService._getWallet(localStorage['wallet_id'])
      .subscribe(response=>{
          // this.formType = 'transation'
          this.walletData['name'] = response.name
          this.walletData['id'] = response._id
          this.walletData['balance'] = response.balance
      })
    }
  }

  receivingData(data){
      // console.log(data)  
    if(data.type == 'edit'){
      this.formType = 'edit'
      this.CstmForm.controls['name'].setValue(data.body.name)
      this.CstmForm.controls['description'].setValue(data.body.description)
      this.CstmForm.controls['quatity'].setValue(data.body.quatity)
    }else if(data.type == 'delete'){
      this.onCancel();
    }
  }

  onCancel(){
    this.CstmForm.reset();
    this.CstmForm2.reset();
  }

  onSubmit(){
    if(!this.CstmForm.valid){
      this.webService.openSnackBar('Something went wrong, please try after some time.', 'Error!', 2000);
      return;
    }
    if(this.formType == 'add'){
      this.webService.__createNewWallet(this.CstmForm.value)
      .subscribe(response=>{
        // console.log(response)
        if(response){
          // this.onCancel();
          this.formType = 'transation'
          this.walletData['name'] = response.name
          this.walletData['id'] = response.id
          this.walletData['balance'] = response.balance
          localStorage.setItem('wallet_id', response.id);
          this.webService.openSnackBar( 'Wallet is created!', 'Success!', 2000); 
        }
      },err=>{
        console.log(err)
        this.webService.openSnackBar('Server encountered with some error, please try after some time.', 'Error!', 2000);
      })
    }
  }

  onCreateTrans(values){
    if(!this.CstmForm2.valid){
      this.webService.openSnackBar('Something went wrong, please try after some time.', 'Error!', 2000);
      return;
    }
    const sendObj = {
      amount: !values.type ? Math.abs(values.amount) : - Math.abs(values.amount),
      description: values.description
    }
    // console.log(sendObj)

    this.webService.__createTransact(this.walletData['id'], sendObj)
    .subscribe(response=>{
      if(response){
        this.walletData['balance'] = response['balance']
        this.CstmForm2.reset();
        this.webService.openSnackBar( 'Transaction is created!', 'Success!', 2000); 
      }
    },err=>{
      console.log(err)
      this.webService.openSnackBar('Server encountered with some error, please try after some time.', 'Error!', 2000);
    })

  }

}

