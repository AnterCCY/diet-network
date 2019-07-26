/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CashToVegetableService } from './CashToVegetable.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-cashtovegetable',
  templateUrl: './CashToVegetable.component.html',
  styleUrls: ['./CashToVegetable.component.css'],
  providers: [CashToVegetableService]
})
export class CashToVegetableComponent implements OnInit {

  myForm: FormGroup;

  private vegetablePerCash = 1;
  private vegetableRate = (1 / this.vegetablePerCash).toFixed(3);

  private vegetableWeightValue;
  private totalCash;

  private marketIsBuyer = false;

  private allTransactions;
  private Transaction;
  private currentId;
  private errorMessage;
  private successTransaction;

  private allBuyers;
  private allSellers;
  private allMarkets;

  private market;
  private user;
  private supplier;
  private transactionID;
  private transactionBuyerID;

  private cashNum;
  private buyerCashAsset;
  private buyerVegetableAsset;
  private sellerCashAsset;
  private sellerVegetableAsset;

  // buyerID = new FormControl('', Validators.required);
  // vegetableValue = new FormControl('', Validators.required);
  // cashRate = new FormControl('', Validators.required);
  // cashValue = new FormControl('', Validators.required);
  // vegetableInc = new FormControl('', Validators.required);
  // vegetableDec = new FormControl('', Validators.required);
  // cashInc = new FormControl('', Validators.required);
  // cashDec = new FormControl('', Validators.required);
  // transactionId = new FormControl('', Validators.required);
  // timestamp = new FormControl('', Validators.required);

  action = new FormControl('', Validators.required);
  formBuyerID = new FormControl('', Validators.required);
  formSellerID = new FormControl('', Validators.required);
  cashValue = new FormControl('', Validators.required);
  vegetableWeight = new FormControl('', Validators.required);

  constructor(private serviceCashToVegetable: CashToVegetableService, fb: FormBuilder) {
    this.myForm = fb.group({
      action: this.action,
      formBuyerID: this.formBuyerID,
      formSellerID: this.formSellerID,
      cashValue: this.cashValue,
      vegetableWeight: this.vegetableWeight

      // buyerID: this.buyerID,
      // vegetableValue: this.vegetableValue,
      // cashRate: this.cashRate,
      // cashValue: this.cashValue,
      // vegetableInc: this.vegetableInc,
      // vegetableDec: this.vegetableDec,
      // cashInc: this.cashInc,
      // cashDec: this.cashDec,
      // transactionId: this.transactionId,
      // timestamp: this.timestamp
    });
  };

  ngOnInit(): void {
    // this.myForm.get('action').value == "fromMarket";
  
    this.loadAllUsers();
    this.loadAllMarkets();
  
  
    this.myForm.get('action').valueChanges.subscribe(res=>{
        if (res=='fromMarket')
        {
          this.marketIsBuyer = false;
          this.allBuyers = null;
          this.allSellers = null;
          this.loadAllUsers()
          this.loadAllMarkets();
        }
    
        if (res=='fromSupplier')
        {
          this.marketIsBuyer = true;
          this.allBuyers = null;
          this.allSellers = null;
          this.loadAllMarkets()
          this.loadAllSuppliers();
        }
    });
  
      this.successTransaction = false;
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceCashToVegetable.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(transaction => {
        tempList.push(transaction);
      });
      this.allTransactions = tempList;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  // get all users
  loadAllUsers(): Promise<any> {

    //retrieve all users in the tempList array
    let tempList = [];

    // call serviceTransaction to get all users 
    return this.serviceCashToVegetable.getAllUsers()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;

      // add user into tempList
      result.forEach(user => {
        // if(user == "userID"){
        //   let buyerID = user;
        //   tempList.push(buyerID);
        // }
        tempList.push(user)
        console.log(user)
      });

      tempList.forEach(buyer => {
        buyer.buyerID = buyer.userID;
        delete buyer.userID;
      });

      this.allBuyers = tempList;
      console.log("users:"+this.allBuyers)
    })
    .catch((error) => {
      if(error == 'Server error'){
          this.errorMessage = "Could not connect to REST server. Please check your configuration details";
      }
      else if(error == '404 - Not Found'){
      this.errorMessage = "404 - Could not find API route. Please check your available APIs."
      }
      else{
          this.errorMessage = error;
      }
    });
  }

  loadAllMarkets(): Promise<any> {
    
    //retrieve all users in the tempList array
    let tempList = [];

    // call serviceTransaction to get all users 
    return this.serviceCashToVegetable.getAllMarkets()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;

      // add user into tempList
      result.forEach(market => {
        tempList.push(market)
      });

      if(this.marketIsBuyer){
        tempList.forEach(buyer => {
          buyer.buyerID = buyer.marketID;
          delete buyer.marketID;
        });
        this.allBuyers = tempList;
      }else{
        tempList.forEach(seller => {
          seller.sellerID = seller.marketID;
          delete seller.marketID;
        });
        this.allSellers = tempList;
      }
    })
    .catch((error) => {
      if(error == 'Server error'){
          this.errorMessage = "Could not connect to REST server. Please check your configuration details";
      }
      else if(error == '404 - Not Found'){
      this.errorMessage = "404 - Could not find API route. Please check your available APIs."
      }
      else{
          this.errorMessage = error;
      }
    });
  }

  loadAllSuppliers(): Promise<any> {

    //retrieve all users in the tempList array
    let tempList = [];

    // call serviceTransaction to get all users 
    return this.serviceCashToVegetable.getAllSuppliers()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;

      // add user into tempList
      result.forEach(supplier => {
        tempList.push(supplier)
      });

      tempList.forEach(seller => {
        seller.sellerID = seller.supplierID;
        delete seller.supplierID;
      });

      this.allSellers = tempList;
      console.log("suppliers:"+this.allSellers)
    })
    .catch((error) => {
      if(error == 'Server error'){
          this.errorMessage = "Could not connect to REST server. Please check your configuration details";
      }
      else if(error == '404 - Not Found'){
      this.errorMessage = "404 - Could not find API route. Please check your available APIs."
      }
      else{
          this.errorMessage = error;
      }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the transaction field to update
   * @param {any} value - the enumeration value for which to toggle the checked state
   */
  changeArrayValue(name: string, value: any): void {
    const index = this[name].value.indexOf(value);
    if (index === -1) {
      this[name].value.push(value);
    } else {
      this[name].value.splice(index, 1);
    }
  }

	/**
	 * Checkbox helper, determining whether an enumeration value should be selected or not (for array enumeration values
   * only). This is used for checkboxes in the transaction updateDialog.
   * @param {String} name - the name of the transaction field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified transaction field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addTransaction(form: any): Promise<any> {

    if(this.marketIsBuyer){
      for (let buyer of this.allBuyers) {
        if(buyer.buyerID == this.formBuyerID.value){
          this.market = buyer;
        }
      }
    }else{
      for (let seller of this.allSellers) {
        if(seller.sellerID == this.formSellerID.value){
          this.market = seller;
        }
      }
    }

    // get all users
    for (let buyer of this.allBuyers) {
      if(buyer.buyerID == this.formBuyerID.value) {
        this.user = buyer;
      }
    }

    // get all suppliers
    for (let seller of this.allSellers) {
      if(seller.sellerID == this.formSellerID.value) {
        this.supplier = seller;
      }
    }

    if(this.action.value == 'fromMarket') {

      // this.cashNum = this.cashValue.value;
      this.transactionBuyerID = "org.diet.network.User#" + this.formBuyerID.value;
      this.vegetableWeight = this.vegetableWeight.value;
      this.buyerCashAsset = this.user.cash;
      this.sellerCashAsset = this.market.cash;
      this.buyerVegetableAsset = this.user.vegetable;
      this.sellerVegetableAsset = this.market.vegetable;
    }
    else if (this.action.value == 'fromSupplier') {
  
      // this.cashNum = this.cashValue.value;
      this.transactionBuyerID = "org.diet.network.Market#" + this.formBuyerID.value;
      this.vegetableWeight = this.vegetableWeight.value;
      this.buyerCashAsset = this.market.cash;
      this.sellerCashAsset = this.supplier.cash;
      this.buyerVegetableAsset = this.market.vegetable;
      this.sellerVegetableAsset = this.supplier.vegetable;
    }

    console.log("buyerID:" + this.transactionBuyerID);

    // find out how much the seller owns according to cashID and appleID
    var splitted_cashID = this.buyerCashAsset.split("#", 2);
    var cashID = String(splitted_cashID[1]);
  
    var splitted_vegetableID = this.sellerVegetableAsset.split("#", 2);
    var vegetableID = String(splitted_vegetableID[1]);
  
    //calculate the total cash according to the apple weight
    this.totalCash = (this.vegetableWeightValue / this.vegetablePerCash);

    this.Transaction = {
      $class: 'org.diet.network.CashToFruit',
      'buyerID': this.transactionBuyerID,
      'fruitValue': this.vegetableWeight,
      'cashRate': this.vegetablePerCash,
      'cashValue': this.totalCash,
      'fruitInc': this.buyerVegetableAsset,
      'fruitDec': this.sellerVegetableAsset,
      'cashInc': this.sellerCashAsset,
      'cashDec': this.buyerCashAsset
    };

    // this.myForm.setValue({
    //   'buyerID': null,
    //   'fruitValue': null,
    //   'cashRate': null,
    //   'cashValue': null,
    //   'fruitInc': null,
    //   'fruitDec': null,
    //   'cashInc': null,
    //   'cashDec': null,
    //   'transactionId': null,
    //   'timestamp': null
    // });

    return this.sellerCashAsset.getCash(cashID)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      // check the buyer enough cash
      if(result.value) {
        if ((result.value - this.totalCash) < 0) {
          this.errorMessage = "Insufficient Cash!";
          return false;
        }
        return true;
      }
    
      // this.myForm.setValue({
      //   'buyerID': null,
      //   'fruitValue': null,
      //   'cashRate': null,
      //   'cashValue': null,
      //   'fruitInc': null,
      //   'fruitDec': null,
      //   'cashInc': null,
      //   'cashDec': null,
      //   'transactionId': null,
      //   'timestamp': null
      // });
    })
    .then((checkCash) => {
      // if positive on sufficient cash, then check if sufficent apple 
      if(checkCash){
        //call service to get vegetable 
        this.serviceCashToVegetable.getVegetable(vegetableID)
        .toPromise()
        .then((result) => {
          //check if enough vegetable
          if(result.value){
            if((result.value - this.vegetableWeight) < 0){
              this.errorMessage = "Insufficient Apples!";
              return false;
            }
            return true;
          }
        })
        .then((checkFruit) => {
          // if positive on sufficient apple, then call transaction 
          if(checkFruit){
            //call transaction
            this.serviceCashToVegetable.addTransaction(this.Transaction)
            .toPromise()
            .then((result) => {
              this.errorMessage = null;
              this.transactionID = result.transactionId;
              console.log(result)
            })
            .catch((error) => {
              if (error === 'Server error') {
                this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
              } else {
                this.errorMessage = error;
              }
            })
            .then(() => {
              this.successTransaction = true;
            })
          }
        })
      }
    });
  }

  updateTransaction(form: any): Promise<any> {
    // this.Transaction = {
    //   $class: 'org.diet.network.CashToVegetable',
    //   'buyerID': this.buyerID.value,
    //   'vegetableValue': this.vegetableValue.value,
    //   'cashRate': this.cashRate.value,
    //   'cashValue': this.cashValue.value,
    //   'vegetableInc': this.vegetableInc.value,
    //   'vegetableDec': this.vegetableDec.value,
    //   'cashInc': this.cashInc.value,
    //   'cashDec': this.cashDec.value,
    //   'timestamp': this.timestamp.value
    // };

    return this.serviceCashToVegetable.updateTransaction(form.get('transactionId').value, this.Transaction)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
      this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  deleteTransaction(): Promise<any> {

    return this.serviceCashToVegetable.deleteTransaction(this.currentId)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  setId(id: any): void {
    this.currentId = id;
  }

  getForm(id: any): Promise<any> {

    return this.serviceCashToVegetable.getTransaction(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'action': 'fromMarket',
        'buyerID': null,
        'vegetableValue': null,
        'cashRate': null,
        'cashValue': null,
        'vegetableInc': null,
        'vegetableDec': null,
        'cashInc': null,
        'cashDec': null,
        'transactionId': null,
        'timestamp': null
      };

      if (result.buyerID) {
        formObject.buyerID = result.buyerID;
      } else {
        formObject.buyerID = null;
      }

      if (result.vegetableValue) {
        formObject.vegetableValue = result.vegetableValue;
      } else {
        formObject.vegetableValue = null;
      }

      if (result.cashRate) {
        formObject.cashRate = result.cashRate;
      } else {
        formObject.cashRate = null;
      }

      if (result.cashValue) {
        formObject.cashValue = result.cashValue;
      } else {
        formObject.cashValue = null;
      }

      if (result.vegetableInc) {
        formObject.vegetableInc = result.vegetableInc;
      } else {
        formObject.vegetableInc = null;
      }

      if (result.vegetableDec) {
        formObject.vegetableDec = result.vegetableDec;
      } else {
        formObject.vegetableDec = null;
      }

      if (result.cashInc) {
        formObject.cashInc = result.cashInc;
      } else {
        formObject.cashInc = null;
      }

      if (result.cashDec) {
        formObject.cashDec = result.cashDec;
      } else {
        formObject.cashDec = null;
      }

      if (result.transactionId) {
        formObject.transactionId = result.transactionId;
      } else {
        formObject.transactionId = null;
      }

      if (result.timestamp) {
        formObject.timestamp = result.timestamp;
      } else {
        formObject.timestamp = null;
      }

      this.myForm.setValue(formObject);

    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
      this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  resetForm(): void {
    this.myForm.setValue({
      'action': 'fromMarket',
      'buyerID': null,
      'vegetableValue': null,
      'cashRate': null,
      'cashValue': null,
      'vegetableInc': null,
      'vegetableDec': null,
      'cashInc': null,
      'cashDec': null,
      'transactionId': null,
      'timestamp': null
    });
  }
}
