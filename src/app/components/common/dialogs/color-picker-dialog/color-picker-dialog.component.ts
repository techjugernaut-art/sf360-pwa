import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-color-picker-dialog',
  templateUrl: './color-picker-dialog.component.html',
  styleUrls: ['./color-picker-dialog.component.scss']
})
export class ColorPickerDialogComponent implements OnInit {

  constructor(
    private matBottomSheetRef: MatBottomSheetRef<ColorPickerDialogComponent>
  ) { }

  ngOnInit() {
  }
  onColorSelected(color: string) {
    this.matBottomSheetRef.dismiss(color);
  }
}
