var cnv = document.getElementById("cnv");
var ctx = cnv.getContext("2d");
var moved = false;
var pelets = [];
var P1 = {
  xy: [10, 10],
  size: 10,
  wasd: [false, false, false, false],
  velocity: [0, 0]
}
var P2 = {
  xy: [0.95*window.innerWidth-10, 10],
  size: 10,
  arrowsULDR: [false, false, false ,false], //Arrow keys Up Left Down Right
  velocity: [0, 0]
}

setInterval(function() {
  if (P1.wasd[0]===true || P1.wasd[1]===true || P1.wasd[2]===true || P1.wasd[3]===true ||
    P2.arrowsULDR[0]===true || P2.arrowsULDR[1]===true || P2.arrowsULDR[2]===true || P2.arrowsULDR[3]===true) {
      moved = true;
    }

  resize();
  for (i = 0; i < pelets.length; i++) {
    ctx.beginPath();
    ctx.arc(pelets[i][0], pelets[i][1], pelets[i][2], 0, 2*Math.PI);
    ctx.stroke();
  }
  if (moved === true && Math.random() <= 0.005) { createPelet(); }
  checkForPelet();
  checkPlOverPl();
  if (moved === false) {
    ctx.font = "12px Arial";
    ctx.fillText("Player 1 use w, a, s and d keys to move", 10, 50);
    ctx.fillText("Player 2 use up, down, left and right arrow keys to move", 10, 65);
  }
  ctx.beginPath();
  ctx.arc(P1.xy[0],P1.xy[1],P1.size,0,2*Math.PI);
  ctx.stroke();
  Pl1Movement();

  ctx.beginPath();
  ctx.arc(P2.xy[0],P2.xy[1],P2.size,0,2*Math.PI);
  ctx.stroke();
  Pl2Movement();

}, 1);

$(function() {
  $(document).keyup(function(evt){
    if (evt.keyCode === 87) { P1.wasd[0] = false; }
    if (evt.keyCode === 65) { P1.wasd[1] = false; }
    if (evt.keyCode === 83) { P1.wasd[2] = false; }
    if (evt.keyCode === 68) { P1.wasd[3] = false; }

    if (evt.keyCode === 38) { P2.arrowsULDR[0] = false; }
    if (evt.keyCode === 37) { P2.arrowsULDR[1] = false; }
    if (evt.keyCode === 40) { P2.arrowsULDR[2] = false; }
    if (evt.keyCode === 39) { P2.arrowsULDR[3] = false; }
  }).keydown(function(evt) {
    if (evt.keyCode === 87) { P1.wasd[0] = true; }
    if (evt.keyCode === 65) { P1.wasd[1] = true; }
    if (evt.keyCode === 83) { P1.wasd[2] = true; }
    if (evt.keyCode === 68) { P1.wasd[3] = true; }

    if (evt.keyCode === 38) { P2.arrowsULDR[0] = true; }
    if (evt.keyCode === 37) { P2.arrowsULDR[1] = true; }
    if (evt.keyCode === 40) { P2.arrowsULDR[2] = true; }
    if (evt.keyCode === 39) { P2.arrowsULDR[3] = true; }
  });
});

function resize() {
  cnv.width = window.innerWidth*0.95;
  cnv.height = window.innerHeight*0.95;
}
function createPelet() {
  if (pelets.length < 75) {
    pelets[pelets.length] = [Math.floor(Math.random()*cnv.width), Math.floor(Math.random()*cnv.height), Math.floor(Math.random()*10)/10];
  }
  for (i = 0; i < pelets.length; i++) {
    if (pelets[i] === 0) {
      pelets[i] = [Math.floor(Math.random()*cnv.width), Math.floor(Math.random()*cnv.height), Math.floor(Math.random()*10)/10];
    }
  }
}
function checkForPelet() {
  //Gets distance of player and pelet and tests if distance is <= size of player
  for (i = 0; i < pelets.length; i++) {
    //Check player 1
    if (Math.sqrt( Math.pow(P1.xy[0] - pelets[i][0],2) + Math.pow(P1.xy[1] - pelets[i][1],2) ) <= P1.size) {
      P1.size += pelets[i][2];
      pelets[i] = 0;
    }
    //Check Player 2
    if (Math.sqrt( Math.pow(P2.xy[0] - pelets[i][0],2) + Math.pow(P2.xy[1] - pelets[i][1],2) ) <= P2.size) {
      P2.size += pelets[i][2];
      pelets[i] = 0;
    }
  }
}
function Pl1Movement() {
  //Player 1 movement
  if (P1.wasd[2] === true && P1.velocity[1] <= 1) { P1.velocity[1] += 0.01; }
  if (P1.wasd[2] === false && P1.velocity[1] > 0) { P1.velocity[1] -= 0.0025; }
  if (P1.wasd[0] === true && P1.velocity[1] >= -1) { P1.velocity[1] -= 0.01; }
  if (P1.wasd[0] === false && P1.velocity[1] < 0) { P1.velocity[1] += 0.0025; }
  P1.xy[1] += P1.velocity[1];
  if (P1.wasd[1] === true && P1.velocity[0] >= -1) { P1.velocity[0] -= 0.01; }
  if (P1.wasd[1] === false && P1.velocity[0] < 0) { P1.velocity[0] += 0.0025; }
  if (P1.wasd[3] === true && P1.velocity[0] <= 1) { P1.velocity[0] += 0.01; }
  if (P1.wasd[3] === false && P1.velocity[0] > 0) { P1.velocity[0] -= 0.0025; }
  P1.xy[0] += P1.velocity[0]
  //Player 1 border enter
  if (P1.xy[0] > cnv.width+P1.size) { P1.xy[0] = -P1.size; }
  if (P1.xy[0] < -P1.size) { P1.xy[0] = cnv.width+P1.size; }
  if (P1.xy[1] > cnv.height+P1.size) { P1.xy[1] = -P1.size; }
  if (P1.xy[1] < -P1.size) { P1.xy[1] = cnv.height+P1.size; }
}
function Pl2Movement() {
  //Player 2 movement
  if (P2.arrowsULDR[2] === true && P2.velocity[1] <= 1) { P2.velocity[1] += 0.01; }
  if (P2.arrowsULDR[2] === false && P2.velocity[1] > 0) { P2.velocity[1] -= 0.0025; }
  if (P2.arrowsULDR[0] === true && P2.velocity[1] >= -1) { P2.velocity[1] -= 0.01; }
  if (P2.arrowsULDR[0] === false && P2.velocity[1] < 0) { P2.velocity[1] += 0.0025; }
  P2.xy[1] += P2.velocity[1];
  if (P2.arrowsULDR[1] === true && P2.velocity[0] >= -1) { P2.velocity[0] -= 0.01; }
  if (P2.arrowsULDR[1] === false && P2.velocity[0] < 0) { P2.velocity[0] += 0.0025; }
  if (P2.arrowsULDR[3] === true && P2.velocity[0] <= 1) { P2.velocity[0] += 0.01; }
  if (P2.arrowsULDR[3] === false && P2.velocity[0] > 0) { P2.velocity[0] -= 0.0025; }
  P2.xy[0] += P2.velocity[0];
  //Player 2 border enter
  if (P2.xy[0] > cnv.width+P2.size) { P2.xy[0] = -P2.size; }
  if (P2.xy[0] < -P2.size) { P2.xy[0] = cnv.width+P2.size; }
  if (P2.xy[1] > cnv.height+P2.size) { P2.xy[1] = -P2.size; }
  if (P2.xy[1] < -P2.size) { P2.xy[1] = cnv.height+P2.size; }
}
function checkPlOverPl() {
  //Gets the distance between the two players and has the bigger player kill the smaller player
  //Check Player 1
  if (Math.sqrt( Math.pow(P1.xy[0] - P2.xy[0],2) + Math.pow(P1.xy[1] - P2.xy[1],2) ) <= P1.size && P1.size > P2.size + 10) {
    P1.size += P2.size;
    P2.size = 0;
  }
  //Check Player 2
  if (Math.sqrt( Math.pow(P2.xy[0] - P1.xy[0],2) + Math.pow(P2.xy[1] - P1.xy[1],2) ) <= P2.size && P2.size > P1.size + 10) {
    P2.size += P1.size;
    P1.size = 0;
  }
}
