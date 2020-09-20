import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolService } from '@app/services/tool-service';

// TODO : Avoir un fichier séparé pour les constantes ?
export const DEFAULT_WIDTH = window.innerWidth / 2;
export const DEFAULT_HEIGHT = window.innerHeight / 2;
const sizeSidebar = 200;
const minSizeWindow = 500;
const minSizeCanvas = 250;

@Component({
    selector: 'app-drawing',
    templateUrl: './drawing.component.html',
    styleUrls: ['./drawing.component.scss'],
})
export class DrawingComponent implements AfterViewInit {
    @ViewChild('baseCanvas', { static: false }) baseCanvas: ElementRef<HTMLCanvasElement>;
    // On utilise ce canvas pour dessiner sans affecter le dessin final
    @ViewChild('previewCanvas', { static: false }) previewCanvas: ElementRef<HTMLCanvasElement>;

    private baseCtx: CanvasRenderingContext2D;
    private previewCtx: CanvasRenderingContext2D;
    private canvasSize: Vec2 = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT };

    constructor(private drawingService: DrawingService, private toolService: ToolService) {}

    ngAfterViewInit(): void {
        this.baseCtx = this.baseCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.previewCtx = this.previewCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.drawingService.baseCtx = this.baseCtx;
        this.drawingService.previewCtx = this.previewCtx;
        this.drawingService.canvas = this.baseCanvas.nativeElement;
    }

    @HostListener('mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        this.toolService.currentTool.onMouseMove(event);
    }

    @HostListener('mousedown', ['$event'])
    onMouseDown(event: MouseEvent): void {
        this.toolService.currentTool.onMouseDown(event);
    }

    @HostListener('mouseup', ['$event'])
    onMouseUp(event: MouseEvent): void {
        this.toolService.currentTool.onMouseUp(event);
    }

    @HostListener('window:keydown.shift', ['$event'])
    onKeyShiftDown(event: KeyboardEvent): void {
        this.toolService.currentTool.OnShiftKeyDown(event);
    }

    @HostListener('window:keyup.shift', ['$event'])
    onKeyShiftUp(event: KeyboardEvent): void {
        this.toolService.currentTool.OnShiftKeyUp(event);
    }

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: Event): void {
        if (window.innerWidth <= minSizeWindow && window.innerHeight <= minSizeWindow) {
            this.canvasSize.x = minSizeCanvas;
            this.canvasSize.y = minSizeCanvas;
        } else {
            // Might be made responsive
            this.canvasSize.x = DEFAULT_WIDTH - sizeSidebar;
            this.canvasSize.y = DEFAULT_HEIGHT;
        }
    }
}
