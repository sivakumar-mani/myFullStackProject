import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogViewBillProducts } from './dialog-view-bill-products';

describe('DialogViewBillProducts', () => {
  let component: DialogViewBillProducts;
  let fixture: ComponentFixture<DialogViewBillProducts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogViewBillProducts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogViewBillProducts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
