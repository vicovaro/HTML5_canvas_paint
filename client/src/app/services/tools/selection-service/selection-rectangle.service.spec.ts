/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { Subscription } from 'rxjs/internal/Subscription';
// import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionRectangleService } from './selection-rectangle.service';

// tslint:disable:no-any
// tslint:disable:no-magic-numbers
// tslint:disable:no-string-literal
// tslint:disable:max-file-line-count
// tslint:disable:no-shadowed-variable
describe('Service: SelectionRectangle', () => {
    let service: SelectionRectangleService;
    let mouseEvent: MouseEvent;

    let drawSelectionSpy: jasmine.Spy<any>;
    let pasteSelectionSpy: jasmine.Spy<any>;
    let getImageDataSpy: jasmine.Spy<any>;
    let drawSelectionRectSpy: jasmine.Spy<any>;
    let putImageDataSpy: jasmine.Spy<any>;
    let drawPreviewRectSpy: jasmine.Spy<any>;
    let fillRectSpy: jasmine.Spy<any>;
    let clearSelectionSpy: jasmine.Spy<any>;

    let pasteArrowSelectionSpy: jasmine.Spy<any>;
    let subscriptionMoveLeftSubscribeSpy: jasmine.Spy<any>;
    let subscriptionMoveRightSubscribeSpy: jasmine.Spy<any>;
    let subscriptionMoveUpSubscribeSpy: jasmine.Spy<any>;
    let subscriptionMoveDownSubscribeSpy: jasmine.Spy<any>;

    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'isPreviewCanvasBlank']);
        TestBed.configureTestingModule({
            providers: [SelectionRectangleService, { provide: DrawingService, useValue: drawServiceSpy }],
        });

        service = TestBed.inject(SelectionRectangleService);

        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;
        service['drawingService'].canvas = canvasTestHelper.canvas as HTMLCanvasElement;
    });

    it('should be created', inject([SelectionRectangleService], (service: SelectionRectangleService) => {
        expect(service).toBeTruthy();
    }));

    it(' onMouseUp should copy a selection and draw it in the preview canvas', () => {
        drawSelectionSpy = spyOn<any>(service, 'drawSelection').and.callThrough();
        const imageDataMock = new ImageData(10, 10) as ImageData;
        getImageDataSpy = spyOn<any>(service['drawingService'].baseCtx, 'getImageData').and.returnValue(imageDataMock);

        mouseEvent = {
            button: 0,
            offsetX: 25,
            offsetY: 25,
        } as MouseEvent;

        service.mouseDownCoord = { x: 1, y: 1 };
        service.shiftPressed = false;
        service.mouseDown = true;

        service.onMouseUp(mouseEvent);
        expect(getImageDataSpy).toHaveBeenCalled();
        expect(drawSelectionSpy).toHaveBeenCalled();
    });

    it(' onMouseUp should copy a selection and draw it in the preview canvas if shift is pressed', () => {
        drawSelectionSpy = spyOn<any>(service, 'drawSelection').and.callThrough();
        const imageDataMock = new ImageData(10, 10) as ImageData;
        getImageDataSpy = spyOn<any>(service['drawingService'].baseCtx, 'getImageData').and.returnValue(imageDataMock);

        mouseEvent = {
            button: 0,
            offsetX: 25,
            offsetY: 25,
        } as MouseEvent;

        service.mouseDownCoord = { x: 1, y: 1 };
        service.shiftPressed = true;
        service.mouseDown = true;

        service.onMouseUp(mouseEvent);
        expect(getImageDataSpy).toHaveBeenCalled();
        expect(drawSelectionSpy).toHaveBeenCalled();
    });

    it(' onMouseUp should not copy a selection and draw it in the preview canvas if the left mouse button was not pressed', () => {
        drawSelectionSpy = spyOn<any>(service, 'drawSelection').and.callThrough();
        const imageDataMock = new ImageData(10, 10) as ImageData;
        getImageDataSpy = spyOn<any>(service['drawingService'].baseCtx, 'getImageData').and.returnValue(imageDataMock);

        mouseEvent = {
            button: 0,
            offsetX: 25,
            offsetY: 25,
        } as MouseEvent;

        service.mouseDownCoord = { x: 1, y: 1 };
        service.shiftPressed = false;
        service.mouseDown = false;

        service.onMouseUp(mouseEvent);
        expect(getImageDataSpy).not.toHaveBeenCalled();
        expect(drawSelectionSpy).not.toHaveBeenCalled();
    });

    it(' onMouseUp should paste a selection if a selection has been drawn', () => {
        drawSelectionSpy = spyOn<any>(service, 'drawSelection').and.callThrough();
        pasteSelectionSpy = spyOn<any>(service, 'pasteSelection').and.callThrough();
        service.imageData = new ImageData(10, 10);

        mouseEvent = {
            button: 0,
            offsetX: 25,
            offsetY: 25,
        } as MouseEvent;

        service.mouseDownCoord = { x: 1, y: 1 };
        service.copyImageInitialPos = { x: 1, y: 1 };
        service.mouseMouvement = { x: 10, y: 10 };
        service.inSelection = true;
        service.mouseDown = true;

        service.onMouseUp(mouseEvent);
        expect(pasteSelectionSpy).toHaveBeenCalled();
    });

    it(' drawSelection should draw a selection rectangle and put the image inside it', () => {
        drawSelectionRectSpy = spyOn<any>(service, 'drawSelectionRect').and.callThrough();
        putImageDataSpy = spyOn<any>(service['drawingService'].previewCtx, 'putImageData').and.callThrough();

        service.imageData = new ImageData(10, 10);
        service['drawSelection']({ x: 1, y: 1 });
        expect(drawSelectionRectSpy).toHaveBeenCalled();
        expect(putImageDataSpy).toHaveBeenCalled();
    });

    it(' pasteSelection should put a selection on the canvas', () => {
        putImageDataSpy = spyOn<any>(service['drawingService'].baseCtx, 'putImageData').and.callThrough();

        service.imageData = new ImageData(10, 10);
        service['pasteSelection']({ x: 1, y: 1 }, service.imageData);
        expect(putImageDataSpy).toHaveBeenCalled();
    });

    it(' drawPreview should draw a preview rectangle', () => {
        drawPreviewRectSpy = spyOn<any>(service, 'drawPreviewRect').and.callThrough();

        service.shiftPressed = true;
        service['drawPreview']();
        expect(drawPreviewRectSpy).toHaveBeenCalled();
    });

    it(' clearSelection should put a white rectangle over a selection initial position', () => {
        fillRectSpy = spyOn<any>(service['drawingService'].baseCtx, 'fillRect').and.callThrough();
        service['clearSelection']({ x: 1, y: 1 }, 10, 10);
        expect(fillRectSpy).toHaveBeenCalled();
    });

    it(' pasteArrowSelection should paste a selection moved with the arrow keys', () => {
        pasteSelectionSpy = spyOn<any>(service, 'pasteSelection').and.callThrough();
        clearSelectionSpy = spyOn<any>(service, 'clearSelection').and.callThrough();

        service.timerStarted = false;
        service.mouseMouvement = { x: 5, y: 5 };
        service.width = 10;
        service.height = 10;
        service.imageData = new ImageData(10, 10);

        service.pasteArrowSelection();
        expect(clearSelectionSpy).toHaveBeenCalled();
        expect(pasteSelectionSpy).toHaveBeenCalled();
    });

    it(' pasteArrowSelection should not paste a selection if it wasnt move with the arrow keys', () => {
        pasteSelectionSpy = spyOn<any>(service, 'pasteSelection').and.callThrough();
        clearSelectionSpy = spyOn<any>(service, 'clearSelection').and.callThrough();

        service.timerStarted = true;
        service.mouseMouvement = { x: 5, y: 5 };
        service.width = 10;
        service.height = 10;
        service.imageData = new ImageData(10, 10);

        service.pasteArrowSelection();
        expect(clearSelectionSpy).not.toHaveBeenCalled();
        expect(pasteSelectionSpy).not.toHaveBeenCalled();
    });

    it(' onLeftArrowUp should reset the left timer and paste the selection', () => {
        drawServiceSpy.isPreviewCanvasBlank.and.returnValue(false);
        service.timerLeft = true;
        service.imageData = new ImageData(10, 10);

        service.subscriptionMoveLeft = new Subscription();
        subscriptionMoveLeftSubscribeSpy = spyOn<any>(service.subscriptionMoveLeft, 'unsubscribe').and.callThrough();
        pasteArrowSelectionSpy = spyOn<any>(service, 'pasteArrowSelection').and.callThrough();

        service.onLeftArrowUp();
        expect(subscriptionMoveLeftSubscribeSpy).toHaveBeenCalled();
        expect(pasteArrowSelectionSpy).toHaveBeenCalled();
    });

    it(' onLeftArrowUp should not reset the left timer and paste the selection if the preview canvas is blank', () => {
        drawServiceSpy.isPreviewCanvasBlank.and.returnValue(true);
        service.timerLeft = true;
        service.imageData = new ImageData(10, 10);

        service.subscriptionMoveLeft = new Subscription();
        subscriptionMoveLeftSubscribeSpy = spyOn<any>(service.subscriptionMoveLeft, 'unsubscribe').and.callThrough();
        pasteArrowSelectionSpy = spyOn<any>(service, 'pasteArrowSelection').and.callThrough();

        service.onLeftArrowUp();
        expect(subscriptionMoveLeftSubscribeSpy).not.toHaveBeenCalled();
        expect(pasteArrowSelectionSpy).not.toHaveBeenCalled();
    });

    it(' onRightArrowUp should reset the left timer and paste the selection', () => {
        drawServiceSpy.isPreviewCanvasBlank.and.returnValue(false);
        service.timerRight = true;
        service.imageData = new ImageData(10, 10);

        service.subscriptionMoveRight = new Subscription();
        subscriptionMoveRightSubscribeSpy = spyOn<any>(service.subscriptionMoveRight, 'unsubscribe').and.callThrough();
        pasteArrowSelectionSpy = spyOn<any>(service, 'pasteArrowSelection').and.callThrough();

        service.onRightArrowUp();
        expect(subscriptionMoveRightSubscribeSpy).toHaveBeenCalled();
        expect(pasteArrowSelectionSpy).toHaveBeenCalled();
    });

    it(' onRightArrowUp should not reset the left timer and paste the selection if the preview canvas is blank', () => {
        drawServiceSpy.isPreviewCanvasBlank.and.returnValue(true);
        service.timerRight = true;
        service.imageData = new ImageData(10, 10);

        service.subscriptionMoveRight = new Subscription();
        subscriptionMoveRightSubscribeSpy = spyOn<any>(service.subscriptionMoveRight, 'unsubscribe').and.callThrough();
        pasteArrowSelectionSpy = spyOn<any>(service, 'pasteArrowSelection').and.callThrough();

        service.onRightArrowUp();
        expect(subscriptionMoveRightSubscribeSpy).not.toHaveBeenCalled();
        expect(pasteArrowSelectionSpy).not.toHaveBeenCalled();
    });

    it(' onUpArrowUp should reset the left timer and paste the selection', () => {
        drawServiceSpy.isPreviewCanvasBlank.and.returnValue(false);
        service.timerUp = true;
        service.imageData = new ImageData(10, 10);

        service.subscriptionMoveUp = new Subscription();
        subscriptionMoveUpSubscribeSpy = spyOn<any>(service.subscriptionMoveUp, 'unsubscribe').and.callThrough();
        pasteArrowSelectionSpy = spyOn<any>(service, 'pasteArrowSelection').and.callThrough();

        service.onUpArrowUp();
        expect(subscriptionMoveUpSubscribeSpy).toHaveBeenCalled();
        expect(pasteArrowSelectionSpy).toHaveBeenCalled();
    });

    it(' onUpArrowUp should not reset the left timer and paste the selection if the preview canvas is blank', () => {
        drawServiceSpy.isPreviewCanvasBlank.and.returnValue(true);
        service.timerUp = true;
        service.imageData = new ImageData(10, 10);

        service.subscriptionMoveUp = new Subscription();
        subscriptionMoveUpSubscribeSpy = spyOn<any>(service.subscriptionMoveUp, 'unsubscribe').and.callThrough();
        pasteArrowSelectionSpy = spyOn<any>(service, 'pasteArrowSelection').and.callThrough();

        service.onUpArrowUp();
        expect(subscriptionMoveUpSubscribeSpy).not.toHaveBeenCalled();
        expect(pasteArrowSelectionSpy).not.toHaveBeenCalled();
    });

    it(' onDownArrowUp should reset the left timer and paste the selection', () => {
        drawServiceSpy.isPreviewCanvasBlank.and.returnValue(false);
        service.timerDown = true;
        service.imageData = new ImageData(10, 10);

        service.subscriptionMoveDown = new Subscription();
        subscriptionMoveDownSubscribeSpy = spyOn<any>(service.subscriptionMoveDown, 'unsubscribe').and.callThrough();
        pasteArrowSelectionSpy = spyOn<any>(service, 'pasteArrowSelection').and.callThrough();

        service.onDownArrowUp();
        expect(subscriptionMoveDownSubscribeSpy).toHaveBeenCalled();
        expect(pasteArrowSelectionSpy).toHaveBeenCalled();
    });

    it(' onDownArrowUp should reset the left timer and paste the selection', () => {
        drawServiceSpy.isPreviewCanvasBlank.and.returnValue(true);
        service.timerDown = true;
        service.imageData = new ImageData(10, 10);

        service.subscriptionMoveDown = new Subscription();
        subscriptionMoveDownSubscribeSpy = spyOn<any>(service.subscriptionMoveDown, 'unsubscribe').and.callThrough();
        pasteArrowSelectionSpy = spyOn<any>(service, 'pasteArrowSelection').and.callThrough();

        service.onDownArrowUp();
        expect(subscriptionMoveDownSubscribeSpy).not.toHaveBeenCalled();
        expect(pasteArrowSelectionSpy).not.toHaveBeenCalled();
    });
});
