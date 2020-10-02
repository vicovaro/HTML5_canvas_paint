/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { EventOfTest } from '@app/classes/event-of-test';
import { RGBA } from '@app/classes/rgba';
// import { RGBA } from '@app/classes/rgba';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';

// tslint:disable:no-magic-numbers
describe('ColorService', () => {
    let service: ColorService;
    let mouseEventDrawDot: EventOfTest;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService }],
        });

        service = TestBed.inject(ColorService);
        //  drawMovingDotSpy= spyOn<any>(service, 'drawMovingDot').and.callThrough();

        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;

        mouseEventDrawDot = new EventOfTest();
    });

    it('should be created', inject([ColorService], (serviceCol: ColorService) => {
        expect(serviceCol).toBeTruthy();
    }));

    /*
    it('getLastColor() and setLastColor() should get et set the color from lastColors ', () => {
        service.addLastColor('#FFFFFF');
        service.getlastColors();
        
    });
    */

    it('drawMovingDot should call drawMovingDot should change line cap,stroke style and fillstyle', () => {
        service.drawMovingStopper(baseCtxStub, { x: 50, y: 50 }, mouseEventDrawDot.mouseEvent1);
        expect(baseCtxStub.lineCap).toEqual('round');
        expect(baseCtxStub.strokeStyle).toEqual('#000000');
        expect(baseCtxStub.fillStyle).toEqual('#ffffff');
    });
    /*
    it('getcolor() should read data from the canvas ', () => {
        const imageData: RGBA = service.getColor({ x: 0, y: 0 }, baseCtxStub);
        expect(imageData[0]).toEqual(0); // R
        expect(imageData.[1]).toEqual(255); // G
        expect(imageData.[2]).toEqual(255); // B
        expect(imageData.[3]).toEqual(255); // A
    });
    */
    it('changeColoOpacity should change the opacity of primary color ', () => {
        service.isclicked = true;
        service.changeColorOpacity(1);
        expect(service.primaryColorTransparency).toEqual(1);
        expect(baseCtxStub.globalAlpha).toEqual(1);
    });

    it('changeColoOpacity should change the opacity of secondary color ', () => {
        service.isclicked = false;
        service.changeColorOpacity(1);
        expect(service.secondaryColorTransparency).toEqual(1);
        expect(baseCtxStub.globalAlpha).toEqual(1);
    });

    it('swapColor should invert primary and secondary colors ', () => {
        service.primaryColor = '#FFFFFF';
        service.secondaryColor = '#000000';
        service.swapColor();
        expect(service.primaryColor).toEqual('#000000');
        expect(service.secondaryColor).toEqual('#FFFFFF');
    });

    it('numeralToHex() should return a hex value from a rgb ', () => {
        const value: RGBA = { red: 255, green: 0, blue: 0, alpha: 1 };

        service.numeralToHex(value);
        expect(service.numeralToHex(value)).toEqual('#ff0000');
    });
});