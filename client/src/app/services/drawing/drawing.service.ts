import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class DrawingService {
    baseCtx: CanvasRenderingContext2D;
    previewCtx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;

    clearCanvas(context: CanvasRenderingContext2D): void {
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    isCanvasBlank(): boolean {
        const pixelBuffer = new Uint32Array(this.baseCtx.getImageData(0, 0, this.canvas.width, this.canvas.height).data.buffer);
        return !pixelBuffer.some((color) => color !== 0);
    }
}
