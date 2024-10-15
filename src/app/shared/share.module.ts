import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ExtractArrayValue } from '../pipes/extractvalue.pipe';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ExtractArrayValue],
  imports: [CommonModule, RouterModule, FormsModule],
  exports: [CommonModule, RouterModule, FormsModule, ExtractArrayValue],
})
export class ShareModule {}
