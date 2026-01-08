const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// Filled rectangle
ctx.fillStyle = "steelblue";
ctx.fillRect(50, 50, 150, 100);

// Filled circle
ctx.beginPath();
ctx.arc(350, 120, 50, 0, 2 * Math.PI);
ctx.fillStyle = "tomato";
ctx.fill();

// Straight line
ctx.beginPath();
ctx.moveTo(50, 250);
ctx.lineTo(450, 250);
ctx.strokeStyle = "black";
ctx.lineWidth = 3;
ctx.stroke();

// Text
ctx.font = "24px Arial";
ctx.fillStyle = "black";
ctx.fillText("HTML5 Canvas", 170, 30);
