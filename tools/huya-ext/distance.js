function _upsample(x, y) {
    var i;
    var newX = new Array();
    var newY = new Array();
    for (i = 0; i < x.length-1; i++) {
        newX.push(x[i]);
        newX.push((x[i]+x[i+1])/2);
        newY.push(y[i]);
        newY.push((y[i]+y[i+1])/2);
    }
    newX.push(x[x.length-1]);
    newY.push(y[y.length-1]);
    return [newX, newY];
}

function shuffle(array) {
    // from stack overflow
    var currentIndex = array.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
  }
  return array;
}

function compareNumber(a, b) {
  return a - b;
}
    
function randomPick(x, y, n){
    var i = 0;
    var idx = new Array();
    for(i = 0; i < x.length; i++) {
        idx.push(i);
    }
    idx = shuffle(idx).splice(idx.length-n, n).sort(compareNumber);
    var newX = new Array(n);
    var newY = new Array(n);
    for(i = 0; i < n; i++) {
        newX[i] = x[idx[i]];
        newY[i] = y[idx[i]];
    }
    return [newX, newY];
}

function upsample(x, y, n=2048) {
    [newX, newY] = _upsample(x, y);
    while(newX.length < n) {
        [newX, newY] = _upsample(newX, newY);
    }
    return randomPick(newX, newY, n);
}

function euclideanDistance(anchorX, anchorY, userX, userY, maxX) {
    var i;
    var distance = 0;
    [userX, userY] = upsample(userX, userY, anchorX.length);
    for (i = 0; i < anchorX.length; i++) {
        // 将userX坐标镜像到anchor画板
        var mirrorUserX = maxX - userX[i];
        var tmp = Math.pow((anchorX[i]-mirrorUserX),2) + Math.pow((anchorY[i]-userY[i]),2);
        distance += Math.sqrt(tmp);
    }
    distance /= anchorX.length;
    return distance;
}

n = 4096; // 采样到4096个点
maxX = 300; // 最大x坐标
maxY = 400; // 最大y坐标

var anchorX = [302,302,301,301,299,298,297,297,296,294,293,292,291,290,289,288,287,286,285,284,
               283,282,281,280,279,278,277,276,275,274,273,272,271,270,269,268,267,267,267,267,
               267,267,267,267,267,267,268,269,270,271,271,272,272,273,273,274,276,277,279,280,
               282,283,284,285,286,287,288,289,290,291,293,294,295,296,297,298,299,300,302,303,
               304];

var anchorY = [139,139,139,138,137,137,136,135,134,133,132,131,131,131,131,131,131,131,131,131,
               131,131,131,131,131,131,131,132,132,132,132,132,133,134,134,135,137,138,139,140,
               141,142,143,144,145,146,148,149,149,150,151,151,152,152,153,153,154,155,156,157,
               157,158,159,159,160,160,160,160,161,161,162,162,162,163,163,163,163,163,165,166,
               166];

var user1X = [1,2,3,5,6,7,8,9,10,11,12,14,15,17,18,20,21,23,24,26,27,28,28,29,29,30,31,31,31,31,
              31,31,31,31,31,31,31,31,31,31,30,28,27,27,26,25,24,24,22,21,20,19,18,17,16,15,14,
              13,12,11,10,9,8,7,6,5,4,3,2,1,0,0];

var user1Y = [138,138,137,136,135,135,134,132,131,131,129,129,129,129,129,129,129,130,130,131,132,
              133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,
              154,155,156,157,157,158,158,159,160,160,160,160,161,161,161,162,162,163,163,163,163,
              163,163,164,164,164,164,164,164,164];

var user2X = [1,2,3,4,5,6,7,8,9,10];
var user2Y = [10,9,8,7,6,5,4,3,2,1];

var user3X =  [302,302,301,301,299,298,297,297,296,294,293,292,291,290,289,288,287,286,285,284,
    283,282,281,280,279,278,277,276,275,274,273,272,271,270,269,268,267,267,267,267,
    267,267,267,267,267,267,268,269,270,271,271,272,272,273,273,274,276,277,279,280,
    282,283,284,285,286,287,288,289,290,291,293,294,295,296,297,298,299,300,302,303,
    304];
var user3Y = [139,139,139,138,137,137,136,135,134,133,132,131,131,131,131,131,131,131,131,131,
    131,131,131,131,131,131,131,132,132,132,132,132,133,134,134,135,137,138,139,140,
    141,142,143,144,145,146,148,149,149,150,151,151,152,152,153,153,154,155,156,157,
    157,158,159,159,160,160,160,160,161,161,162,162,162,163,163,163,163,163,165,166,
    166,];

[anchorX, anchorY] = upsample(anchorX, anchorY, n);

module.exports = euclideanDistance