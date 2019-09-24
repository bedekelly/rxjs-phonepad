const canvas = document.querySelector("#pad");
const context = canvas.getContext("2d");
const [width, height] = [300, 300];
const radius = (0.8 * width) / 3 / 2;

/**
 * Draw a single button on screen.
 */
function drawButton(number, x, y, fill = "black", stroke = "white") {
  context.lineWidth = 3;
  context.beginPath();
  context.arc(x, y, radius, 0, 2 * Math.PI);
  context.strokeStyle = stroke;
  context.stroke();

  context.fillStyle = fill;
  context.fill();

  context.font = "bold 50px sans-serif";
  context.fillStyle = stroke;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(number, x, y);
}

/**
 * Draw the number pad.
 */
function drawScreen() {
  context.clearRect(0, 0, width, height);
  for (let i = 1; i < 10; i++) {
    const [x, y] = coordsFromButton(i);
    drawButton(i, x, y, "black", "white");
  }
}

/**
 * Display the "Unlocked" message.
 */
function displayUnlockedMessage() {
  const indicator = document.querySelector("#locked-indicator");
  indicator.classList.add("unlocked");
  indicator.innerText = "Unlocked";
}

/**
 * Return the button index given some coordinates.
 */
function buttonFromCoords(x, y) {
  const col = Math.floor(x / 100);
  const row = Math.floor(y / 100);
  const buttonNumber = col + 1 + row * 3;
  const [buttonX, buttonY] = coordsFromButton(buttonNumber);
  const r = Math.hypot(x - buttonX, y - buttonY);
  return r < radius && buttonNumber < 10 ? buttonNumber : null;
}

/**
 * Return the coordinates for a given button.
 */
function coordsFromButton(number) {
  const row = Math.floor((number - 1) / 3);
  const col = number - row * 3 - 1;
  const x = (col * width) / 3 + width / 3 / 2;
  const y = (row * height) / 3 + height / 3 / 2;
  return [x, y];
}

/**
 * Pull relative X and Y values out of a mouseMove event.
 * */
const coordsFromEvent = event => ({
  x: event.pageX - canvas.offsetLeft,
  y: event.pageY - canvas.offsetTop
});

/**
 * Test two arrays for equality.
 */
function shallowEq(one, two) {
  return JSON.stringify(one) === JSON.stringify(two);
}

/**
 * Draw a line between two buttons.
 */
function drawLineBetweenButtons([button1, button2]) {
  const [x1, y1] = button1;
  const [x2, y2] = button2;
  context.beginPath();
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.strokeStyle = "rgba(128, 128, 128, 0.7)";
  context.lineWidth = 10;
  context.stroke();
}

export {
  coordsFromEvent,
  canvas,
  coordsFromButton,
  buttonFromCoords,
  drawScreen,
  drawButton,
  shallowEq,
  displayUnlockedMessage,
  drawLineBetweenButtons
};
