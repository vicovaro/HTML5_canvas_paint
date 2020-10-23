import { DrawingService } from '@app/services/drawing/drawing.service';
import { PencilService } from '@app/services/tools/pencil-service';
import { Vec2 } from '../vec2';
import { AbsUndoRedo } from './abs-undo-redo';

// class that allows to redo-undo pencil-brush-eraser tool
export class StrokeAction extends AbsUndoRedo {
    // couleur finale = couleur du stroke
    // couleur initiale = avant le stroke dans le canvas (dans ) // use getcolor de colorservice
    constructor(private changes: Vec2[], private initColor: string, private pencilService: PencilService, private drawingService: DrawingService) {
        super();
    }

    apply(): void {
        // after a redo
        // couleur finale aux positions

        this.drawingService.baseCtx.strokeStyle = this.initColor;
        this.pencilService.drawLine(this.drawingService.baseCtx, this.changes);
        this.pencilService.clearEffectTool();
    }

    //  deapply(): void {
    // after a undo
    // couleur initiale (dans le tableau de tuple Vec2/string) aux positions
    //  this.drawingService.clearCanvas(this.drawingService.baseCtx);
    //   this.drawingService.baseCtx.strokeStyle = this.initColor;
    //    this.pencilService.drawLine(this.drawingService.baseCtx, this.changes);
    //     this.pencilService.clearEffectTool();
    //   }
}
