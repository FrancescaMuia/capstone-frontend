import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VinylWineAssociationComponent } from './vinyl-wine-association.component';

describe('VinylWineAssociationComponent', () => {
  let component: VinylWineAssociationComponent;
  let fixture: ComponentFixture<VinylWineAssociationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VinylWineAssociationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VinylWineAssociationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
