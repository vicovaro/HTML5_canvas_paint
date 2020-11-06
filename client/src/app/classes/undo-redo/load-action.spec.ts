import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { CanvasResizerService } from '@app/services/canvas/canvas-resizer.service';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { LoadAction } from './load-action';

// tslint:disable:no-magic-numbers
describe('loadAction', () => {
    let loadActionStub: LoadAction;
    let drawingStub: DrawingService;
    let colorStub: ColorService;
    let undoRedoStub: UndoRedoService;
    let resizeStub: CanvasResizerService;

    let picture: string;
    let height: number;
    let width: number;

    let baseStub: CanvasRenderingContext2D;
    let previewStub: CanvasRenderingContext2D;
    let canvas: HTMLCanvasElement;

    beforeEach(() => {
        height = 100;
        width = 100;

        const pictureImage = new Image();
        const converter = document.createElement('canvas');
        const converterCtx = converter.getContext('2d') as CanvasRenderingContext2D;
        converterCtx.drawImage(pictureImage, height, width);
        picture = converter.toDataURL();

        drawingStub = new DrawingService();
        colorStub = new ColorService(drawingStub);
        undoRedoStub = new UndoRedoService(drawingStub);
        resizeStub = new CanvasResizerService(undoRedoStub);

        loadActionStub = new LoadAction(picture, height, width, drawingStub, resizeStub);

        canvas = canvasTestHelper.canvas;
        // tslint:disable:no-magic-numbers
        canvas.width = 100;
        // tslint:disable:no-magic-numbers
        canvas.height = 100;

        baseStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        drawingStub.canvas = canvas;
        drawingStub.baseCtx = baseStub;
        drawingStub.previewCtx = previewStub;

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawingStub },
                { provide: ColorService, useValue: colorStub },
                { provide: UndoRedoService, useValue: undoRedoStub },
                { provide: CanvasResizerService, useValue: resizeStub },
                { provide: LoadAction, useValue: loadActionStub },
            ],
        });
        loadActionStub = TestBed.inject(LoadAction);
        resizeStub = TestBed.inject(CanvasResizerService);
        drawingStub = TestBed.inject(DrawingService);
    });

    it('should call convertBase64ToBaseCanvas', () => {
        const convertBaseSpy = spyOn(drawingStub, 'convertBase64ToBaseCanvas').and.stub();
        loadActionStub.apply();
        expect(convertBaseSpy).toHaveBeenCalled();
    });
});