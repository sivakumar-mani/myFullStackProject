import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCategory } from './dialog-category';

describe('DialogCategory', () => {
  let component: DialogCategory;
  let fixture: ComponentFixture<DialogCategory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogCategory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogCategory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
