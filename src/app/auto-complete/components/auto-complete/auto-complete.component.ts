import { Component, OnInit, ViewChild, TemplateRef, ContentChild, ContentChildren, QueryList } from '@angular/core';
import { OptionComponent } from '../option/option.component';
import { switchMap } from 'rxjs/operators';
import { merge } from 'rxjs';
import { AutoCompleteContentDirective } from '../../directives/auto-complete-content.directive';

@Component({
  selector: 'app-auto-complete',
  templateUrl: './auto-complete.component.html',
  styleUrls: ['./auto-complete.component.scss'],
  exportAs: 'appAutoComplete'
})
export class AutoCompleteComponent {
  @ViewChild('root', {static: true}) rootTemplate: TemplateRef<any>;

  @ContentChild(AutoCompleteContentDirective, {static: true})

  content: AutoCompleteContentDirective;

  @ContentChildren(OptionComponent) options: QueryList<OptionComponent>;

  optionsClick() {
    return this.options.changes.pipe(
      switchMap(options => {
        const clicks$ = options.map(option => option.click$);
        return merge(...clicks$);
      })
    );
  }

}
