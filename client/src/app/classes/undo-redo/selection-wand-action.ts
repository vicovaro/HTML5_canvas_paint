import { RGBA } from '@app/classes/rgba';
import { SelectionImage } from '@app/classes/selection';
import { AbsUndoRedo } from '@app/classes/undo-redo/abs-undo-redo';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MagicWandService } from '@app/services/tools/selection-service/magic-wand.service';

export class SelectionWandAction extends AbsUndoRedo {
    private selection: SelectionImage;
    constructor(
        private selectionService: MagicWandService,
        private drawingService: DrawingService,
        selection: SelectionImage,
        private originalColor: RGBA,
    ) {
        super();
        this.selection = new SelectionImage(this.drawingService);
        this.selection.copyImageInitialPos = { x: selection.copyImageInitialPos.x, y: selection.copyImageInitialPos.y };
        this.selection.imagePosition = { x: selection.imagePosition.x, y: selection.imagePosition.y };
        this.selection.endingPos = { x: selection.endingPos.x, y: selection.endingPos.y };
        this.selection.imageSize = { x: selection.imageSize.x, y: selection.imageSize.y };
        this.selection.width = selection.width;
        this.selection.height = selection.height;
        this.selection.imageData = selection.imageData;
        this.selection.image = new Image();
        this.selection.image.src = selection.image.src;
        this.selection.rotationAngle = selection.rotationAngle;
    }

    apply(): void {
        this.selectionService.selection.width = this.selection.width;
        this.selectionService.selection.height = this.selection.height;
        this.selectionService.originalColor = this.originalColor;
        this.selectionService.selection.copyImageInitialPos = this.selection.copyImageInitialPos;
        this.selectionService.selection.imagePosition = this.selection.imagePosition;
        this.selectionService.selection.rotationAngle = this.selection.rotationAngle;
        this.selectionService.clearSelectionWand(this.selection.copyImageInitialPos, this.originalColor);
        this.selectionService.pasteSelection(this.selection);
    }
}
