import { Injectable } from '@angular/core';
import { MouseButton } from '@app/classes/mouse-button';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class EraserService extends Tool {
    private pathData: Vec2[];
    eraserWidth: number = 5;
    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.clearPath();
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.mouseMove = false;
            this.drawingService.baseCtx.strokeStyle = '#FFF'; // draw in white
            this.drawingService.previewCtx.strokeStyle = '#FFF'; // when changecolor is implemented call pencil weith white.
            this.drawingService.baseCtx.setLineDash([0, 0]); // reset
            this.drawingService.previewCtx.setLineDash([0, 0]); // reset
            this.drawingService.baseCtx.lineWidth = this.eraserWidth;
            this.drawingService.previewCtx.lineWidth = this.eraserWidth;
            this.drawingService.baseCtx.lineCap = 'butt';
            this.drawingService.baseCtx.lineJoin = 'bevel';
            this.drawingService.previewCtx.lineCap = 'butt';
            this.drawingService.previewCtx.lineJoin = 'bevel';
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.pathData.push(this.mouseDownCoord);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            if (this.mouseMove) {
                this.pathData.push(mousePosition);
                this.RemoveLine(this.drawingService.baseCtx, this.pathData);
            } else {
                // code to draw dot
                this.drawingService.baseCtx.fillStyle = '#FFF';
                this.drawingService.baseCtx.fillRect(mousePosition.x, mousePosition.y, this.eraserWidth, this.eraserWidth);
                this.drawingService.previewCtx.fillStyle = '#FFF';
                this.drawingService.previewCtx.fillRect(mousePosition.x, mousePosition.y, this.eraserWidth, this.eraserWidth);
            }
        }

        this.mouseDown = false;
        this.clearPath();
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            this.mouseMove = true;
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);

            // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.RemoveLine(this.drawingService.previewCtx, this.pathData);
        }
    }

    private RemoveLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.beginPath();
        for (const point of path) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
    }
    clearPath(): void {
        this.pathData = [];
    }
}