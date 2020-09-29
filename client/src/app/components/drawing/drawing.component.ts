import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { CanvasResizerService, ResizeDirection } from '@app/services/canvas/canvas-resizer.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolService } from '@app/services/tool-service';

@Component({
    selector: 'app-drawing',
    templateUrl: './drawing.component.html',
    styleUrls: ['./drawing.component.scss'],
})
export class DrawingComponent implements AfterViewInit {
    constructor(private drawingService: DrawingService, private toolService: ToolService, private canvasResizerService: CanvasResizerService) {}

    get width(): number {
        return this.canvasResizerService.canvasSize.x;
    }

    get workWidth(): number {
        return this.width + this.canvasResizerService.WORK_AREA_PADDING_SIZE;
    }

    get height(): number {
        return this.canvasResizerService.canvasSize.y;
    }

    get workHeight(): number {
        return this.height + this.canvasResizerService.WORK_AREA_PADDING_SIZE;
    }

    get cursorUsed(): string {
        return this.drawingService.cursorUsed;
    }

    get canvasPreviewWidth(): number {
        return window.innerWidth - this.canvasResizerService.SIDEBAR_WIDTH - this.canvasResizerService.ICON_WIDTH;
    }

    get canvasPreviewHeight(): number {
        return window.innerHeight;
    }
    get southRightHookShiftX(): number {
        return this.canvasResizerService.canvasSize.x - this.canvasResizerService.HOOK_HEIGHT;
    }

    get southRightHookShiftY(): number {
        return this.canvasResizerService.canvasSize.y - this.canvasResizerService.HOOK_HEIGHT;
    }

    get southMiddleHookX(): number {
        return this.canvasResizerService.canvasSize.x / 2.0 - this.canvasResizerService.HOOK_HEIGHT;
    }

    get eastMiddleHookY(): number {
        return this.canvasResizerService.canvasSize.y / 2.0 - this.canvasResizerService.HOOK_HEIGHT;
    }
    @ViewChild('baseCanvas', { static: false }) baseCanvas: ElementRef<HTMLCanvasElement>;
    // On utilise ce canvas pour dessiner sans affecter le dessin final, aussi utilisé pour sauvegarder
    // une version du dessin avant de l'appliquer au final.
    @ViewChild('previewCanvas', { static: false }) previewCanvas: ElementRef<HTMLCanvasElement>;

    private baseCtx: CanvasRenderingContext2D;
    private previewCtx: CanvasRenderingContext2D;

    ngAfterViewInit(): void {
        this.baseCtx = this.baseCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.previewCtx = this.previewCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
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

    onVerticalDown(event: MouseEvent): void {
        this.canvasResizerService.onVerticalDown(event);
    }

    onVerticalResize(event: MouseEvent): void {
        this.canvasResizerService.onResize(event, this.baseCanvas.nativeElement, ResizeDirection.vertical);
    }

    onVerticalUp(event: MouseEvent): void {
        this.canvasResizerService.onVerticalUp(event);
    }

    onVerticalOut(event: MouseEvent): void {
        this.canvasResizerService.onVerticalOut(event);
    }

    @HostListener('window:keydown.shift', ['$event'])
    onKeyShiftDown(event: KeyboardEvent): void {
        this.toolService.currentTool.OnShiftKeyDown(event);
    }

    @HostListener('window:keyup.shift', ['$event'])
    onKeyShiftUp(event: KeyboardEvent): void {
        this.toolService.currentTool.OnShiftKeyUp(event);
    }
}
