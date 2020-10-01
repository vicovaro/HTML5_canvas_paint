import { Injectable } from '@angular/core';
import { MouseButton } from '@app/classes/mouse-button';
import { SubToolselected } from '@app/classes/sub-tool-selected';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class EllipseService extends Tool {
    lineWidth: number = 2;
    fillColor: string = '#ffb366';
    strokeColor: string = '#00ccff';
    strokeRectColor: string = '#000000';
    lineRectwidth: number = 1;
    circle: boolean = false;
    mousePosition: Vec2;
    dottedLineWidth: number = 2;
    dottedSpace: number = 10;
    debug: number = 0;

    constructor(drawingService: DrawingService) {
        super(drawingService);
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        this.drawingService.baseCtx.lineWidth = this.dottedLineWidth;
        this.drawingService.previewCtx.lineWidth = this.dottedLineWidth;
        if (this.mouseDown) {
            this.mouseDownCoord = this.getPositionFromMouse(event);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.mousePosition = mousePosition;
            this.selectEllipse(mousePosition, true);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
        }
        this.mouseDown = false;
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.mousePosition = mousePosition;

            // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.selectEllipse(mousePosition, false);
        }
    }

    OnShiftKeyDown(event: KeyboardEvent): void {
        this.circle = true;
        if (this.mouseDown) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.selectEllipse(this.mousePosition, false);
        }
    }

    OnShiftKeyUp(event: KeyboardEvent): void {
        this.circle = false;
        if (this.mouseDown) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.selectEllipse(this.mousePosition, false);
        }
    }

    selectEllipse(mousePosition: Vec2, base: boolean): void {
        if (base) {
            switch (this.subToolSelect) {
                case SubToolselected.tool1: {
                    this.drawFillEllipse(this.drawingService.baseCtx, this.mouseDownCoord, mousePosition, this.fillColor);
                    break;
                }

                case SubToolselected.tool2: {
                    this.drawEllipseOutline(this.drawingService.baseCtx, this.mouseDownCoord, mousePosition, this.lineWidth, this.strokeColor);
                    break;
                }

                case SubToolselected.tool3: {
                    this.drawFillEllipseOutline(
                        this.drawingService.baseCtx,
                        this.mouseDownCoord,
                        mousePosition,
                        this.lineWidth,
                        this.fillColor,
                        this.strokeColor,
                    );
                    break;
                }
            }
        } else {
            switch (this.subToolSelect) {
                case SubToolselected.tool1:
                    this.drawFillEllipse(this.drawingService.previewCtx, this.mouseDownCoord, mousePosition, this.fillColor);
                    break;

                case SubToolselected.tool2:
                    this.drawEllipseOutline(this.drawingService.previewCtx, this.mouseDownCoord, mousePosition, this.lineWidth, this.strokeColor);
                    break;

                case SubToolselected.tool3:
                    this.drawFillEllipseOutline(
                        this.drawingService.previewCtx,
                        this.mouseDownCoord,
                        mousePosition,
                        this.lineWidth,
                        this.fillColor,
                        this.strokeColor,
                    );
                    break;
            }
        }
    }

    // draw a basic ellipse + circle if shift pressed
    private drawEllipse(ctx: CanvasRenderingContext2D, radiusX: number, radiusY: number): void {
        let centerX = 0;
        let centerY = 0;
        centerX = this.mouseDownCoord.x + radiusX;
        centerY = this.mouseDownCoord.y + radiusY;
        if (this.circle) {
            ctx.ellipse(
                centerX,
                centerY,
                Math.min(Math.abs(radiusX), Math.abs(radiusY)),
                Math.min(Math.abs(radiusX), Math.abs(radiusY)),
                0,
                0,
                2 * Math.PI,
            );
        } else {
            ctx.ellipse(centerX, centerY, Math.abs(radiusX), Math.abs(radiusY), 0, 0, 2 * Math.PI);
        }
    }

    drawFillEllipse(ctx: CanvasRenderingContext2D, mouseDownPos: Vec2, mouseUpPos: Vec2, fillColor: string): void {
        this.drawingService.previewCtx.beginPath();
        this.drawingService.baseCtx.beginPath();
        const height = mouseUpPos.y - mouseDownPos.y;
        const width = mouseUpPos.x - mouseDownPos.x;
        ctx.fillStyle = fillColor;
        ctx.strokeStyle = this.strokeRectColor;
        ctx.setLineDash([this.dottedSpace, this.dottedSpace]);
        this.drawEllipse(ctx, width / 2, height / 2);
        ctx.fill();
        if (this.drawingService.previewCtx === ctx) {
            ctx.strokeRect(mouseDownPos.x, mouseDownPos.y, width, height);
        }
    }

    drawEllipseOutline(ctx: CanvasRenderingContext2D, mouseDownPos: Vec2, mouseUpPos: Vec2, lineWidth: number, strokeColor: string): void {
        this.drawingService.baseCtx.beginPath();
        this.drawingService.previewCtx.beginPath();
        const height = mouseUpPos.y - mouseDownPos.y;
        const width = mouseUpPos.x - mouseDownPos.x;
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = strokeColor;
        ctx.setLineDash([0, 0]);
        this.drawEllipse(ctx, width / 2, height / 2);
        ctx.stroke();

        ctx.beginPath(); // Define new path for outlined rectangle

        ctx.strokeStyle = this.strokeRectColor;
        ctx.lineWidth = this.lineRectwidth;
        ctx.setLineDash([this.dottedSpace, this.dottedSpace]);
        this.drawPreviewRect(ctx, mouseDownPos, mouseUpPos, lineWidth, height, width);
    }

    drawFillEllipseOutline(
        ctx: CanvasRenderingContext2D,
        mouseDownPos: Vec2,
        mouseUpPos: Vec2,
        lineWidth: number,
        fillColor: string,
        strokeColor: string,
    ): void {
        ctx.fillStyle = fillColor;
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = lineWidth;
        this.drawingService.previewCtx.beginPath();
        this.drawingService.baseCtx.beginPath();
        const height = mouseUpPos.y - mouseDownPos.y;
        const width = mouseUpPos.x - mouseDownPos.x;
        ctx.setLineDash([0, 0]);

        this.drawEllipse(ctx, width / 2, height / 2);
        ctx.stroke();
        ctx.fill();

        ctx.beginPath(); // Define new path for outlined rectangle

        ctx.strokeStyle = this.strokeRectColor;
        ctx.lineWidth = this.lineRectwidth;
        ctx.setLineDash([this.dottedSpace, this.dottedSpace]);
        this.drawPreviewRect(ctx, mouseDownPos, mouseUpPos, lineWidth, height, width);
    }
    clearPreviewCtx(): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }
    drawPreviewRect(ctx: CanvasRenderingContext2D, mouseDownPos: Vec2, mousePosition: Vec2, lineWidth: number, height: number, width: number): void {
        if (this.drawingService.previewCtx === ctx) {
            if (mousePosition.x > mouseDownPos.x && mousePosition.y > mouseDownPos.y) {
                ctx.strokeRect(mouseDownPos.x - lineWidth / 2, mouseDownPos.y - lineWidth / 2, width + lineWidth, height + lineWidth);
            } else if (mousePosition.x < mouseDownPos.x && mousePosition.y < mouseDownPos.y) {
                ctx.strokeRect(mouseDownPos.x + lineWidth / 2, mouseDownPos.y + lineWidth / 2, width - lineWidth, height - lineWidth);
            } else if (mousePosition.x > mouseDownPos.x && mousePosition.y < mouseDownPos.y) {
                ctx.strokeRect(mouseDownPos.x - lineWidth / 2, mouseDownPos.y + lineWidth / 2, width + lineWidth, height - lineWidth);
            } else if (mousePosition.x < mouseDownPos.x && mousePosition.y > mouseDownPos.y) {
                ctx.strokeRect(mouseDownPos.x + lineWidth / 2, mouseDownPos.y - lineWidth / 2, width - lineWidth, height + lineWidth);
            }
        }
    }
}
