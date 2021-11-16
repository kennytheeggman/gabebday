class Point{
    constructor (x, y, r, g, b, a) {
        // Position of point
        this.x = x;
        this.y = y;
        // Color value of point (rgba)
        this.red = r;
        this.green = g;
        this.blue = b;
        this.alpha = a;
    }
    toVector () {
        // Creates vector (for vector methods);
        return_vector = new Vector (this.x, this.y)
        return return_vector;
    }
    connect (point) {
        // Create an array of point objects
        var point_array = [];
        var intervals = Math.max(Math.abs(point.x - this.x), Math.abs(point.y - this.y)); // Number of intervals is the most number of lattice points
        for (var i = 0; i < intervals; i++) {
            var point_values = new Array(6);
            // Linear gradient between 2 points for all values
            point_values[0] = this.x + (point.x - this.x) / intervals * i;
            point_values[1] = this.y + (point.y - this.y) / intervals * i;
            point_values[2] = this.red + (point.red - this.red) / intervals * i;
            point_values[3] = this.green + (point.green - this.green) / intervals * i;
            point_values[4] = this.blue + (point.blue - this.blue) / intervals * i;
            point_values[5] = this.alpha + (point.alpha - this.alpha) / intervals * i;
            // Add poisition and color values to point object
            var p_obj = new Point(point_values[0],point_values[1],point_values[2],point_values[3],point_values[4],point_values[5]);
            point_array.push(p_obj); // Add point object to array of points
        }
        return point_array; // Return array of points
    }
    distTo (point1, point2) {
        var dx = point2.x - point1.x;
        var dy = point2.y - point1.y;
        var a = -dy;
        var b = dx;
        var c = a * point1.x + b * point1.y;
        var distDen = Math.pow(Math.pow(a, 2) + Math.pow(b, 2), 0.5);
        var distNum = a * this.x + b * this.y - c;
        var dist = Math.abs(distNum) / distDen;
        return dist;
    }
    distToLineSegment (point1, point2) {
        function dist (p1, p2) {
            return Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2);
        }
        var l2 = dist(point1, point2);
        if (l2 == 0) {
            return dist(this, point1);
        }
        var t = ((this.x - point1.x) * (point2.x - point1.x) + (this.y - point1.y) * (point2.y - point1.y)) / l2;
        t = Math.max(0, Math.min(1, t));
        var c = dist(this, new Point(point1.x + t * (point2.x - point1.x), point1.y + t * (point2.y - point1.y)));
        return Math.sqrt(c);
    }
}
class Vector {
    constructor (x, y) {
        this.xComponent = x;
        this.yComponent = y;
        this.magnitude = Math.pow(Math.pow(x, 2) + Math.pow(y, 2), 0.5); // Pythagorean Theorem
    }
    add (vector) {
        var return_vector = new Vector(this.xComponent + vector.xComponent, this.yComponent + vector.yComponent);
        return return_vector;
    }
    scalarMultiply (scalar) {
        var return_vector_array = [this.xComponent * scalar, this.yComponent * scalar];
        var return_vector = new Vector(...return_vector_array);
        return return_vector;
    }
    unitize () {
        var vector = this;
        return vector.scalarMultiply(1 / this.magnitude);
    }
    dotProduct (vector) {
        var return_vector_array = [this.xComponent * vector.xComponent, this.yComponent * vector.yComponent];
        var return_vector = new Vector(...return_vector_array);
        return return_vector;
    }
    normal() {
        var deltaY = this.yComponent;
        var deltaX = this.xComponent;
        var vector = new Vector(deltaY, -1 * deltaX);
        return vector;
    }
}
class Edge {
    constructor (points) {
        this.nodes = []; // Vertices
        this.sticks = []; // Edges
        this.nsPos = []; // Prefix sum array for indices of stick points between vertices
        // Add points to collection of vertices
        for (var i = 0; i < points.length; i++) {
            this.nodes.push(points[i]); 
        }
        // Initialize prefix sum array at 0
        this.nsPos[0] = 0;
        // For all future positions, add previous position to create prefix sum array
        for (var i = 1; i < points.length; i++) {
            var maxVal = Math.max(points[i].x - points[i-1].x, points[i].y - points[i-1].y); // Equal to number of sample intervals
            this.nsPos.push(maxVal + this.nsPos[i-1]); // Also equal to indices
        }
        for (var i = 0; i < points.length - 1; i++) {
            this.addStick(i); // Connect all points with sticks
        }
    }
    insert (index, points) {
        this.nodes.splice(index, 0, ...points); // Insert points into collection of vertices
        // Recreate prefix sum array
        this.nsPos[0] = 0;
        for (var i = 1; i < this.nodes.length; i++) {
            var maxVal = Math.max(Math.abs(this.nodes[i].x - this.nodes[i-1].x), Math.abs(this.nodes[i].y - this.nodes[i-1].y));
            this.nsPos[i] = (maxVal + this.nsPos[i-1]);
        }
        // Reconnect all points with sticks
        this.sticks = [];
        for (var i = 0; i < this.nodes.length - 1; i++) {
            this.addStick(i);
        }
    }
    remove (index) {
        this.nodes.splice(index, 1); // Removes point at index
        // Recreate prefix sum array
        this.nsPos[0] = 0;
        for (var i = 1; i < this.nodes.length; i++) {
            var maxVal = Math.max(Math.abs(this.nodes[i].x - this.nodes[i-1].x), Math.abs(this.nodes[i].y - this.nodes[i-1].y));
            this.nsPos[i] = (maxVal + this.nsPos[i-1]);
        }
        // Reconnect all points with sticks
        this.sticks = [];
        for (var i = 0; i < this.nodes.length - 1; i++) {
            this.addStick(i);
        }
    }
    replace (index, point) {
        this.nodes.splice(index, 1, point); // Replaces point at index with point argument
        // Recreate prefix sum array
        this.nsPos[0] = 0;
        for (var i = 1; i < this.nodes.length; i++) {
            var maxVal = Math.max(Math.abs(this.nodes[i].x - this.nodes[i-1].x), Math.abs(this.nodes[i].y - this.nodes[i-1].y));
            this.nsPos[i] = (maxVal + this.nsPos[i-1]);
        }
        // Reconnect all points with sticks
        this.sticks = [];
        for (var i = 0; i < this.nodes.length - 1; i++) {
            this.addStick(i);
        }
    }
    addStick (index) {
        // Connect vertex at index index to vertext at index index + 1
        var stick = this.nodes[index].connect(this.nodes[index+1]);
        var i1 = this.nsPos[index];
        this.sticks.splice(i1, 0, ...stick);
    }
    move (xDisplacement, yDisplacement) {
        for (var i = 0 ; i < this.nodes.length; i++) {
            // Add points to temporary points
            var tempPoint = this.nodes[i];
            // Increment each point by specified values
            tempPoint.x += xDisplacement;
            tempPoint.y += yDisplacement;
            // Replace nodes with temporary points
            this.replace(i, tempPoint);
        }
    }
    getEraseArr () {
        var eraseArr = [];
        for (var i = 0; i < this.sticks.length; i++) {
            var point = new Point(this.sticks[i].x, this.sticks[i].y, this.sticks[i].red, this.sticks[i].green, this.sticks[i].blue, 0)
            eraseArr.push(point);
        }
        return eraseArr;
    }
    over (layer) {
        var return_p_arr = [...this.sticks, ...layer.sticks];
        return return_p_arr;
    }
}
class Layer {
    constructor (p_arr) {
        this.p_arr = p_arr;
    }
    over () {
        var return_p_arrs = [...arguments];
        var return_p_arr = [...return_p_arrs];
        var return_layer = new Edge(return_p_arr);
        return return_layer;
    }
}
class Draw {
    constructor (canvasID) {
        // Initializing canvas variables
        this.canvas = document.getElementById(canvasID);
        this.ctx = this.canvas.getContext("2d");
        this.imageData = this.ctx.createImageData(this.canvas.width, this.canvas.height);
    }
    drawPoint (x, y, r, g, b, a) {
        // Add color values to the imageData
        var index = y * this.canvas.width + x;
        this.imageData.data[index * 4 + 0] = r;
        this.imageData.data[index * 4 + 1] = g;
        this.imageData.data[index * 4 + 2] = b;
        this.imageData.data[index * 4 + 3] = a;
    }
    update () {
        // Add imageData to canvas context
        this.ctx.putImageData(this.imageData, 0, 0);
    }
    drawPoints(p_arr) {
        // Draw all points in the point array
        for (var i = 0; i < p_arr.length; i++) {
            this.drawPoint(Math.floor(p_arr[i].x), Math.floor(p_arr[i].y), p_arr[i].red, p_arr[i].green, p_arr[i].blue, p_arr[i].alpha);
        }
        this.update();
    }
    drawText(text, r, g, b, a) {
        this.ctx.font = "50px Roboto";
        this.ctx.fillStyle = "rgba(" + r + "," + g + "," + b + "," + a + ")"
        this.ctx.textAlign = "center";
        this.ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    }
    drawFadeOut(p_arr) {
        var counter = 0;
        var c = setInterval(() => {
            if (counter < 255) {
                this.canvas.width = this.canvas.width;
                for (var i = 0; i < p_arr.length; i++) {
                    this.drawPoint(Math.floor(p_arr[i].x), Math.floor(p_arr[i].y), p_arr[i].red, p_arr[i].green, p_arr[i].blue, 255 - counter);
                }
                counter++;
                this.update();
            }
            else {
                this.canvas.width = this.canvas.width;
                clearInterval(c);
            }
        }, 1)
    }
    drawFadeIn(p_arr) {
        var counter = 0;
        var c = setInterval(() => {
            if (counter < 255) {
                this.canvas.width = this.canvas.width;
                for (var i = 0; i < p_arr.length; i++) {
                    this.drawPoint(Math.floor(p_arr[i].x), Math.floor(p_arr[i].y), p_arr[i].red, p_arr[i].green, p_arr[i].blue, counter);
                }
                counter++;
                this.update();
            }
            else {
                clearInterval(c);
            }
        }, 1)
    }
    drawFadeOutText(text, r, g, b, a) {
        var counter = 0;
        var c = setInterval(() => {
            if (counter <= a / 255) {
                this.canvas.width = this.canvas.width;
                this.drawText(text, r, g, b, a / 255 - counter);
                counter+= 0.05;
            }
            else {
                this.canvas.width = this.canvas.width;
                clearInterval(c);
            }
        }, 50)
    }
    drawFadeInText(text, r, g, b, a) {
        var counter = 0;
        var c = setInterval(() => {
            if (counter <= a / 255) {
                this.canvas.width = this.canvas.width;
                this.drawText(text, r, g, b, counter);
                counter+= 0.05;
            }
            else {
                clearInterval(c);
            }
        }, 50)
    }
    clearFrame() {
        this.blankImageData = this.ctx.createImageData(this.canvas.width, this.canvas.height);
        for (var i = 0; i < this.canvas.width * this.canvas.height * 4; i++) {
            this.blankImageData.data[i + 3] = 255
        }
        this.ctx.putImageData(this.blankImageData, 0, 0);
    }
}
class Ball {
    constructor (draw, sides, holeCenter, ballPos) {
        this.draw = draw;
        this.sides = sides;
        this.circle = new Edge([
        // Black Circle
        new Point(-2, 4, 0, 0, 0, 255),
        new Point(2, 4, 0, 0, 0, 255),
        new Point(2, 3, 0, 0, 0, 255),
        new Point(3, 3, 0, 0, 0, 255),
        new Point(3, 2, 0, 0, 0, 255),
        new Point(4, 2, 0, 0, 0, 255),
        new Point(4, -2, 0, 0, 0, 255),
        new Point(3, -2, 0, 0, 0, 255),
        new Point(3, -3, 0, 0, 0, 255),
        new Point(2, -3, 0, 0, 0, 255),
        new Point(2, -4, 0, 0, 0, 255),
        new Point(-2, -4, 0, 0, 0, 255),
        new Point(-2, -3, 0, 0, 0, 255),
        new Point(-3, -3, 0, 0, 0, 255),
        new Point(-3, -2, 0, 0, 0, 255),
        new Point(-4, -2, 0, 0, 0, 255),
        new Point(-4, 2, 0, 0, 0, 255),
        new Point(-3, 2, 0, 0, 0, 255),
        new Point(-3, 3, 0, 0, 0, 255),
        new Point(-2, 3, 0, 0, 0, 255),
        new Point(-2, 4, 0, 0, 0, 255),
        // White Inner Circle
        new Point(-1, 3, 255, 255, 255, 255),
        new Point(1, 3, 255, 255, 255, 255),
        new Point(2, 2, 255, 255, 255, 255),
        new Point(-2, 2, 255, 255, 255, 255),
        new Point(-3, 1, 255, 255, 255, 255),
        new Point(3, 1, 255, 255, 255, 255),
        new Point(3, 0, 255, 255, 255, 255),
        new Point( -3, 0, 255, 255, 255, 255),
        new Point(-3, -1, 255, 255, 255, 255),
        new Point(3, -1, 255, 255, 255, 255),
        new Point(2, -2, 255, 255, 255, 255),
        new Point(-2, -2, 255, 255, 255, 255),
        new Point(-1, -3, 255, 255, 255, 255),
        new Point(1, -3, 255, 255, 255, 255)
        ]);
        this.hole = [];
        this.holeCenter = holeCenter;
        for (var i = -30; i < 30; i++) {
            for (var j = -30; j < 30; j++) {
                if (Math.pow(Math.pow(i, 2) + Math.pow(j, 2), 0.5) < 25) {
                    this.hole.push(new Point(i + this.holeCenter.x, j + this.holeCenter.y, 0, 0, 0, 255));
                }
            }
        }
        this.holeEdge = new Edge(this.hole);
        this.position = ballPos;
        this.circle.move(this.position.x, this.position.y);
        this.draw.drawFadeIn(this.hole);
        this.draw.drawFadeIn(this.circle.sticks);
        this.draw.drawFadeIn(this.sides.sticks);
    }
    move (movementVector) {
        this.draw.drawPoints(this.circle.getEraseArr());
        this.circle.move(movementVector.xComponent, movementVector.yComponent);
        this.position = new Point(this.position.x + movementVector.xComponent, this.position.y + movementVector.yComponent);
        this.draw.drawPoints(this.hole);
        this.draw.drawPoints(this.circle.sticks);
        this.draw.drawPoints(this.sides.sticks);
    }
    fade () {
        draw.drawFadeOut(this.hole);
        draw.drawFadeOut(this.circle.sticks);
        draw.drawFadeOut(this.sides.sticks);
    }
    checkCollisions (movementVector) {
        for (var i = 0; i < this.sides.nodes.length - 1; i++) {
            var center = new Point(this.position.x, this.position.y);
            var nextCenter = new Point(center.x + movementVector.xComponent, center.y + movementVector.yComponent);
            var dist = nextCenter.distToLineSegment(this.sides.nodes[i + 1], this.sides.nodes[i]);
            if (dist < 5) {
                return i;
            }
        }
        return -1;
    }
    deccelerate (movementVector, decceleration) {
        var xDeccel = movementVector.xComponent * (1 - decceleration);
        var yDeccel = movementVector.yComponent * (1 - decceleration);
        var deccelledVector = new Vector(xDeccel, yDeccel);
        return deccelledVector;
    }
    collide (movementVector, index) {
        var collision_line = new Vector( this.sides.nodes[index + 1].x - this.sides.nodes[index].x, this.sides.nodes[index + 1].y - this.sides.nodes[index].y);
        var normal_cl = collision_line.normal();
        var anti_incidence = movementVector.scalarMultiply(-1);
        var p1 = new Point(anti_incidence.xComponent, anti_incidence.yComponent);
        var p2 = new Point(0,0);
        var p3 = new Point(normal_cl.xComponent, normal_cl.yComponent);
        var reflection_ray_magnitude = p1.distTo(p2, p3) * 2;
        var cl = collision_line.unitize();
        var cl_point = new Point(cl.xComponent, cl.yComponent);
        var ai_point = new Point(anti_incidence.xComponent, anti_incidence.yComponent);
        var nc_point = new Point(normal_cl.xComponent, normal_cl.yComponent);
        if (this.sameSide(cl_point, ai_point, new Point(0, 0), nc_point)) {
            var cl_vector = cl.scalarMultiply(-reflection_ray_magnitude);
            var reflection_vector = cl_vector.add(anti_incidence);
        }
        else {
            var cl_vector = cl.scalarMultiply(reflection_ray_magnitude);
            var reflection_vector = cl_vector.add(anti_incidence);
        }
        return reflection_vector;
    }
    sameSide (point1, point2, lineEnd1, lineEnd2) {
        var determinant = ((lineEnd1.y - lineEnd2.y) * (point1.x - lineEnd1.x) + (lineEnd2.x - lineEnd1.x) * (point1.y - lineEnd1.y)) * ((lineEnd1.y - lineEnd2.y) * (point2.x - lineEnd1.x) + (lineEnd2.x - lineEnd1.x) * (point2.y - lineEnd1.y))
        if (determinant < 0) {
            return false;
        }
        else {
            return true;
        }
    }
}