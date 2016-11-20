import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';

import {Todo} from '../todo';
import {TodoService} from '../todo.service';

import {enableProdMode} from '@angular/core';
enableProdMode();

@Component({
  selector: 'app-todo-app',
  templateUrl: './todo-app.component.html',
  styleUrls: ['./todo-app.component.css'],
  providers: [TodoService]
})
export class TodoAppComponent implements OnInit {
  todos: Observable<Todo[]>;
  singleTodo$: Observable<Todo>;

  newTodo: Todo = new Todo();

  constructor(private todoService: TodoService) {
  }

  ngOnInit() {
    // Subscribe to the observable collection
    this.todos = this.todoService.todos;

    // subscribe to only one todo 
    this.singleTodo$ = this.todoService.todos
                           .map(todos => todos.find(item => item.id === '1'));

    // load all todos
    this.todoService.loadAll();
    // load only todo with id of '1'
    this.todoService.load('1');
  }

  addTodo() {
    this.newTodo.createdAt = new Date().toJSON();
    this.todoService.create(this.newTodo);
    this.newTodo = new Todo();
  }

  toggleTodoComplete(todo) {
    this.todoService.toggleTodoComplete(todo);
  }

  deleteTodo(todoId: number) {
    this.todoService.remove(todoId);
  }

}
