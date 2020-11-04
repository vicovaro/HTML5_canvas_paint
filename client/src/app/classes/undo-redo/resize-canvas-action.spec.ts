import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { ResizeDirection } from '@app/classes/resize-direction';
import { ResizeCanvasAction } from '@app/classes/undo-redo/resize-canvas-action';
import { CanvasResizerService } from '@app/services/canvas/canvas-resizer.service';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

// tslint:disable:no-magic-numbers
describe('resizeCanvasAction', () => {
    let resizeActionStub: ResizeCanvasAction;
    let drawingStub: DrawingService;
    let colorStub: ColorService;
    let undoRedoStub: UndoRedoService;
    let resizeStub: CanvasResizerService;
    let event: MouseEvent;
    let resizeCtx: CanvasRenderingContext2D;
    let baseCanvas: HTMLCanvasElement;
    let resizeDirection: ResizeDirection;
    let baseStub: CanvasRenderingContext2D;
    let previewStub: CanvasRenderingContext2D;
    let canvas: HTMLCanvasElement;

    beforeEach(() => {
        event = {
            offsetX: 25,
            offsetY: 10,
        } as MouseEvent;

        resizeDirection = ResizeDirection.horizontal;
        drawingStub = new DrawingService();
        colorStub = new ColorService(drawingStub);
        undoRedoStub = new UndoRedoService(drawingStub);
        resizeStub = new CanvasResizerService(undoRedoStub);
        resizeActionStub = new ResizeCanvasAction(event, resizeCtx, baseCanvas, resizeDirection, resizeStub);
        canvas = canvasTestHelper.canvas;
        // tslint:disable:no-magic-numbers
        canvas.width = 100;
        // tslint:disable:no-magic-numbers
        canvas.height = 100;
        baseCanvas = canvasTestHelper.canvas;
        // tslint:disable:no-magic-numbers
        baseCanvas.width = 50;
        // tslint:disable:no-magic-numbers
        baseCanvas.height = 50;
        baseStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        resizeCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        drawingStub.canvas = canvas;
        drawingStub.baseCtx = baseStub;
        drawingStub.previewCtx = previewStub;

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawingStub },
                { provide: ColorService, useValue: colorStub },
                { provide: UndoRedoService, useValue: undoRedoStub },
                { provide: ResizeCanvasAction, useValue: resizeActionStub },
                { provide: CanvasResizerService, useValue: resizeStub },
            ],
        });
        resizeActionStub = TestBed.inject(ResizeCanvasAction);
        resizeStub = TestBed.inject(CanvasResizerService);
    });

    it('should call onResizeUp', () => {
        const onResizeUpSpy = spyOn(resizeStub, 'onResizeUp').and.stub();
        resizeActionStub.apply();
        expect(onResizeUpSpy).toHaveBeenCalled();
    });
});
