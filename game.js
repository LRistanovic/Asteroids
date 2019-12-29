//napravim canvas i ctx
let canvas = document.getElementById('myCanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let ctx = canvas.getContext('2d');

//napravim pozadinu
let background = new Image();
background.src = 'Game/images/background.png';

let score = 0;
let points = 0;

//koji je screen i ostala govna
let startScreen = true;
let game = false;
let gameOver = false;
let helpScreen = false;

let easyMode = true;
let fontSize;

let ratio = canvas.height/1008;

//audio

let beep = new Audio();
beep.src = 'Game/sounds/beep.mp3';

let blop = new Audio();
blop.src = 'Game/sounds/blop.mp3';
blop.volume = 0.1;

let gameOverSound = new Audio();
gameOverSound.src = 'Game/sounds/gameOver.mp3';

let destroy = new Audio();
destroy.src = 'Game/sounds/destroy.mp3';
destroy.volume = 0.1;

//STVARI ZA GAMEPLAY//

//napravim brod i stavim ga na sredinu canvasa
let ship = {
    x: canvas.width/2, 
    y: canvas.height/2, 
    dir: 0, 
    rotating: 'stop', 
    moving: false, 
    shooting: false,
    Speed: 120*ratio,
    Reload: 1,
    bulletDamage: 2,
    bulletSpeed: 1*ratio
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
    ctx.moveTo(0, -16*ratio);
    ctx.lineTo(8*ratio, 8*ratio);
    ctx.lineTo(0, 0);
    ctx.lineTo(-8*ratio, 8*ratio);
    ctx.lineTo(0, -16*ratio);
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
        this.r = r1*ratio;
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
        this.radius = 100*ratio;
        this.speed = 75*ratio;
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
        ctx.moveTo(0, 0 - 100*ratio);
        ctx.lineTo(0 + 30*ratio, 0 - 90*ratio);
        ctx.lineTo(0 + 80*ratio, 0 - 50*ratio);
        ctx.lineTo(0 + 100*ratio, 0);
        ctx.lineTo(0 + 93*ratio, 0 + 30*ratio);
        ctx.lineTo(0 + 53*ratio, 0 + 90*ratio);
        ctx.lineTo(0, 0 + 100*ratio);
        ctx.lineTo(0 - 25*ratio, 0 + 90*ratio);
        ctx.lineTo(0 - 75*ratio, 0 + 50*ratio);
        ctx.lineTo(0 - 95*ratio, 0 + 20*ratio)
        ctx.lineTo(0 - 100*ratio, 0);
        ctx.lineTo(0 - 95*ratio, 0 - 30*ratio);
        ctx.lineTo(0 - 55*ratio, 0 - 80*ratio)
        ctx.lineTo(0, 0 - 100*ratio);
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
        this.radius = 50*ratio;
        this.speed = 100*ratio;
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
        ctx.moveTo(0, 0 - 50*ratio);
        ctx.lineTo(0 + 15*ratio, 0 - 45*ratio);
        ctx.lineTo(0 + 40*ratio, 0 - 25*ratio);
        ctx.lineTo(0 + 50*ratio, 0);
        ctx.lineTo(0 + 46.5*ratio, 0 + 15*ratio);
        ctx.lineTo(0 + 26.5*ratio, 0 + 45*ratio);
        ctx.lineTo(0, 0 + 50*ratio);
        ctx.lineTo(0 - 12.5*ratio, 0 + 45*ratio);
        ctx.lineTo(0 - 37.5*ratio, 0 + 25*ratio);
        ctx.lineTo(0 - 47.5*ratio, 0 + 10*ratio)
        ctx.lineTo(0 - 50*ratio, 0);
        ctx.lineTo(0 - 47.5*ratio, 0 - 15*ratio);
        ctx.lineTo(0 - 27.5*ratio, 0 - 40*ratio)
        ctx.lineTo(0, 0 - 50*ratio);
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
        this.radius = 25*ratio;
        this.speed = 150*ratio;
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
        ctx.moveTo(0, 0 - 25*ratio);
        ctx.lineTo(0 + 7.5*ratio, 0 - 22.5*ratio);
        ctx.lineTo(0 + 20*ratio, 0 - 12.5*ratio);
        ctx.lineTo(0 + 25*ratio, 0);
        ctx.lineTo(0 + 23.25*ratio, 0 + 7.5*ratio);
        ctx.lineTo(0 + 13.25*ratio, 0 + 22.5*ratio);
        ctx.lineTo(0, 0 + 25*ratio);
        ctx.lineTo(0 - 6.25*ratio, 0 + 22.5*ratio);
        ctx.lineTo(0 - 18.75*ratio, 0 + 12.25*ratio);
        ctx.lineTo(0 - 23.75*ratio, 0 + 5*ratio)
        ctx.lineTo(0 - 25*ratio, 0);
        ctx.lineTo(0 - 23.5*ratio, 0 - 7.5*ratio);
        ctx.lineTo(0 - 13.75*ratio, 0 - 20*ratio)
        ctx.lineTo(0, 0 - 25*ratio);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    }
};

let MouseX;
let MouseY;

document.addEventListener('mousemove', function(e) {
    let x = e.x-ship.x;
    let y = e.y-ship.y;
    MouseX = e.x;
    MouseY = e.y;

    let angle = Math.atan2(y, x)*180/Math.PI;
    if (easyMode) {
        ship.dir = angle+90;
    }
})

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
    if(e.x > canvas.width / 2 - 100*ratio && e.x < canvas.width / 2 + 100*ratio && e.y > canvas.height / 2 - 50*ratio && e.y < canvas.height / 2 + 50*ratio) {
        mouseOverStartButton = true;
    }
    else mouseOverStartButton = false;
    //canvas.width / 2 - 70, canvas.height / 2 + 70, 140, 50
    if(e.x > canvas.width / 2 - 70*ratio && e.x < canvas.width / 2 + 70*ratio && e.y > canvas.height / 2 + 70*ratio && e.y < canvas.height / 2 + 120*ratio) {
        mouseOverHelpButton = true;
    }
    else mouseOverHelpButton = false;
});
document.addEventListener('click', function(e) {
    if(startScreen && e.x > canvas.width / 2 - 100*ratio && e.x < canvas.width / 2 + 100*ratio && e.y > canvas.height / 2 - 50*ratio && e.y < canvas.height / 2 + 50*ratio) {
        game = true;
        ship.dir = 0;
        ship.moving = false;
        startScreen = false;
        beep.play();
    }
    if(startScreen & e.x > canvas.width / 2 - 70*ratio && e.x < canvas.width / 2 + 70*ratio && e.y > canvas.height / 2 + 70*ratio && e.y < canvas.height / 2 + 120*ratio) {
        helpScreen = true;
        startScreen = false;
        beep.play();
    }
});

//STVARI ZA HELP SCREEN
let mouseOverBackButton = false;

document.addEventListener('mousemove', function(e) {
    //ctx.strokeRect(canvas.width - 200, 50, 140, 50);
    if(e.x > canvas.width - 200*ratio && e.x < canvas.width - 60*ratio && e.y > 50*ratio && e.y < 100*ratio) {
        mouseOverBackButton = true;
    }
    else mouseOverBackButton = false;
});
document.addEventListener('click', function(e) {
    if(helpScreen & e.x > canvas.width - 200*ratio && e.x < canvas.width - 60*ratio && e.y > 50*ratio && e.y < 100*ratio) {
        helpScreen = false;
        startScreen = true;
        beep.play();
    }
});

//MODEBUTTON
let mouseOverModeButton = false;

document.addEventListener('mousemove', function(e) {
    //ctx.strokeRect(canvas.width - 200, 50, 140, 50);
    if(e.x > canvas.width / 2 - 70*ratio && e.x < canvas.width / 2 + 70*ratio && e.y > canvas.height / 2 + 140*ratio && e.y < canvas.height / 2 + 190*ratio) {
        mouseOverModeButton = true;
    }
    else mouseOverModeButton = false;
});
document.addEventListener('click', function(e) {
    if(startScreen && mouseOverModeButton && easyMode) {
        easyMode = false;
        beep.play();
    }
    else if(startScreen && mouseOverModeButton && easyMode == false) {
        easyMode = true;
        beep.play();
    }
});

function drawButtons() {
    ctx.strokeStyle = 'white';

    ctx.strokeRect(100*ratio, 100*ratio, 75*ratio, 75*ratio);
    ctx.beginPath();
    ctx.moveTo(137.5*ratio, 160*ratio);
    ctx.lineTo(137.5*ratio, 115*ratio);
    ctx.lineTo(157.5*ratio, 135*ratio);
    ctx.moveTo(137.5*ratio, 115*ratio);
    ctx.lineTo(117.5*ratio, 135*ratio)
    ctx.stroke();
    ctx.closePath();

    ctx.strokeRect(100*ratio, 200*ratio, 75*ratio, 75*ratio);
    ctx.beginPath();
    ctx.moveTo(160*ratio, 237.5*ratio);
    ctx.lineTo(115*ratio, 237.5*ratio);
    ctx.lineTo(135*ratio, 217.5*ratio);
    ctx.moveTo(115*ratio, 237.5*ratio);
    ctx.lineTo(135*ratio, 257.5*ratio)
    ctx.stroke();
    ctx.closePath();

    ctx.strokeRect(100*ratio, 300*ratio, 75*ratio, 75*ratio);
    ctx.beginPath();
    ctx.moveTo(115*ratio, 337.5*ratio);
    ctx.lineTo(160*ratio, 337.5*ratio);
    ctx.lineTo(140*ratio, 317.5*ratio);
    ctx.moveTo(160*ratio, 337.5*ratio);
    ctx.lineTo(140*ratio, 357.5*ratio)
    ctx.stroke();    
    ctx.closePath(); 
    
    ctx.strokeRect(100*ratio, 400*ratio, 75*ratio, 75*ratio);
    fontSize = 20*ratio
    ctx.font = fontSize.toString()+'px Arial';
    ctx.strokeText('SPACE', 105*ratio, 445*ratio);

    
    ctx.strokeRect(700*ratio, 100*ratio, 75*ratio, 75*ratio);
    fontSize = 60*ratio
    ctx.font = fontSize.toString()+'px Arial';
    ctx.strokeText('1', 720*ratio, 158*ratio);
    
    ctx.strokeRect(700*ratio, 200*ratio, 75*ratio, 75*ratio);
    ctx.strokeText('2', 720*ratio, 258*ratio);
    
    ctx.strokeRect(700*ratio, 300*ratio, 75*ratio, 75*ratio);
    ctx.strokeText('3', 720*ratio, 358*ratio);
    
    ctx.strokeRect(700*ratio, 400*ratio, 75*ratio, 75*ratio);
    ctx.strokeText('4', 720*ratio, 458*ratio);
}

//STVARI ZA GAMEOVERSCREEN
let mouseOverMainMenuBtn = false;
let mainMenuBtnClicked = false;
let mouseOverRestartBtn = false;
let restartBtnClicked = false;

document.addEventListener('mousemove', function(e) {
    if(e.x > canvas.width / 2 - 150*ratio && e.x < canvas.width / 2 - 10*ratio && e.y > canvas.height / 2 + 110*ratio && e.y < canvas.height / 2 + 160*ratio) {
        mouseOverMainMenuBtn = true;
    }
    else mouseOverMainMenuBtn = false;
    
    if(e.x > canvas.width / 2 + 10*ratio && e.x < canvas.width / 2 + 150*ratio && e.y > canvas.height / 2 + 110*ratio && e.y < canvas.height / 2 + 160*ratio) {
        mouseOverRestartBtn = true;
    }
    else mouseOverRestartBtn = false;
});

document.addEventListener('click', function(e) {
    if(gameOver & e.x > canvas.width / 2 - 150*ratio && e.x < canvas.width / 2 - 10*ratio && e.y > canvas.height / 2 + 110*ratio && e.y < canvas.height / 2 + 160*ratio) {
        mainMenuBtnClicked = true;
        beep.play();
    }
    
    if(gameOver & e.x > canvas.width / 2 + 10*ratio && e.x < canvas.width / 2 + 150*ratio && e.y > canvas.height / 2 + 110*ratio && e.y < canvas.height / 2 + 160*ratio) {
        restartBtnClicked = true;
        beep.play();
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
        if (easyMode == false) {
            if(ship.rotating === 'left') {
                ship.dir -= 4  * 50 * deltaTime;
                if(ship.dir < 0) ship.dir = 360 + ship.dir;//ovo je da ne bi bilo npr -3 nego 357   
            }
            //rotiram brod desno
            else if(ship.rotating === 'right') {
                ship.dir += 4 * 50 * deltaTime;
                if(ship.dir > 360) ship.dir = ship.dir - 360;//ovo je da ne bi bilo npr 368 nego 8
            }

            if(ship.moving) {
                ship.x += Math.sin(ship.dir * Math.PI / 180) * ship.Speed * deltaTime;
                ship.y -= Math.cos(ship.dir * Math.PI / 180) * ship.Speed * deltaTime;
            }

            if(ship.x < 0) 
                ship.x = canvas.width + ship.x;
            
            else if(ship.x > canvas.width) 
                ship.x -= canvas.width;
            
            if(ship.y < 0) 
                ship.y = canvas.height + ship.y;
            
              else if(ship.y > canvas.height) 
                ship.y -= canvas.height;

                if(ship.shooting && Date.now() > lastShot + 500/ship.Reload) {//ako je pritisnut spacebar i ako je proslo minimum 150ms od proslog metka
                    //shipPointX i shipPointY su koordinate vrha broda
                    let shipPointX = ship.x + Math.sin(ship.dir * Math.PI / 180) * 16;
                    let shipPointY = ship.y - Math.cos(ship.dir * Math.PI / 180) * 16;
                    let bullet = new Bullet(shipPointX, shipPointY, 1.5, ship.dir);//napravim novi metak
                    bullets[bullets.length] = bullet;//dodam ga u array
                    lastShot = Date.now();//stavim da je zadnji metak opaljen sad
                    blop.play();
            }
        }
        else if (easyMode) {
            if(ship.moving) {
                ship.x += Math.sin(ship.dir * Math.PI / 180) * ship.Speed * deltaTime;
                ship.y -= Math.cos(ship.dir * Math.PI / 180) * ship.Speed * deltaTime;
            }

            let shipPointX = ship.x + Math.sin(ship.dir * Math.PI / 180) * 16;
            let shipPointY = ship.y - Math.cos(ship.dir * Math.PI / 180) * 16;

            if(Date.now() > lastShot + 500/ship.Reload) {//ako je pritisnut spacebar i ako je proslo minimum 150ms od proslog metka
                //shipPointX i shipPointY su koordinate vrha broda
                let bullet = new Bullet(shipPointX, shipPointY, 1.5, ship.dir);//napravim novi metak
                bullets[bullets.length] = bullet;//dodam ga u array
                lastShot = Date.now();//stavim da je zadnji metak opaljen sad
                blop.play();
            }

            if(Math.round(shipPointX)-2 <= Math.round(MouseX) && Math.round(MouseX) <= Math.round(shipPointX)+2 && Math.round(shipPointY)-2 <= Math.round(MouseY) && Math.round(MouseY) <= Math.round(shipPointY)+2 && easyMode) {
                ship.moving = false
            }
            else if(easyMode) {
                ship.moving = true
            }

        }

        //crtanje metaka
        for(let i = 0; i < bullets.length; i++) {//prolazim kroz svaki metak
            bullets[i].draw();//funkcija ugradjena u klasu
            bullets[i].x += Math.sin(bullets[i].dir * Math.PI / 180) * 230*ship.bulletSpeed * deltaTime;//pomjeram
            bullets[i].y -= Math.cos(bullets[i].dir * Math.PI / 180) * 230*ship.bulletSpeed * deltaTime;//metak
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
                randomAsteroidX = -100*ratio;
            }
            else if(side == 1){
                randomAsteroidY = -100*ratio;
            }
            else if(side == 2){
                randomAsteroidX = canvas.width + 100*ratio;
            }
            else if(side == 3){
                randomAsteroidY = canvas.height + 100*ratio;
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
            if(asteroids[i].x < -101*ratio) 
                asteroids[i].x = canvas.width + 100*ratio;
            
            else if(asteroids[i].x > canvas.width+101*ratio) 
                asteroids[i].x = -100*ratio;
            
            if(asteroids[i].y < -101*ratio) 
                asteroids[i].y = canvas.height + 100*ratio;
            
            else if(asteroids[i].y > canvas.height+101*ratio) 
                asteroids[i].y = -100*ratio;
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
                        if(astRadius == 100*ratio) {//ako jeste i nije najmanji napravi dva manja asteroida
                            let asteroid1 = new mediumAsteroid(astX+ Math.sin((astDir+90) * Math.PI / 180), astY - Math.cos((astDir+90) * Math.PI / 180), astDir+90);
                            let asteroid2 = new mediumAsteroid(astX+ Math.sin((astDir-90) * Math.PI / 180), astY - Math.cos((astDir-90) * Math.PI / 180), astDir-90);
                            asteroids[asteroids.length] = asteroid1;
                            asteroids[asteroids.length] = asteroid2;
                        }
                        else if(astRadius == 50*ratio) {//ako jeste i nije najmanji napravi dva manja asteroida
                            let asteroid1 = new smallAsteroid(astX+ Math.sin((astDir+90) * Math.PI / 180), astY - Math.cos((astDir+90) * Math.PI / 180), astDir+90);
                            let asteroid2 = new smallAsteroid(astX+ Math.sin((astDir-90) * Math.PI / 180), astY - Math.cos((astDir-90) * Math.PI / 180), astDir-90);
                            asteroids[asteroids.length] = asteroid1;
                            asteroids[asteroids.length] = asteroid2;
                        }
                        asteroids.splice(i, 1);//izbrise udareni asteroid
                        score++;
                        points++;
                        destroy.play();
                    }
                }
            }
        }

        //provjera da li je brod udario u neki asteroid
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
                gameOverSound.play();
                window.setTimeout(function() {game = false; gameOver = true;}, 100);
            }
        }
    }
    
    else if(startScreen){//ako nisam jos kliknuo 'START' dugme
        //posvijetlim dugme ako hoverujem misom preko njega
        if(mouseOverStartButton) {
            ctx.fillStyle = '#111111';
            ctx.fillRect(canvas.width / 2 - 100*ratio, canvas.height / 2 - 50*ratio, 200*ratio, 100*ratio);
        }
        //crtam dugme
        ctx.strokeStyle = 'white';
        ctx.strokeRect(canvas.width / 2 - 100*ratio, canvas.height / 2 - 50*ratio, 200*ratio, 100*ratio);
        let fontSize = 50*ratio
        ctx.font = fontSize.toString()+'px Arial';
        ctx.strokeText('START', canvas.width / 2 - 80*ratio, canvas.height / 2 + 15*ratio);

        if(mouseOverHelpButton) {
            ctx.fillStyle = '#111111';
            ctx.fillRect(canvas.width / 2 - 70*ratio, canvas.height / 2 + 70*ratio, 140*ratio, 50*ratio);
        }
        fontSize = 30*ratio
        ctx.font = fontSize.toString()+'px Arial';
        ctx.strokeRect(canvas.width / 2 - 70*ratio, canvas.height / 2 + 70*ratio, 140*ratio, 50*ratio);
        ctx.strokeText('HELP', canvas.width / 2 - 40*ratio, canvas.height / 2 + 105*ratio);

        if(mouseOverModeButton) {
            ctx.fillStyle = '#111111';
            ctx.fillRect(canvas.width / 2 - 70*ratio, canvas.height / 2 + 140*ratio, 140*ratio, 50*ratio);
        }
        fontSize = 28*ratio
        ctx.font = fontSize.toString()+'px Arial';
        ctx.strokeRect(canvas.width / 2 - 70*ratio, canvas.height / 2 + 140*ratio, 140*ratio, 50*ratio);
        if (easyMode) {
            ctx.strokeText('EASY', canvas.width / 2 - 40*ratio, canvas.height / 2 + 175*ratio);
        }
        else {
            ctx.strokeText('HARD', canvas.width / 2 - 40*ratio, canvas.height / 2 + 175*ratio);
        }
    }

    else if(gameOver) {
        fontSize = 50*ratio
        ctx.font = fontSize.toString()+'px Arial';
        ctx.strokeStyle = 'white';
        ctx.strokeText('GAME OVER', canvas.width / 2 - 150*ratio, canvas.height / 2 + 15*ratio);
        fontSize = 40*ratio
        ctx.font = fontSize.toString()+"px Arial";
        ctx.strokeText('Score: '+score, canvas.width / 2 - 70*ratio,canvas.height / 2 + 75*ratio);
        
        if(mouseOverMainMenuBtn) {
            ctx.fillStyle = '#111111';
            ctx.fillRect(canvas.width/2 - 150*ratio, canvas.height/2 + 110*ratio, 140*ratio, 50*ratio);
        }
        ctx.strokeRect(canvas.width/2 - 150*ratio, canvas.height/2 + 110*ratio, 140*ratio, 50*ratio);
        fontSize = 20*ratio
        ctx.font = fontSize.toString()+'px Arial';
        ctx.strokeText('MAIN MENU', canvas.width / 2 - 137*ratio, canvas.height / 2 + 141.5*ratio);
        
        if(mouseOverRestartBtn) {
            ctx.fillStyle = '#111111';
            ctx.fillRect(canvas.width/2 + 10*ratio, canvas.height/2 + 110*ratio, 140*ratio, 50*ratio);
        }
        ctx.strokeRect(canvas.width/2 + 10*ratio, canvas.height/2 + 110*ratio, 140*ratio, 50*ratio);
        ctx.strokeText('RESTART', canvas.width / 2 + 35*ratio, canvas.height / 2 + 141.5*ratio);

        if(mainMenuBtnClicked) {
            window.setTimeout(() => document.location.reload(), 100);
        }

        if(restartBtnClicked) {
            score = 0;
            points = 0;
            asteroids.splice(0, asteroids.length);
            bullets.splice(0, bullets.length);
            ship.x = canvas.width/2;
            ship.y = canvas.height/2; 
            ship.dir = 0;
            ship.rotating = 'stop'; 
            ship.moving = false;
            ship.shooting = false;
            ship.Speed = 120*ratio;
            ship.Reload = 1;
            ship.bulletDamage = 2;
            ship.bulletSpeed = 1*ratio;

            restartBtnClicked = false;
            game = true;
            gameOver = false;
        }
    }

    else if(helpScreen) {
        fontSize = 30*ratio
        ctx.font = fontSize.toString()+'px Arial';
        
        ctx.strokeText('Move the ship forward', 200*ratio, 150*ratio);
        ctx.strokeText('Rotate the ship left', 200*ratio, 250*ratio);
        ctx.strokeText('Rotate the ship right', 200*ratio, 350*ratio);
        ctx.strokeText('Shoot', 200*ratio, 450*ratio);

        ctx.strokeText("Upgrade the ship's speed", 800*ratio, 150*ratio);
        ctx.strokeText("Upgrade the ship's firerate", 800*ratio, 250*ratio);
        ctx.strokeText("Upgrade the ship's bullet damage", 800*ratio, 350*ratio);
        ctx.strokeText("Upgrade the ship's bullet speed", 800*ratio, 450*ratio);
        
        drawButtons();

        fontSize = 35*ratio
        ctx.font = fontSize.toString()+'px Arial';
        ctx.strokeText('Destroy an asteroid to increment your score and points', 270*ratio, 540*ratio);
        ctx.strokeText('To upgrade a stat, you need 5 points', 400*ratio, 600*ratio);

        if(mouseOverBackButton) {
            ctx.fillStyle = '#111111';
            ctx.fillRect(canvas.width - 200*ratio, 50*ratio, 140*ratio, 50*ratio);
        }
        ctx.strokeRect(canvas.width - 200*ratio, 50*ratio, 140*ratio, 50*ratio);
        fontSize = 25*ratio
        ctx.font = fontSize.toString()+'px Arial';
        ctx.strokeText('BACK', canvas.width - 165*ratio, 83*ratio);
    }

    window.requestAnimationFrame(() => update(lastAnimationTime));
}

if (gameOver == false) {
    update();
}

//crtam score
function drawScore(){
    ctx.font = '16px Arial';
    ctx.fillStyle = "white";
    ctx.fillText('Score: '+score, 8,20);

    if (easyMode == false) {
        ctx.fillText('Points: '+points, 8*ratio,35*ratio);
        ctx.fillText('Bullet Speed: '+Math.round(ship.bulletSpeed), 8*ratio,canvas.height-15*ratio);
        ctx.fillText('Bullet Damage: '+ship.bulletDamage, 8*ratio,canvas.height-30*ratio);
        ctx.fillText('Firerate: '+ship.Reload, 8*ratio,canvas.height-45*ratio);
        ctx.fillText('Speed: '+Math.round(ship.Speed), 8*ratio,canvas.height-60*ratio);
    }
}
