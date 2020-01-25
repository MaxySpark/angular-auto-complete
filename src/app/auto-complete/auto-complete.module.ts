import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutoCompleteDirective } from './directives/auto-complete.directive';
import { AutoCompleteContentDirective } from './directives/auto-complete-content.directive';
import { OverlayModule } from '@angular/cdk/overlay';
import { FilterPipe } from './pipes/filter.pipe';
import { OptionComponent } from './components/option/option.component';
import { AutoCompleteComponent } from './components/auto-complete/auto-complete.component';

@NgModule({
  declarations: [
    OptionComponent,
    AutoCompleteComponent,
    AutoCompleteContentDirective,
    AutoCompleteDirective,
    OverlayModule,
    FilterPipe,
  ],
  imports: [
    CommonModule
  ]
})
export class AutoCompleteModule { }
