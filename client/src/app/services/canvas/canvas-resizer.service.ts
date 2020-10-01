import { Injectable } from '@angular/core';
import { cursorName } from '@app/classes/cursor-name';
import { MouseButton } from '@app/classes/mouse-button';
import { ResizeDirection } from '@app/classes/resize-direction';
import { Vec2 } from '@app/classes/vec2';

@Injectable({
    providedIn: 'root',
})
export class CanvasResizerService {
    MIN_CANVAS_SIZE: number = 250;
    WORK_AREA_PADDING_SIZE: number = 200;
    SIDEBAR_WIDTH: number = 226;
    ICON_WIDTH: number = 50;
    DEFAULT_WIDTH: number = (window.innerWidth - this.SIDEBAR_WIDTH - this.ICON_WIDTH) / 2;
    DEFAULT_HEIGHT: number = window.innerHeight / 2;

    canvasSize: Vec2 = { x: this.DEFAULT_WIDTH, y: this.DEFAULT_HEIGHT };

    isResizeDown: boolean = false;
    resizeDirection: ResizeDirection;
    resizeCursor: string = cursorName.default;

    resizeWidth: number = window.innerWidth - this.SIDEBAR_WIDTH - this.ICON_WIDTH;
    resizeHeight: number = window.innerHeight;

    RESIZE_DASH_SPACING: number = 10;
    RESIZE_DASH_THICKNESS: number = 1;

    // Resizer canvas index
    PRIORITY_INDEX: number = 10;
    NORMAL_INDEX: number = 1;
    resizerIndex: number = 1;

    // Resizer hook thickness
    HOOK_THICKNESS: number = 30;

    onWindowResize(): void {
        console.log('to be removed');
    }

    private clearCanvas(context: CanvasRenderingContext2D, dimension: Vec2): void {
        context.clearRect(0, 0, dimension.x, dimension.y);
    }

    onResizeDown(event: MouseEvent, resizeDirection: ResizeDirection): void {
        this.isResizeDown = event.button === MouseButton.Left;
        if (this.isResizeDown) {
            this.resizerIndex = this.PRIORITY_INDEX; // We now put the whole surface in the foregound.
            this.resizeDirection = resizeDirection;
            console.log(event.offsetX + ' ' + event.offsetY);
        }
    }

    onResize(event: MouseEvent, resizeCtx: CanvasRenderingContext2D): void {
        if (this.isResizeDown) {
            this.clearCanvas(resizeCtx, { x: this.resizeWidth, y: this.resizeHeight });
            resizeCtx.setLineDash([this.RESIZE_DASH_SPACING]);
            resizeCtx.strokeStyle = '#000000';
            resizeCtx.lineWidth = this.RESIZE_DASH_THICKNESS;
            switch (this.resizeDirection) {
                case ResizeDirection.vertical:
                    if (event.offsetY < this.MIN_CANVAS_SIZE) {
                        resizeCtx.strokeRect(0, 0, this.canvasSize.x, this.MIN_CANVAS_SIZE);
                    } else {
                        resizeCtx.strokeRect(0, 0, this.canvasSize.x, event.offsetY);
                    }
                    break;
                case ResizeDirection.horizontal:
                    if (event.offsetX < this.MIN_CANVAS_SIZE) {
                        resizeCtx.strokeRect(0, 0, this.MIN_CANVAS_SIZE, this.canvasSize.y);
                    } else {
                        resizeCtx.strokeRect(0, 0, event.offsetX, this.canvasSize.y);
                    }
                    break;
                case ResizeDirection.verticalAndHorizontal:
                    let rectWidth = 0;
                    let rectHeight = 0;
                    if (event.offsetY < this.MIN_CANVAS_SIZE) {
                        rectHeight = this.MIN_CANVAS_SIZE;
                    } else {
                        rectHeight = event.offsetY;
                    }
                    if (event.offsetX < this.MIN_CANVAS_SIZE) {
                        rectWidth = this.MIN_CANVAS_SIZE;
                    } else {
                        rectWidth = event.offsetX;
                    }
                    resizeCtx.strokeRect(0, 0, rectWidth, rectHeight);
                    break;
            }
        }
    }

    private changeCanvasY(event: MouseEvent): void {
        if (event.offsetY < this.MIN_CANVAS_SIZE) {
            this.canvasSize.y = this.MIN_CANVAS_SIZE;
        } else {
            this.canvasSize.y = event.offsetY;
        }
    }

    private changeCanvasX(event: MouseEvent): void {
        if (event.offsetX < this.MIN_CANVAS_SIZE) {
            this.canvasSize.x = this.MIN_CANVAS_SIZE;
        } else {
            this.canvasSize.x = event.offsetX;
        }
    }

    // The following reference has been used to preserver canvas image. The whitening is automatic.
    // https://stackoverflow.com/questions/8977369/drawing-png-to-a-canvas-element-not-showing-transparency
    onResizeUp(event: MouseEvent, resizeCtx: CanvasRenderingContext2D, baseCanvas: HTMLCanvasElement): void {
        console.log(event.offsetX + ' ' + event.offsetY);
        if (this.isResizeDown) {
            const originalImage = new Image();
            originalImage.src = baseCanvas.toDataURL('image/png', 1);
            switch (this.resizeDirection) {
                case ResizeDirection.vertical:
                    this.changeCanvasY(event);
                    break;
                case ResizeDirection.horizontal:
                    this.changeCanvasX(event);
                    break;
                case ResizeDirection.verticalAndHorizontal:
                    this.changeCanvasX(event);
                    this.changeCanvasY(event);
                    break;
            }
            const ctx = baseCanvas.getContext('2d') as CanvasRenderingContext2D;

            // onload because drawing an image depends on the condition that the originalImage is loaded.
            // Being asynchronous is keypart of web developement
            originalImage.onload = () => {
                ctx.drawImage(originalImage, 0, 0);
            };
        }
        this.clearCanvas(resizeCtx, { x: this.resizeWidth, y: this.resizeHeight });
        this.resizerIndex = this.NORMAL_INDEX;
        this.isResizeDown = false;
        this.resizeCursor = cursorName.default;
    }

    onResizeOut(event: MouseEvent, resizeCtx: CanvasRenderingContext2D, baseCanvas: HTMLCanvasElement): void {
        this.onResizeUp(event, resizeCtx, baseCanvas);
    }
}
