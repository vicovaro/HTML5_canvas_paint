import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogCreateNewDrawingComponent } from 'src/app/components/dialog-create-new-drawing/dialog-create-new-drawing.component';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent {
    onGoingDrawing: boolean;

    constructor(public dialog: MatDialog) {
        this.onGoingDrawing = true;
    }

    createNewDrawing(): void {
        this.dialog.open(DialogCreateNewDrawingComponent, {});
    }

    continueDrawing(): void {
        alert('On continuera le dessin dans le Sprint 2.');
    }

    openCarousel(): void {
        alert('À continuer dans le Sprint 3.');
    }

    openDocumentation(): void {
        alert('La documentation est ouverte.');
    }
}
