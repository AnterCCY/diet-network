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

import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs/Observable';
import { RewardsDec } from '../org.diet.network';

import { User } from '../org.diet.network';
import { Rewards } from '../org.diet.network';
import 'rxjs/Rx';

// Can be injected into a constructor
@Injectable()
export class RewardsDecService {

  private REWARDSDEC: string = 'RewardsDec';
  private USER: string = 'User';
  private REWARDS: string = 'Rewards';

  constructor(private dataService: DataService<RewardsDec>, private userService: DataService<User>, private rewardService: DataService<Rewards>) {
  };

  public getAll(): Observable<RewardsDec[]> {
    return this.dataService.getAll(this.REWARDSDEC);
}

// get all users
public getAllUsers(): Observable<User[]> {
  return this.userService.getAll(this.USER);
}

// get user by id
public getUser(id: any): Observable<User> {
  return this.userService.getSingle(this.USER, id);
}

// get reward by id
public getReward(id: any): Observable<Rewards> {
  return this.rewardService.getSingle(this.REWARDS, id);
}

public getTransaction(id: any): Observable<RewardsDec> {
  return this.dataService.getSingle(this.REWARDSDEC, id);
}

public addTransaction(itemToAdd: any): Observable<RewardsDec> {
  return this.dataService.add(this.REWARDSDEC, itemToAdd);
}

public updateTransaction(id: any, itemToUpdate: any): Observable<RewardsDec> {
  return this.dataService.update(this.REWARDSDEC, id, itemToUpdate);
}

public deleteTransaction(id: any): Observable<RewardsDec> {
  return this.dataService.delete(this.REWARDSDEC, id);
}

}

