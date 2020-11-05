import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { SubToolselected } from '@app/classes/sub-tool-selected';
import { LineAction } from '@app/classes/undo-redo/line-action';
import { Vec2 } from '@app/classes/vec2';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { LineService } from '@app/services/tools/line.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

// tslint:disable:prefer-const
// tslint:disable:no-magic-numbers
describe('LineAction', () => {
    let lineActionStub: LineAction;
    let drawingStub: DrawingService;
    let colorStub: ColorService;
    let undoRedoStub: UndoRedoService;
    let lineStub: LineService;

    let changesLine: Vec2[] = [];
    let pointMouse: Vec2;
    let colorLine: string;
    let thickness: number;
    let secondaryTickness: number;
    let subToolselected: SubToolselected;

    let baseStub: CanvasRenderingContext2D;
    let previewStub: CanvasRenderingContext2D;
    let canvas: HTMLCanvasElement;

    beforeEach(() => {
        changesLine.push({ x: 5, y: 6 });
        changesLine.push({ x: 25, y: 15 });
        pointMouse = { x: 5, y: 6 };
        colorLine = '#000000';
        thickness = 2;
        secondaryTickness = 3;
        subToolselected = SubToolselected.tool1;

        drawingStub = new DrawingService();
        colorStub = new ColorService(drawingStub);
        undoRedoStub = new UndoRedoService(drawingStub);
        lineStub = new LineService(drawingStub, colorStub, undoRedoStub);

        lineActionStub = new LineAction(changesLine, pointMouse, colorLine, thickness, secondaryTickness, lineStub, drawingStub, subToolselected);

        canvas = canvasTestHelper.canvas;
        canvas.width = 100;
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
                { provide: LineAction, useValue: lineActionStub },
                { provide: LineService, useValue: lineStub },
            ],
        });
        lineActionStub = TestBed.inject(LineAction);
        lineStub = TestBed.inject(LineService);
    });

    it('should stroke color and linewidth to be primary color and thickness', () => {
        drawingStub.baseCtx.shadowColor = drawingStub.previewCtx.shadowColor = '#000000' as string;
        lineActionStub.apply();
        expect(drawingStub.baseCtx.strokeStyle).toEqual(colorLine);
        expect(drawingStub.baseCtx.lineWidth).toEqual(thickness);
    });

    it('should call drawline', () => {
        const drawLineSpy = spyOn(lineStub, 'drawLine').and.stub();
        lineActionStub.apply();
        expect(drawLineSpy).toHaveBeenCalled();
    });

    it('should call drawPoint', () => {
        const drawPointSpy = spyOn(lineStub, 'drawPoint').and.stub();
        lineActionStub.apply();
        expect(drawPointSpy).toHaveBeenCalled();
    });

    it('should call drawLineLastPoint', () => {
        const drawLinePointSpy = spyOn(lineStub, 'drawLineLastPoint').and.stub();
        lineActionStub.apply();
        expect(drawLinePointSpy).toHaveBeenCalled();
    });

    it('should call clearEffectTool', () => {
        const clearEffectSpy = spyOn(lineStub, 'clearEffectTool').and.stub();
        lineActionStub.apply();
        expect(clearEffectSpy).toHaveBeenCalled();
    });
});
