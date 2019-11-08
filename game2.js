//VERZIJA 0.2//
//SADRZI BROD SA POTPUNIM POMJERANJEM I MOGUCNOST DA PUCA//

//napravim canvas i ctx
let canvas = document.getElementById('myCanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let ctx = canvas.getContext('2d');
let gamestarted = false;

//napravim pozadinu
let background = new Image();
background.src = '../Pictures/background.png';

//STVARI ZA GAMEPLAY//

//napravim brod i stavim ga na sredinu canvasa
let ship = {x: canvas.width/2, 
    y: canvas.height/2, 
    dir: 0, 
    rotating: 'stop', 
    moving: false, 
    shooting: false};

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
class Asteroid {
    x;
    y;
    size;
    dir;
    constructor(x1, y1, s, d) {
        this.x = x1;
        this.y = y1;
        this.size = s;
        this.dir = d;
   }
    //iscrtavam ih kao krugove
    draw() {
        let r = 25* Math.pow(2, this.size);//za size 0,1,2 r je 25,50,100
        ctx.beginPath();
        ctx.moveTo(this.x + r, this.y);
        ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
        ctx.strokeStyle = 'white';
        ctx.stroke();
        ctx.closePath();
    }
};

//array koji sadrzi sve metke i asteroidi
let bullets = [];
let asteroids = [];
//pomocna promjenljiva s kojom pravim vremenski razmak izmedju dva metka/asteroida
//da ne bi bilo op i da ima prostora za power-up
let lastShot = 0;
let lastAsteroid = 0;
//score
let score = 0;
//promjenljiva za ako umres
let gameOver = false;

//STVARI ZA POCETNI SCREEN//

let mouseOverStartButton = false;

document.addEventListener('mousemove', function(e) {
    if(e.x > canvas.width / 2 - 100 && e.x < canvas.width / 2 + 100 && e.y > canvas.height / 2 - 50 && e.y < canvas.height / 2 + 50) {
        mouseOverStartButton = true;
    }
    else mouseOverStartButton = false;
});
document.addEventListener('click', function(e) {
    if(e.x > canvas.width / 2 - 100 && e.x < canvas.width / 2 + 100 && e.y > canvas.height / 2 - 50 && e.y < canvas.height / 2 + 50) {
        gamestarted = true;
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
    if(gamestarted) {//ako sam kliknuo 'START' dugme na pocetku
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
            ship.x += Math.sin(ship.dir * Math.PI / 180) * 250 * deltaTime;
            ship.y -= Math.cos(ship.dir * Math.PI / 180) * 250 * deltaTime;
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
        if(ship.shooting && Date.now() > lastShot + 150) {//ako je pritisnut spacebar i ako je proslo minimum 150ms od proslog metka
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
            bullets[i].x += Math.sin(bullets[i].dir * Math.PI / 180) * 500 * deltaTime;//pomjeram
            bullets[i].y -= Math.cos(bullets[i].dir * Math.PI / 180) * 500 * deltaTime;//metak
            //provjeravam da li je metak izasao iz canvasa da ne bi lagovalo
            if(bullets[i].x < 0 || bullets[i].x > canvas.width || bullets[i].y < 0 || bullets[i].y > canvas.height) 
                bullets.splice(i, 1);
        }

        //pravljenje asteroida
        if(score >= 0 && Date.now() > lastAsteroid + 2000/(Math.floor(score/19)+1)) {//ako je proslo minimum 2000ms od proslog asteroida, postepeno se ubrzava za svaki 20 score
            //shipPointX i shipPointY su koordinate vrha broda
            

            //odreduje sa koje strane ce nastati asteroid
            let side = Math.floor(Math.random()*4);
            let randomAsteroidX = Math.floor(Math.random()*canvas.width);
            let randomAsteroidY = Math.floor(Math.random()*canvas.height);
            let randomAsteroidDir = Math.floor(Math.random()*180);
            let randomAsteroidSize = Math.floor(Math.random()*3);
            let asteroid;

            if(side == 0) {
                asteroid = new Asteroid(-100, randomAsteroidY, randomAsteroidSize, randomAsteroidDir);
            }
            else if(side == 1){
                asteroid = new Asteroid(randomAsteroidX, -100, randomAsteroidSize, randomAsteroidDir);
            }
            else if(side == 2){
                asteroid = new Asteroid(canvas.width+100, randomAsteroidY, randomAsteroidSize, randomAsteroidDir);
            }
            else if(side == 3){
                asteroid = new Asteroid(randomAsteroidX, canvas.height+100, randomAsteroidSize, randomAsteroidDir);
            }
            
            asteroids[asteroids.length] = asteroid;//dodam ga u array
            lastAsteroid = Date.now();//stavim da je zadnji asteroid napravljen sad
    }

        for(let i = 0; i < asteroids.length; i++) {//prolazim kroz svaki asteroid
            asteroids[i].draw();//funkcija ugradjena u klasu
            if(asteroids[i].dir > 360) asteroids[i].dir = asteroids[i].dir - 360;
            asteroids[i].x += Math.sin(asteroids[i].dir * Math.PI / 180) * 150 * deltaTime;//pomjeram
            asteroids[i].y -= Math.cos(asteroids[i].dir * Math.PI / 180) * 150 * deltaTime;//asteroid
            //provjeravam da li je citav asteroid izasao iz canvasa da ne bi lagovalo
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
            let astRadius = 25*Math.pow(2, asteroids[i].size);
            for(let m = 0; m < bullets.length; m++) {
                let bulX = bullets[m].x;
                let bulY = bullets[m].y;

                if(Math.sqrt(Math.pow(bulX-astX, 2) + Math.pow(bulY-astY, 2)) <= astRadius) {
                    bullets.splice(m, 1);
                    if(asteroids[i].size > 0) {//ako jeste i nije najmanji napravi dva manja asteroida
                        let asteroid1 = new Asteroid(astX+ Math.sin((asteroids[i].dir+90) * Math.PI / 180), astY - Math.cos((asteroids[i].dir+90) * Math.PI / 180), asteroids[i].size-1, asteroids[i].dir+90);
                        let asteroid2 = new Asteroid(astX+ Math.sin((asteroids[i].dir-90) * Math.PI / 180), astY - Math.cos((asteroids[i].dir-90) * Math.PI / 180), asteroids[i].size-1, asteroids[i].dir-90);
                        asteroids[asteroids.length] = asteroid1;
                        asteroids[asteroids.length] = asteroid2;
                        asteroids.splice(i, 1);
                    }
                    asteroids.splice(i, 1);//izbrise udareni asteroid
                    score++;
                }
            }
        }

        for(let i = 0; i < asteroids.length; i++) {
            let astX = asteroids[i].x;
            let astY = asteroids[i].y;
            let astRadius = 25*Math.pow(2, asteroids[i].size);
            let shipPointX1 = ship.x + Math.sin(ship.dir * Math.PI / 180) * 16;
            let shipPointY1 = ship.y - Math.cos(ship.dir * Math.PI / 180) * 16;
            let shipPointX2 = ship.x + Math.sin(ship.dir * Math.PI / 180) * 8;
            let shipPointY2 = ship.y - Math.cos(ship.dir * Math.PI / 180) * 8;
            let shipPointX3 = ship.x + Math.sin(ship.dir * Math.PI / 180) * -8;
            let shipPointY3 = ship.y - Math.cos(ship.dir * Math.PI / 180) * 8;//tri tjeme od ship
            //provjerim ako su bila koja od ta tri tjemena u asteroidu
            if(Math.sqrt(Math.pow(shipPointX1-astX, 2) + Math.pow(shipPointY1-astY, 2)) <= astRadius ||
               Math.sqrt(Math.pow(shipPointX2-astX, 2) + Math.pow(shipPointY2-astY, 2)) <= astRadius ||
               Math.sqrt(Math.pow(shipPointX3-astX, 2) + Math.pow(shipPointY3-astY, 2)) <= astRadius ) {
                ctx.font = '50px Arial';
                ctx.strokeText('GAME OVER', canvas.width / 2 - 80, canvas.height / 2 + 15);
                gameOver = true;
            }
        }
    }
    
    else {//ako nisam jos kliknuo 'START' dugme
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
    }

    //kao i uvijek
    if (gameOver == false) {
        window.requestAnimationFrame(() => update(lastAnimationTime));
    }
}

if (gameOver == false) {
    update();
}

//crtam score
function drawScore(){
    ctx.font = "16px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Score:"+score,8,20);
}
