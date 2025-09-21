export class Either {
    left;
    right;
    constructor(left, right) {
        this.left = left;
        this.right = right;
        if (this.neitherExist()) {
            throw new TypeError('Either requires a left or a right');
        }
        if (this.bothExist()) {
            throw new TypeError('Either cannot have both a left and a right');
        }
    }
    static exists(value) {
        return typeof value !== 'undefined' && value !== null;
    }
    bothExist() {
        return this.isLeft() && this.isRight();
    }
    neitherExist() {
        return !this.isLeft() && !this.isRight();
    }
    isLeft() {
        return Either.exists(this.left);
    }
    isRight() {
        return Either.exists(this.right);
    }
    match(pattern) {
        return this.isRight()
            ? pattern.right(this.right)
            : pattern.left(this.left);
    }
    tap(pattern) {
        this.isRight()
            ? typeof pattern.right === 'function' && pattern.right(this.right)
            : typeof pattern.left === 'function' && pattern.left(this.left);
    }
    map(fn) {
        return this.isRight()
            ? new Either(undefined, fn(this.right))
            : new Either(this.left);
    }
    flatMap(fn) {
        return this.isRight()
            ? fn(this.right)
            : new Either(this.left);
    }
}
