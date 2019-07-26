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
import { UserService } from './User.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-user',
  templateUrl: './User.component.html',
  styleUrls: ['./User.component.css'],
  providers: [UserService]
})
export class UserComponent implements OnInit {

  myForm: FormGroup;

  private allParticipants;
  private participant;
  private currentId;
  private errorMessage;

  userID = new FormControl('', Validators.required);
  firstName = new FormControl('', Validators.required);
  lastName = new FormControl('', Validators.required);
  fruit = new FormControl('', Validators.required);
  vegetable = new FormControl('', Validators.required);
  cash = new FormControl('', Validators.required);
  reward = new FormControl('', Validators.required);


  constructor(public serviceUser: UserService, fb: FormBuilder) {
    this.myForm = fb.group({
      userID: this.userID,
      firstName: this.firstName,
      lastName: this.lastName,
      fruit: this.fruit,
      vegetable: this.vegetable,
      cash: this.cash,
      reward: this.reward
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceUser.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(participant => {
        tempList.push(participant);
      });
      this.allParticipants = tempList;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
        this.errorMessage = error;
      }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the participant field to update
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
   * only). This is used for checkboxes in the participant updateDialog.
   * @param {String} name - the name of the participant field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified participant field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addParticipant(form: any): Promise<any> {
    this.participant = {
      $class: 'org.diet.network.User',
      'userID': this.userID.value,
      'firstName': this.firstName.value,
      'lastName': this.lastName.value,
      'fruit': this.fruit.value,
      'vegetable': this.vegetable.value,
      'cash': this.cash.value,
      'reward': this.reward.value
    };

    this.myForm.setValue({
      'userID': null,
      'firstName': null,
      'lastName': null,
      'fruit': null,
      'vegetable': null,
      'cash': null,
      'reward': null
    });

    return this.serviceUser.addParticipant(this.participant)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'userID': null,
        'firstName': null,
        'lastName': null,
        'fruit': null,
        'vegetable': null,
        'cash': null,
        'reward': null
      });
      this.loadAll(); 
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
        this.errorMessage = error;
      }
    });
  }


   updateParticipant(form: any): Promise<any> {
    this.participant = {
      $class: 'org.diet.network.User',
      'firstName': this.firstName.value,
      'lastName': this.lastName.value,
      'fruit': this.fruit.value,
      'vegetable': this.vegetable.value,
      'cash': this.cash.value,
      'reward': this.reward.value
    };

    return this.serviceUser.updateParticipant(form.get('userID').value, this.participant)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
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


  deleteParticipant(): Promise<any> {

    return this.serviceUser.deleteParticipant(this.currentId)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
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

    return this.serviceUser.getparticipant(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'userID': null,
        'firstName': null,
        'lastName': null,
        'fruit': null,
        'vegetable': null,
        'cash': null,
        'reward': null
      };

      if (result.userID) {
        formObject.userID = result.userID;
      } else {
        formObject.userID = null;
      }

      if (result.firstName) {
        formObject.firstName = result.firstName;
      } else {
        formObject.firstName = null;
      }

      if (result.lastName) {
        formObject.lastName = result.lastName;
      } else {
        formObject.lastName = null;
      }

      if (result.fruit) {
        formObject.fruit = result.fruit;
      } else {
        formObject.fruit = null;
      }

      if (result.vegetable) {
        formObject.vegetable = result.vegetable;
      } else {
        formObject.vegetable = null;
      }

      if (result.cash) {
        formObject.cash = result.cash;
      } else {
        formObject.cash = null;
      }

      if (result.reward) {
        formObject.reward = result.reward;
      } else {
        formObject.reward = null;
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
      'userID': null,
      'firstName': null,
      'lastName': null,
      'fruit': null,
      'vegetable': null,
      'cash': null,
      'reward': null
    });
  }
}
