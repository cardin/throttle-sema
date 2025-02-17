function arrayMove(
	src: any[],
	srcIndex: number,
	dst: any[],
	dstIndex: number,
	len: number
) {
	for (let j = 0; j < len; ++j) {
		dst[j + dstIndex] = src[j + srcIndex];
		src[j + srcIndex] = void 0;
	}
}

function pow2AtLeast(n: number) {
	n = n >>> 0;
	n = n - 1;
	n = n | (n >> 1);
	n = n | (n >> 2);
	n = n | (n >> 4);
	n = n | (n >> 8);
	n = n | (n >> 16);
	return n + 1;
}

function getCapacity(capacity: number) {
	return pow2AtLeast(Math.min(Math.max(16, capacity), 1073741824));
}

// Deque is based on https://github.com/petkaantonov/deque/blob/master/js/deque.js
// Released under the MIT License: https://github.com/petkaantonov/deque/blob/6ef4b6400ad3ba82853fdcc6531a38eb4f78c18c/LICENSE
export class Deque {
	private _capacity: number;
	private _length: number;
	private _front: number;
	private arr: Array<any>;

	constructor(capacity: number) {
		this._capacity = getCapacity(capacity);
		this._length = 0;
		this._front = 0;
		this.arr = [];
	}

	push(item: any): number {
		const length = this._length;

		this.checkCapacity(length + 1);
		const i = (this._front + length) & (this._capacity - 1);
		this.arr[i] = item;
		this._length = length + 1;

		return length + 1;
	}

	pop() {
		const length = this._length;
		if (length === 0) {
			return void 0;
		}
		const i = (this._front + length - 1) & (this._capacity - 1);
		const ret = this.arr[i];
		this.arr[i] = void 0;
		this._length = length - 1;

		return ret;
	}

	shift() {
		const length = this._length;
		if (length === 0) {
			return void 0;
		}
		const front = this._front;
		const ret = this.arr[front];
		this.arr[front] = void 0;
		this._front = (front + 1) & (this._capacity - 1);
		this._length = length - 1;

		return ret;
	}

	get length(): number {
		return this._length;
	}

	private checkCapacity(size: number) {
		if (this._capacity < size) {
			this.resizeTo(getCapacity(this._capacity * 1.5 + 16));
		}
	}

	private resizeTo(capacity: number) {
		const oldCapacity = this._capacity;
		this._capacity = capacity;
		const front = this._front;
		const length = this._length;
		if (front + length > oldCapacity) {
			const moveItemsCount = (front + length) & (oldCapacity - 1);
			arrayMove(this.arr, 0, this.arr, oldCapacity, moveItemsCount);
		}
	}
}
