//PRVA VERZIJA//
//SADRZI SAMO BROD I NJEGOVO POMJERANJE//

//napravim canvas i ctx
let canvas = document.getElementById('myCanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let ctx = canvas.getContext('2d');

//napravim brod i stavim ga na sredinu canvasa
let ship = {x: canvas.width/2, y: canvas.height/2, dir: 0, rotating: 'stop', moving: false};

//napravim pozadinu
let background = new Image();
background.src = 'background.png';

//gledam da li je neki taster pritisnut
document.addEventListener('keydown', function(e) {
    //strelica lijevo
    if(e.keyCode == 37) {
        ship.rotating = 'left';
    }
    //strelica desno
    else if(e.keyCode == 39) {
        ship.rotating = 'right';
    }
    //strelica gore
    if(e.keyCode == 38) {
        ship.moving = true;
    }
});

//gledam da li je neki taster pusten
document.addEventListener('keyup', function(e) {
    //strelica lijevo ili desnp
    if(e.keyCode == 37 || e.keyCode == 39) {
        ship.rotating = 'stop';
    }
    //strelica gore
    if(e.keyCode == 38) {
        ship.moving = false;
    }
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

//glavna funkcija
function update(animationTime) {
    //kao i uvijek
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let deltaTime = (Date.now() - (animationTime || Date.now())) / 1000;
    let lastAnimationTime = Date.now();
    
    //crtam pozadinu
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

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

    //kao i uvijek
    window.requestAnimationFrame(() => update(lastAnimationTime));
}

update();
