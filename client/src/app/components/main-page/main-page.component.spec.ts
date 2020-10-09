import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListItem, MatListModule } from '@angular/material/list';
import { RouterTestingModule } from '@angular/router/testing';
import { IndexService } from '@app/services/index/index.service';
import { of } from 'rxjs';
import { MainPageComponent } from './main-page.component';

import SpyObj = jasmine.SpyObj;

describe('MainPageComponent', () => {
    let component: MainPageComponent;
    let fixture: ComponentFixture<MainPageComponent>;
    let indexServiceSpy: SpyObj<IndexService>;

    beforeEach(
        waitForAsync(() => {
            indexServiceSpy = jasmine.createSpyObj('IndexService', ['basicGet', 'basicPost']);
            indexServiceSpy.basicGet.and.returnValue(of({ title: '', body: '' }));
            indexServiceSpy.basicPost.and.returnValue(of());

            TestBed.configureTestingModule({
                imports: [RouterTestingModule, HttpClientModule, MatIconModule, MatListModule, MatListItem, MatButtonModule],
                declarations: [MainPageComponent],
                providers: [{ provide: MatDialog, useValue: {} }],
            }).compileComponents();
        }),
    );

    beforeEach(async () => {
        fixture = TestBed.createComponent(MainPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterEach(() => {
        if (fixture.nativeElement && 'remove' in fixture.nativeElement) {
            (fixture.nativeElement as HTMLElement).remove();
        }
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have onGoingDrawing as false', () => {
        expect(component.onGoingDrawing).toBeFalse();
    });

    it('should open a new drawing modal', () => {
        fixture.whenStable().then(() => {
            component.createNewDrawing();
            expect(component.createNewDrawing).toHaveBeenCalled();
        });
    });

    it('should open a new drawin modal user guide', () => {
        fixture.whenStable().then(() => {
            component.openUserGuide();
            expect(component.openUserGuide).toHaveBeenCalled();
        });
    });
});
