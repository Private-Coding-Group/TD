/*

make losing possible
fix aiming on y axis
multiple maps

make 10 enemies / round but health increases (duels defence style)

*/


var keys = [];

$(document).keydown(function (e) {
    keys[e.keyCode] = true;
});

$(document).keyup(function (e) {
    delete keys[e.keyCode];
});

var pathPoints = [
    { x: 0, y: 25 },
    { x: 1000, y: 25 },
    { x: 1000, y: 100 },
    { x: 500, y: 100 },
    { x: 500, y: 200 },
    { x: 100, y: 200 },
    { x: 100, y: 350 },
    { x: 1280,  y: 350 }
];

var enemies = {};
var turrets = {};
var bullets = {};
var particles = {};

var cooldown = 1000;

var FPS = 60;
var lives = 20;
var money = 50;

var nextWaveIn = 100;
var waveCount = 0;

var mouseX = 0;
var mouseY = 0;

// enemies
var basic = {
  speed: 2,
  color: "black",
  hp: 10,
  size: 10,
}
var fast = {
  speed: 4,
  color: "blue",
  hp: 15,
  size: 10,
}
var boss = {
  speed: 1/2,
  color: "red",
  hp: 1000,
  size: 20,
  special: "summon",
}
var dodger = {
  speed: 3,
  color: "darkkhaki",
  hp: 25,
  size: 14,
  special: "dodger",
}
var runner = {
  speed: 2,
  color: "orange",
  hp: 35,
  size: 8,
  special: "summonFast",
}
var teleporter = {
  speed: 1,
  color: "lime",
  hp: 15,
  size: 8,
  special: "teleport",
}
var summoner = {
  speed: 1,
  color: "brown",
  hp: 20,
  size: 15,
  special: "summon",
}
var healer = {
  speed: 2,
  color: "white",
  hp: 20,
  size: 8,
  special: "heal",
}
var heavy = {
  speed: 1,
  color: "grey",
  hp: 200,
  size: 15,
}

// turrets
var normal = {
  x: Math.random()*1200,
  y: 50, // 50
  dmg: 2, // 1
  fireRate: 25, // 20
  fire: 0, // always 0
  range: 100, // 100
  color: "yellow",
  strokeColor: "goldenrod",
  level: 0,
  upgrades: {
    lvl1:{
      dmg: 2,
      fireRate: 25,
      range: 100,
      price: 10,
    },
    lvl2:{
      dmg: 2,
      fireRate: 20,
      range: 110,
      price: 20,
    },
    lvl3:{
      dmg: 3,
      fireRate: 18,
      range: 125,
      price: 25,
    },
    lvl4:{
      dmg: 5,
      fireRate: 16,
      range: 150,
      price: 30,
    },
    lvl5:{
      dmg: 5,
      fireRate: 14,
      range: 200,
      price: 30,
    }
  }
}
var shotgun = {
  x: Math.random()*1200,
  y: 50, // 50
  dmg: 6, // 1
  fireRate: 90, // 20
  fire: 0, // always 0
  range: 80, // 100
  color: "red",
  strokeColor: "black",
  level: 0,
  upgrades: {
    lvl1:{
      dmg: 6,
      fireRate: 90,
      range: 80,
      price: 50,
    },
    lvl2:{
      dmg: 7,
      fireRate: 85,
      range: 90,
      price: 25,
    },
    lvl3:{
      dmg: 10,
      fireRate: 80,
      range: 100,
      price: 30,
    },
    lvl4:{
      dmg: 15,
      fireRate: 75,
      range: 110,
      price: 30,
    },
    lvl5:{
      dmg: 20,
      fireRate: 60,
      range: 125,
      price: 50,
    },
  }
}
var sniper = {
  x: Math.random()*1200,
  y: 50, // 50
  dmg: 10, // 10
  fireRate: 100, // 20
  fire: 0, // always 0
  range: 150, // 100
  color: "blue",
  strokeColor: "black",
  level: 0,
  upgrades: {
    lvl1:{
      dmg: 10,
      fireRate: 100,
      range: 150,
      price: 40,
    },
    lvl2:{
      dmg: 15,
      fireRate: 90,
      range: 180,
      price: 30,
    },
    lvl3:{
      dmg: 15,
      fireRate: 85,
      range: 210,
      price: 30,
    },
    lvl4:{
      dmg: 18,
      fireRate: 80,
      range: 240,
      price: 30,
    },
    lvl5:{
      dmg: 25,
      fireRate: 70,
      range: 300,
      price: 50,
    },
  }
}
var minigun = {
  x: Math.random()*1200,
  y: 50, // 50
  dmg: 1/4, // 10
  fireRate: 5, // 20
  fire: 0, // always 0
  range: 80, // 100
  color: "white",
  strokeColor: "black",
  level: 0,
  upgrades: {
    lvl1:{
      dmg: 1/3,
      fireRate: 6,
      range: 80,
      price: 25,
    },
    lvl2:{
      dmg: 1/2,
      fireRate: 5,
      range: 85,
      price: 15,
    },
    lvl3:{
      dmg: 1,
      fireRate: 3,
      range: 90,
      price: 20,
    },
    lvl4:{
      dmg: 1.2,
      fireRate: 3,
      range: 95,
      price: 25,
    },
    lvl5:{
      dmg: 1.5,
      fireRate: 2,
      range: 100,
      price: 25,
    },
  }
}
var flamethrower = {
  x: Math.random()*1200,
  y: 50, // 50
  dmg: 1/4, // 10
  fireRate: 5, // 20
  fire: 0, // always 0
  range: 80, // 100
  color: "orange",
  strokeColor: "black",
  level: 0,
  upgrades: {
    lvl1:{
      dmg: 1/6,
      fireRate: 5,
      range: 80,
      price: 25,
    },
    lvl2:{
      dmg: 2/5,
      fireRate: 5,
      range: 85,
      price: 15,
    },
    lvl3:{
      dmg: 6/4,
      fireRate: 5,
      range: 90,
      price: 20,
    },
    lvl4:{
      dmg: 2,
      fireRate: 3,
      range: 95,
      price: 25,
    },
    lvl5:{
      dmg: 15/5,
      fireRate: 2,
      range: 100,
      price: 25,
    },
  }
}
var poison = {
  x: Math.random()*1200,
  y: 50, // 50
  dmg: 1/4, // 10
  fireRate: 5, // 20
  fire: 0, // always 0
  range: 100, // 100
  color: "lime",
  strokeColor: "black",
  level: 0,
  upgrades: {
    lvl1:{
      dmg: 1/2,
      fireRate: 25,
      range: 100,
      price: 25,
    },
    lvl2:{
      dmg: 1,
      fireRate: 20,
      range: 105,
      price: 20,
    },
    lvl3:{
      dmg: 1.5,
      fireRate: 15,
      range: 110,
      price: 25,
    },
    lvl4:{
      dmg: 2,
      fireRate: 10,
      range: 120,
      price: 25,
    },
    lvl5:{
      dmg: 2,
      fireRate: 5,
      range: 130,
      price: 25,
    },
  }
}

function newEnemy(type, x, y, pathNode) {
  if (!type) type = "basic";
  var speed = window[type].speed;
  var color = window[type].color;
  var hp = window[type].hp;
  var hpMax = hp;
  if (!x){var x = 0;}
  if(!y){var y = 20;}
  var size = window[type].size;
  var special = window[type].special;
  
  x = Math.ceil(x/2) * 2;
  
  if (!pathNode) pathNode = 0;
  

  var id = Math.random();

  var e = {
    x: x,
    y: y,
    speed: speed,
    color: color,
    size: size,
    hp: hp,
    hpMax: hpMax,
    special: special,
    pathNode: pathNode,
    goToPosX: true,
    goToPosY: false,
    selected: false,
    onFire: 0,
    poison: 0,
  }

  enemies[id] = e;
}

function newBullet(x,y, dmg, vx, vy, fire, poison) {
  
  var id = Math.random();
  
  if (!fire) fire = 0;
  if (!poison) poison = 0;

  var b = {
    x: x,
    y: y,
    vx: vx,
    vy: vy,
    life: 0,
    dmg: dmg,
    fire: fire,
    poison: poison,
  }

  bullets[id] = b;
}

function newTurret(type, x, y) {
  if (!type) type = "normal";
  
  var id = Math.random();
  
  var t = {
    x: x,
    y: y, // 50
    dmg: window[type].dmg, // 1
    fireRate: window[type].fireRate, // 20
    fire: 0, // always 0
    range: window[type].range, // 100
    type: type,
    strokeColor: window[type].strokeColor,
    color: window[type].color,
    selected: false,
    level: 1,
    upgrades: window[type].upgrades,
    isSold: false,
  }
  

  turrets[id] = t;
}

function newParticle(x, y, life, color){
  var randx = Math.random()*2-1;
  var randy = Math.random()*2-1;
  
  if (!color) color = "black";
  
  var p = {
    x: x,
    y: y,
    vx: randy,
    vy: randx,
    color: color,
    life: life,
  }
  particles[Math.random()] = p;
}

var ctx = document.getElementById("canvas").getContext("2d");

function engine() {
  $('#info').html("Gold: "+(Math.floor(money*10)/10)+"<br>Lives: "+(Math.floor(lives))+"<br>Wave: "+waveCount);
  ctx.fillStyle = "green";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  drawMap();
  
  for (var key in enemies){
    if (enemies[key] && cooldown > 0){
      cooldown -= 1;
      break;
    }
  }
  
  var disabledColor = "#5e5e5e";
  var enabledColor = "#0cb53c";
  
  $('#specialAttackBtn').html("Special attack<br>"+cooldown+"s");
  if (cooldown <= 0) $('#specialAttackBtn').css("background-color",enabledColor);
  if (cooldown > 0) $('#specialAttackBtn').css("background-color",disabledColor);
  
  var enemiesAreAlive = false;
  
  for (var key in enemies){
    if (enemies[key])$('#nextWaveBtn').css("background-color",disabledColor);
    enemiesAreAlive = true;
  }
  if (!enemiesAreAlive) $('#nextWaveBtn').css("background-color",enabledColor);
  
  if (lives <= 0){
    
  }

  for (var key in enemies) {
    entity(enemies[key]);
    if (enemies[key].hp <= 0) {
      for (var i = 0; i < 10; i++){
        newParticle(enemies[key].x,enemies[key].y, 100);
      }
      money += Math.floor(enemies[key].hpMax / 10);
      delete enemies[key];
    }
  }
  
  for (var key in bullets){
    bulletEngine(bullets[key]);
    if (bullets[key].x < 0 || bullets[key].x >= canvas.width || bullets[key].y < 0 || bullets[key].y >= canvas.height){
      for (var i = 0; i < 10; i++){
        newParticle(bullets[key].x,bullets[key].y,150);
      }
      delete bullets[key];
    }
  }

  for (var key in turrets) {
    turretEngine(turrets[key]);
    if (turrets[key].isSold){
      delete turrets[key];
    }
  }
  
  for (var key in particles) {
    particle(particles[key]);
    if (particles[key].life <= 0) {
      delete particles[key];
    }
  }
  
  
  var towers = ["normal","shotgun","minigun","sniper","poison","flamethrower"];
  
  for (var i = 0; i < towers.length; i++){
    var checked = document.getElementById(towers[i]).checked;
    if (checked){
      var tower = window[towers[i]];
      ctx.fillStyle = "black";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(mouseX,mouseY,tower.range,0,Math.PI*2,true);
      ctx.stroke();
      
      ctx.fillStyle = tower.color;
      ctx.strokeStyle = tower.strokeColor;
      ctx.beginPath();
      ctx.arc(mouseX,mouseY,10,0,Math.PI*2,true);
      ctx.stroke();
      ctx.fill();
    }
  }
  
  
  

  setTimeout(engine, 1000 / FPS);
}
engine();

function entity(ent) {
  ctx.fillStyle = ent.color;
  ctx.fillRect(ent.x, ent.y, ent.size, ent.size);

  //ctx.font = "12px Arial";
  //ctx.fillText(Math.floor(ent.hp * 10) / 10, ent.x, ent.y - 10);
  
  for (var key in bullets){
      if (ent.x < bullets[key].x + 5 && ent.x + ent.size > bullets[key].x && ent.y < bullets[key].y + 5 && ent.size + ent.y > bullets[key].y){
        ent.hp -= bullets[key].dmg;
        ent.poison = bullets[key].poison;
        ent.onFire = bullets[key].fire;
        for (var i = 0; i < 5; i++){
          newParticle(bullets[key].x,bullets[key].y,60);
        }
        delete bullets[key];
    }
  }
  
  if (ent.x >= 1250){
    ent.hp = 0;
    lives--;
  }
  
  var perc = ent.hp / ent.hpMax;
  
  ctx.fillStyle = "black";
  ctx.fillRect(ent.x, ent.y-10, ent.size, 5);

  ctx.fillStyle = "red";
  ctx.fillRect(ent.x, ent.y-10, ent.size * perc, 5);
  
  if (ent.special == "summonFast"){
    var rand = Math.random();
    if (rand < 0.01){
      newEnemy("fast",ent.x,ent.y, ent.pathNode);
    }
  }
  if (ent.special == "dodger"){
    var rand = Math.random();
    if (rand < 0.15){
      Math.random() < 0.5 ? ent.y += 10 : ent.y -= 10
    }
  }
  
  if (ent.special == "teleport"){
    var rand = Math.random();
    if (rand < 0.02){
      if (ent.goToPosX) ent.x += ent.speed * 5;
      if (ent.goToPosX == false) ent.x -= ent.speed * 5;
      for (var key in enemies){
        var range = Math.sqrt(Math.pow(enemies[key].y - ent.y,2) + Math.pow(enemies[key].x - ent.x,2));
        if (range < 100 && ent.goToPosX){
          enemies[key].x += enemies[key].speed * 5;
        }
        if (range < 100 && ent.goToPosX == false){
          enemies[key].x -= enemies[key].speed * 5;
        }
      }
    }
  }
  if (ent.special == "summon"){
    var rand = Math.random();
    if (rand < 0.01){
      newEnemy("basic",ent.x,ent.y, ent.pathNode);
    }
  }
  if (ent.special == "heal" && ent.hp < 20){
    ent.hp += 1/30;
    for (var key in enemies){
      var range = Math.sqrt(Math.pow(enemies[key].y - ent.y,2) + Math.pow(enemies[key].x - ent.x,2));
      if (range < 50 && enemies[key].hp < 20){
        enemies[key].hp+=1/20;
      }
    }
  }
  
  var path = ent.pathNode;
  
  if (ent.y > pathPoints[path].y){
    ent.y-=ent.speed;
    ent.goToPosY = true;
  }
  if (ent.y < pathPoints[path].y){
    ent.y+=ent.speed;
    ent.goToPosY = true;
  }
  if (ent.x < pathPoints[path].x){
    ent.x+= ent.speed;
    ent.goToPosX = true;
    ent.goToPosY = false;
  }
  if (ent.x > pathPoints[path].x){
    ent.x-=ent.speed;
    ent.goToPosX = false;
    ent.goToPosY = false;
  }
  
  // 997 - 1003
  if (ent.x-3 <= pathPoints[path].x && ent.x+3 >= pathPoints[path].x && ent.y-3 <= pathPoints[path].y && ent.y+3 >= pathPoints[path].y){
    ent.pathNode++;
  }
  
  if (ent.selected){
    ctx.font = "600 16px Arial bold";
    ctx.fillStyle = "black";
    ctx.fillText((Math.floor(ent.hp*10)/10)+" hp",ent.x-10,ent.y-10);
  }
  
  if (ent.onFire > 0){
    ent.onFire -= 1;
    ent.hp -= 1/10;
    newParticle(ent.x+ent.size/2,ent.y+ent.size/2,60,"red");
    newParticle(ent.x+ent.size/2,ent.y+ent.size/2,40,"yellow");
  }
  if (ent.poison > 0){
    ent.poison -= 1/2;
    ent.hp -= 1/20;
    newParticle(ent.x+ent.size/2,ent.y+ent.size/2,100,"lime");
  }
  
  
}

function wave(type, amount, timeout, speedup) {
  var x = 0;

  function newEnemyToWave() {
    if (x < amount) {
      newEnemy(type);
    }
    x++;

    if (!speedup) setTimeout(newEnemyToWave, timeout);
    if (speedup) setTimeout(newEnemyToWave, timeout/(x/2));
  }
  newEnemyToWave();
}

function turretEngine(turret) {
  if (turret.fire < turret.fireRate){
    turret.fire++;
  }
  
  ctx.beginPath();
  ctx.arc(turret.x, turret.y, 10, 0, 2 * Math.PI, false);
  ctx.fillStyle = turret.color;
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = turret.strokeColor;
  ctx.stroke();
  
  var showRange = document.getElementById("showrange").checked;
  
  if (showRange == true || turret.selected){
    ctx.fillStyle = turret.color;
    ctx.beginPath();
    ctx.arc(turret.x,turret.y,turret.range,0,Math.PI*2,true);
    ctx.stroke();
    ctx.font = "600 16px Arial bold";
    ctx.fillStyle = "black";
    // turret -> upgrades -> lvl1 -> dmg
    var upDmg = turret.upgrades["lvl"+(turret.level+1)].dmg;
    var upFire = turret.upgrades["lvl"+(turret.level+1)].fireRate;
    var upPrice = turret.upgrades["lvl"+(turret.level+1)].price;
    
    if (turret.level == 4){
      var fireRate = (Math.floor(1000/60 * turret.fireRate*100/1000)/100);
      ctx.fillText(turret.dmg+" dmg",turret.x-10,turret.y-30);
      ctx.fillText(fireRate+"s",turret.x-10,turret.y-20);
    }
    
    if (turret.level < 4){
      ctx.fillText((Math.floor(turret.dmg*100)/100)+" dmg -> "+upDmg,turret.x-10,turret.y-45);
      var fireRate = (Math.floor(1000/60 * turret.fireRate*100/1000)/100);
      upFire = (Math.floor(1000/60 * upFire*100/1000)/100);
      ctx.fillText(fireRate+"s -> "+upFire+"s",turret.x-10,turret.y-30);
      ctx.fillText(upPrice+"$",turret.x-10,turret.y-15);
      ctx.fillText(turret.level,turret.x-3,turret.y+3);
    }
  }
  
  var perc = turret.fire / turret.fireRate;
  
  ctx.fillStyle = "black";
  ctx.fillRect(turret.x-10, turret.y+10, 20, 5);

  ctx.fillStyle = "yellow";
  ctx.fillRect(turret.x-10, turret.y+10, 20 * perc, 5);
  
  if (turret.fire >= turret.fireRate) {
      for (var key in enemies){
        var range = Math.sqrt(Math.pow(enemies[key].y - turret.y,2) + Math.pow(enemies[key].x - turret.x,2));
        if (range <= turret.range){
          turret.fire = 0;
          var speedX = ((enemies[key].x - turret.x) / range) * 4;
          var speedY = ((enemies[key].y - turret.y) / range) * 4;
          
          if (enemies[key].goToPosX){
            var xcom = eval("+enemies[key].speed");
          }
          if (enemies[key].goToPosX == false){
            var xcom = eval("-enemies[key].speed");
          }
          if (turret.type == "flamethrower"){
            newBullet(turret.x,turret.y, 0, speedX+xcom, speedY, turret.dmg*10);
            break;
          }
          if (turret.type == "poison"){
            newBullet(turret.x,turret.y, 0, speedX+xcom, speedY, 0, turret.dmg*10);
          }
          
          if (turret.type !== "poison" && turret.type !== "flamethrower"){
            newBullet(turret.x,turret.y, turret.dmg, speedX+xcom, speedY);
          }
          //newBullet(turret.x,turret.y, turret.dmg, speedX+enemies[key].speed, speedY);
          if (turret.type !== "shotgun" && turret.type !== "poison"){
            break;
          }
        }
      }
  }
  // turret -> upgrades -> lvl1 -> dmg
  var level = "lvl"+turret.level;
  
  var stats = turret.upgrades[level];
  
  turret.range = stats.range;
  turret.dmg = stats.dmg;
  turret.fireRate = stats.fireRate;
  
  var upPrice = turret.upgrades[("lvl"+(turret.level+1))].price;
  
  var nextLevel = turret.upgrades[("lvl"+(turret.level+1))];
  //                          U
  if (turret.selected && keys[85] && turret.level < 4){
    var newFireRate = (Math.floor(1000/60 * nextLevel.fireRate*100/1000)/100);
    var actualFireRate = (Math.floor(1000/60 * turret.fireRate*100/1000)/100);
    $('#dialog-msg').html("Are you sure you want to spend <b><u>"+upPrice+"$</u></b> for upgrade?<br>Damage: "+(Math.floor(turret.dmg*100)/100)+" &#x279C; "+(Math.floor(nextLevel.dmg*100)/100)+"<br>Fire rate: "+(Math.floor(actualFireRate*100)/100)+"s &#x279C; "+(Math.floor(newFireRate*100)/100)+"s<br>Range: "+turret.range.toFixed(0)+"m &#x279C; "+nextLevel.range.toFixed(0)+"m");
    $('#dialog').dialog({
      modal: true,
      draggable: false,
      resizeable: false,
      title: "Are you sure?",
      buttons:{
        "OK":function(){
          if (money >= upPrice){
            money -= upPrice;
            turret.level++;
            $(this).dialog("close");
          }
        },
        "CANCEL":function(){
          $(this).dialog("close");
        }
      }
    });
  }
  //                          S
  if (turret.selected && keys[83]){
    var sellPrice = Math.floor(stats.price);
    $('#dialog-msg').html("Sell turret for "+sellPrice+"$ ?")
    $('#dialog').dialog({
      modal: true,
      draggable: false,
      resizeable: false,
      title: "Are you sure?",
      buttons:{
        "Yes":function(){
          money += sellPrice;
          turret.isSold = true;
          $(this).dialog("close");
        },
        "No":function(){
          $(this).dialog("close");
        }
      }
    });
  }
  
}

function bulletEngine(bullet){
  ctx.fillStyle = "black";
  if (bullet.fire > 0) ctx.fillStyle = "red";
  if (bullet.poison > 0) ctx.fillStyle = "lime";
  ctx.beginPath();
  ctx.arc(bullet.x, bullet.y, 2.5, 0, 2 * Math.PI, false);
  ctx.fill();
  bullet.x += bullet.vx;
  bullet.y += bullet.vy;
  
//   var smallestDistance = 1e99;
//   var smallestKey = 0;
  
  
//   for (var key in enemies){
//     var dist = Math.sqrt(Math.pow(bullet.y - enemies[key].y,2) + Math.pow(bullet.x - enemies[key].x,2));
//     if (dist < smallestDistance){
//       smallestKey = parseFloat(key);
//       smallestDistance = dist;
//     }
//   }
  
//   if (!enemies[smallestKey]){
//     bullet.x += bullet.vx;
//     bullet.y += bullet.vy;
//   }
  
//     if (enemies[smallestKey]){
//       if (bullet.x > enemies[smallestKey].x){
//       bullet.x -= 5;
//       }
//       if (bullet.x < enemies[smallestKey].x){
//         bullet.x += 5;
//       }
//       if (bullet.y > enemies[smallestKey].y){
//         bullet.y -= 5;
//       }
//       if (bullet.y < enemies[smallestKey].y){
//         bullet.y += 5;
//       }
//     }
}

function particle(particle){
  ctx.fillStyle = particle.color;
  ctx.fillRect(particle.x,particle.y,particle.life/50,particle.life/50);
  
  particle.x += particle.vx;
  particle.y += particle.vy;
  particle.life--;
}


function drawMap(){
  ctx.beginPath();
  ctx.strokeStyle = "darkgreen";
  ctx.lineWidth=20;
  var lastPoint = null;
  for(var i = 0; i < pathPoints.length; i++) {
    var curPoint = pathPoints[i];
    if (lastPoint)
      ctx.lineTo(curPoint.x, curPoint.y);
      ctx.moveTo(curPoint.x, curPoint.y);
      lastPoint = curPoint;
    }
  ctx.stroke();
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}
window.oncontextmenu = function(){
  document.getElementById("select").checked = true;
  return false;
}
function placeTower(){
  // check collision with mouse
  for (var key in turrets){
    var dx = turrets[key].x - mouseX;
    var dy = turrets[key].y - mouseY;
    var distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < 13){
      turrets[key].selected = true;
      break;
    }
    if (distance > 13){
      for (var key in turrets){
        turrets[key].selected = false;
      }
    }
  }
  
  for (var key in enemies){
    var dx = enemies[key].x - mouseX;
    var dy = enemies[key].y - mouseY;
    var distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < enemies[key].size + 3){
      enemies[key].selected = true;
      break;
    }
    if (distance > 13){
      for (var key in enemies){
        enemies[key].selected = false;
      }
    }
  }
  
  var normalChecked = document.getElementById("normal").checked;
  var shotgunChecked = document.getElementById("shotgun").checked;
  var minigunChecked = document.getElementById("minigun").checked;
  var sniperChecked = document.getElementById("sniper").checked;
  var poisonChecked = document.getElementById("poison").checked;
  var flamethrowerChecked = document.getElementById("flamethrower").checked;
  
  if (normalChecked && money >= 20){
    newTurret("normal",mouseX,mouseY);
    money -= 20;
  }
  if (shotgunChecked && money >= 100){
    newTurret("shotgun",mouseX,mouseY);
    money -= 100;
  }
  if (minigunChecked && money >= 30){
    newTurret("minigun",mouseX,mouseY);
    money -= 30;
  }
  if (sniperChecked && money >= 75){
    newTurret("sniper",mouseX,mouseY);
    money -= 75;
  }
  if (poisonChecked && money >= 35){
    newTurret("poison",mouseX,mouseY);
    money -= 35;
  }
  if (flamethrowerChecked && money >= 40){
    newTurret("flamethrower",mouseX,mouseY);
    money -= 40;
  }
  
  document.getElementById("select").checked = true;
  
}

document.onmousemove = function(mouse){
  mouseX = mouse.clientX - document.getElementById('canvas').getBoundingClientRect().left;
  mouseY = mouse.clientY - document.getElementById('canvas').getBoundingClientRect().top;
};

// basic, fast, boss, dodger, runner, teleporter, summoner, healer, heavy
function nextWave(){
  
  waveCount++;
  money += 5;
  var enemies = ["basic","fast","boss","dodger","runner","teleporter","summoner","healer","heavy"];
  var teamWork = Math.random();
  
  var type = Math.floor((Math.random()*31*waveCount)+1);
  
  var rand = Math.random() < 0.5 ? true : false;
  
  var randSpeed = Math.floor((Math.random()*2500)+500);
  if (waveCount > 10){
    randSpeed = 1000;
  }
  if (waveCount > 25){
    randSpeed = 500;
  }
  if (waveCount > 50){
    randSpeed = 250;
  }
  if (waveCount > 100){
    randSpeed = 100;
  }
  if (waveCount > 200){
    randSpeed = 50;
  }
  
  if (type > 0){
    wave("basic",waveCount*3,randSpeed,rand);
  }
  if (type > 200 && waveCount % 10 !== 0 && waveCount % 25 !== 0){
    wave("fast",waveCount*2,randSpeed,rand);
  }
  if (type > 300 && waveCount % 10 !== 0 && waveCount % 25 !== 0){
    wave("dodger",waveCount*2,randSpeed,rand);
  }
  if (type > 400 && waveCount % 10 !== 0 && waveCount % 25 !== 0){
    wave("runner",waveCount*2,randSpeed,rand);
  }
  if (type > 500 && waveCount % 10 !== 0 && waveCount % 25 !== 0){
    wave("teleporter",waveCount*5,randSpeed,rand);
  }
  if (type > 600 && waveCount % 10 !== 0 && waveCount % 25 !== 0){
    wave("summoner",waveCount*3,randSpeed,rand);
  }
  if (type > 700 && teamwork > 0.8 && waveCount % 10 !== 0 && waveCount % 25 !== 0){
    wave("healer",waveCount*2,randSpeed,rand);
  }
  if (waveCount % 10 == 0){
    wave("heavy",waveCount/10,randSpeed,rand);
  }
  if (waveCount % 25 == 0){
    wave("boss",waveCount/25,randSpeed,rand);
  }
  
}
// x,y, dmg, vx, vy
function specialAttack(){
  var wall = document.getElementById("wall").checked;
  var spiral = document.getElementById("spiral").checked;
  var sniperSkill = document.getElementById("sniperSkill").checked;
  
  if (cooldown <= 0){
    cooldown = 5000;
    //wall
    if (wall){
      for (var i = 0; i < 25; i++){
        newBullet(1250,i*16,10,-10,0);
      }
      for (var i = 0; i < 25; i++){
        newBullet(0,i*16,10,10,0);
      }
      for (var i = 0; i < 25; i++){
        newBullet(i*50,0,10,0,10);
      }
      for (var i = 0; i < 25; i++){
        newBullet(i*50,400,10,0,-10);
      }
    }
    // spiral
    if (spiral){
      for (var i = 0; i < 50; i++){
        var vx = Math.sin(i) * 5;
        var vy = Math.cos(i) * 5;
        newBullet(625,200,10,vx,vy);
      }
    }
    // accurate
    if (sniperSkill){
      for (var key in enemies){
        var range = Math.sqrt(Math.pow(enemies[key].y - 200,2) + Math.pow(enemies[key].x - 625,2));

        var speedX = ((enemies[key].x - 625) / range) * 4;
        var speedY = ((enemies[key].y - 200) / range) * 4;
        
        if (enemies[key].goToPosY){
          speedY = speedY + enemies[key].speed;
        }
        
        newBullet(625,200, 5, speedX, speedY);
      }
    }
    
  }
}
$('input[type=checkbox]').checkboxradio();
$('input[type=radio]').checkboxradio({
  icon: false
});
