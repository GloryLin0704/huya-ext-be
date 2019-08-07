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
    if(anchorX.length == 0 || userX.length == 0) {
      return Number.MAX_VALUE;
    }
    n = 4096;
    if (anchorX.length > 4096) {
      n = anchorX.length;
    }
    var i;
    var distance = 0;
    [anchorX, anchorY] = upsample(anchorX, anchorY, n);
    [userX, userY] = upsample(userX, userY, n);
    for (i = 0; i < anchorX.length; i++) {
        // 将userX坐标镜像到anchor画板
        var mirrorUserX = maxX - userX[i];
        var tmp = Math.pow((anchorX[i]-mirrorUserX),2) + Math.pow((anchorY[i]-userY[i]),2);
        distance += Math.sqrt(tmp);
    }
    distance /= anchorX.length;
    return distance;
}

module.exports = euclideanDistance