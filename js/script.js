let Mario;
let Pipes = [];
let Score;
let DifficultyText;
let EasyText;

let GameOver;

function startGame() {
    Mario = new component(40, 80,"red" , 50, 100 );
    Score =  new component("50px", "Times New Roman", "gold", 800, 45, "text");
    DifficultyText = new component("30px", "Arial", "black", 10, 30, "text"); 
    EasyText = new component("30px", "Arial", "green", 10, 30, "text"); 
    DifficultyText.text = "Difficulty: ";
    EasyText.text = "Easy";
    Mario.gravity = 0.05;
    Game.start();
}

let Game = {
    start () {
        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext("2d");
        this.canvas.width = 1200;
        this.canvas.height = 380;
        
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        
        this.frameNum = 0;
        this.interval = setInterval(updateGame, 12);
        },

    clear () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component(width, height, image, x, y, type) {
    this.type = type;
    this.score = 0;
    this.width = width;
    this.height = height;
    this.speed_x = 0;
    this.speed_y = 0;    
    this.x = x;
    this.y = y;
    this.gravity = 0;
    this.gravitySpeed = 0;
    
    this.draw = function () {
        ctx = Game.context;
        const img = new Image();
        img.src = 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/dee38e10-db68-462d-9df7-46b87d4c7876/ddxujlr-94b97111-a43e-4f91-8351-bbfb413704e4.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2RlZTM4ZTEwLWRiNjgtNDYyZC05ZGY3LTQ2Yjg3ZDRjNzg3NlwvZGR4dWpsci05NGI5NzExMS1hNDNlLTRmOTEtODM1MS1iYmZiNDEzNzA0ZTQucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.jQIk9OhfeZYkXokHoHIPxNodIVg7gzQQpR-G_RAbuos';
        ctx.drawImage(img, 205, 145, 34, 62, this.x, this.y, this.width, this.height);
    }

    this.update = function() {
        ctx = Game.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = image;
            ctx.fillText(this.text, this.x, this.y);
        }
        else {
            ctx.fillStyle = image;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    this.newPosition = function() {
        this.gravitySpeed += this.gravity;
        this.x += this.speed_x;
        this.y += this.speed_y + this.gravitySpeed;
        this.hitBottomorTop();
    }

    this.getTextWidth = function() {
        if (this.type === "text") {
            ctx = Game.context;
            ctx.font = this.width + " " + this.height;
            return ctx.measureText(this.text).width;
        }
        return 0;
    }

    this.hitBottomorTop= function() {
        let canvasbottom = Game.canvas.height - this.height;
        let canvastop= 0;
        
        if (this.y > canvasbottom) {
            this.y = canvasbottom;
            this.gravitySpeed = 0;
        }
        
        if (this.y < canvastop) {
            this.y = canvastop;
            this.gravitySpeed = 0;
        }
    }

        
    this.willCrash = function(pipe) {
        let left = this.x;
        let right = this.x + (this.width);
        let top = this.y;
        let bottom = this.y + (this.height);
        let pipeleft = pipe.x;
        let piperight = pipe.x + (pipe.width);
        let pipetop = pipe.y;
        let pipebottom = pipe.y + (pipe.height);
        let crash = true;
        if ((bottom < pipetop) || (top > pipebottom) || (right < pipeleft) || (left > piperight)) {
            crash = false;
    
        }
        
        return crash;
    }
}

function restartGame() {
    location.reload();
}

function updateGame() {
    let x, height, gap, minHeight, maxHeight;
    for (i = 0; i < Pipes.length; i += 1) {
        if (Mario.willCrash(Pipes[i])) {
            GameOver = new component("60px", "COMIC NEUE", "brown", 450, 220, "text");
            GameOver.text = "Game Over!";
            GameOver.update();
            return;
        } 
    }
    
    Game.clear();
    Game.frameNum += 1;

    if (Game.frameNum == 1 || everyinterval(180)) {
        x = Game.canvas.width;
        minHeight = 50;
        maxHeight = 150;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        
        gap = Math.floor(Math.random()+180);
        Pipes.push(new component(25, height, "green", x, 0));
        Pipes.push(new component(25, x - height - gap, "green", x, height + gap));
    }
    
    for (i = 0; i < Pipes.length; i += 1) {
        Pipes[i].x += -1;
        Pipes[i].update();
    }
    
    DifficultyText.update();
    EasyText.x = DifficultyText.getTextWidth() + 10;
    EasyText.update();

    Score.text= "Current Score: " + Game.frameNum;
    
    Score.update();
    Mario.newPosition();
    Mario.draw();
}

function everyinterval(n) {
    if ((Game.frameNum / n) % 1 == 0) {
        return true;
    }
    return false;
}

function newspeed(n) {
    Mario.gravity = n;
}
