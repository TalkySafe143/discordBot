"use strict";
exports.__esModule = true;
exports.Cola = void 0;
var Nodo = /** @class */ (function () {
    function Nodo(value) {
        this.value = value;
        this.prev = null;
    }
    return Nodo;
}());
var Cola = /** @class */ (function () {
    function Cola() {
        this.last = null;
        this.first = null;
        this.length = 0;
    }
    Cola.prototype.peek = function () {
        if (this.length === 0)
            throw new Error('No hay ningún elemento en la cola');
        return this.first;
    };
    Cola.prototype.lastest = function () {
        if (this.length === 0)
            throw new Error('No hay ningun elemento en la cola');
        return this.last;
    };
    Cola.prototype.enqueue = function (value) {
        var newPile = new Nodo(value);
        if (this.length === 0) {
            this.last = newPile;
            this.first = newPile;
        }
        else {
            this.last.prev = newPile;
            this.last = newPile;
        }
        this.length++;
        return this;
    };
    Cola.prototype.dequeue = function () {
        if (this.length === 0)
            throw new Error('No hay ningún elemento en la cola');
        var removedPile = this.first;
        this.length === 1 ? (this.last = null, this.first = null) : this.first = this.first.prev;
        this.length--;
        return removedPile;
    };
    return Cola;
}());
exports.Cola = Cola;
