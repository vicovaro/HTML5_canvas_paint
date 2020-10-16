import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MouseButton } from '@app/classes/mouse-button';
import { RGBA } from '@app/classes/rgba';
import { Vec2 } from '@app/classes/vec2';
import { ColorService, GradientStyle, LastColor } from '@app/services/color/color.service';

// certaines parties du code a ete inspiree de l'auteur
const SIZE_OPACITY = 207;
const MAX_VALUE_RGB = 255;
@Component({
    selector: 'app-color',
    templateUrl: './color.component.html',
    styleUrls: ['./color.component.scss'],
})
// The following code has been highly inspired but not copied from this website
// The website mainly teach how to do the drawing with canvas2d the gradient
// https://malcoded.com/posts/angular-color-picker/
export class ColorComponent implements AfterViewInit {
    readonly WIDTH: number = 207;
    readonly SQUARE_HEIGHT: number = 200;
    horizontalHeight: number = 20;
    private positionSlider: number;

    @ViewChild('previewSquare') previewSquare: ElementRef<HTMLCanvasElement>; // used to do a hover position
    @ViewChild('squarePalette') squareCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('previewHorizontal') previewHorizontal: ElementRef<HTMLCanvasElement>; // used to do a hover position
    @ViewChild('horizontalPalette') horizontalCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('opacitySlider') opacitySliderCanvas: ElementRef<HTMLCanvasElement>; // to have an opacity slider
    @ViewChild('opacitySliderPreview') opacitySliderPreview: ElementRef<HTMLCanvasElement>; // to have a hover
    @ViewChild('message', { static: false }) messageRGB: MatDialogRef<HTMLElement>;
    @ViewChild('message', { static: false }) messageAlpha: MatDialogRef<HTMLElement>;

    squareDimension: Vec2 = { x: this.WIDTH, y: this.SQUARE_HEIGHT };
    horizontalDimension: Vec2 = { x: this.WIDTH, y: this.horizontalHeight };

    previewSquareCtx: CanvasRenderingContext2D;
    squareCtx: CanvasRenderingContext2D;

    previewHorizontalCtx: CanvasRenderingContext2D;
    horizontalCtx: CanvasRenderingContext2D;

    opacitySliderCtx: CanvasRenderingContext2D;
    previewopacitySliderCtx: CanvasRenderingContext2D;

    lastColors: LastColor[];

    color: string;

    constructor(
        private iconRegistry: MatIconRegistry,
        private sanitizer: DomSanitizer,
        public colorService: ColorService,
        public matDialog: MatDialog,
    ) {
        this.lastColors = this.colorService.getLastColors();
        this.iconRegistry.addSvgIcon('red', this.sanitizer.bypassSecurityTrustResourceUrl('assets/apple.svg'));
        this.iconRegistry.addSvgIcon('green', this.sanitizer.bypassSecurityTrustResourceUrl('assets/leaf.svg'));
        this.iconRegistry.addSvgIcon('blue', this.sanitizer.bypassSecurityTrustResourceUrl('assets/wave.svg'));
        this.iconRegistry.addSvgIcon('alpha', this.sanitizer.bypassSecurityTrustResourceUrl('assets/transparency.svg'));
    }

    ngAfterViewInit(): void {
        this.previewSquareCtx = this.previewSquare.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.squareCtx = this.squareCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;

        this.previewHorizontalCtx = this.previewHorizontal.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.horizontalCtx = this.horizontalCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;

        this.previewopacitySliderCtx = this.opacitySliderPreview.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.opacitySliderCtx = this.opacitySliderCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;

        this.drawSquarePalette();
        this.drawHorizontalPalette();
        this.drawOpacitySlider();
    }

    primaryClick(): void {
        this.colorService.isClicked = true;
    }
    secondaryClick(): void {
        this.colorService.isClicked = false;
    }

    drawSquarePalette(): void {
        this.colorService.drawPalette(this.squareCtx, this.squareDimension, GradientStyle.lightToDark);
    }
    drawHorizontalPalette(): void {
        this.colorService.drawPalette(this.horizontalCtx, this.horizontalDimension, GradientStyle.rainbow);
    }

    drawOpacitySlider(): void {
        this.colorService.drawPalette(this.opacitySliderCtx, this.horizontalDimension, GradientStyle.colorToColor);
    }

    onMouseOverSquare(event: MouseEvent): void {
        const position = { x: event.offsetX, y: event.offsetY };
        this.colorService.previewColor = this.colorService.numeralToHex(this.colorService.getColor(position, this.squareCtx));
    }

    onMouseOverSquareClick(event: MouseEvent): void {
        if (this.colorService.isClicked) {
            this.colorService.primaryColor = this.colorService.previewColor;
            this.colorService.addLastColor(this.colorService.primaryColor);
        } else {
            this.colorService.secondaryColor = this.colorService.previewColor;
            this.colorService.addLastColor(this.colorService.secondaryColor);
        }
        this.drawSquarePalette();
        this.drawOpacitySlider();
    }

    onMouseOverHorizontalClick(event: MouseEvent): void {
        if (this.colorService.isClicked) {
            this.colorService.primaryColor = this.colorService.previewColor;
            this.colorService.addLastColor(this.colorService.primaryColor);
        } else {
            this.colorService.secondaryColor = this.colorService.previewColor;
            this.colorService.addLastColor(this.colorService.secondaryColor);
        }
        this.colorService.selectedColor = this.colorService.previewColor;
        this.colorService.drawMovingStopper(this.previewHorizontalCtx, { x: this.WIDTH, y: this.horizontalHeight }, event);
        this.drawSquarePalette();
        this.drawHorizontalPalette();
        this.drawOpacitySlider();
    }

    onMouseOverHorizontal(event: MouseEvent): void {
        const position = { x: event.offsetX, y: event.offsetY };
        this.colorService.previewColor = this.colorService.numeralToHex(this.colorService.getColor(position, this.horizontalCtx));
    }

    onMouseOverOpacitySliderClick(event: MouseEvent): void {
        this.drawOpacitySlider();
        this.colorService.drawMovingStopper(this.previewopacitySliderCtx, { x: this.WIDTH, y: this.horizontalHeight }, event);
        this.colorService.changeColorOpacity(this.findPositionSlider(event)); // change opacity via the slider.
    }
    onMouseLastColorClick(event: MouseEvent, clickedColor: LastColor): boolean {
        if (clickedColor.active) {
            if (MouseButton.Left === event.button) {
                this.colorService.primaryColor = clickedColor.color as string;
            } else if (MouseButton.Right === event.button) {
                this.colorService.secondaryColor = clickedColor.color as string;
                return false;
            }
        }
        return true;
    }

    findPositionSlider(event: MouseEvent): number {
        const position = { x: event.offsetX, y: event.offsetY };
        this.positionSlider = 1 - position.x / SIZE_OPACITY;
        return this.positionSlider;
    }

    sendInput(rgb: RGBA): void {
        if (!rgb.red && !rgb.green && !rgb.blue && rgb.alpha >= 0 && rgb.alpha <= 1) {
            this.colorService.changeColorOpacity(rgb.alpha);
        } else if (rgb.red <= MAX_VALUE_RGB && rgb.green <= MAX_VALUE_RGB && rgb.blue <= MAX_VALUE_RGB && rgb.alpha <= 1 && rgb.alpha >= 0) {
            this.color = this.colorService.numeralToHex(rgb);
            this.colorService.primaryColor = this.color;
            this.colorService.changeColorOpacity(rgb.alpha);
        } else {
            this.openWarningMessage(this.messageRGB);
        }
    }
    // tslint:disable-next-line:no-any
    openWarningMessage(templateRef: any): void {
        this.matDialog.open(templateRef, {
            width: '300px',
        });
    }
}
