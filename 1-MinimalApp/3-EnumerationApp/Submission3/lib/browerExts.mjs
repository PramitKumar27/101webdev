Array.max = function (array){
    return Math.max.apply(Math,array);
}

Array.min = function (array) {
    return Math.min.apply(Math,array);
}

Array.prototype.clone = function () {
    return this.slice(0);
}

Array.prototype.isEqualTo = function (a2){
    return (this.length === a2.length) && this.every(function (el, i){return el === a2[i];});
}