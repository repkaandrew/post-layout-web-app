import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ObstructionData, ObstructionType, PostLayoutInput} from '../../models/post-layout-input';
import {PostLayoutDescription, PostLayoutOption} from '../../models/post-layout-option';
import {PostLayoutService} from '../../services/post-layout-service';
import * as _ from 'lodash';
import {LayoutViewComponent} from '../../components/layout-view-component/layout-view.component';
import {JsonPipe} from '@angular/common';

@Component({
  selector: 'app-post-layout-page',
  templateUrl: './post-layout-page.component.html',
  styleUrls: ['./post-layout-page.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, LayoutViewComponent, JsonPipe]
})
export class PostLayoutPageComponent implements OnInit {

  readonly controls: { [key in keyof PostLayoutInput]: string } = {
    postSize: 'postSize',
    panelMaxLength: 'panelMaxLength',
    runHorLength: 'runHorLength',
    obstructions: 'obstructions'
  };

  readonly obstructionControls: { [key in keyof ObstructionData]: string } = {
    size: 'size',
    type: 'type',
    location: 'location'
  };

  readonly obstructionOptions: { name: string, value: ObstructionType }[] = [
    {name: 'Try to avoid', value: ObstructionType.TRY_TO_AVOID},
    {name: 'Must avoid', value: ObstructionType.MUST_AVOID},
    {name: 'Place post here', value: ObstructionType.PLACE_POST}
  ];

  form: FormGroup;

  postLayoutOptions: PostLayoutOption[];
  selectedOption: PostLayoutOption;
  currObstructions: ObstructionData[];

  constructor(private readonly fb: FormBuilder, private readonly layoutService: PostLayoutService) {
    this.postLayoutOptions = [];
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
      [this.obstructionControls.location]: this.createNumberControl(),
      [this.obstructionControls.type]: this.fb.control<ObstructionType>(ObstructionType.TRY_TO_AVOID, Validators.required)
    });
  }

  async calculate(): Promise<void> {
    this.postLayoutOptions = await this.layoutService.calculateOptions(this.form.value);
    this.selectedOption = _.first(this.postLayoutOptions);
    console.log(this.postLayoutOptions);
    this.currObstructions = this.obstructionsArray.value;
  }

  calculationDisabled(): boolean {
    return this.form.invalid;
  }

  isNextOptionAvailable(): boolean {
    return this.selectedOptionIndex < this.postLayoutOptions.length - 1;
  }

  isPreviousOptionAvailable(): boolean {
    return this.selectedOptionIndex > 0;
  }

  onNextOption(): void {
    const optionIndex = this.selectedOptionIndex;

    if (optionIndex !== -1) {
      this.selectedOption = this.postLayoutOptions[optionIndex + 1]
    }
  }

  onPreviousOption(): void {
    const optionIndex = this.selectedOptionIndex;

    if (optionIndex !== -1) {
      this.selectedOption = this.postLayoutOptions[optionIndex - 1]
    }
  }

  private get selectedOptionIndex(): number | undefined {
    return this.postLayoutOptions.indexOf(this.selectedOption);
  }

  getDescription(description: PostLayoutDescription): string {
    return `Option ${this.selectedOptionIndex + 1}: even layout ${description.evenLayout};
     extra posts ${description.additionalPosts};
      try avoid ${description.postsFallOnTryToAvoid};
       must avoid: ${description.postsFallOnMustAvoid}`;
  }

  getCenterToCenterLength(selectedOption: PostLayoutOption): number[] {
    const locations = selectedOption.postLocations;
    const c2c = [];

    for (let i = 1; i < locations.length; i++) {
      c2c.push(_.round(locations[i] - locations[i - 1], 1));
    }

    return c2c;
  }
}
