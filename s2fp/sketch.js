let R, rTicks, rHour, rMin, rSec;
let centerX, centerY;
let tzStr = "";
let locLabel = "LOCATING…";
let solar = null;
let lat = 39.9526, lon = -75.1652;
let gradientImg;

function preload() {
  gradientImg = loadImage('sky-gradient.png'); // Preload the image
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  textFont('IBM Plex Mono');
  computePositioning();

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        lat = pos.coords.latitude;
        lon = pos.coords.longitude;
        locLabel = `LAT ${lat.toFixed(3)}, LON ${lon.toFixed(3)}`;
        computeSolar();
      },
      () => {
        locLabel = "PHILADELPHIA, PA (fallback)";
        computeSolar();
      }
    );
  } else {
    locLabel = "EMMI IS CURRENTLY IN PHILADELPHIA";
    computeSolar();
  }
}

function computePositioning() {
  R = min(width, height) * 0.36;
  rSec = R * 0.78;
  rMin = R * 0.70;
  rHour = R * 0.55;
  rTicks = R * 0.92;

  centerX = width / 2;
  centerY = height * 0.55;
}

function computeSolar() {
  const now = new Date();
  tzStr = now.toLocaleTimeString([], { timeZoneName: 'short' }).split(' ').pop();
  solar = SunCalc.getTimes(now, lat, lon);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  computePositioning();
}

function draw() {
  background(31, 35, 38);

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

  // responsive text sizing based on window width
  const baseText = width < 700 ? 10 : width < 1000 ? 12 : 14;
  textSize(baseText);
  fill(230);
  noStroke();

  // --- Left column ---
  textAlign(LEFT, TOP);
  const margin = width * 0.02; // dynamic edge margin
  text(`${locLabel}\n${timeStr} ${tzStr}`, margin, margin);

  // --- Right column ---
  textAlign(RIGHT, TOP);
  text("WE MIGHT MEET AGAIN, SOMEDAY\nBETWEEN DREAMS AT DAWN.", width - margin, margin);

  // --- Clock ---
  push();
  translate(centerX, centerY);
  rotate(-90);
  drawFace();
  drawTicks();
  drawTimeLabels();
  drawHands(now);
  pop();

  // --- Footer ---
  textAlign(LEFT, BOTTOM);
  text("CREATED WITH LOVE AND DREAMS", margin, height - margin);
  textAlign(RIGHT, BOTTOM);
  text("BY EMMI", width - margin, height - margin);
}

/* ---------- Clock visuals ---------- */

function drawFace() {
  stroke(230); strokeWeight(2); noFill();
  circle(0, 0, R * 2); // Draw the rim

  if (gradientImg) {
    push();
    imageMode(CENTER);
    rotate(90); // Correct rotation to align the image properly
    image(gradientImg, 0, 0, R * 2, R * 2); // Resize to fit the clock
    pop();
  }
}

function drawTicks() {
  stroke(235);
  for (let h = 0; h < 24; h++) {
    const heavy = (h % 6 === 0);
    strokeWeight(heavy ? 2.5 : 1);
    push();
    rotate((360 / 24) * h + 180); // Adjusted for 180-degree flip
    line(rTicks, 0, rTicks + (heavy ? 14 : 8), 0);
    pop();
  }
}

function drawTimeLabels() {
  const positions = [
    { h: 24, x: -rTicks + 28, y: 0, rot: 90}, // Left
    { h: 0o6, x: 0, y: -rTicks + 28, rot: 90 }, // Top
    { h: 12, x: rTicks - 28, y: 0, rot: 90 }, // Right
    { h: 18, x: 0, y: rTicks - 28, rot: 90 }, // Bottom
  ];

  for (const pos of positions) {
    push();
    translate(pos.x, pos.y);
    rotate(pos.rot);
    noStroke();
    fill(235);
    textAlign(CENTER, CENTER);
    textSize(width < 800 ? 10 : 12);
    text(nf(pos.h, 2), 0, 0); // Draw the label without rotation
    pop();
  }
}

function drawHands(now) {
  const s = now.getSeconds();
  const m = now.getMinutes() + s / 60;
  const h24 = now.getHours() + m / 60;

  const aSec = map(s, 0, 60, 0, 360) + 180; // Adjusted for 180-degree flip
  const aMin = map(m, 0, 60, 0, 360) + 180;
  const aHour = map(h24, 0, 24, 0, 360) + 180;

  stroke(255);
  strokeWeight(4);
  push();
  rotate(aHour);
  line(-10, 0, rHour, 0);
  pop();

  strokeWeight(4);
  push();
  rotate(aMin);
  line(-14, 0, rMin, 0);
  pop();

  strokeWeight(2);
  push();
  rotate(aSec);
  line(-16, 0, rSec, 0);
  pop();

  noStroke();
  fill(255);
  circle(0, 0, 6);
}

/* ---------- Utility functions ---------- */

function drawGrain(strength, count) {
  randomSeed(1);
  noStroke();
  for (let i = 0; i < count / 2; i++) { // Reduced density
    const ang = random(360);
    const rad = sqrt(random()) * (R - 4);
    const x = cos(ang) * rad;
    const y = sin(ang) * rad;
    const alpha = random(strength / 2); // Reduced opacity
    fill(255, alpha);
    rect(x, y, 1, 1);
  }
}

function timeToAngle(dateObj) {
  const d = new Date(dateObj);
  const h = d.getHours() + d.getMinutes() / 60;
  return (h / 24) * 360;
}

function fmtLocal(d) {
  if (!d) return "—";
  const s = new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  return `${s} ${tzStr}`;
}

function preload() {
  gradientImg = loadImage('sky-gradient.png'); // Preload the image
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  textFont('IBM Plex Mono');
  computePositioning();

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        lat = pos.coords.latitude;
        lon = pos.coords.longitude;
        locLabel = `LAT ${lat.toFixed(3)}, LON ${lon.toFixed(3)}`;
        computeSolar();
      },
      () => {
        locLabel = "PHILADELPHIA, PA (fallback)";
        computeSolar();
      }
    );
  } else {
    locLabel = "EMMI IS CURRENTLY IN PHILADELPHIA";
    computeSolar();
  }
}

function computePositioning() {
  R = min(width, height) * 0.36;
  rSec = R * 0.78;
  rMin = R * 0.70;
  rHour = R * 0.55;
  rTicks = R * 0.92;

  centerX = width / 2;
  centerY = height * 0.55;
}

function computeSolar() {
  const now = new Date();
  tzStr = now.toLocaleTimeString([], { timeZoneName: 'short' }).split(' ').pop();
  solar = SunCalc.getTimes(now, lat, lon);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  computePositioning();
}

function draw() {
  background(31, 35, 38);

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

  // responsive text sizing based on window width
  const baseText = width < 700 ? 10 : width < 1000 ? 12 : 14;
  textSize(baseText);
  fill(230);
  noStroke();

  // --- Left column ---
  textAlign(LEFT, TOP);
  const margin = width * 0.02; // dynamic edge margin
  text(`${locLabel}\n${timeStr} ${tzStr}`, margin, margin);

  // --- Right column ---
  textAlign(RIGHT, TOP);
  text("WE MIGHT MEET AGAIN, SOMEDAY\nBETWEEN DREAMS AT DAWN.", width - margin, margin);

  // --- Clock ---
  push();
  translate(centerX, centerY);
  rotate(-90);
  drawFace();
  drawTicks();
  drawTimeLabels();
  drawHands(now);
  pop();

  // --- Footer ---
  textAlign(LEFT, BOTTOM);
  text("CREATED WITH LOVE AND DREAMS", margin, height - margin);
  textAlign(RIGHT, BOTTOM);
  text("BY EMMI", width - margin, height - margin);
}

/* ---------- Clock visuals ---------- */

function drawFace() {
  stroke(230); strokeWeight(2); noFill();
  circle(0, 0, R * 2); // Draw the rim

  if (gradientImg) {
    push();
    imageMode(CENTER);
    rotate(90); // Correct rotation to align the image properly
    image(gradientImg, 0, 0, R * 2, R * 2); // Resize to fit the clock
    pop();
  }
}

function drawTicks() {
  stroke(235);
  for (let h = 0; h < 24; h++) {
    const heavy = (h % 6 === 0);
    strokeWeight(heavy ? 2.5 : 1);
    push();
    rotate((360 / 24) * h + 180); // Adjusted for 180-degree flip
    line(rTicks, 0, rTicks + (heavy ? 14 : 8), 0);
    pop();
  }
}

function drawTimeLabels() {
  const positions = [
    { h: 24, x: -rTicks + 28, y: 0, rot: 90}, // Left
    { h: 0o6, x: 0, y: -rTicks + 28, rot: 90 }, // Top
    { h: 12, x: rTicks - 28, y: 0, rot: 90 }, // Right
    { h: 18, x: 0, y: rTicks - 28, rot: 90 }, // Bottom
  ];

  for (const pos of positions) {
    push();
    translate(pos.x, pos.y);
    rotate(pos.rot);
    noStroke();
    fill(235);
    textAlign(CENTER, CENTER);
    textSize(width < 800 ? 10 : 12);
    text(nf(pos.h, 2), 0, 0); // Draw the label without rotation
    pop();
  }
}

function drawHands(now) {
  const s = now.getSeconds();
  const m = now.getMinutes() + s / 60;
  const h24 = now.getHours() + m / 60;

  const aSec = map(s, 0, 60, 0, 360) + 180; // Adjusted for 180-degree flip
  const aMin = map(m, 0, 60, 0, 360) + 180;
  const aHour = map(h24, 0, 24, 0, 360) + 180;

  stroke(255);
  strokeWeight(4);
  push();
  rotate(aHour);
  line(-10, 0, rHour, 0);
  pop();

  strokeWeight(4);
  push();
  rotate(aMin);
  line(-14, 0, rMin, 0);
  pop();

  strokeWeight(2);
  push();
  rotate(aSec);
  line(-16, 0, rSec, 0);
  pop();

  noStroke();
  fill(255);
  circle(0, 0, 6);
}

/* ---------- Utility functions ---------- */

function drawGrain(strength, count) {
  randomSeed(1);
  noStroke();
  for (let i = 0; i < count / 2; i++) { // Reduced density
    const ang = random(360);
    const rad = sqrt(random()) * (R - 4);
    const x = cos(ang) * rad;
    const y = sin(ang) * rad;
    const alpha = random(strength / 2); // Reduced opacity
    fill(255, alpha);
    rect(x, y, 1, 1);
  }
}

function timeToAngle(dateObj) {
  const d = new Date(dateObj);
  const h = d.getHours() + d.getMinutes() / 60;
  return (h / 24) * 360;
}

function fmtLocal(d) {
  if (!d) return "—";
  const s = new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  return `${s} ${tzStr}`;
}
