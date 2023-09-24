import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ObstructionType} from '../../models/post-layout-input';

@Component({
  selector: 'app-post-layout-page',
  templateUrl: './post-layout-page.component.html',
  styleUrls: ['./post-layout-page.component.scss']
})
export class PostLayoutPageComponent implements OnInit {

  readonly controls: { [key: string]: string } = {
    postSize: 'postSize',
    panelMaxLength: 'panelMaxLength',
    runHorLength: 'runHorLength',
    obstructions: 'obstructions'
  };

  readonly obstructionControls: { [key: string]: string } = {
    size: 'size',
    type: 'type',
    horLocation: 'horLocation'
  };

  readonly obstructionOptions: { name: string, value: ObstructionType }[] = [
    {name: 'Try to avoid', value: ObstructionType.TRY_TO_AVOID},
    {name: 'Must avoid', value: ObstructionType.MUST_AVOID},
    {name: 'Place post here', value: ObstructionType.PLACE_POST}
  ];

  form: FormGroup;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.initForm()
  }

  private initForm(): void {
    this.form = this.fb.group({
      [this.controls.postSize]: this.createNumberControl(),
      [this.controls.panelMaxLength]: this.createNumberControl(),
      [this.controls.runHorLength]: this.createNumberControl(),
      [this.controls.obstructions]: this.fb.array([])
    })
  }

  private createNumberControl(): FormControl<number | null> {
    return this.fb.control<number | null>(null, [Validators.required, Validators.min(1)]);
  }

  get obstructionsArray(): FormArray {
    return this.form?.get(this.controls.obstructions) as FormArray;
  }

  deleteObstruction(idx: number): void {
    this.obstructionsArray.removeAt(idx);
  }

  addObstruction(): void {
    this.obstructionsArray.push(this.createObstructionGroup())
  }

  private createObstructionGroup(): FormGroup {
    return this.fb.group({
      [this.obstructionControls.size]: this.createNumberControl(),
      [this.obstructionControls.horLocation]: this.createNumberControl(),
      [this.obstructionControls.type]: this.fb.control<ObstructionType>(ObstructionType.TRY_TO_AVOID, Validators.required)
    });
  }
}
