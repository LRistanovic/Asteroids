//napravim canvas i ctx
let canvas = document.getElementById('myCanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let ctx = canvas.getContext('2d');

//napravim pozadinu
let background = new Image();
background.src = 'background.png';

let score = 0;
let points = 0;

//koji je screen i ostala govna
let startScreen = true;
let game = false;
let gameOver = false;
let helpScreen = false;

//STVARI ZA GAMEPLAY//

//napravim brod i stavim ga na sredinu canvasa
let ship = {
    x: canvas.width/2, 
    y: canvas.height/2, 
    dir: 0, 
    rotating: 'stop', 
    moving: false, 
    shooting: false,
    Speed: 120,
    Reload: 1,
    bulletDamage: 2,
    bulletSpeed: 1
    };

//gledam da li je neki taster pritisnut
document.addEventListener('keydown', function(e) {
    //strelica lijevo
    if(e.keyCode == 37) 
        ship.rotating = 'left';
    
    //strelica desno
    else if(e.keyCode == 39) 
        ship.rotating = 'right';
    
    //strelica gore
    if(e.keyCode == 38) 
        ship.moving = true;
    
    if(e.keyCode == 32) 
        ship.shooting = true;
});

//gledam da li je neki taster pusten
document.addEventListener('keyup', function(e) {
    //strelica lijevo ili desnp
    if(e.keyCode == 37 || e.keyCode == 39) 
        ship.rotating = 'stop';
    //strelica gore
    
    if(e.keyCode == 38) 
        ship.moving = false;
    
    if(e.keyCode == 32) 
        ship.shooting = false;
});

document.addEventListener('keypress', function(e) {
    if(e.keyCode == 49) {
        if(points >= 5 && ship.Speed < 300)  {
            ship.Speed += 20;
            points -= 5;
        }
    }
    if(e.keyCode == 50) {
        if(points >= 5 && ship.Reload < 5)  {
            ship.Reload += 0.5;
            points -= 5;
        }
    }
    if(e.keyCode == 51) {
        if(points >= 5 && ship.bulletDamage < 10)  {
            ship.bulletDamage++;
            points -= 5;
        }
    }
    if(e.keyCode == 52) {
        if(points >= 5 && ship.bulletSpeed < 5)  {
            ship.bulletSpeed += 0.5;
            points -= 5;
        }
    }
})

//crtam brod u zavisnosti od kursa
function drawShip() {
    ctx.save();
    ctx.translate(ship.x, ship.y);
    ctx.rotate(ship.dir * Math.PI / 180);
    ctx.beginPath();
    ctx.moveTo(0, -16);
    ctx.lineTo(8, 8);
    ctx.lineTo(0, 0);
    ctx.lineTo(-8, 8);
    ctx.lineTo(0, -16);
    ctx.strokeStyle = 'white';
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
}

//klasa za metke
class Bullet {
    x;
    y;
    r;
    dir;
    constructor(x1, y1, r1, d) {
        this.x = x1;
        this.y = y1;
        this.r = r1;
        this.dir = d;
    }
    //iscrtavam ih kao male krugove
    draw() {
        ctx.beginPath();
        ctx.moveTo(this.x + this.r, this.y);
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.closePath();
    }
};

//klasa za asteroidi
class bigAsteroid {
    x;
    y;
    dir;
    constructor(x1, y1, d) {
        this.x = x1;
        this.y = y1;
        this.dir = d;
        this.HP = 15;
        this.radius = 100;
        this.speed = 75;
        this.rotationDir = (Math.floor(Math.random() * 2) === 1) ? 1 : -1;
        this.rotationSpeed = 10;
        this.drawDir = Math.floor(Math.random() * 360);
   }
    //iscrtavam ih kao krugove
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.drawDir * Math.PI / 180);
        ctx.beginPath();
        ctx.moveTo(0, 0 - 100);
        ctx.lineTo(0 + 30, 0 - 90);
        ctx.lineTo(0 + 80, 0 - 50);
        ctx.lineTo(0 + 100, 0);
        ctx.lineTo(0 + 93, 0 + 30);
        ctx.lineTo(0 + 53, 0 + 90);
        ctx.lineTo(0, 0 + 100);
        ctx.lineTo(0 - 25, 0 + 90);
        ctx.lineTo(0 - 75, 0 + 50);
        ctx.lineTo(0 - 95, 0 + 20)
        ctx.lineTo(0 - 100, 0);
        ctx.lineTo(0 - 95, 0 - 30);
        ctx.lineTo(0 - 55, 0 - 80)
        ctx.lineTo(0, 0 - 100);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    }
};

class mediumAsteroid {
    x;
    y;
    dir;
    constructor(x1, y1, d) {
        this.x = x1;
        this.y = y1;
        this.dir = d;
        this.HP = 8;
        this.radius = 50;
        this.speed = 100;
        this.rotationDir = (Math.floor(Math.random() * 2) === 1) ? 1 : -1;
        this.rotationSpeed = 17;
        this.drawDir = Math.floor(Math.random() * 360);
   }
    //iscrtavam ih kao krugove
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.drawDir * Math.PI / 180);
        ctx.beginPath();
        ctx.moveTo(0, 0 - 50);
        ctx.lineTo(0 + 15, 0 - 45);
        ctx.lineTo(0 + 40, 0 - 25);
        ctx.lineTo(0 + 50, 0);
        ctx.lineTo(0 + 46.5, 0 + 15);
        ctx.lineTo(0 + 26.5, 0 + 45);
        ctx.lineTo(0, 0 + 50);
        ctx.lineTo(0 - 12.5, 0 + 45);
        ctx.lineTo(0 - 37.5, 0 + 25);
        ctx.lineTo(0 - 47.5, 0 + 10)
        ctx.lineTo(0 - 50, 0);
        ctx.lineTo(0 - 47.5, 0 - 15);
        ctx.lineTo(0 - 27.5, 0 - 40)
        ctx.lineTo(0, 0 - 50);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    }
};

class smallAsteroid {
    x;
    y;
    dir;
    constructor(x1, y1, d) {
        this.x = x1;
        this.y = y1;
        this.dir = d;
        this.HP = 2;
        this.radius = 25;
        this.speed = 150;
        this.rotationDir = (Math.floor(Math.random() * 2) === 1) ? 1 : -1;
        this.rotationSpeed = 30;
        this.drawDir = Math.floor(Math.random() * 360);
   }
    //iscrtavam ih kao krugove
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.drawDir * Math.PI / 180);
        ctx.beginPath();
        ctx.moveTo(0, 0 - 25);
        ctx.lineTo(0 + 7.5, 0 - 22.5);
        ctx.lineTo(0 + 20, 0 - 12.5);
        ctx.lineTo(0 + 25, 0);
        ctx.lineTo(0 + 23.25, 0 + 7.5);
        ctx.lineTo(0 + 13.25, 0 + 22.5);
        ctx.lineTo(0, 0 + 25);
        ctx.lineTo(0 - 6.25, 0 + 22.5);
        ctx.lineTo(0 - 18.75, 0 + 12.25);
        ctx.lineTo(0 - 23.75, 0 + 5)
        ctx.lineTo(0 - 25, 0);
        ctx.lineTo(0 - 23.5, 0 - 7.5);
        ctx.lineTo(0 - 13.75, 0 - 20)
        ctx.lineTo(0, 0 - 25);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    }
};

//array koji sadrzi sve metke i asteroidi
let bullets = [];
let asteroids = [];
//pomocna promjenljiva s kojom pravim vremenski razmak izmedju dva metka/asteroida
//da ne bi bilo op i da ima prostora za power-up
let lastShot = 0;
let lastAsteroid = 0;

//STVARI ZA POCETNI SCREEN//

let mouseOverStartButton = false;
let mouseOverHelpButton = false;

document.addEventListener('mousemove', function(e) {
    if(e.x > canvas.width / 2 - 100 && e.x < canvas.width / 2 + 100 && e.y > canvas.height / 2 - 50 && e.y < canvas.height / 2 + 50) {
        mouseOverStartButton = true;
    }
    else mouseOverStartButton = false;
    //canvas.width / 2 - 70, canvas.height / 2 + 70, 140, 50
    if(e.x > canvas.width / 2 - 70 && e.x < canvas.width / 2 + 70 && e.y > canvas.height / 2 + 70 && e.y < canvas.height / 2 + 120) {
        mouseOverHelpButton = true;
    }
    else mouseOverHelpButton = false;
});
document.addEventListener('click', function(e) {
    if(startScreen && e.x > canvas.width / 2 - 100 && e.x < canvas.width / 2 + 100 && e.y > canvas.height / 2 - 50 && e.y < canvas.height / 2 + 50) {
        game = true;
        startScreen = false;
    }
    if(e.x > canvas.width / 2 - 70 && e.x < canvas.width / 2 + 70 && e.y > canvas.height / 2 + 70 && e.y < canvas.height / 2 + 120) {
        helpScreen = true;
        startScreen = false;
    }
});

//STVARI ZA HELP SCREEN
let mouseOverBackButton = false;

document.addEventListener('mousemove', function(e) {
    //ctx.strokeRect(canvas.width - 200, 50, 140, 50);
    if(e.x > canvas.width - 200 && e.x < canvas.width - 60 && e.y > 50 && e.y < 100) {
        mouseOverBackButton = true;
    }
    else mouseOverBackButton = false;
});
document.addEventListener('click', function(e) {
    if(e.x > canvas.width - 200 && e.x < canvas.width - 60 && e.y > 50 && e.y < 100) {
        helpScreen = false;
        startScreen = true;
    }
});

//STVARI ZA GAMEOVERSCREEN
let mouseOverMainMenuBtn = false;
let mainMenuBtnClicked = false;
let mouseOverRestartBtn = false;
let restartBtnClicked = false;

document.addEventListener('mousemove', function(e) {
    if(e.x > canvas.width / 2 - 150 && e.x < canvas.width / 2 - 10 && e.y > canvas.height / 2 + 110 && e.y < canvas.height / 2 + 160) {
        mouseOverMainMenuBtn = true;
    }
    else mouseOverMainMenuBtn = false;
    
    if(e.x > canvas.width / 2 + 10 && e.x < canvas.width / 2 + 150 && e.y > canvas.height / 2 + 110 && e.y < canvas.height / 2 + 160) {
        mouseOverRestartBtn = true;
    }
    else mouseOverRestartBtn = false;
});

document.addEventListener('click', function(e) {
    if(e.x > canvas.width / 2 - 150 && e.x < canvas.width / 2 - 10 && e.y > canvas.height / 2 + 110 && e.y < canvas.height / 2 + 160) {
        mainMenuBtnClicked = true;
    }
    
    if(e.x > canvas.width / 2 + 10 && e.x < canvas.width / 2 + 150 && e.y > canvas.height / 2 + 110 && e.y < canvas.height / 2 + 160) {
        restartBtnClicked = true;
    }
});

//glavna funkcija//
function update(animationTime) {
    //kao i uvijek
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let deltaTime = (Date.now() - (animationTime || Date.now())) / 1000;
    let lastAnimationTime = Date.now();

    //crtam pozadinu
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    if(game) {//ako sam kliknuo 'START' dugme na pocetku
        //crtam brod i score
        drawShip();
        drawScore();

        //rotiram brod lijevo
        if(ship.rotating === 'left') {
            ship.dir -= 4  * 50 * deltaTime;
            if(ship.dir < 0) ship.dir = 360 + ship.dir;//ovo je da ne bi bilo npr -3 nego 357   
        }
        //rotiram brod desno
        else if(ship.rotating === 'right') {
            ship.dir += 4 * 50 * deltaTime;
            if(ship.dir > 360) ship.dir = ship.dir - 360;//ovo je da ne bi bilo npr 368 nego 8
        }

        //pomjeram brod u zavisnosti od kursa broda
        if(ship.moving) {
            ship.x += Math.sin(ship.dir * Math.PI / 180) * ship.Speed * deltaTime;
            ship.y -= Math.cos(ship.dir * Math.PI / 180) * ship.Speed * deltaTime;
        }

        //ako brod izadje iz canvasa
        if(ship.x < 0) 
            ship.x = canvas.width + ship.x;
            
        else if(ship.x > canvas.width) 
            ship.x -= canvas.width;
            
        if(ship.y < 0) 
            ship.y = canvas.height + ship.y;
            
        else if(ship.y > canvas.height) 
            ship.y -= canvas.height;

            
        //pravljenje metaka
        if(ship.shooting && Date.now() > lastShot + 500/ship.Reload) {//ako je pritisnut spacebar i ako je proslo minimum 150ms od proslog metka
                //shipPointX i shipPointY su koordinate vrha broda
                let shipPointX = ship.x + Math.sin(ship.dir * Math.PI / 180) * 16;
                let shipPointY = ship.y - Math.cos(ship.dir * Math.PI / 180) * 16;
                let bullet = new Bullet(shipPointX, shipPointY, 1, ship.dir);//napravim novi metak
                bullets[bullets.length] = bullet;//dodam ga u array
                lastShot = Date.now();//stavim da je zadnji metak opaljen sad
        }

        //crtanje metaka
        for(let i = 0; i < bullets.length; i++) {//prolazim kroz svaki metak
            bullets[i].draw();//funkcija ugradjena u klasu
            bullets[i].x += Math.sin(bullets[i].dir * Math.PI / 180) * 200*ship.bulletSpeed * deltaTime;//pomjeram
            bullets[i].y -= Math.cos(bullets[i].dir * Math.PI / 180) * 200*ship.bulletSpeed * deltaTime;//metak
            //provjeravam da li je metak izasao iz canvasa da ne bi lagovalo
            if(bullets[i].x < 0 || bullets[i].x > canvas.width || bullets[i].y < 0 || bullets[i].y > canvas.height) 
                bullets.splice(i, 1);
        }

        //pravljenje asteroida
        if(score >= 0 && Date.now() > lastAsteroid + 2000/(Math.floor(score/39)+1)) {//ako je proslo minimum 2000ms od proslog asteroida, postepeno se ubrzava za svaki 20 score

            //odreduje sa koje strane ce nastati asteroid
            let side = Math.floor(Math.random()*4);
            let randomAsteroidX = Math.floor(Math.random()*canvas.width);
            let randomAsteroidY = Math.floor(Math.random()*canvas.height);
            let randomAsteroidDir = Math.floor(Math.random()*180);
            let randomAsteroidSize = Math.floor(Math.random()*3);
            let asteroid;

            if(side == 0) {
                randomAsteroidX = -100;
            }
            else if(side == 1){
                randomAsteroidY = -100;
            }
            else if(side == 2){
                randomAsteroidX = canvas.width + 100;
            }
            else if(side == 3){
                randomAsteroidY = canvas.height + 100;
            }

            if(randomAsteroidSize == 0) {
                asteroid = new bigAsteroid(randomAsteroidX, randomAsteroidY, randomAsteroidDir);
            }
            else if(randomAsteroidSize == 1) {
                asteroid = new mediumAsteroid(randomAsteroidX, randomAsteroidY, randomAsteroidDir);
            }
            else if(randomAsteroidSize == 2) {
                asteroid = new smallAsteroid(randomAsteroidX, randomAsteroidY, randomAsteroidDir);
            }
            
            asteroids[asteroids.length] = asteroid;//dodam ga u array
            lastAsteroid = Date.now();//stavim da je zadnji asteroid napravljen sad
    }

        for(let i = 0; i < asteroids.length; i++) {//prolazim kroz svaki asteroid
            asteroids[i].draw();//funkcija ugradjena u klasu
            asteroids[i].drawDir += asteroids[i].rotationDir * asteroids[i].rotationSpeed * deltaTime;
            if(asteroids[i].dir > 360) asteroids[i].dir = asteroids[i].dir - 360;
            asteroids[i].x += Math.sin(asteroids[i].dir * Math.PI / 180) * asteroids[i].speed * deltaTime;//pomjeram
            asteroids[i].y -= Math.cos(asteroids[i].dir * Math.PI / 180) * asteroids[i].speed * deltaTime;//asteroid
            //provjeravam da li je citav asteroid izasao iz canvasa
            if(asteroids[i].x < -101) 
                asteroids[i].x = canvas.width + 100;
            
            else if(asteroids[i].x > canvas.width+101) 
                asteroids[i].x = -100;
            
            if(asteroids[i].y < -101) 
                asteroids[i].y = canvas.height + 100;
            
            else if(asteroids[i].y > canvas.height+101) 
                asteroids[i].y = -100;
        }
        //provjera ako je metak udario asteroid
        for(let i = 0; i < asteroids.length; i++) {
            let astX = asteroids[i].x;
            let astY = asteroids[i].y;
            let astDir = asteroids[i].dir;
            let astRadius = asteroids[i].radius;
            for(let m = 0; m < bullets.length; m++) {
                let bulX = bullets[m].x;
                let bulY = bullets[m].y;

                if(Math.sqrt(Math.pow(bulX-astX, 2) + Math.pow(bulY-astY, 2)) <= astRadius) {
                    bullets.splice(m, 1);
                    asteroids[i].HP -= ship.bulletDamage;
                    if (asteroids[i].HP <= 0) {
                        if(astRadius == 100) {//ako jeste i nije najmanji napravi dva manja asteroida
                            let asteroid1 = new mediumAsteroid(astX+ Math.sin((astDir+90) * Math.PI / 180), astY - Math.cos((astDir+90) * Math.PI / 180), astDir+90);
                            let asteroid2 = new mediumAsteroid(astX+ Math.sin((astDir-90) * Math.PI / 180), astY - Math.cos((astDir-90) * Math.PI / 180), astDir-90);
                            asteroids[asteroids.length] = asteroid1;
                            asteroids[asteroids.length] = asteroid2;
                        }
                        else if(astRadius == 50) {//ako jeste i nije najmanji napravi dva manja asteroida
                            let asteroid1 = new smallAsteroid(astX+ Math.sin((astDir+90) * Math.PI / 180), astY - Math.cos((astDir+90) * Math.PI / 180), astDir+90);
                            let asteroid2 = new smallAsteroid(astX+ Math.sin((astDir-90) * Math.PI / 180), astY - Math.cos((astDir-90) * Math.PI / 180), astDir-90);
                            asteroids[asteroids.length] = asteroid1;
                            asteroids[asteroids.length] = asteroid2;
                        }
                        asteroids.splice(i, 1);//izbrise udareni asteroid
                        score++;
                        points++;
                    }
                }
            }
        }

        for(let i = 0; i < asteroids.length; i++) {
            let astX = asteroids[i].x;
            let astY = asteroids[i].y;
            let astRadius = asteroids[i].radius;
            let shipPointX1 = ship.x + Math.sin(ship.dir * Math.PI / 180) * 16;
            let shipPointY1 = ship.y - Math.cos(ship.dir * Math.PI / 180) * 16;
            let shipPointX2 = ship.x + Math.sin(ship.dir * Math.PI / 180) * -8;
            let shipPointY2 = ship.y - Math.cos(ship.dir * Math.PI / 180) * -8;
            let shipPointX3 = ship.x + Math.sin(ship.dir * Math.PI / 180) * 8;
            let shipPointY3 = ship.y - Math.cos(ship.dir * Math.PI / 180) * -8;//tri tjeme od ship
            //provjerim ako su bila koja od ta tri tjemena u asteroidu
            if(Math.sqrt(Math.pow(shipPointX1-astX, 2) + Math.pow(shipPointY1-astY, 2)) <= astRadius ||
               Math.sqrt(Math.pow(shipPointX2-astX, 2) + Math.pow(shipPointY2-astY, 2)) <= astRadius ||
               Math.sqrt(Math.pow(shipPointX3-astX, 2) + Math.pow(shipPointY3-astY, 2)) <= astRadius ) {
                game = false;
                gameOver = true;
            }
        }
    }
    
    else if(startScreen){//ako nisam jos kliknuo 'START' dugme
        //posvijetlim dugme ako hoverujem misom preko njega
        if(mouseOverStartButton) {
            ctx.fillStyle = '#111111';
            ctx.fillRect(canvas.width / 2 - 100, canvas.height / 2 - 50, 200, 100);
        }
        //crtam dugme
        ctx.strokeStyle = 'white';
        ctx.strokeRect(canvas.width / 2 - 100, canvas.height / 2 - 50, 200, 100);
        ctx.font = '50px Arial';
        ctx.strokeText('START', canvas.width / 2 - 80, canvas.height / 2 + 15);

        if(mouseOverHelpButton) {
            ctx.fillStyle = '#111111';
            ctx.fillRect(canvas.width / 2 - 70, canvas.height / 2 + 70, 140, 50);
        }
        ctx.font = '30px Arial';
        ctx.strokeRect(canvas.width / 2 - 70, canvas.height / 2 + 70, 140, 50);
        ctx.strokeText('HELP', canvas.width / 2 - 40, canvas.height / 2 + 105);
    }

    else if(gameOver) {
        ctx.font = '50px Arial';
        ctx.strokeStyle = 'white';
        ctx.strokeText('GAME OVER', canvas.width / 2 - 150, canvas.height / 2 + 15);
        ctx.font = "40px Arial";
        ctx.strokeText('Score: '+score, canvas.width / 2 - 70,canvas.height / 2 + 75);
        
        if(mouseOverMainMenuBtn) {
            ctx.fillStyle = '#111111';
            ctx.fillRect(canvas.width/2 - 150, canvas.height/2 + 110, 140, 50);
        }
        ctx.strokeRect(canvas.width/2 - 150, canvas.height/2 + 110, 140, 50);
        ctx.font = '20px Arial';
        ctx.strokeText('MAIN MENU', canvas.width / 2 - 137, canvas.height / 2 + 141.5);
        
        if(mouseOverRestartBtn) {
            ctx.fillStyle = '#111111';
            ctx.fillRect(canvas.width/2 + 10, canvas.height/2 + 110, 140, 50);
        }
        ctx.strokeRect(canvas.width/2 + 10, canvas.height/2 + 110, 140, 50);
        ctx.strokeText('RESTART', canvas.width / 2 + 35, canvas.height / 2 + 141.5);

        if(mainMenuBtnClicked) {
            document.location.reload();
        }

        if(restartBtnClicked) {
            score = 0;
            asteroids.splice(0, asteroids.length);
            bullets.splice(0, bullets.length);
            ship.x = canvas.width/2;
            ship.y = canvas.height/2; 
            ship.dir = 0;
            ship.rotating = 'stop'; 
            ship.moving = false;
            ship.shooting = false;
            ship.Speed = 120;
            ship.Reload = 1;
            ship.bulletDamage = 2;
            ship.bulletSpeed = 1;

            restartBtnClicked = false;
            game = true;
            gameOver = false;
        }
    }

    else if(helpScreen) {
        ctx.font = '50px Arial';
        ctx.strokeText('OVDE IDU UPUTSTVA', 50, 150);
        if(mouseOverBackButton) {
            ctx.fillStyle = '#111111';
            ctx.fillRect(canvas.width - 200, 50, 140, 50);
        }
        ctx.strokeRect(canvas.width - 200, 50, 140, 50);
        ctx.font = '25px Arial';
        ctx.strokeText('BACK', canvas.width - 165, 83);
    }

    window.requestAnimationFrame(() => update(lastAnimationTime));
}

if (gameOver == false) {
    update();
}

//crtam score
function drawScore(){
    ctx.font = "16px Arial";
    ctx.fillStyle = "white";
    ctx.fillText('Score: '+score, 8,20);
    ctx.fillText('Points: '+points, 8,35);
    ctx.fillText('Speed: '+ship.Speed, 8,canvas.height-15);
    ctx.fillText('Reload: '+ship.Reload, 8,canvas.height-30);
    ctx.fillText('Damage: '+ship.bulletDamage, 8,canvas.height-45);
    ctx.fillText('Bullet Speed: '+ship.bulletSpeed, 8,canvas.height-60);
}