import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostLayoutPageComponent } from './post-layout-page.component';

describe('PostLayoutPageComponent', () => {
  let component: PostLayoutPageComponent;
  let fixture: ComponentFixture<PostLayoutPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostLayoutPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostLayoutPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
