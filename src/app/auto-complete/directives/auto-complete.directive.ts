import { Directive, OnInit, Input, ElementRef, ViewContainerRef } from '@angular/core';
import { AutoCompleteComponent } from '../components/auto-complete/auto-complete.component';
import { OverlayRef, Overlay, ConnectionPositionPair } from '@angular/cdk/overlay';
import { NgControl } from '@angular/forms';
import { fromEvent } from 'rxjs';
import { TemplatePortal } from '@angular/cdk/portal';
import { untilDestroyed } from '@ngneat/until-destroy';
import { takeUntil, filter } from 'rxjs/operators';

@Directive({
  selector: '[appAutoComplete]',
})
export class AutoCompleteDirective implements OnInit {

  @Input() appAutoComplete: AutoCompleteComponent;
  private overlayRef: OverlayRef;

  constructor(
    private host: ElementRef<HTMLInputElement>,
    private ngControl: NgControl,
    private vcr: ViewContainerRef,
    private overlay: Overlay
  ) { }

  get control() {
    return this.ngControl.control;
  }

  get origin() {
    return this.host.nativeElement;
  }

  ngOnInit() {
    fromEvent(this.origin, 'focus').pipe(
      untilDestroyed(this)
    ).subscribe(() => {
      this.openDropdown();
      this.appAutoComplete.optionsClick()
        .pipe(takeUntil(this.overlayRef.detachments()))
        .subscribe((value: string) => {
          this.control.setValue(value);
          this.close();
        });
    });
  }

  openDropdown() {
    this.overlayRef = this.overlay.create({
      width: this.origin.offsetWidth,
      maxHeight: 40 * 3,
      backdropClass: '',
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      positionStrategy: this.getOverlayPosition()
    });

    const template = new TemplatePortal(this.appAutoComplete.rootTemplate, this.vcr);
    this.overlayRef.attach(template);
  }

  private close() {
    this.overlayRef.detach();
    this.overlayRef = null;
  }

  private getOverlayPosition() {
    const positions = [
      new ConnectionPositionPair(
        { originX: 'start', originY: 'bottom' },
        { overlayX: 'start', overlayY: 'top' }
      )
    ];

    return this.overlay
      .position()
      .flexibleConnectedTo(this.origin)
      .withPositions(positions)
      .withFlexibleDimensions(false)
      .withPush(false);
  }
}

export function overlayClickOutside(overlayRef: OverlayRef, origin: HTMLElement) {
  return fromEvent<MouseEvent>(document, 'click')
    .pipe(
      filter(event => {
        const clickTarget = event.target as HTMLElement;
        const notOrigin = clickTarget !== origin;
        const notOverlay = !!overlayRef && (overlayRef.overlayElement.contains(clickTarget) === false);
        return notOrigin && notOverlay;
      }),
      takeUntil(overlayRef.detachments())
    )
}
