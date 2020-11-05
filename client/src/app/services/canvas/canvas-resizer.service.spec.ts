/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { EventOfTest } from '@app/classes/event-of-test';
import { MIN_CANVAS_SIZE, WORK_AREA_PADDING_SIZE } from '@app/classes/resize-canvas';
import { ResizeDirection } from '@app/classes/resize-direction';
import { CanvasResizerService } from './canvas-resizer.service';

fdescribe('Service: CanvasResizer', () => {
    // tslint:disable-next-line: no-any
    let changeResizeYSpy: jasmine.Spy<any>;
    // tslint:disable-next-line: no-any
    let changeResizeXSpy: jasmine.Spy<any>;
    let canvasResizerService: CanvasResizerService;
    let baseCtxStub: CanvasRenderingContext2D;
    let conparativectxStub: CanvasRenderingContext2D;
    let events: EventOfTest;
    beforeEach(() => {
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        conparativectxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        TestBed.configureTestingModule({
            providers: [CanvasResizerService],
        });

        canvasResizerService = TestBed.inject(CanvasResizerService);
        baseCtxStub.fillStyle = 'white';
        baseCtxStub.fillRect(0, 0, MIN_CANVAS_SIZE, MIN_CANVAS_SIZE);
        conparativectxStub.fillStyle = 'white';
        conparativectxStub.fillRect(0, 0, MIN_CANVAS_SIZE, MIN_CANVAS_SIZE);

        // tslint:disable-next-line: no-any
        changeResizeXSpy = spyOn<any>(canvasResizerService, 'changeResizeX').and.callThrough();
        // tslint:disable-next-line: no-any
        changeResizeYSpy = spyOn<any>(canvasResizerService, 'changeResizeY').and.callThrough();
        events = new EventOfTest();
        canvasResizerService.resizeDirection = ResizeDirection.vertical;
    });

    it('should creer', inject([CanvasResizerService], (service: CanvasResizerService) => {
        expect(service).toBeTruthy();
    }));

    it('should onResizeDown horizontal', () => {
        canvasResizerService.onResizeDown(events.mouseEvent, ResizeDirection.horizontal);
        expect(canvasResizerService.resizerIndex).toEqual(canvasResizerService.PRIORITY_INDEX);
        expect(canvasResizerService.resizeDirection).toEqual(ResizeDirection.horizontal);
    });

    it('should onResizeDown Right click horizontal', () => {
        canvasResizerService.onResizeDown(events.mouseEventR, ResizeDirection.horizontal);
        expect(canvasResizerService.resizerIndex).toEqual(canvasResizerService.NORMAL_INDEX);
        expect(canvasResizerService.resizeDirection).toEqual(ResizeDirection.horizontal);
    });

    it('should onResizeDown vertical', () => {
        canvasResizerService.onResizeDown(events.mouseEvent, ResizeDirection.vertical);
        expect(canvasResizerService.resizerIndex).toEqual(canvasResizerService.PRIORITY_INDEX);
        expect(canvasResizerService.resizeDirection).toEqual(ResizeDirection.vertical);
    });

    it('should onResizeDown verticalAndHorizontal', () => {
        canvasResizerService.onResizeDown(events.mouseEvent, ResizeDirection.verticalAndHorizontal);
        expect(canvasResizerService.resizerIndex).toEqual(canvasResizerService.PRIORITY_INDEX);
        expect(canvasResizerService.resizeDirection).toEqual(ResizeDirection.verticalAndHorizontal);
    });

    it('changeResizeY is MIN_CANVAS_SIZE', () => {
        const numberResult: number = changeResizeYSpy(events.mouseEvent2, canvasResizerService);
        expect(numberResult).toEqual(MIN_CANVAS_SIZE);
    });

    it('changeResizeX is MIN_CANVAS_SIZE', () => {
        const numberResult: number = changeResizeXSpy(events.mouseEvent2, canvasResizerService);
        expect(numberResult).toEqual(MIN_CANVAS_SIZE);
    });

    it('changeResizeY is overSized', () => {
        const numberResult: number = changeResizeYSpy(events.mouseEventOutSate, canvasResizerService);
        expect(numberResult).toEqual(canvasResizerService.resizeHeight - WORK_AREA_PADDING_SIZE);
    });

    it('changeResizeX is overSized', () => {
        const numberResult: number = changeResizeXSpy(events.mouseEventOutSate, canvasResizerService);
        expect(numberResult).toEqual(canvasResizerService.resizeWidth - WORK_AREA_PADDING_SIZE);
    });

    it('changeResizeY is good size', () => {
        const numberResult: number = changeResizeYSpy(events.mouseEventX499Y500, canvasResizerService);
        expect(numberResult).toEqual(events.mouseEventX499Y500.offsetY);
    });

    it('changeResizeX inclusive value is good', () => {
        const event: MouseEvent = { offsetX: 500, offsetY: 500 } as MouseEvent;
        const numberResult: number = canvasResizerService['changeResizeX'](event, canvasResizerService);
        expect(numberResult).toBe(event.offsetX);
    });

    it('onResize is good vertical', () => {
        canvasResizerService.isResizeDown = true;
        canvasResizerService.resizeDirection = ResizeDirection.vertical;
        canvasResizerService.onResize(events.mouseEventX499Y500, baseCtxStub);
    });

    it('onResize is good horizontal', () => {
        canvasResizerService.isResizeDown = true;
        canvasResizerService.resizeDirection = ResizeDirection.horizontal;
        canvasResizerService.onResize(events.mouseEventX499Y500, baseCtxStub);
    });

    it('onResize is good verticalAndHorizontal', () => {
        canvasResizerService.isResizeDown = true;
        canvasResizerService.resizeDirection = ResizeDirection.verticalAndHorizontal;
        canvasResizerService.onResize(events.mouseEventX499Y500, baseCtxStub);
    });

    it('changeCanvasY smaller than MIN_CANVAS_SIZE', () => {
        const event: MouseEvent = { offsetX: 0, offsetY: MIN_CANVAS_SIZE } as MouseEvent;
        canvasResizerService['changeCanvasY'](event);
        expect(canvasResizerService.canvasSize.y).toBe(MIN_CANVAS_SIZE);
    });

    it('changeCanvasY greater than drawing area', () => {
        canvasResizerService.resizeHeight = 1000;
        const event: MouseEvent = { offsetX: 0, offsetY: 20000 } as MouseEvent;
        canvasResizerService['changeCanvasY'](event);
        expect(canvasResizerService.canvasSize.y).toBe(canvasResizerService.resizeHeight - WORK_AREA_PADDING_SIZE);
    });

    it('changeCanvasY to be in the respective area, not too small or too big', () => {
        const event: MouseEvent = { offsetX: 0, offsetY: 500 } as MouseEvent;
        canvasResizerService['changeCanvasY'](event);
        expect(canvasResizerService.canvasSize.y).toBe(event.offsetY);
    });

    it('changeCanvasX smaller than MIN_CANVAS_SIZE', () => {
        const event: MouseEvent = { offsetX: MIN_CANVAS_SIZE, offsetY: 0 } as MouseEvent;
        canvasResizerService['changeCanvasX'](event);
        expect(canvasResizerService.canvasSize.x).toBe(MIN_CANVAS_SIZE);
    });

    it('changeCanvasX greater than drawing area', () => {
        canvasResizerService.resizeHeight = 1000;
        const event: MouseEvent = { offsetX: 20000, offsetY: 20000 } as MouseEvent;
        canvasResizerService['changeCanvasX'](event);
        expect(canvasResizerService.canvasSize.x).toBe(canvasResizerService.resizeWidth - WORK_AREA_PADDING_SIZE);
    });

    it('changeCanvasX to be in the respective area, not too small or too big', () => {
        const event: MouseEvent = { offsetX: 500, offsetY: 500 } as MouseEvent;
        canvasResizerService['changeCanvasX'](event);
        expect(canvasResizerService.canvasSize.x).toBe(event.offsetX);
    });

    it('onResizeOut has redirected to onResizeUp', () => {
        const onResizeUpSpy = spyOn(canvasResizerService, 'onResizeUp');
        canvasResizerService.onResizeOut({} as MouseEvent, baseCtxStub, canvasTestHelper.canvas);
        expect(onResizeUpSpy).toHaveBeenCalled();
    });
});
