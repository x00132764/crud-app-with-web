import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';

import {Todo} from './todo';

export interface Todo {
  id: number | string;
  created: number;
  title: string;
  complete: boolean;
}

@Injectable()
export class TodoService {
  private _todos: BehaviorSubject<Todo[]>;


  // Base URL of RESTful service 
  private baseUrl = 'http://5830716ebb8b3a120043b65b.mockapi.io';
  // private baseUrl = 'http://localhost:9000';

  // Define header content type
  private headers = new Headers({'Content-Type': 'application/json'});

  // This is where we will store our data in memory
  private dataStore: {
    todos: Todo[]
  };

  constructor(private http: Http) {
    this.dataStore = { todos: [] };

    // BehaviorSubject can recieve and emit new Todo lists.
    this._todos = <BehaviorSubject<Todo[]>>new BehaviorSubject([]);
  }

  get todos() {
    return this._todos.asObservable();
  }

  loadAll() {
    this.http.get(`${this.baseUrl}/todos`)
             .map(response => response.json()).subscribe(data => {
                this.dataStore.todos = data;
                this._todos.next(Object.assign({}, this.dataStore).todos);
              }, error => console.log('Could not load todos.'));
  }

  load(id: number | string) {
    this.http.get(`${this.baseUrl}/todos/${id}`)
             .map(response => response.json())
             .subscribe(data => {
                let notFound = true;
                this.dataStore.todos
                .forEach((item, index) => {
                    if (item.id === data.id) {
                        this.dataStore.todos[index] = data;
                        notFound = false;
                    }
                });

                if (notFound) {
                  this.dataStore.todos.push(data);
                }
                this._todos.next(Object.assign({}, this.dataStore).todos);

            }, error => console.log('Could not load todo.'));
  }

  create(todo: Todo) {
    console.log(JSON.stringify(todo));
    this.http.post(`${this.baseUrl}/todos`,
                      JSON.stringify(todo),
                      {headers: this.headers})
                      .map(response => response.json())
                      .subscribe(data => {
                          this.dataStore.todos.push(data);
                          this._todos.next(Object.assign({}, this.dataStore).todos);
                      }, error => console.log('Could not create todo.'));
  }

  toggleTodoComplete(todo: Todo) {
    this.http.put(`${this.baseUrl}/todos/${todo.id}`,
                    JSON.stringify(todo))
                    .map(response => response.json()).subscribe(data => {
                      this.dataStore.todos.forEach((t, i) => {
                        if (t.id === data.id) {
                          data.complete = !t.complete;
                          this.dataStore.todos[i] = data;
                        }
                      });
                      this._todos.next(Object.assign({}, this.dataStore).todos);
                    }, error => console.log('Could not update todo.'));
  }

  remove(todoId: number) {
    this.http.delete(`${this.baseUrl}/todos/${todoId}`)
                    .subscribe(response => {
                        this.dataStore.todos.forEach((t, i) => {
                          if (t.id === todoId) {
                            this.dataStore.todos.splice(i, 1); 
                          }
                        });
                        this._todos.next(Object.assign({},
                                    this.dataStore).todos);
                    }, error => console.log('Could not delete todo.'));
  }
}
