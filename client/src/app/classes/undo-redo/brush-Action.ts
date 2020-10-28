import { SubToolselected } from '@app/classes/sub-tool-selected';
import { AbsUndoRedo } from '@app/classes/undo-redo/abs-undo-redo';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { BrushService } from '@app/services/tools/brush.service';
import { PointArc } from '../point-arc';

export class BrushAction extends AbsUndoRedo {
    constructor(
        private changesBrush: Vec2[],
        private brushPointData: PointArc[],
        private primaryColor: string,
        private secondaryColor: string,
        private thicknessBursh: number,
        private selectedBrushTool: SubToolselected,
        private brushService: BrushService,
        private drawingService: DrawingService,
    ) {
        super();
    }

    apply(): void {
        this.drawingService.baseCtx.strokeStyle = this.primaryColor;
        this.drawingService.baseCtx.shadowColor = this.secondaryColor;
        this.drawingService.baseCtx.lineWidth = this.thicknessBursh;
        this.brushService.drawLine(this.drawingService.baseCtx, this.changesBrush, this.selectedBrushTool);
        if (this.selectedBrushTool === SubToolselected.tool4) {
            this.brushService.drawBrushTool4(this.drawingService.baseCtx, this.brushPointData);
        }
        this.brushService.witchBrush(this.selectedBrushTool);
        this.brushService.clearEffectTool();
    }
}
