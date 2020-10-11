import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { SubToolselected } from '@app/classes/sub-tool-selected';
import { ToolUsed } from '@app/classes/tool';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolService } from '@app/services/tool-service';
import { BrushService } from '@app/services/tools/brush.service';
import { DropperService } from '@app/services/tools/dropper.service';
import { EllipseService } from '@app/services/tools/ellipse.service';
import { EraserService } from '@app/services/tools/eraser-service';
import { LineService } from '@app/services/tools/line.service';
import { PencilService } from '@app/services/tools/pencil-service';
import { RectangleService } from '@app/services/tools/rectangle.service';
import { SidebarComponent } from './sidebar.component';

describe('SidebarComponent', () => {
    let component: SidebarComponent;
    let fixture: ComponentFixture<SidebarComponent>;
    let drawingStub: DrawingService;
    let toolServiceStub: ToolService;
    let rectangleStub: RectangleService;
    let ellipseStub: EllipseService;
    let brushStub: BrushService;
    let pencilStub: PencilService;
    let eraserStub: EraserService;
    let lineStub: LineService;
    let colorStub: ColorService;
    let dropperServiceStub: DropperService;
    beforeEach(async () => {
        drawingStub = new DrawingService();
        colorStub = new ColorService(drawingStub);
        rectangleStub = new RectangleService(drawingStub, colorStub);
        ellipseStub = new EllipseService(drawingStub, colorStub);
        brushStub = new BrushService(drawingStub, colorStub);
        pencilStub = new PencilService(drawingStub, colorStub);
        eraserStub = new EraserService(drawingStub);
        lineStub = new LineService(drawingStub, colorStub);
        dropperServiceStub = new DropperService(drawingStub, colorStub);
        toolServiceStub = new ToolService(pencilStub, eraserStub, brushStub, lineStub, rectangleStub, ellipseStub, dropperServiceStub);

        await TestBed.configureTestingModule({
            declarations: [SidebarComponent],
            providers: [
                { provide: DrawingService, useValue: drawingStub },
                { provide: ToolService, useValue: toolServiceStub },
                { provide: RectangleService, useValue: rectangleStub },
                { provide: EllipseService, useValue: ellipseStub },
                { provide: BrushService, useValue: brushStub },
                { provide: PencilService, useValue: pencilStub },
                { provide: EraserService, useValue: eraserStub },
                { provide: LineService, useValue: lineStub },
                { provide: ToolService, useValue: toolServiceStub },
                { provide: MatDialog, useValue: {} },
                { provide: DropperService, useValue: dropperServiceStub },
                {
                    provide: MatIconRegistry,
                    useValue: {
                        addSvgIcon: () => '',
                    },
                },
                {
                    provide: DomSanitizer,
                    useValue: {
                        bypassSecurityTrustResourceUrl: () => '',
                    },
                },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SidebarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('pickPencil', () => {
        component.pickPencil();
        expect(toolServiceStub.currentToolName).toEqual(ToolUsed.Pencil);
    });
    it('pickEraser()', () => {
        component.pickEraser();
        expect(toolServiceStub.currentToolName).toEqual(ToolUsed.Eraser);
    });
    it('pickRectangle()', () => {
        component.pickRectangle(SubToolselected.tool1);
        expect(toolServiceStub.currentToolName).toEqual(ToolUsed.Rectangle);
    });
    it('pickEllipse()', () => {
        component.pickEllipse(SubToolselected.tool1);
        expect(toolServiceStub.currentToolName).toEqual(ToolUsed.Ellipse);
    });
    it('pickDropper()', () => {
        component.pickDropper();
        expect(toolServiceStub.currentToolName).toEqual(ToolUsed.Dropper);
    });
});
