import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UndoRedoService {

constructor() { }

redo():void{}
undo():void{}

}
