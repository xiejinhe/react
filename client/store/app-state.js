import { observable, computed, autorun, action } from 'mobx';

export class AppState {
  @observable conut = 0;
  @observable name = 'jocky';
  @computed get msg() {
    return `${this.name} say conut is ${this.conut}`;
  }
  @action add() {
    this.conut += 1;
  }
  @action changeName(name) {
    this.name = name;
  }
}


export default new AppState();
