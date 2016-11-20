export class Todo {
  id: number | string;
  createdAt: any;
  title: string = '';
  complete: boolean = false;

  constructor(values: Object = {}) {
    // Object.assign(this, values);
    (<any>Object).assign(this, values);
  }
}