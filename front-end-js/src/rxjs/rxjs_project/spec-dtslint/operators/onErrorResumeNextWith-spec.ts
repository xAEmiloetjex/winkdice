import { of } from 'rxjs';
import { onErrorResumeNextWith } from 'rxjs/operators';

it('should infer correctly', () => {
  const o = of('apple', 'banana', 'peach').pipe(onErrorResumeNextWith()); // $ExpectType Observable<string>
});

it('should accept one input', () => {
  const o = of('apple', 'banana', 'peach').pipe(onErrorResumeNextWith(of(1))); // $ExpectType Observable<string | number>
  const p = of('apple', 'banana', 'peach').pipe(onErrorResumeNextWith(of('5'))); // $ExpectType Observable<string>
});

it('should accept promises', () => {
  const o = of('apple', 'banana', 'peach').pipe(onErrorResumeNextWith(Promise.resolve(5))); // $ExpectType Observable<string | number>
});

it('should accept iterables', () => {
  const o = of('apple', 'banana', 'peach').pipe(onErrorResumeNextWith('foo')); // $ExpectType Observable<string>
});

it('should accept arrays', () => {
  const o = of('apple', 'banana', 'peach').pipe(onErrorResumeNextWith([5])); // $ExpectType Observable<string | number>
});

it('should accept two inputs', () => {
  const o = of('apple', 'banana', 'peach').pipe(onErrorResumeNextWith(of(1), of(2))); // $ExpectType Observable<string | number>
});

it('should accept three inputs', () => {
  const o = of('apple', 'banana', 'peach').pipe(onErrorResumeNextWith(of(1), of(2), of('3'))); // $ExpectType Observable<string | number>
});

it('should accept four inputs', () => {
  const o = of('apple', 'banana', 'peach').pipe(onErrorResumeNextWith(of(1), of(2), of('3'), of('4'))); // $ExpectType Observable<string | number>
});

it('should accept five inputs', () => {
  const o = of('apple', 'banana', 'peach').pipe(onErrorResumeNextWith(of(1), of(2), of('3'), of('4'), of(5))); // $ExpectType Observable<string | number>
});

it('should accept six inputs', () => {
  const o = of('apple', 'banana', 'peach').pipe(onErrorResumeNextWith(of(1), of(2), of('3'), of('4'), of(5), of('6'))); // $ExpectType Observable<string | number>
});

it('should accept seven and more inputs', () => {
  const o = of('apple', 'banana', 'peach').pipe(onErrorResumeNextWith(of(1), of(2), of('3'), of('4'), of(5), of('6'), of(7))); // $ExpectType Observable<string | number>
});

it('should enforce types', () => {
  const o = of('apple', 'banana', 'peach').pipe(onErrorResumeNextWith(5)); // $ExpectError
});
