"use strict";
const { createCanvas } = require("canvas");
/**
 * There is a single object parameter as an input to the function
 * Here is the list of available parameters, all of them optional
 * -- charset {arr} list of characters to generate captcha from
 * -- length {number} length of the captcha
 * -- value {String} value of the captcha
 */
const PER_CHAR_WIDTH = 40;
const MIN_HEIGHT = 50;
const DEFAULT_HEIGHT = 50;
const DEFAULT_WIDTH = 200;
const DEFAULT_LENGTH = 3;
const DEFAULT_MIN_CIRCLE = 10;
const DEFAULT_MAX_CIRCLE = 25;

module.exports = p => {
  const params = Object.assign({}, p);
  if (params.charset === undefined) {
    params.charset = "1234567890".split("");
  }
  if (params.length === undefined) {
    params.length = DEFAULT_LENGTH;
  } else if (params.length < 1) {
    throw new Error("Parameter Length is less then 1");
  }
  if (params.value === undefined) {
    params.value = "";
    const len = params.charset.length;
    for (let i = 0; i < params.length; i++) {
      params.value += params.charset[Math.floor(Math.random() * len)];
    }
  }
  if (params.length !== params.value.length) {
    throw new Error(
      "Parameter Length and Parameter Value Length is inconsistent"
    );
  }
  if (params.width === undefined) {
    params.width = Math.min(DEFAULT_WIDTH, params.length * PER_CHAR_WIDTH);
  } else if (params.width / params.length < PER_CHAR_WIDTH) {
    throw new Error("Width per char should be more than " + PER_CHAR_WIDTH);
  }
  if (params.height === undefined) {
    params.height = DEFAULT_HEIGHT;
  } else if (params.height < MIN_HEIGHT) {
    throw new Error("Min Height is " + PER_CHAR_WIDTH);
  }
  if(params.numberOfCircles === undefined){
    params.numberOfCircles = DEFAULT_MIN_CIRCLE + (Math.random() * (DEFAULT_MAX_CIRCLE - DEFAULT_MIN_CIRCLE))
  }

  params.image = drawImage(params);
  return {
    value: params.value,
    width: params.width,
    height: params.height,
    image: params.image
  };
};

function drawImage(params) {
  const { width, height, length, value } = params;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  fillBackground(ctx, params);
  printText(ctx, params);
  addCircles(ctx,params);

  return canvas.toDataURL('image/jpeg', 0.6);
}
function fillBackground(ctx, params) {
  var gradient = ctx.createLinearGradient(0, 0, params.width, params.height);

  for (let i = 0; i < 10; i++) {
    gradient.addColorStop(Math.random() * 0.1 + i * 0.1, randomLightColor(5));
  }
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, params.width, params.height);
}
function printText(ctx, params) {
  let width = (params.width - 10) / params.length;
  let height = params.height;
  let value = params.value;

  for (let i = 0; i < params.length; i++) {
    // Font Size
    let fontSize = Math.random() * 20 + 24;
    ctx.font = fontSize + "px serif";

    // Font Color
    ctx.fillStyle = randomDarkColor(10);

    // Font Location
    const topMargin = (height - fontSize) * Math.random() / 2.5;
    ctx.fillText(value.charAt(i), 5 + width * i, height / 3 + fontSize - 10 + topMargin);
  }
}
function addCircles(ctx, params){
  let i = 0;

  // Dark Circles
  while(i < params.numberOfCircles / 2){
    i++;
    ctx.beginPath();

    // Radius
    const radius = 10 * Math.random() + 5;

    // Center
    const centerX = params.width * Math.random();
    const centerY = params.height * Math.random();

    // Color
    ctx.strokeStyle = randomDarkColor(5);

    // Width
    ctx.lineWidth = 0.5 * Math.random();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * (1.5+Math.random()*0.5), false);
    ctx.stroke();
  }

  // Light Circles
  while(i < params.numberOfCircles / 2){
    i++;
    // Color
    ctx.strokeStyle = randomLightColor(5);

    // Width
    ctx.lineWidth = 4 * Math.random();

    // Radius
    const radius = 10 * Math.random() + 5;

    // Center
    const centerX = params.width * Math.random();
    const centerY = params.height * Math.random();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * (1+Math.random()), false);
    ctx.stroke();
  }
}
function randomLightHex(amount = 4) {
  return (16 - Math.floor(Math.random() * amount + 1)).toString(16);
}
function randomDarkHex(amount = 4) {
  return Math.floor(Math.random() * amount + 1).toString(16);
}
function randomLightColor(amount) {
  return "#" + randomLightHex(amount) + randomLightHex(amount) + randomLightHex(amount);
}
function randomDarkColor(amount) {
  return (
    "#" + randomDarkHex(amount) + randomDarkHex(amount) + randomDarkHex(amount)
  );
}