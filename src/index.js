import { fromEvent, BehaviorSubject, merge, zip } from "rxjs";
import {
  distinctUntilChanged,
  filter,
  map,
  buffer,
  withLatestFrom,
  bufferCount,
  pluck,
  mapTo
} from "rxjs/operators";

import {
  canvas,
  coordsFromEvent,
  coordsFromButton,
  buttonFromCoords,
  drawLineBetweenButtons,
  displayUnlockedMessage,
  drawButton,
  drawScreen,
  shallowEq
} from "/utils.js";

// Set the correct password.
const password = [1, 2, 3, 5, 8];

// Listen for mouse down/up.
const mouseIsDown$ = new BehaviorSubject(false);
const mouseDown$ = fromEvent(canvas, "mousedown");
const mouseUp$ = fromEvent(document, "mouseup").pipe(mapTo("UP"));
mouseDown$.subscribe(() => mouseIsDown$.next(true));
mouseUp$.subscribe(() => mouseIsDown$.next(false));

// Listen for mouse drags.
const dragEvents$ = fromEvent(canvas, "mousemove").pipe(
  withLatestFrom(mouseIsDown$),
  filter(([, mouseDown]) => mouseDown),
  pluck(0)
);

// Listen for buttons.
const buttons$ = merge(dragEvents$, mouseDown$).pipe(
  map(coordsFromEvent),
  map(({ x, y }) => buttonFromCoords(x, y)),
  filter(x => x !== null)
);

// Listen for distinct buttons.
const distinctButtons$ = merge(buttons$, mouseUp$).pipe(
  distinctUntilChanged(),
  filter(x => x !== "UP")
);

// Listen for completely entered passwords.
const enteredPasswords$ = distinctButtons$.pipe(
  buffer(mouseUp$),
  filter(x => x.length > 0)
);

// Listen for the correct password.
enteredPasswords$
  .pipe(filter(pass => shallowEq(pass, password)))
  .subscribe(displayUnlockedMessage);

// Draw each distinct button on screen.
const distinctXYs$ = distinctButtons$.pipe(map(coordsFromButton));
const distinctButtonsAndXYs$ = zip(distinctButtons$, distinctXYs$);
distinctButtonsAndXYs$.subscribe(([num, [x, y]]) => {
  drawButton(num, x, y, "white", "black");
});

// Draw lines between the buttons.
const enteredPasswordsNull$ = enteredPasswords$.pipe(mapTo(null));
merge(distinctXYs$, enteredPasswordsNull$)
  .pipe(
    bufferCount(2, 1),
    filter(([x, y]) => x !== null && y !== null)
  )
  .subscribe(drawLineBetweenButtons);

// Draw the screen when we enter a password, and at the start.
enteredPasswords$.subscribe(drawScreen);
drawScreen();
