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
background.src = 'background.png';

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

//array koji sadrzi sve metke
let bullets = [];
//pomocna promjenljiva s kojom pravim vremenski razmak izmedju dva metka
//da ne bi bilo op i da ima prostora za power-up
let lastShot = 0;

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
        //crtam brod
        drawShip();

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
    window.requestAnimationFrame(() => update(lastAnimationTime));
}

update();
