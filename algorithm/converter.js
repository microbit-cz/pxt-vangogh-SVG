//SVG -> Turtle Graphics Converter
//
//cs:
// Podporuje následující SVG commandy: (velké písmeno = absolutní souřadnice, malé písmeno = relativní souřadnice)
//
// - M,m - přesuň se na souřadnice                   - zvedne tužku, otočí se a dojede na souřadnice        - parametry: x,y (abs/rel)
// - L,l - udělej čáru na souřadnice                 - položí tužku, otočí se a dojede na souřadnice        - parametry: x,y (abs/rel)
// - Z,z - dojeď zpět na start (0,0)                 - položí tužku, otočí se a dojede na souřadnice 0,0    - bez parametrů (bez rozdílu abs/rel)
// - H,h - udělej horizontální čáru na souřadnici x  - položí tužku, otočí se a dojede na souřadnici x      - parametry: x (abs/rel)
// - V,v - udělej vertikální čáru na souřadnici y    - položí tužku, otočí se a dojede na souřadnici y      - parametry: y (abs/rel)
// - C,c - udělej beziérovu křivku 4. úrovně          - položí tužku, rozdělí křivku a vytvoří čáry          - parametry P0,P1,P2,P3 (x,y) (abs/rel)
// - Q,q - udělej beziérovu křivku 3. úrovně          - položí tužku, rozdělí křivku a vytvoří čáry          - parametry P0,P1,P2 (x,y) (abs/rel)
// - A,a; S,s; T,t;
//en:
// Supports the following SVG commands: (uppercase = absolute coordinates, lowercase = relative coordinates)
//
// - M,m - move to the coordinates               - pick up the pen, turn and move to the coordinates        - parameters: x,y (abs/rel)
// - L,l - line to the coordinates               - place down the pen, turn and move to the coordinates     - parameters: x,y (abs/rel)
// - Z,z - line back to start (0,0)              - place down the pen, turn and move to the coordinates 0,0 - no parameters (no diff abs/rel)
// - H,h - horizontal line to x                  - place down the pen, turn and move to the coordinate x    - parameters: x (abs/rel)
// - V,v - vertical line to y y                  - place down the pen, turn and move to the coordinate y    - parameters: y (abs/rel)
// - C,c - cubic bezier curve (base 4)           - place down the pen, split the curve and create lines     - parameters P0,P1,P2,P3 (x,y) (abs/rel)
// - Q,q - quadratic bezier curve (base 3)           - place down the pen, split the curve and create lines     - parameters P0,P1,P2 (x,y) (abs/rel)
 
const { format } = require("path/posix");
 
/**
 * Calculates the length of hypotenuse and one angle of a triangle.
 * @param a The length of the triangle's first side.
 * @param b The length of the triangle's second side.
 * @returns An object containing the length of the hypotenuse and the angle in degrees.
 */
 function calcRightTriangle(a, b) {
    const c = Math.sqrt(a * a + b * b);
    let deg = (b < 0) ? (Math.atan(a / b) * 180 / Math.PI) + 180 : (Math.atan(a / b) * 180 / Math.PI)
    return {c, deg}
}
 
/**
 * Checks if letter is a valid SVG command key
 * @param letter currently scanned letter - SVG command key candidate
 * @param valid the array of valid SVG command keys
 * @returns Boolean - true if it is a SVG command key
 */
function isValid(letter, valid) {
    // If the letter is a number, space or comma, return false (letter is not valid start of SVG command)
    if (/^\d$/.test(letter) || letter == " " || letter == ",")
        return false;
    // If the letter is a SVG command key, return true
    return (letter in valid) ? true : false;
}
/**
 * Writes a rotate (L,R) turtle command to the specified output, based on the value of the input
 * @param deltaAngle Angle in degrees
 * @param output Output array to write to
 */
function deltaWrite(deltaAngle, output) {
    if (deltaAngle < 0) {
        output.push([2, -deltaAngle]);
    }
    else if (deltaAngle <= 180) {
        output.push([3, deltaAngle]);
    }
    else if (deltaAngle > 180) {
        output.push([2, 360 - deltaAngle]);
    }
}
/**
 * Makes a line or moves the pen to the next position, writes the command to the output
 * @param pen Current pen - Stores information about current angle and position
 * @param coords Final position of the pen.
 * @param draw Make a line (true) or just move (false)
 * @param output Output for the command
 */
function draw(pen, coords, draw, output) {
    if (draw && !pen.down) {
        output.push([4, 0]);
        pen.down = true;
    }
    else if (!draw && pen.down) {
        output.push([5, 0]);
        pen.down = false;
    }
    var triangle = calcRightTriangle(coords[0], coords[1]);
    //When c = 0, deg becomes = 0° and changes the bearing
    if (triangle.c == 0)
        return;
    var deltaAngle = triangle.deg - pen.bearing;
    deltaWrite(deltaAngle, output);
    if (triangle.c > 0)
        output.push([1, triangle.c]);
    pen.bearing = triangle.deg;
}
// How many points will generate on each curve. More points = more accurate final path, but more diffucult for turtle and bigger output. Default: 6
var accuracy = 5;
/**
 * Calculates the cubic bezier curve a converts it to a list of connected points
 * @param P0 First control point (the curve starts here)
 * @param P1 Second control point
 * @param P2 Third control point
 * @param P3 Last control point (the curve ends here)
 * @returns List of coordinates
 */
function cubicBezier(P0, P1, P2, P3) {
    var res = [];
    for (var t = (1 / accuracy); t <= 1; t += (1 / accuracy)) {
        var bezout = [];
        for (var i = 0; i < P0.length; i++) {
            bezout[i] = Math.round(((1 - t) * (1 - t) * (1 - t) * P0[i] + 3 * (1 - t) * (1 - t) * t * P1[i] + 3 * (1 - t) * t * t * P2[i] + t * t * t * P3[i]) * 1000) / 1000;
        }
        res.push(bezout);
    }
    return res;
}

/**
 * Calculates the quadratic bezier curve a converts it to a list of connected points
 * @param P0 First control point (the curve starts here)
 * @param P1 Second control point
 * @param P2 Last control point (the curve ends here)
 * @returns List of coordinates
 */
function quadBezier(P0, P1, P2) {
    var res = [];
    for (var t = (1 / accuracy); t <= 1; t += (1 / accuracy)) {
        var bezout = [];
        for (var i = 0; i < P0.length; i++) {
            bezout[i] = Math.round(((P0[i] - 2 * P1[i] + P2[i]) * t * t + (2 * P1[i] - 2 * P0[i]) * t + P0[i]) * 1000) / 1000;
        }
        res.push(bezout);
    }
    return res;
}
/**
 *
 * @param rx
 * @param ry
 * @param xAxisRotation
 * @param largeArcFlag
 * @param sweepFlag
 * @param x
 * @param y
 * @returns
 */
function ellipticalArc(rx, ry, xAxisRotation, largeArcFlag, sweepFlag, x, y, currentX, currentY) { //přepsat
    // Convert rotation angle from degrees to radians
    let phi = xAxisRotation * (Math.PI / 180);
    let sinPhi = Math.sin(phi);
    let cosPhi = Math.cos(phi);
 
    // Calculate the transformed coordinates
    let dx2 = (currentX - x) / 2;
    let dy2 = (currentY - y) / 2;
    let x1p = cosPhi * dx2 + sinPhi * dy2;
    let y1p = -sinPhi * dx2 + cosPhi * dy2;
 
    // Ensure radii are large enough
    rx = Math.abs(rx);
    ry = Math.abs(ry);
    let lambda = (x1p * x1p) / (rx * rx) + (y1p * y1p) / (ry * ry);
    if (lambda > 1) {
        rx *= Math.sqrt(lambda);
        ry *= Math.sqrt(lambda);
    }
 
    // Calculate (cx', cy')
    let rx2 = rx * rx;
    let ry2 = ry * ry;
    let x1p2 = x1p * x1p;
    let y1p2 = y1p * y1p;
 
    let factor = Math.sqrt(((rx2 * ry2) - (rx2 * y1p2) - (ry2 * x1p2)) / ((rx2 * y1p2) + (ry2 * x1p2)));
    if (largeArcFlag === sweepFlag) factor = -factor;
 
    let cxp = factor * (rx * y1p) / ry;
    let cyp = factor * -(ry * x1p) / rx;
 
    // Calculate (cx, cy) from (cx', cy')
    let cx = cosPhi * cxp - sinPhi * cyp + (currentX + x) / 2;
    let cy = sinPhi * cxp + cosPhi * cyp + (currentY + y) / 2;
 
    // Calculate the start and end angles
    let startAngle = Math.atan2((y1p - cyp) / ry, (x1p - cxp) / rx);
    let endAngle = Math.atan2((-y1p - cyp) / ry, (-x1p - cxp) / rx);
 
    if (sweepFlag === 0 && endAngle > startAngle) {
        endAngle -= 2 * Math.PI;
    } else if (sweepFlag === 1 && endAngle < startAngle) {
        endAngle += 2 * Math.PI;
    }
 
    // Calculate points along the arc
    let res = [];
    let deltaAngle = endAngle - startAngle;
    for (let i = 0; i < accuracy + Math.round(accuracy/10); i++) {
        let t = i / accuracy;
        let angle = startAngle + t * deltaAngle;
        let xPoint = cosPhi * rx * Math.cos(angle) - sinPhi * ry * Math.sin(angle) + cx;
        let yPoint = sinPhi * rx * Math.cos(angle) + cosPhi * ry * Math.sin(angle) + cy;
        res.push([xPoint, yPoint]);
    }
    
    return res;
}
 
function formatted(output, angle) {
    var textOut = "[\n";

    if (angle !== -1) {
        textOut += "[3, " +  angle.toString() + "],"
    }

    output.forEach(function (x) {
        textOut += "[".concat(x[0], ", ").concat(x[1], "],");
    });
    textOut += "[4, 0]\n]";
    return textOut;
}
//Calls the algorith. Normally it would be called on user request (input)
/**
 * The main algorithm
 * @param path SVG path input
 * @param isAngle;
 */
function main(path) {
    var valid = {
        M: 2,
        m: 2,
        L: 2,
        l: 2,
        H: 1,
        h: 1,
        V: 1,
        v: 1,
        C: 6,
        c: 6,
        S: 4,
        s: 4,
        Q: 4,
        q: 4,
        T: 2,
        t: 2,
        A: 7,
        a: 7,
        Z: 0,
        z: 0,
        G: 1,
        E: 1
    };
 
    // The final array of parsed Commands
    var commands = [];
    //Stores info about the current command, adds to final array it when new command key is found
    var currentCommand = { name: "", args: [] };
    //Stores info about current command argument, adds to command when next argument is found
    var currentArg = "";
    //Stores info about previous argument sign (+,-)
    var prevSign = true;

    var angle = -1;
    var scale = 1;

    var prevControlPoint = null;
    // Breaks the path to signle letters and iterates throught them
    for (var _i = 0, path_1 = path; _i < path_1.length; _i++) {
        var letter = path_1[_i];
        
        // If the letter is a SVG command key, write previous args and the command (if exists) to output array, and reset current command
        if (isValid(letter, valid)) {

            if (currentArg)
                currentCommand.args.push(prevSign ? parseFloat(currentArg * scale) : -parseFloat(currentArg * scale));

            currentArg = "";
            prevSign = true;

            if (currentCommand.name) {
                switch (currentCommand.name) {
                    case "E":
                        scale = currentCommand.args[0];
                        break;
                    case "G":
                        angle = currentCommand.args[0];
                        break;
                    default:
                        commands.push(currentCommand);
                        break;
                }
            }  
            // Initiate new command
            currentCommand = { name: letter, args: [] };
            // If the letter is a space, write previous argument to the current command instance and reset current argument
        }
        else if (letter == " " || letter == ",") {
            if (currentArg)
                currentCommand.args.push(prevSign ? parseFloat(currentArg * scale) : -parseFloat(currentArg * scale));
            // Checks for reperating command arguments - more than default arg length means more commands consecutively
            if (currentCommand.args.length >= valid[currentCommand.name]) {
                commands.push(currentCommand); // valid commands
            }
            prevSign = true;
            currentArg = "";
            // Same as previous but with negative values
        }
        else if (letter == "-") {
            if (currentArg)
                currentCommand.args.push(prevSign ? parseFloat(currentArg * scale) : -parseFloat(currentArg * scale));
            if (currentCommand.args.length >= valid[currentCommand.name]) {
                commands.push(currentCommand);
                currentCommand = { name: currentCommand.name, args: [] };
            }
            prevSign = false;
            currentArg = "";
            // If it is a number, dot, or anything else, write it to the current argument and to be parsed to number
        }
        else {
            currentArg += letter;
        }
    }
    //Saves the last argument and command when all the letters are parsed
    if (currentArg)
        currentCommand.args.push(prevSign ? parseFloat(currentArg * scale) : -parseFloat(currentArg * scale));
    if (currentCommand.name)
        commands.push(currentCommand); //pro Z
    //Initializes output array
    var output = [];
    //Initializes the pen for storing current info
    var pen = {
        coords: [0, 0],
        bearing: 0,
        down: false
    };
    
    console.log(commands)
    //Iterates throught every command
    commands.forEach(function (command) {
        // For shortening the code :D
        var args = command.args;
        var relArgs;
        var isHorizontal;
        var isUpperCase;
        var relArg;
        var deg;
        var reflection;

        switch (command.name) {
            case "L": case "M": case "l": case "m":
                relArgs = (command.name === "L" || command.name === "M") ? [args[0] - pen.coords[0], args[1] - pen.coords[1]] : [args[0], args[1]];
                pen.coords = (command.name === "L" || command.name === "M") ? [args[0], args[1]] : [pen.coords[0] + args[0], pen.coords[1] + args[1]];
                command.name === "L" || command.name === "l" ? draw(pen, relArgs, true, output) : draw(pen, relArgs, false, output);
                break;
            case "H": case "h": case "V": case "v":
                isHorizontal = (command.name == "H" || command.name == "h");
                isUpperCase = (command.name == "H" || command.name == "V");
                relArg = isUpperCase ? args[0] - (isHorizontal ? pen.coords[0] : pen.coords[1]) : args[0];
                isHorizontal ? pen.coords[0] = isUpperCase ? args[0] : args[0] + pen.coords[0] : pen.coords[1] = isUpperCase ? args[0] : args[0] + pen.coords[1];
           
                if (!pen.down) {
                    output.push([4, 0]);
                    pen.down = true;
                } else if (relArg === 0) {
                    return;
                }
 
                isHorizontal ? deg = relArg < 0 ? -90 : 90 : deg = relArg < 0 ? 180 : 0;
                deltaWrite(deg - pen.bearing, output);
                output.push([1, Math.abs(relArg)]);
                pen.bearing = deg;
                break;
            case "C": case "c": case "q": case "Q": case "A": case "a": case "S": case "s": case "T": case "t":
                switch (command.name) {
                    case "C":
                        curve = cubicBezier(pen.coords, [args[0], args[1]], [args[2], args[3]], [args[4], args[5]]);
                        break;
                    case "c":
                        curve = cubicBezier(pen.coords, [pen.coords[0] + args[0], pen.coords[1] + args[1]], [pen.coords[0] + args[2], pen.coords[1] + args[3]], [pen.coords[0] + args[4], pen.coords[1] + args[5]]);
                        break;
                    case "Q":
                        curve = quadBezier(pen.coords, [args[0], args[1]], [args[2], args[3]]);
                        break;
                    case "q":
                        curve = quadBezier(pen.coords, [pen.coords[0] + args[0], pen.coords[1] + args[1]], [pen.coords[0] + args[2], pen.coords[1] + args[3]]);
                        break;
                    case "A":
                        curve = ellipticalArc(args[0], args[1], args[2], args[3], args[4], args[5], args[6], pen.coords[0], pen.coords[1]);
                        break;
                    case "a":
                        curve = ellipticalArc(args[0], args[1], args[2], args[3], args[4], args[5], args[6], pen.coords[0] + args[0], pen.coords[1] + args[1]);
                        break;
                    case "S":
                        reflection = prevControlPoint ? [2 * pen.coords[0] - prevControlPoint[0], 2 * pen.coords[1] - prevControlPoint[1]] : [pen.coords[0], pen.coords[1]];
                        curve = cubicBezier(pen.coords, reflection, [args[0], args[1]], [args[2], args[3]]);
                        prevControlPoint = [args[0], args[1]];
                        break;
                    case "s":
                        reflection = prevControlPoint ? [2 * pen.coords[0] - prevControlPoint[0], 2 * pen.coords[1] - prevControlPoint[1]] : [pen.coords[0], pen.coords[1]];
                        curve = cubicBezier(pen.coords, reflection, [pen.coords[0] + args[0], pen.coords[1] + args[1]], [pen.coords[0] + args[2], pen.coords[1] + args[3]]);
                        prevControlPoint = [pen.coords[0] + args[0], pen.coords[1] + args[1]];
                        break;
                    case "T":
                        reflection = prevControlPoint ? [2 * pen.coords[0] - prevControlPoint[0], 2 * pen.coords[1] - prevControlPoint[1]] : pen.coords;
                        curve = quadBezier(pen.coords, reflection, [args[0], args[1]]);
                        prevControlPoint = reflection;
                        break;
                    case "t":
                        reflection = prevControlPoint ? [2 * pen.coords[0] - prevControlPoint[0], 2 * pen.coords[1] - prevControlPoint[1]] : pen.coords;
                        curve = quadBezier(pen.coords, reflection, [pen.coords[0] + args[0], pen.coords[1] + args[1]]);
                        prevControlPoint = reflection;
                        break;
                }

                for (let i = 0; i < curve.length; i++) {
                    let xy = curve[i];
                    let xyNew = xy.map(function(dim, index) {
                        return dim - pen.coords[index];
                    });
                    pen.coords = xy;
                    draw(pen, xyNew, true, output);
                }
                break;
            case "Z": case "z":
                draw(pen, [0, 0], true, output);
        }
    });
    return formatted(output, angle);
}

console.log(main("svg path"))
