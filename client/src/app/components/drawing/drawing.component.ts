import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { cursorName } from '@app/classes/cursor-name';
import { ResizeDirection } from '@app/classes/resize-direction';
import { CanvasResizerService } from '@app/services/canvas/canvas-resizer.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolService } from '@app/services/tool-service';

@Component({
    selector: 'app-drawing',
    templateUrl: './drawing.component.html',
    styleUrls: ['./drawing.component.scss'],
})
export class DrawingComponent implements AfterViewInit {
    constructor(private drawingService: DrawingService, private toolService: ToolService, public canvasResizerService: CanvasResizerService) {}

    get width(): number {
        return this.canvasResizerService.canvasSize.x;
    }

    get height(): number {
        return this.canvasResizerService.canvasSize.y;
    }

    get cursorUsed(): string {
        return this.drawingService.cursorUsed;
    }

    // On utilise ce canvas pour dessiner sans affecter le dessin final, aussi utilisé pour sauvegarder
    // une version du dessin avant de l'appliquer au final.
    @ViewChild('baseCanvas', { static: false }) baseCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('previewCanvas', { static: false }) previewCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('canvasResizingPreview', { static: false }) canvasResizingPreview: ElementRef<HTMLCanvasElement>;

    private baseCtx: CanvasRenderingContext2D;
    private previewCtx: CanvasRenderingContext2D;
    private resizeCtx: CanvasRenderingContext2D;

    ngAfterViewInit(): void {
        this.baseCtx = this.baseCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.previewCtx = this.previewCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.resizeCtx = this.canvasResizingPreview.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.drawingService.baseCtx = this.baseCtx;
        this.drawingService.previewCtx = this.previewCtx;
        this.drawingService.canvas = this.baseCanvas.nativeElement;
    }

    onMouseDown(event: MouseEvent): void {
        this.toolService.currentTool.onMouseDown(event);
    }

    onMouseMove(event: MouseEvent): void {
        this.toolService.currentTool.onMouseMove(event);
    }

    onMouseUp(event: MouseEvent): void {
        this.toolService.currentTool.onMouseUp(event);
    }

    onMouseOut(event: MouseEvent): void {
        this.toolService.currentTool.onMouseOut(event);
    }
    onMouseEnter(event: MouseEvent): void {
        this.toolService.currentTool.onMouseEnter(event);
    }

    onResizeDown(event: MouseEvent): void {
        const isVertical =
            this.canvasResizerService.canvasSize.y < event.offsetY &&
            event.offsetY < this.canvasResizerService.canvasSize.y + this.canvasResizerService.HOOK_THICKNESS;
        const isHorizontal =
            this.canvasResizerService.canvasSize.x < event.offsetX &&
            event.offsetX < this.canvasResizerService.canvasSize.x + this.canvasResizerService.HOOK_THICKNESS;

        if (isVertical && isHorizontal) {
            this.canvasResizerService.resizeCursor = cursorName.resizeVerticalAndHorizontal;
            this.canvasResizerService.onResizeDown(event, ResizeDirection.verticalAndHorizontal);
        } else if (isVertical) {
            this.canvasResizerService.resizeCursor = cursorName.resizeVertical;
            this.canvasResizerService.onResizeDown(event, ResizeDirection.vertical);
        } else if (isHorizontal) {
            this.canvasResizerService.resizeCursor = cursorName.resizeHorizontal;
            this.canvasResizerService.onResizeDown(event, ResizeDirection.horizontal);
        }
    }

    onResizeMove(event: MouseEvent): void {
        if (this.canvasResizerService.isResizeDown) {
            this.canvasResizerService.onResize(event, this.resizeCtx);
        } else {
            const isVertical =
                this.canvasResizerService.canvasSize.y < event.offsetY &&
                event.offsetY < this.canvasResizerService.canvasSize.y + this.canvasResizerService.HOOK_THICKNESS;
            const isHorizontal =
                this.canvasResizerService.canvasSize.x < event.offsetX &&
                event.offsetX < this.canvasResizerService.canvasSize.x + this.canvasResizerService.HOOK_THICKNESS;

            if (isVertical) {
                this.canvasResizerService.resizeCursor = cursorName.resizeVertical;
            }
            if (isVertical && isHorizontal) {
                this.canvasResizerService.resizeCursor = cursorName.resizeVerticalAndHorizontal;
            } else if (isVertical) {
                this.canvasResizerService.resizeCursor = cursorName.resizeVertical;
            } else if (isHorizontal) {
                this.canvasResizerService.resizeCursor = cursorName.resizeHorizontal;
            } else {
                this.canvasResizerService.resizeCursor = cursorName.default;
            }
        }
    }

    onResizeUp(event: MouseEvent): void {
        this.canvasResizerService.onResizeUp(event, this.resizeCtx, this.baseCanvas.nativeElement);
    }

    onResizeOut(event: MouseEvent): void {
        this.canvasResizerService.onResizeOut(event, this.resizeCtx, this.baseCanvas.nativeElement);
    }

    @HostListener('window:keydown.shift', ['$event'])
    onKeyShiftDown(event: KeyboardEvent): void {
        this.toolService.currentTool.OnShiftKeyDown(event);
    }

    @HostListener('window:keyup.shift', ['$event'])
    onKeyShiftUp(event: KeyboardEvent): void {
        this.toolService.currentTool.OnShiftKeyUp(event);
    }

    @HostListener('dblclick', ['$event'])
    onDoubleClick(event: MouseEvent): void {
        this.toolService.currentTool.onDoubleClick(event);
    }

    @HostListener('window:keydown.escape', ['$event'])
    onKeyEscape(event: KeyboardEvent): void {
        this.toolService.currentTool.onKeyEscape(event);
    }

    @HostListener('window:keydown.backspace', ['$event'])
    onKeyBackSpace(event: KeyboardEvent): void {
        this.toolService.currentTool.onKeyBackSpace(event);
    }

    @HostListener('window:resize')
    onWindowResize(): void {
        this.canvasResizerService.onWindowResize();
    }
}
