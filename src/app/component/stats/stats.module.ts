import { NgModule } from '@angular/core';
import { ShareModule } from '../../shared/share.module';
import { StatsComponent } from './stats.component';

@NgModule({
  declarations: [StatsComponent],
  imports: [ShareModule],
  exports: [StatsComponent],
})
export class StatsModule {}
