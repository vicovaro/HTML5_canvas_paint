/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { SubToolselected } from '@app/classes/sub-tool-selected';
import { Vec2 } from '@app/classes/vec2';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PolygonService } from '@app/services/tools/polygon.service';

// tslint:disable:no-any
fdescribe('Service: Polygon', () => {
    let service: PolygonService;
    let mouseEvent: MouseEvent;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let colorServiceSpy: jasmine.SpyObj<ColorService>;
    let drawFillPolygonSpy: jasmine.Spy<any>;
    let drawPolygonOutlineSpy: jasmine.Spy<any>;
    let drawFillPolygonOutlineSpy: jasmine.Spy<any>;
    let onMouseUpSpy: jasmine.Spy<any>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'clearEffectTool']);
        colorServiceSpy = jasmine.createSpyObj('ColorService', ['getprimaryColor', 'getsecondaryColor']);
        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawServiceSpy },
                { provide: ColorService, useValue: colorServiceSpy },
            ],
        });
        service = TestBed.inject(PolygonService);
        drawFillPolygonSpy = spyOn<any>(service, 'drawFillPolygon').and.callThrough();
        drawPolygonOutlineSpy = spyOn<any>(service, 'drawPolygonOutline').and.callThrough();
        drawFillPolygonOutlineSpy = spyOn<any>(service, 'drawFillPolygonOutline').and.callThrough();
        onMouseUpSpy = spyOn<any>(service, 'onMouseUp').and.callThrough();

        // Configuration du spy du service
        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;

        mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
        } as MouseEvent;
    });

    it('should be created', inject([PolygonService], (servicePoly: PolygonService) => {
        expect(servicePoly).toBeTruthy();
    }));

    it(' mouseDown should set mouseDownCoord to correct position', () => {
        const expectedResult: Vec2 = { x: 25, y: 25 };
        service.onMouseDown(mouseEvent);
        expect(service.mouseDownCoord).toEqual(expectedResult);
    });

    it(' mouseDown should set mouseDown property to true on left click', () => {
        service.onMouseDown(mouseEvent);
        expect(service.mouseDown).toEqual(true);
    });

    it(' mouseDown should set mouseDown property to false on right click', () => {
        const mouseEventRClick = {
            offsetX: 25,
            offsetY: 25,
            button: 1,
        } as MouseEvent;
        service.onMouseDown(mouseEventRClick);
        expect(service.mouseDown).toEqual(false);
    });

    it('switch  polygon tool 1', () => {
        service.subToolSelect = SubToolselected.tool1;
        service.onMouseDown(mouseEvent);
        expect(service.subToolSelect).toEqual(SubToolselected.tool1);
    });
    it('switch  polygon tool 2', () => {
        service.subToolSelect = SubToolselected.tool2;
        service.onMouseDown(mouseEvent);
        expect(service.subToolSelect).toEqual(SubToolselected.tool2);
    });
    it('switch  polygon tool 3', () => {
        service.subToolSelect = SubToolselected.tool3;
        service.onMouseDown(mouseEvent);
        expect(service.subToolSelect).toEqual(SubToolselected.tool3);
    });

    it(' onMouseUp should not call drawFillPolygon if mouse is already up ', () => {
        service.subToolSelect = SubToolselected.tool1;
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = false;

        service.onMouseUp(mouseEvent);
        expect(drawFillPolygonSpy).not.toHaveBeenCalled();
    });

    it(' onMouseMove should call drawFillPolygon if mouse was already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;
        service.subToolSelect = SubToolselected.tool1;

        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(drawFillPolygonSpy).toHaveBeenCalled();
    });

    it(' onMouseMove should not call drawFillPolygon if mouse was not already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = false;

        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
        expect(drawFillPolygonSpy).not.toHaveBeenCalled();
    });

    it(' onMouseUp should call drawFillPolygon if mouse was already down and tool1 selected', () => {
        service.subToolSelect = SubToolselected.tool1;
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        service.onMouseUp(mouseEvent);
        expect(drawFillPolygonSpy).toHaveBeenCalled();
    });

    it(' onMouseUp should call drawPolygonOutline if mouse was already down and tool2 selected', () => {
        service.subToolSelect = SubToolselected.tool2;
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        service.onMouseUp(mouseEvent);
        expect(drawPolygonOutlineSpy).toHaveBeenCalled();
    });

    it(' onMouseUp should call drawFillPolygonOutline if mouse was already down and tool3 selected', () => {
        service.subToolSelect = SubToolselected.tool3;
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        service.onMouseUp(mouseEvent);
        expect(drawFillPolygonOutlineSpy).toHaveBeenCalled();
    });

    it(' onMouseDown should call onMouseUp if the mouse enter the canvas', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseEnter = true;
        service.onMouseDown(mouseEvent);
        expect(onMouseUpSpy).toHaveBeenCalled();
    });

    it(' should change mouseOut value to true when the mouse is living the canvas while left click is pressed', () => {
        service.mouseDown = true;
        service.onMouseOut(mouseEvent);
        expect(service.mouseOut).toEqual(true);
    });

    it(' should not change mouseOut value to true when the mouse is living the canvas while left click is not pressed', () => {
        service.mouseDown = false;
        service.onMouseOut(mouseEvent);
        expect(service.mouseOut).toEqual(false);
    });

    it(' should change mouseEnter value to true when the mouse is entering the canvas after leaving it while drawing', () => {
        service.mouseOut = true;
        service.onMouseEnter(mouseEvent);
        expect(service.mouseEnter).toEqual(true);
    });

    it(' should not change mouseEnter value to true when the mouse is entering the canvas after leaving it while not drawing', () => {
        service.mouseOut = false;
        service.onMouseEnter(mouseEvent);
        expect(service.mouseEnter).toEqual(false);
    });

    it(' should draw on previewCanvas with tool2', () => {
        const expectedResult: Vec2 = { x: 25, y: 10 };
    });
});
