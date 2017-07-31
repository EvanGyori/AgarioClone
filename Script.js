var cnv = document.getElementById("cnv");
var ctx = cnv.getContext("2d");
var moved = false;
var pelets = [];
var orbs = [];
var P1 = {
  xy: [10, 10],
  size: 10,
  wasd: [false, false, false, false],
  velocity: [0, 0, 4],
  acceleration: 0.01,
  color: "black",
  stats: [10] //[size smaller player needs to be eaten]
}
var P2 = {
  xy: [0.95*window.innerWidth-10, 10],
  size: 10,
  arrowsULDR: [false, false, false ,false], //Arrow keys Up Left Down Right
  velocity: [0, 0, 4],
  acceleration: 0.01,
  color: "black",
  stats: [10]
}
var spikes = [];

setInterval(function() {
  if (P1.wasd[0]===true || P1.wasd[1]===true || P1.wasd[2]===true || P1.wasd[3]===true ||
    P2.arrowsULDR[0]===true || P2.arrowsULDR[1]===true || P2.arrowsULDR[2]===true || P2.arrowsULDR[3]===true) {
      moved = true;
    }
  colorAbility();
  resize();
  if (moved === true) {
    ctx.fillStyle = "grey";
    ctx.rect(cnv.width*0.5-15, cnv.height*0.5-15, 30, 30);
    ctx.fill();
    ctx.stroke();
  }
  for (i = 0; i < pelets.length; i++) {
    ctx.beginPath();
    ctx.arc(pelets[i][0], pelets[i][1], pelets[i][2], 0, 2*Math.PI);
    ctx.stroke();
  }
  for (i=0; i<orbs.length; i++) {
    ctx.beginPath();
    ctx.strokeStyle = getOrbColor(orbs[i][2]);
    ctx.fillStyle = getOrbColor(orbs[i][2]);
    ctx.arc(orbs[i][0], orbs[i][1], 5, 0, 2*Math.PI);
    ctx.fill();
    ctx.stroke();
  }
  if (moved === true && Math.random() <= 0.005) { createPelet(); }
  if (moved === true && Math.random() <= 0.0001) { createOrb(); }
  checkForPelet();
  checkForOrb();
  checkPlOverPl();
  if (moved === false) {
    ctx.font = "12px Arial";
    ctx.strokStyle = "black";
    ctx.fillStyle = "black";
    ctx.fillText("Player 1 use w, a, s and d keys to move", 10, 50);
    ctx.fillText("Player 2 use up, down, left and right arrow keys to move", 10, 65);
    ctx.fillText("Colors:", 10, 80);
    ctx.fillText("Blue: player slides way less", 10, 95);
    ctx.fillText("Red: other player has to be even bigger in order to eat you", 10, 110);
    ctx.fillText("Purple: player is slightly faster", 10, 125);
  }
  ctx.beginPath();
  ctx.strokeStyle = "black";
  ctx.arc(P1.xy[0],P1.xy[1],P1.size,0,2*Math.PI);
  ctx.fillStyle = P1.color;
  ctx.fill();
  ctx.stroke();
  Pl1Movement();

  ctx.beginPath();
  ctx.arc(P2.xy[0],P2.xy[1],P2.size,0,2*Math.PI);
  ctx.fillStyle = P2.color;
  ctx.fill();
  ctx.stroke();
  Pl2Movement();

  for (i=0; i<spikes.length; i++) {
    ctx.beginPath();
    ctx.arc(spikes[i][0], spikes[i][1], 10, 0, 2*Math.PI);
    ctx.fillStyle = "grey";
    ctx.fill();
    ctx.stroke();
  }
  spikeAI();
  checkForSpike();
}, 1);
setInterval(function() {
  if (moved === true) { createSpike(); }
}, 6000);

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

function createSpike() {
  spikes[spikes.length] = [cnv.width*0.5-5, cnv.height*0.5-5];
}
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
function createOrb() {
  if (orbs.length <= 5) {
    orbs[orbs.length] = [Math.floor(Math.random()*cnv.width), Math.floor(Math.random()*cnv.height), Math.floor(Math.random()*3)];
  } else {
    for (i=0; i < orbs.length; i++) {
      if (orbs[i] === 0) {
        orbs[i] = [Math.floor(Math.random()*cnv.width), Math.floor(Math.random()*cnv.height), Math.floor(Math.random()*3)];
      }
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
function checkForOrb() {
  for (i=0; i<orbs.length; i++) {
    //Check Player 1
    if (Math.sqrt( Math.pow(P1.xy[0] - orbs[i][0],2) + Math.pow(P1.xy[1] - orbs[i][1],2) ) <= P1.size) {
      P1.color = getOrbColor(orbs[i][2]);
      orbs[i] = 0;
    }
    //Check Player 2
    if (Math.sqrt( Math.pow(P2.xy[0] - orbs[i][0],2) + Math.pow(P2.xy[1] - orbs[i][1],2) ) <= P2.size) {
      P2.color = getOrbColor(orbs[i][2]);
      orbs[i] = 0;
    }
  }
}
function Pl1Movement() {
  //Player 1 movement
  if (P1.wasd[2] === true && P1.velocity[1] <= P1.acceleration*100) { P1.velocity[1] += P1.acceleration; }
  if (P1.wasd[2] === false && P1.velocity[1] > 0) { P1.velocity[1] -= P1.acceleration/P1.velocity[2]; }
  if (P1.wasd[0] === true && P1.velocity[1] >= -P1.acceleration*100) { P1.velocity[1] -= P1.acceleration; }
  if (P1.wasd[0] === false && P1.velocity[1] < 0) { P1.velocity[1] += P1.acceleration/P1.velocity[2]; }
  P1.xy[1] += P1.velocity[1];
  if (P1.wasd[1] === true && P1.velocity[0] >= -P1.acceleration*100) { P1.velocity[0] -= P1.acceleration; }
  if (P1.wasd[1] === false && P1.velocity[0] < 0) { P1.velocity[0] += P1.acceleration/P1.velocity[2]; }
  if (P1.wasd[3] === true && P1.velocity[0] <= P1.acceleration*100) { P1.velocity[0] += P1.acceleration; }
  if (P1.wasd[3] === false && P1.velocity[0] > 0) { P1.velocity[0] -= P1.acceleration/P1.velocity[2]; }
  P1.xy[0] += P1.velocity[0]
  //Player 1 border enter
  if (P1.xy[0] > cnv.width+P1.size) { P1.xy[0] = -P1.size; }
  if (P1.xy[0] < -P1.size) { P1.xy[0] = cnv.width+P1.size; }
  if (P1.xy[1] > cnv.height+P1.size) { P1.xy[1] = -P1.size; }
  if (P1.xy[1] < -P1.size) { P1.xy[1] = cnv.height+P1.size; }
}
function Pl2Movement() {
  //Player 2 movement
  if (P2.arrowsULDR[2] === true && P2.velocity[1] <= P2.acceleration*100) { P2.velocity[1] += P2.acceleration; }
  if (P2.arrowsULDR[2] === false && P2.velocity[1] > 0) { P2.velocity[1] -= P2.acceleration/P2.velocity[2]; }
  if (P2.arrowsULDR[0] === true && P2.velocity[1] >= -P2.acceleration*100) { P2.velocity[1] -= P2.acceleration; }
  if (P2.arrowsULDR[0] === false && P2.velocity[1] < 0) { P2.velocity[1] += P2.acceleration/P2.velocity[2]; }
  P2.xy[1] += P2.velocity[1];
  if (P2.arrowsULDR[1] === true && P2.velocity[0] >= -P2.acceleration*100) { P2.velocity[0] -= P2.acceleration; }
  if (P2.arrowsULDR[1] === false && P2.velocity[0] < 0) { P2.velocity[0] += P2.acceleration/P2.velocity[2]; }
  if (P2.arrowsULDR[3] === true && P2.velocity[0] <= P2.acceleration*100) { P2.velocity[0] += P2.acceleration; }
  if (P2.arrowsULDR[3] === false && P2.velocity[0] > 0) { P2.velocity[0] -= P2.acceleration/P2.velocity[2]; }
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
  if (Math.sqrt( Math.pow(P1.xy[0] - P2.xy[0],2) + Math.pow(P1.xy[1] - P2.xy[1],2) ) <= P1.size && P1.size > P2.size + P2.stats[0]) {
    P1.size += P2.size;
    P2.size = 0;
  }
  //Check Player 2
  if (Math.sqrt( Math.pow(P2.xy[0] - P1.xy[0],2) + Math.pow(P2.xy[1] - P1.xy[1],2) ) <= P2.size && P2.size > P1.size + P1.stats[0]) {
    P2.size += P1.size;
    P1.size = 0;
  }
}
function getOrbColor(x) {
  switch (x) {
    case 0:
      return "red";
      break;
    case 1:
      return "blue";
      break;
    case 2:
      return "purple";
      break;
  }
}
function colorAbility() {
  //Abilities for player 1
  switch (P1.color) {
    case "black":
      P1.velocity[2] = 4;
      P1.stats[0] = 10;
      P1.acceleration = 0.01;
      break;
    case "blue":
      P1.velocity[2] = 1;
      P1.stats[0] = 10;
      P1.acceleration = 0.01;
      break;
    case "red":
      P1.velocity[2] = 4;
      P1.stats[0] = 20;
      P1.acceleration = 0.01;
      break;
    case "purple":
      P1.velocity[2] = 4;
      P1.stats[0] = 10;
      P1.acceleration = 0.011;
      break;
  }
  //Abilities for player 2
  switch (P2.color) {
    case "black":
      P2.velocity[2] = 4;
      P2.stats[0] = 10;
      P2.acceleration = 0.01;
      break;
    case "blue":
      P2.velocity[2] = 1;
      P2.stats[0] = 10;
      P2.acceleration = 0.01;
      break;
    case "red":
      P2.velocity[2] = 4;
      P2.stats[0] = 20;
      P2.acceleration = 0.01;
      break;
    case "purple":
      P2.velocity[2] = 4;
      P2.stats[0] = 10;
      P2.acceleration = 0.011;
      break;
  }
}
function spikeAI() {
  for (i=0; i<spikes.length; i++) {
    //Moves randomly
    spikes[i][0] += Math.random();
    spikes[i][0] -= Math.random();
    spikes[i][1] += Math.random();
    spikes[i][1] -= Math.random();
    //Follows greater player
    if (P1.size > P2.size && P1.size > 10) {
      if (spikes[i][0] < P1.xy[0] && Math.random() <= 0.5) {
        spikes[i][0] += Math.random()/3;
      } else if (spikes[i][0] > P1.xy[0] && Math.random() <= 0.5) {
        spikes[i][0] -= Math.random()/3;
      }
      if (spikes[i][1] < P1.xy[1] && Math.random() <= 0.5) {
        spikes[i][1] += Math.random()/3;
      } else if (spikes[i][1] > P1.xy[1] && Math.random() <= 0.5) {
        spikes[i][1] -= Math.random()/3;
      }
    } else if (P2.size > 10) {
      if (spikes[i][0] < P2.xy[0] && Math.random() <= 0.5) {
        spikes[i][0] += Math.random()/3;
      } else if (spikes[i][0] > P2.xy[0] && Math.random() <= 0.5) {
        spikes[i][0] -= Math.random()/3;
      }
      if (spikes[i][1] < P2.xy[1] && Math.random() <= 0.5) {
        spikes[i][1] += Math.random()/3;
      } else if (spikes[i][1] > P2.xy[1] && Math.random() <= 0.5) {
        spikes[i][1] -= Math.random()/3;
      }
    }
  }
}
function checkForSpike() {
  for (i=0; i<spikes.length; i++) {
    //Checks Player 1
    if (Math.sqrt( Math.pow(P1.xy[0] - spikes[i][0],2) + Math.pow(P1.xy[1] - spikes[i][1],2) ) <= P1.size && P1.size > 10 && Math.random() <= 0.1) {
      P1.size -= 0.1;
    }
    //Checks Player 2
    if (Math.sqrt( Math.pow(P2.xy[0] - spikes[i][0],2) + Math.pow(P2.xy[1] - spikes[i][1],2) ) <= P2.size && P2.size > 10 && Math.random() <= 0.1) {
      P2.size -= 0.1;
    }
  }
}
