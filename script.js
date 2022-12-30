
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 900;
canvas.height = 600;

// global variables
const cellSize = 100;
const cellGap = 3;
let numberOfResources = 875;
let enemiesInterval = 750;
let frame = 0;
let gameOver = false;
let score = 0;
function hit () {
    var hitted = new Audio ('hit.mp3');
    hitted.loop = false;
    hitted.play();
}
function die () {
    var ded = new Audio('die.mp3');
    ded.loop = false;
    ded.play();
}
const winningScore = 50000;

const gameGrid = [];
const defenders = [];
const enemies = [];
const enemies1 = [];
const boss = [];
const enemyPositions = [];
const projectiles = [];
const resources = [];

// mouse
const mouse = {
    x: 10,
    y: 10,
    width: 0.1,
    height: 0.1,
}
let canvasPosition = canvas.getBoundingClientRect();
canvas.addEventListener('mousemove', function(e){
    mouse.x = e.x - canvasPosition.left;
    mouse.y = e.y - canvasPosition.top;
});
canvas.addEventListener('mouseleave', function(){
    mouse.y = undefined;
    mouse.y = undefined;
});

// game board
const controlsBar = {
    width: canvas.width,
    height: cellSize,
}
class Cell {
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.width = cellSize;
        this.height = cellSize;
    }
    draw(){
        if (mouse.x && mouse.y && collision(this, mouse)){
            ctx.strokeStyle = 'black';
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
    }
}
function createGrid(){
    for (let y = cellSize; y < canvas.height; y += cellSize){
        for (let x = 0; x < canvas.width; x += cellSize){
            gameGrid.push(new Cell(x, y));
        }
    }
}
createGrid();
function handleGameGrid(){
    for (let i = 0; i < gameGrid.length; i++){
        gameGrid[i].draw();
    }
}
// projectiles
class Projectile {
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.width = 2.5;
        this.height = 1;
        this.power = Math.random() * 1 + 5;
        this.speed = Math.random() * 1 + 2;
    }
    update(){
        this.x += this.speed;
    }
    draw(){
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.width, 0, Math.PI * 2);
        ctx.fill();
    }
}
function handleProjectiles(){
    for (let i = 0; i < projectiles.length; i++){
        projectiles[i].update();
        projectiles[i].draw();

        for (let j = 0; j < enemies.length; j++){
            if (enemies[j] && projectiles[i] && collision(projectiles[i], enemies[j])){
                enemies[j].health -= projectiles[i].power;
                projectiles.splice(i, 1);
                hit ();
                i--;
            }
        }

        for (let j = 0; j < enemies1.length; j++){
            if (enemies1[j] && projectiles[i] && collision(projectiles[i], enemies1[j])){
                enemies1[j].health -= projectiles[i].power;
                projectiles.splice(i, 1);
                hit ();
                i--;
            }
        }
        for (let j = 0; j < boss.length; j++){
            if (boss[j] && projectiles[i] && collision(projectiles[i], boss[j])){
                boss[j].health -= 1;
                projectiles.splice(i, 1);
                hit ();
                i--;
            }
        }

        if (projectiles[i] && projectiles[i].x > canvas.width - cellSize){
            projectiles.splice(i, 1);
            i--;
        }
    }
}

// defenders
class Defender {
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.width = cellSize - cellGap * 2;
        this.height = cellSize - cellGap * 2;
        this.shooting = false;
        this.health = Math.random() * 100 + 100;
        this.projectiles = [];
        this.timer = 0;
    }
    draw(){
        ctx.fillStyle = 'blue';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = 'gold';
        ctx.font = '30px Orbitron';
        ctx.fillText(Math.floor(this.health), this.x + 10, this.y + 30);
    }
    update(){
        if (this.shooting){
            this.timer++;
            if (this.timer % 5 === 0){
                projectiles.push(new Projectile(this.x + 70, this.y + 50));
                die ();
            }
        } else {
            this.timer = 0;
        }
    }
}
canvas.addEventListener('click', function(){
    const gridPositionX = mouse.x  - (mouse.x % cellSize) + cellGap;
    const gridPositionY = mouse.y - (mouse.y % cellSize) + cellGap;
    if (gridPositionY < cellSize) return;
    for (let i = 0; i < defenders.length; i++){
        if (defenders[i].x === gridPositionX && defenders[i].y === gridPositionY) return;
    }
    let defenderCost = 175;
    if (numberOfResources >= defenderCost){
        defenders.push(new Defender(gridPositionX, gridPositionY));
        numberOfResources -= defenderCost;
    }
});
function handleDefenders(){
    for (let i = 0; i < defenders.length; i++){
        defenders[i].draw();
        defenders[i].update();
        if (enemyPositions.indexOf(defenders[i].y) !== -1){
            defenders[i].shooting = true;
        } else {
            defenders[i].shooting = false;
        }
        for (let j = 0; j < enemies.length; j++){
            if (defenders[i] && collision(defenders[i], enemies[j])){
                enemies[j].movement = 0;
                defenders[i].health -= 2;
            }
        for (let j = 0; j < boss.length; j++){
            if (defenders[i] && collision(defenders[i], boss[j])){
                boss[j].movement = 0;
                defenders[i].health -= 10;
            }
            if (defenders[i] && defenders[i].health <= 0){
                defenders.splice(i, 1);
                die();
                i--;
                enemies[j].movement = enemies[j].speed;
                enemies1[j].movement = enemies1[j].speed;
                boss[j].movement = boss[j].speed;
            }
            }
        }
    }
}

// enemies
class Enemy {
    constructor(verticalPosition){
        this.x = canvas.width;
        this.y = verticalPosition;
        this.width = cellSize - cellGap * 2;
        this.height = cellSize - cellGap * 2;
        this.speed = Math.random() * 0.5 + 0.7;
        this.movement = this.speed;
        this.health = 150;
        this.maxHealth = this.health / 2;
    }
    update(){
        this.x -= this.movement;
    }
    draw(){
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = 'silver';
        ctx.font = '30px Orbitron';
        ctx.fillText(Math.floor(this.health), this.x + 12, this.y + 30);
    }
}
function handleEnemies(){
    for (let i = 0; i < enemies.length; i++){
        enemies[i].update();
        enemies[i].draw();
        if (enemies[i].x < -98){
            gameOver = true;
        }
        if (enemies[i].health <= 0){
            let gainedResources = enemies[i].maxHealth/5;
            numberOfResources += gainedResources;
            score += gainedResources;
            const findThisIndex = enemyPositions.indexOf(enemies[i].y);
            enemyPositions.splice(findThisIndex, 1);
            enemies.splice(i, 1);
            die ();
            i--;
          }
    }
    if (frame % enemiesInterval === 0 && score < winningScore){
        let verticalPosition = Math.floor(Math.random() * 5 + 1) * cellSize + cellGap;
        enemies.push(new Enemy(verticalPosition));
        enemyPositions.push(verticalPosition);
        if (enemiesInterval > 120) enemiesInterval -= 50;
    }
}
class Enemy1 {
    constructor(verticalPosition){
        this.x = canvas.width;
        this.y = verticalPosition;
        this.width = cellSize - cellGap * 2;
        this.height = cellSize - cellGap * 2;
        this.speed = Math.random() * 0.05 + 0.1;
        this.movement = this.speed;
        this.health = 500;
        this.maxHealth = this.health * 2;
    }
    update(){
        this.x -= this.movement;
    }
    draw(){
        ctx.fillStyle = 'orange';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = 'silver';
        ctx.font = '30px Orbitron';
        ctx.fillText(Math.floor(this.health), this.x + 12, this.y + 30);
    }
}
function handleEnemies1(){
    for (let i = 0; i < enemies1.length; i++){
        enemies1[i].update();
        enemies1[i].draw();
        if (enemies1[i].x < -98){
            gameOver = true;
        }
        if (enemies1[i].health <= 0){
            let gainedResources = enemies1[i].maxHealth/5;
            numberOfResources += gainedResources;
            score += gainedResources;
            const findThisIndex = enemyPositions.indexOf(enemies1[i].y);
            enemyPositions.splice(findThisIndex, 1);
            enemies1.splice(i, 1);
            die();
            i--;
          }
    }
    if (frame % enemiesInterval === 0 && score < winningScore){
        let verticalPosition = Math.floor(Math.random() * 5 + 1) * cellSize + cellGap;
        enemies1.push(new Enemy1(verticalPosition));
        enemyPositions.push(verticalPosition);
        if (enemiesInterval > 120) enemiesInterval -= 50;
    }
}
class Boss {
    constructor(verticalPosition){
        this.x = canvas.width;
        this.y = verticalPosition;
        this.width = cellSize - cellGap * 2;
        this.height = cellSize - cellGap * 2;
        this.speed = Math.random() * 0.01 + 0.05;
        this.movement = this.speed;
        this.health = 5000;
        this.maxHealth = this.health;
    }
    update(){
        this.x -= this.movement;
    }
    draw(){
        ctx.fillStyle = 'black';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = 'silver';
        ctx.font = '30px Orbitron';
        ctx.fillText(Math.floor(this.health), this.x + 12, this.y + 30);
    }
}
function handleBoss(){
    for (let i = 0; i < boss.length; i++){
        boss[i].update();
        boss[i].draw();
        if (boss[i].x < -98){
            gameOver = true;
        }
        if (boss[i].health <= 0){
            let gainedResources = 10000;
            numberOfResources += gainedResources;
            score += gainedResources;
            const findThisIndex = enemyPositions.indexOf(boss[i].y);
            enemyPositions.splice(findThisIndex, 1);
            boss.splice(i, 1);
            die();
            i--;
          }
    }
    if (frame % enemiesInterval === 0 && score > 500){
        let verticalPosition = Math.floor(Math.random() * 5 + 1) * cellSize + cellGap;
        boss.push(new Boss(verticalPosition));
        enemyPositions.push(verticalPosition);
        if (enemiesInterval > 120) enemiesInterval -= 50;
    }
}

// utilities
function handleGameStatus(){
    ctx.fillStyle = 'gold';
    ctx.font = '30px Orbitron';
    ctx.fillText('Score: ' + score, 20, 40);
    ctx.fillText('Resources: ' + numberOfResources, 20, 80);
    if (gameOver){
        ctx.fillStyle = 'black';
        ctx.font = '90px Orbitron';
        ctx.fillText('GAME OVER', 135, 330);
        ctx.font = '55px Orbitron';
        ctx.fillText('They invaded your base', 140, 380);
    }
    if (score >= winningScore && enemies.length === 0){
        ctx.fillStyle = 'black';
        ctx.font = '60px Orbitron';
        ctx.fillText('LEVEL COMPLETE', 130, 300);
        ctx.font = '30px Orbitron';
        ctx.fillText('You win with ' + score + ' points!', 134, 340);
    }
}

function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'blue';
    ctx.fillRect(0,0,controlsBar.width, controlsBar.height);
    handleGameGrid();
    handleDefenders();
    handleProjectiles();
    handleEnemies();
    handleEnemies1();
    handleGameStatus();
    handleBoss();
    frame++;
    if (!gameOver) requestAnimationFrame(animate);
}
animate();

function collision(first, second){
    if (    !(  first.x > second.x + second.width ||
                first.x + first.width < second.x ||
                first.y > second.y + second.height ||
                first.y + first.height < second.y)
    ) {
        return true;
    };
};

window.addEventListener('resize', function(){
    canvasPosition = canvas.getBoundingClientRect();
})