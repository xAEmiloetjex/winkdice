var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { performance } from 'perf_hooks';
import inputLine, { InputCanceledError } from './misc/inputLine';
import { parse } from '..';
function entryPoint() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('intaractive parser');
        while (true) {
            let input;
            try {
                input = yield inputLine('> ');
            }
            catch (err) {
                if (err instanceof InputCanceledError) {
                    console.log('bye.');
                    return;
                }
                throw err;
            }
            input = input
                .replace(/\\n/g, '\n')
                .replace(/\\t/g, '\t')
                .replace(/\\u00a0/g, '\u00a0');
            try {
                const parseTimeStart = performance.now();
                const result = parse(input);
                const parseTimeEnd = performance.now();
                console.log(JSON.stringify(result));
                const parseTime = (parseTimeEnd - parseTimeStart).toFixed(3);
                console.log(`parsing time: ${parseTime}ms`);
            }
            catch (err) {
                console.log('parsing error:');
                console.log(err);
            }
            console.log();
        }
    });
}
entryPoint()
    .catch(err => {
    console.log(err);
    process.exit(1);
});
