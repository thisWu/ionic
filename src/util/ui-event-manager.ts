import { ElementRef } from '@angular/core';

import { listenEvent } from './dom';
import { PointerEvents, PointerEventsConfig } from './pointer-events';


// Test via a getter in the options object to see if the passive property is accessed
var supportsOptions = false;
try {
  var opts = Object.defineProperty({}, 'passive', {
    get: function() {
      supportsOptions = true;
    }
  });
  window.addEventListener('test', null, opts);
} catch (e) { }


export function eventOptions(useCapture = false, usePassive = false): any {
  if (supportsOptions && usePassive) {
    return {
      capture: useCapture,
      passive: usePassive
    };
  }
  return useCapture;
}


/**
 * @private
 */
export class UIEventManager {
  private events: Function[] = [];

  constructor(public zoneWrapped: boolean = true) {}

  pointerEvents(config: PointerEventsConfig): PointerEvents {
    let element = config.element;
    if (!element) {
      element = config.elementRef.nativeElement;
    }

    if (!element || !config.pointerDown) {
      console.error('PointerEvents config is invalid');
      return;
    }
    let zone = config.zone || this.zoneWrapped;
    let opts: any;
    if (supportsOptions) {
      opts = {};
      if (config.passive === true) {
        opts.passive = true;
      }
      if (config.capture === true) {
        opts.capture = true;
      }
    } else {
      if (config.passive === true) {
        console.debug('passive event listeners are not supported by this browser');
      }
      if (config.capture === true) {
        opts = true;
      }
    }

    let pointerEvents = new PointerEvents(
      element,
      config.pointerDown,
      config.pointerMove,
      config.pointerUp,
      zone,
      opts);

    let removeFunc = () => pointerEvents.destroy();
    this.events.push(removeFunc);
    return pointerEvents;
  }

  listenRef(ref: ElementRef, eventName: string, callback: any, option?: any): Function {
    return this.listen(ref.nativeElement, eventName, callback, option);
  }

  listen(element: any, eventName: string, callback: any, option: any = false): Function {
    if (!element) {
      return;
    }
    let removeFunc = listenEvent(element, eventName, this.zoneWrapped, option, callback);
    this.events.push(removeFunc);
    return removeFunc;
  }

  unlistenAll() {
    for (let event of this.events) {
      event();
    }
    this.events.length = 0;
  }
}
