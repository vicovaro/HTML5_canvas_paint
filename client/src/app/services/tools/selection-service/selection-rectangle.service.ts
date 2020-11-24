import { Injectable } from '@angular/core';
import { ControlPoint } from '@app/classes/control-points';
import { MouseButton } from '@app/classes/mouse-button';
import { SelectionRectAction } from '@app/classes/undo-redo/selection-rect-action';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { SelectionService } from './selection-service';

@Injectable({
    providedIn: 'root',
})
export class SelectionRectangleService extends SelectionService {
    constructor(drawingService: DrawingService, private undoRedoService: UndoRedoService) {
        super(drawingService);
    }

    onMouseDown(event: MouseEvent): void {
        this.clearEffectTool();
        this.drawingService.previewCtx.lineWidth = this.lineWidth;
        this.drawingService.previewCtx.strokeStyle = 'black';
        this.drawingService.previewCtx.fillStyle = 'black';

        this.mouseDown = event.button === MouseButton.Left;

        if (this.mouseDown) {
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.previousMousePos = this.getPositionFromMouse(event);

            // check if mouse is inside selection
            if (this.imagePosition && this.endingPos) {
                this.inSelection = this.isInsideSelection(this.mouseDownCoord);
            }

            // check if mouse is inside a control point
            if (!this.drawingService.isPreviewCanvasBlank()) {
                this.controlPoint = this.isInControlPoint(this.mouseDownCoord);
                console.log(this.controlPoint);
            }

            // for drawing preview
            if (this.drawingService.isPreviewCanvasBlank()) {
                this.imagePosition = this.mouseDownCoord;

                // for  pasting selection
            } else if (!this.inSelection && !this.drawingService.isPreviewCanvasBlank() && this.controlPoint === ControlPoint.none) {
                // paste image
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.pasteSelection(this.imagePosition, this.image);
                // undo redo
                const selectRectAc = new SelectionRectAction(
                    this.imagePosition,
                    this.imageData,
                    this.copyImageInitialPos,
                    Math.abs(this.width),
                    Math.abs(this.height),
                    this,
                );
                this.undoRedoService.addUndo(selectRectAc);
                this.undoRedoService.clearRedo();
                this.mouseMouvement = { x: 0, y: 0 };
                this.isAllSelect = false;
                this.endingPos = this.mouseDownCoord;
                this.imagePosition = this.mouseDownCoord;
            }
        }
    }

    onKeyEscape(event: KeyboardEvent): void {
        // paste image
        this.drawingService.clearCanvas(this.drawingService.previewCtx);

        // if the user is pressing escape while moving the selection
        if (
            this.mouseDown ||
            this.leftArrow.arrowPressed ||
            this.rightArrow.arrowPressed ||
            this.upArrow.arrowPressed ||
            this.downArrow.arrowPressed
        ) {
            this.imagePosition = { x: this.imagePosition.x + this.mouseMouvement.x, y: this.imagePosition.y + this.mouseMouvement.y };
        }
        // paste image
        this.pasteSelection(this.imagePosition, this.image);
        // undo redo
        const selectRectAc = new SelectionRectAction(
            this.imagePosition,
            this.imageData,
            this.copyImageInitialPos,
            Math.abs(this.width),
            Math.abs(this.height),
            this,
        );
        this.undoRedoService.addUndo(selectRectAc);
        this.undoRedoService.clearRedo();
        this.mouseMouvement = { x: 0, y: 0 };
        this.isAllSelect = false;
        this.endingPos = this.imagePosition = this.mouseDownCoord;

        this.mouseDown = false;
        if (this.downArrow.timerStarted) {
            this.downArrow.subscription.unsubscribe();
        }
        if (this.leftArrow.timerStarted) {
            this.leftArrow.subscription.unsubscribe();
        }
        if (this.rightArrow.timerStarted) {
            this.rightArrow.subscription.unsubscribe();
        }
        if (this.upArrow.timerStarted) {
            this.upArrow.subscription.unsubscribe();
        }
        if (this.timerStarted) {
            this.subscriptionTimer.unsubscribe();
        }
    }

    updateSelectionPositions(): Vec2 {
        const xSign = Math.sign(this.endingPos.x - this.imagePosition.x);
        const ySign = Math.sign(this.endingPos.y - this.imagePosition.y);
        const tmpEndPos = this.endingPos;

        if (this.shiftPressed) {
            if (xSign > 0 && ySign > 0) {
                this.endingPos = { x: this.imagePosition.x + this.width, y: this.imagePosition.y + this.height };
                return { x: this.imagePosition.x, y: this.imagePosition.y };
            } else if (xSign > 0 && ySign < 0) {
                this.endingPos = { x: this.imagePosition.x + this.width, y: this.imagePosition.y };
                return { x: this.imagePosition.x, y: this.imagePosition.y + this.height };
            } else if (xSign < 0 && ySign < 0) {
                this.endingPos = { x: this.imagePosition.x, y: this.imagePosition.y };
                return { x: this.imagePosition.x + this.width, y: this.imagePosition.y + this.height };
            } else {
                this.endingPos = { x: this.imagePosition.x, y: this.imagePosition.y + this.height };
                return { x: this.imagePosition.x + this.width, y: this.imagePosition.y };
            }
        } else {
            if (xSign > 0 && ySign > 0) {
                return { x: this.imagePosition.x, y: this.imagePosition.y };
            } else if (xSign > 0 && ySign < 0) {
                this.endingPos = { x: this.endingPos.x, y: this.imagePosition.y };
                return { x: this.imagePosition.x, y: tmpEndPos.y };
            } else if (xSign < 0 && ySign < 0) {
                this.endingPos = { x: this.imagePosition.x, y: this.imagePosition.y };
                return { x: tmpEndPos.x, y: tmpEndPos.y };
            } else {
                this.endingPos = { x: this.imagePosition.x, y: this.endingPos.y };
                return { x: tmpEndPos.x, y: this.imagePosition.y };
            }
        }
    }

    protected drawSelection(imagePosition: Vec2): void {
        this.drawingService.previewCtx.drawImage(this.image, imagePosition.x, imagePosition.y, this.width, this.height);
        this.drawSelectionRect(imagePosition, Math.abs(this.width), Math.abs(this.height));
    }

    pasteSelection(position: Vec2, image: HTMLImageElement): void {
        this.drawingService.baseCtx.drawImage(image, position.x, position.y, this.width, this.height);
    }

    protected drawPreview(): void {
        this.drawPreviewRect(this.drawingService.previewCtx, this.shiftPressed);
    }

    clearSelection(position: Vec2, width: number, height: number): void {
        this.drawingService.baseCtx.fillStyle = 'white';
        this.drawingService.baseCtx.fillRect(position.x, position.y, width, height);
    }

    onLeftArrowUp(): void {
        if (!this.drawingService.isPreviewCanvasBlank()) {
            this.leftArrow.arrowPressed = false;
            this.resetTimer();
            if (this.leftArrow.timerStarted) {
                this.leftArrow.subscription.unsubscribe();
            }

            // changing image position
            this.imagePosition = { x: this.imagePosition.x + this.mouseMouvement.x, y: this.imagePosition.y + this.mouseMouvement.y };
            // this.startingPos = { x: this.startingPos.x + this.mouseMouvement.x, y: this.startingPos.y + this.mouseMouvement.y };
            this.endingPos = { x: this.endingPos.x + this.mouseMouvement.x, y: this.endingPos.y + this.mouseMouvement.y };

            this.mouseMouvement = { x: 0, y: 0 };
            this.leftArrow.timerStarted = false;
        }
    }

    onRightArrowUp(): void {
        if (!this.drawingService.isPreviewCanvasBlank()) {
            this.rightArrow.arrowPressed = false;
            this.resetTimer();
            if (this.rightArrow.timerStarted) {
                this.rightArrow.subscription.unsubscribe();
            }

            // changing image position
            this.imagePosition = { x: this.imagePosition.x + this.mouseMouvement.x, y: this.imagePosition.y + this.mouseMouvement.y };
            // this.startingPos = { x: this.startingPos.x + this.mouseMouvement.x, y: this.startingPos.y + this.mouseMouvement.y };
            this.endingPos = { x: this.endingPos.x + this.mouseMouvement.x, y: this.endingPos.y + this.mouseMouvement.y };

            this.mouseMouvement = { x: 0, y: 0 };
            this.rightArrow.timerStarted = false;
        }
    }

    onUpArrowUp(): void {
        if (!this.drawingService.isPreviewCanvasBlank()) {
            this.upArrow.arrowPressed = false;
            this.resetTimer();
            if (this.upArrow.timerStarted) {
                this.upArrow.subscription.unsubscribe();
            }

            // changing image position
            this.imagePosition = { x: this.imagePosition.x + this.mouseMouvement.x, y: this.imagePosition.y + this.mouseMouvement.y };
            // this.startingPos = { x: this.startingPos.x + this.mouseMouvement.x, y: this.startingPos.y + this.mouseMouvement.y };
            this.endingPos = { x: this.endingPos.x + this.mouseMouvement.x, y: this.endingPos.y + this.mouseMouvement.y };

            this.mouseMouvement = { x: 0, y: 0 };
            this.upArrow.timerStarted = false;
        }
    }

    onDownArrowUp(): void {
        if (!this.drawingService.isPreviewCanvasBlank()) {
            this.downArrow.arrowPressed = false;
            this.resetTimer();
            if (this.downArrow.timerStarted) {
                this.downArrow.subscription.unsubscribe();
            }

            // changing image position
            this.imagePosition = { x: this.imagePosition.x + this.mouseMouvement.x, y: this.imagePosition.y + this.mouseMouvement.y };
            // this.startingPos = { x: this.startingPos.x + this.mouseMouvement.x, y: this.startingPos.y + this.mouseMouvement.y };
            this.endingPos = { x: this.endingPos.x + this.mouseMouvement.x, y: this.endingPos.y + this.mouseMouvement.y };

            this.mouseMouvement = { x: 0, y: 0 };
            this.downArrow.timerStarted = false;
        }
    }

    pasteImage(): void {
        if (!this.drawingService.isPreviewCanvasBlank()) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.pasteSelection(this.imagePosition, this.image);
        }
        this.cleared = true;
        this.imageData = this.clipboard.imageData;
        this.imagePosition = { x: 1, y: 1 };
        this.width = this.clipboard.width;
        this.height = this.clipboard.height;
        // this.startingPos = { x: 1, y: 1 };
        this.ellipseRad = { x: this.clipboard.ellipseRad.x, y: this.clipboard.ellipseRad.y };
        this.endingPos = { x: Math.abs(this.width), y: Math.abs(this.height) };
        this.image = new Image();
        this.image.src = this.getImageURL(this.clipboard.imageData, this.width, this.height);
        this.drawSelection({ x: 1, y: 1 });
    }
}
