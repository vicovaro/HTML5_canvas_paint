import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CarrouselPictureComponent } from '@app/components/dialog-carrousel-picture/dialog-carrousel-picture.component';
import { DialogCreateNewDrawingComponent } from '@app/components/dialog-create-new-drawing/dialog-create-new-drawing.component';
import { WriteTextDialogUserGuideComponent } from '@app/components/write-text-dialog-user-guide/write-text-dialog-user-guide.component';
import { AutomaticSaveService } from '@app/services/automatic-save/automatic-save.service';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent {
    isDialogOpenSaveEport: boolean = false;
    onGoingDrawing: boolean;
    newDrawingRef: MatDialogRef<DialogCreateNewDrawingComponent>;
    dialogLoadRef: MatDialogRef<CarrouselPictureComponent>;
    checkDocumentationRef: MatDialogRef<WriteTextDialogUserGuideComponent>;
    constructor(public dialogCreator: MatDialog, private router: Router, private automaticSaveService: AutomaticSaveService) {
        this.onGoingDrawing = this.automaticSaveService.check();
    }

    createNewDrawing(): void {
        this.newDrawingRef = this.dialogCreator.open(DialogCreateNewDrawingComponent, {
            data: { message: 'Créer un nouveau dessin' },
        });
    }

    isThereExistingDrawing(): boolean {
        return this.isDialogOpenSaveEport;
    }

    openCarrousel(): void {
        if (!this.isDialogOpenSaveEport) {
            this.isDialogOpenSaveEport = true;
            this.dialogLoadRef = this.dialogCreator.open(CarrouselPictureComponent, {
                width: '90%',
                height: '90%',
            });
            this.dialogLoadRef.afterClosed().subscribe(() => {
                this.isDialogOpenSaveEport = false;
            });
        }
    }
    openUserGuide(): void {
        this.checkDocumentationRef = this.dialogCreator.open(WriteTextDialogUserGuideComponent, {
            width: '90%',
            height: '100%',
        });
    }
    continueDrawing(): void {
        this.automaticSaveService.getUpload();
        this.router.navigate(['/editor']);
    }
}
