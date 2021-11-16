var height = window.innerHeight - 4;
var width = document.body.clientWidth;

document.getElementById("canvas").setAttribute("height", height + "")
document.getElementById("canvas").setAttribute("width", width + "")

document.addEventListener('click', musicPlay);
function musicPlay() {
    document.getElementById('audio').play();
    document.getElementById("audio").volume = 0.3;
    document.removeEventListener('click', musicPlay);
}

var level = [true];
var draw = new Draw("canvas")

function executeAsynchronously(functions, timeout) {
    for(var i = 0; i < functions.length; i++) {
        setTimeout(functions[i], timeout);
    }
}

function FadeInOutText (text, onScreenTime, waitTime) {
    setTimeout(function() {
        function FadeInHelloWorld () {
            draw.drawFadeInText(text, 0, 0, 0, 255);
        }
        function FadeOutHelloWorld () {
            draw.drawFadeOutText(text, 0, 0, 0, 255);
        }
        setTimeout(FadeInHelloWorld, 0);
        setTimeout(FadeOutHelloWorld, onScreenTime);
    }, waitTime);
}


FadeInOutText("A gift to you,", 2000, 0);
FadeInOutText("from Kenny", 2000, 3000);
FadeInOutText("Happy Birthday, Gabe!", 2000, 6000);
FadeInOutText("This is a very short 3 level golf game,", 3000, 9000);
FadeInOutText("Controls are the same as Game Pidgeon", 3000, 13000);
FadeInOutText("Without further ado, Enjoy!", 2000, 17000);
FadeInOutText("Level 1", 1000, 20000);

setTimeout(level1, 22000);

function level1() {
    var b = new Ball(
        draw, 
        new Edge([
            new Point(100, 100, 0, 0, 0, 255), 
            new Point(100, canvas.height - 100, 0, 0, 0, 255), 
            new Point(canvas.width - 100,canvas.height - 100,0,0,0,255), 
            new Point(canvas.width - 100,100,0,0,0,255), new Point(100,100,0,0,0,255)]), 
        new Point(canvas.width - 200, canvas.height - 200),
        new Point(200,200));
    var movementVector = new Vector(0,0);
    var edge = new Edge([]);
    var xPos = 0;
    var yPos = 0;
    var mouseDown = false;
    var polling = false;

    document.addEventListener("mousemove", (evt) => {
        xPos = evt.pageX;
        yPos = evt.pageY;
        if ((Math.pow(Math.pow(b.position.x - xPos, 2) + Math.pow(b.position.y - yPos, 2), 1/2) < 5) && (mouseDown) && (movementVector.magnitude < 0.1)) {
            polling = true;
        }
    });
    var poll = setInterval(() => {
        
    })
    document.addEventListener("mousedown",()=>{
        console.log("down");
        mouseDown = true;
    });
    document.addEventListener("mouseup", ()=>{
        console.log("up");
        if (polling) {
            movementVector = dirVector;
        }
        mouseDown = false;
        polling = false;
        draw.drawPoints(edge.getEraseArr());
    });
    
    var movementVector = new Vector(0,0);
    var level1 = setInterval(() => {
        movementVector = b.deccelerate(movementVector, 0.007);
        var toHoleVector = new Vector(b.position.x - b.holeCenter.x, b.position.y - b.holeCenter.y);
        if (toHoleVector.magnitude > 20) {
            if (movementVector.magnitude > 0.1) {
                if (b.checkCollisions(movementVector) == -1) {
                    b.move(movementVector);
                }
                else {
                    var sideCollide = b.checkCollisions(movementVector);
                    var tempMovementVector = b.collide(movementVector, sideCollide);
                    movementVector = tempMovementVector.unitize().scalarMultiply(movementVector.magnitude);
                    b.move(movementVector);
                }
            }
            else {    
                if (polling) {
                    draw.drawPoints(edge.getEraseArr());
                    dirVector = (new Vector(b.position.x - xPos, b.position.y - yPos)).scalarMultiply(0.1);
                    if (dirVector.magnitude > 10) {
                        dirVector = dirVector.unitize().scalarMultiply(9.99);
                    }
                    var posVector = new Vector(b.position.x, b.position.y);
                    var dirLine = dirVector.scalarMultiply(30);
                    var linePos = posVector.add(dirLine);
                    edge = new Edge([new Point(b.position.x, b.position.y, 20, 20, 20, 255), new Point(linePos.xComponent, linePos.yComponent, 20, 20, 20, 255)]);
                    draw.drawPoints(edge.sticks);
                    b.move(new Vector(0,0));
                }
            }
        }
        else {
            clearInterval(level1);
            document.removeEventListener("mouseover", () => {});
            document.removeEventListener("mouseup", () => {});
            document.removeEventListener("mousedown", () => {});
            b.fade();
            FadeInOutText("Level 2", 1000, 2550)
            setTimeout(()=>{
                level2();
            }, 4550);
        }
    }, 10);
}

function level2() {
    var b = new Ball(
        draw, 
        new Edge([
            new Point(100, 100, 0, 0, 0, 255), 
            new Point((canvas.width - 200) / 2, 100, 0, 0, 0, 255), 
            new Point((canvas.width - 200) / 2, (canvas.height - 200) * 0.7, 0, 0, 0, 255), 
            new Point((canvas.width - 200) / 2, 100, 0, 0, 0, 255), 
            new Point(canvas.width - 100, 100, 0, 0, 0, 255), 
            new Point(canvas.width - 100, canvas.height - 100,0,0,0,255), 
            new Point(100, canvas.height - 100,0,0,0,255), 
            new Point(100, 100, 0, 0, 0, 255)]), 
        new Point((canvas.width - 200) * 3 / 4,200),
        new Point(200,200));
    var movementVector = new Vector(0,0);
    var edge = new Edge([]);
    var xPos = 0;
    var yPos = 0;
    var mouseDown = false;
    var polling = false;

    document.addEventListener("mousemove", (evt) => {
        xPos = evt.pageX;
        yPos = evt.pageY;
        if ((Math.pow(Math.pow(b.position.x - xPos, 2) + Math.pow(b.position.y - yPos, 2), 1/2) < 5) && (mouseDown) && (movementVector.magnitude < 0.1)) {
            polling = true;
        }
    });
    document.addEventListener("mousedown",()=>{
        console.log("down");
        mouseDown = true;
    });
    document.addEventListener("mouseup", ()=>{
        console.log("up");
        if (polling) {
            movementVector = dirVector;
        }
        mouseDown = false;
        polling = false;
        draw.drawPoints(edge.getEraseArr());
    });
    
    var movementVector = new Vector(0,0);
    var level2 = setInterval(() => {
        movementVector = b.deccelerate(movementVector, 0.007);
        var toHoleVector = new Vector(b.position.x - b.holeCenter.x, b.position.y - b.holeCenter.y);
        if (toHoleVector.magnitude > 20) {
            if (movementVector.magnitude > 0.1) {
                if (b.checkCollisions(movementVector) == -1) {
                    b.move(movementVector);
                }
                else {
                    var sideCollide = b.checkCollisions(movementVector);
                    var tempMovementVector = b.collide(movementVector, sideCollide);
                    movementVector = tempMovementVector.unitize().scalarMultiply(movementVector.magnitude);
                    b.move(movementVector);
                }
            }
            else {    
                if (polling) {
                    draw.drawPoints(edge.getEraseArr());
                    dirVector = (new Vector(b.position.x - xPos, b.position.y - yPos)).scalarMultiply(0.1);
                    if (dirVector.magnitude > 10) {
                        dirVector = dirVector.unitize().scalarMultiply(9.99);
                    }
                    var posVector = new Vector(b.position.x, b.position.y);
                    var dirLine = dirVector.scalarMultiply(30);
                    var linePos = posVector.add(dirLine);
                    edge = new Edge([new Point(b.position.x, b.position.y, 20, 20, 20, 255), new Point(linePos.xComponent, linePos.yComponent, 20, 20, 20, 255)]);
                    draw.drawPoints(edge.sticks);
                    b.move(new Vector(0,0));
                }
            }
        }
        else {
            clearInterval(level2);
            document.removeEventListener("mouseover", () => {});
            document.removeEventListener("mouseup", () => {});
            document.removeEventListener("mousedown", () => {});
            b.fade();
            FadeInOutText("Level 3", 1000, 2550)
            setTimeout(()=>{
                level3();
            }, 4550);
        }
    }, 10);
}

function level3() {
    var b = new Ball(
        draw, 
        new Edge([
            new Point(100, 100, 0, 0, 0, 255), 
            new Point(100 + (canvas.width - 200) / 4, 100, 0, 0, 0, 255), 
            new Point(100 + (canvas.width - 200) / 4, 100 + (canvas.height - 200) * 0.8, 0, 0, 0, 255), 
            new Point(100 + (canvas.width - 200) / 4, 100, 0, 0, 0, 255), 
            new Point(100 + (canvas.width - 200) * 3 / 4, 100, 0, 0, 0, 255), 
            new Point(100 + (canvas.width - 200) * 3 / 4, 100 + (canvas.height - 200) * 0.8, 0, 0, 0, 255), 
            new Point(100 + (canvas.width - 200) * 3 / 4, 100, 0, 0, 0, 255), 
            new Point(canvas.width - 100, 100, 0, 0, 0, 255), 
            new Point(canvas.width - 100, canvas.height - 100, 0, 0, 0, 255), 
            new Point(100 + (canvas.width - 200) / 2, canvas.height - 100,0,0,0,255), 
            new Point(100 + (canvas.width - 200) / 2, 200,0,0,0,255), 
            new Point(100 + (canvas.width - 200) / 2, canvas.height - 100,0,0,0,255), 
            new Point(100, canvas.height - 100,0,0,0,255), 
            new Point(100, 100, 0, 0, 0, 255)]), 
        new Point((canvas.width - 200) * 7 / 8,200),
        new Point(200,200));
    var movementVector = new Vector(0,0);
    var edge = new Edge([]);
    var xPos = 0;
    var yPos = 0;
    var mouseDown = false;
    var polling = false;

    document.addEventListener("mousemove", (evt) => {
        xPos = evt.pageX;
        yPos = evt.pageY;
        if ((Math.pow(Math.pow(b.position.x - xPos, 2) + Math.pow(b.position.y - yPos, 2), 1/2) < 5) && (mouseDown) && (movementVector.magnitude < 0.1)) {
            polling = true;
        }
    });
    document.addEventListener("mousedown",()=>{
        console.log("down");
        mouseDown = true;
    });
    document.addEventListener("mouseup", ()=>{
        console.log("up");
        if (polling) {
            movementVector = dirVector;
        }
        mouseDown = false;
        polling = false;
        draw.drawPoints(edge.getEraseArr());
    });
    
    var movementVector = new Vector(0,0);
    var level3 = setInterval(() => {
        movementVector = b.deccelerate(movementVector, 0.007);
        var toHoleVector = new Vector(b.position.x - b.holeCenter.x, b.position.y - b.holeCenter.y);
        if (toHoleVector.magnitude > 20) {
            if (movementVector.magnitude > 0.1) {
                if (b.checkCollisions(movementVector) == -1) {
                    b.move(movementVector);
                }
                else {
                    var sideCollide = b.checkCollisions(movementVector);
                    var tempMovementVector = b.collide(movementVector, sideCollide);
                    movementVector = tempMovementVector.unitize().scalarMultiply(movementVector.magnitude);
                    b.move(movementVector);
                }
            }
            else {    
                if (polling) {
                    draw.drawPoints(edge.getEraseArr());
                    dirVector = (new Vector(b.position.x - xPos, b.position.y - yPos)).scalarMultiply(0.1);
                    if (dirVector.magnitude > 10) {
                        dirVector = dirVector.unitize().scalarMultiply(9.99);
                    }
                    var posVector = new Vector(b.position.x, b.position.y);
                    var dirLine = dirVector.scalarMultiply(30);
                    var linePos = posVector.add(dirLine);
                    edge = new Edge([new Point(b.position.x, b.position.y, 20, 20, 20, 255), new Point(linePos.xComponent, linePos.yComponent, 20, 20, 20, 255)]);
                    draw.drawPoints(edge.sticks);
                    b.move(new Vector(0,0));
                }
            }
        }
        else {
            clearInterval(level3);
            document.removeEventListener("mouseover", () => {});
            document.removeEventListener("mouseup", () => {});
            document.removeEventListener("mousedown", () => {});
            b.fade();
            setTimeout(()=>{
                FadeInOutText("Congratulations! You beat the game!", 3000, 0);
                FadeInOutText("Your reward: a $5 Amazon Gift card", 3000, 4000);
                FadeInOutText("DM me for the details", 3000, 8000);
            }, 4550);
        }
    }, 10);
}