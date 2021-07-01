interface QueueNode {
    value: string;
    prev: QueueNode | null;
}

class Nodo implements QueueNode {
    value: string;
    prev: QueueNode | null;

    constructor(value: string) {
        this.value = value;
        this.prev = null;
    }
}
export class Cola {
    private last: QueueNode | null;
    private first: QueueNode | null;
    public length: number;

    constructor() {
        this.last = null;
        this.first = null;
        this.length = 0;
    }

    public peek() { // Retornar el primer elemento
        if (this.length === 0) throw new Error('No hay ningún elemento en la cola');
        return this.first;
    }

    public lastest() {
        if (this.length === 0) throw new Error('No hay ningun elemento en la cola');
        return this.last;
    }

    public enqueue(value: any) { // Añadir un nodo a la Queue
        const newPile = new Nodo(value);

        if (this.length === 0) {
            this.last = newPile;
            this.first = newPile
        } else {
            this.last!.prev = newPile;
            this.last = newPile
        }

        this.length++;

        return this;
    }
    
    public dequeue() {
        if (this.length === 0) throw new Error('No hay ningún elemento en la cola');

        const removedPile = this.first;

        this.length === 1 ? (this.last = null, this.first = null) : this.first = this.first!.prev;

        this.length--;

        return removedPile;
    }
}
