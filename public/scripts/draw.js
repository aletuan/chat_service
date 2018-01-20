$(document).ready(function () {
    //drawSomething();
    //drawLine();
    drawArcTo();
});

function addColorStops(gradient) {
    gradient.addColorStop("0", "magenta");
    gradient.addColorStop(".25", "blue");
    gradient.addColorStop(".50", "green");
    gradient.addColorStop(".75", "yellow");
    gradient.addColorStop("1.0", "red");
}

function drawArcTo() {
    var canvas = document.getElementById('myCanvas');
    var ctx = canvas.getContext('2d');
    
    ctx.strokeStyle = "gray";

    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(300, 200);
    ctx.lineTo(400, 500);
    ctx.lineTo(600, 300);
    ctx.stroke();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(300, 200);
    ctx.arcTo(400, 500, 600, 300, 50);
    ctx.stroke();

}

function drawLine() {
    var canvas = document.getElementById('myCanvas');
    var ctx = canvas.getContext('2d');

    ctx.fillStyle = "green";
    ctx.strokeStyle = "yellow";
    ctx.lineWidth = 10;

    ctx.beginPath();
    ctx.moveTo(100, 250);
    ctx.lineTo(150, 350);
    ctx.lineTo(50, 350);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(150, 250);
    ctx.lineTo(250, 250);
    ctx.lineTo(200, 350);
    ctx.closePath();
    //ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(300, 250);
    ctx.lineTo(350, 350);
    ctx.lineTo(250, 350);
    ctx.fill();

    ctx.stroke();
}

function drawSomething() {
    console.log("drawSomething is called");
    var canvas = document.getElementById('myCanvas');
    var ctx = canvas.getContext('2d');
    var offset = 15,
        clearOffset = 30,
        pushDownOffset = 10,
        height = 50,
        width = 100,
        count = 4,
        i = 0;
    
    // define configura gradient
    x0 = 0,
    y0 = 0,
    r0 = 0,
    x1 = 200,
    y1 = 0,
    r1 = 100;    
     
    for (i = 0; i < count; i++) {    
        ctx.fillStyle = "red";
        ctx.fillRect(i * (offset + width) + offset, offset, width, height);
        ctx.clearRect(i * (offset + width) + (clearOffset / 2) + offset, 
                        offset + (clearOffset / 2), 
                        width - clearOffset, 
                        height - clearOffset);
        
        ctx.fillStyle = "#00FF00";
        // changing line width
        ctx.lineWidth = i + 1;
        // chaing line join
        ctx.lineJoin = "bevel";
        ctx.strokeRect( i * (offset + width) + offset, (2 * offset) + height, width, height);
        //ctx.fillRect( i * (offset + width) + offset, (2 * offset) + height, width, height);

        gradient = ctx.createLinearGradient(x0, y0, x1, y1);
        addColorStops(gradient);
        ctx.fillStyle = gradient;
        ctx.fillRect( i * (offset + width) + offset, (6 * offset) + height, width, height);
    }

    // create new image object to use as pattern
    var img = new Image();
    img.src = "../content/piggy.png";
    img.onload = function() {
        console.log("image onload is called");
        var ptrn = ctx.createPattern(img, 'repeat');
        ctx.fillStyle = ptrn;
        ctx.fillRect(500, 10, 200, 200);
    }
}