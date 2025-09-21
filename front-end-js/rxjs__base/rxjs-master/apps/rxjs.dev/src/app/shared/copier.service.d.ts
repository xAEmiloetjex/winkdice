/**
 * This class is based on the code in the following projects:
 *
 * - https://github.com/zenorocha/select
 * - https://github.com/zenorocha/clipboard.js/
 *
 * Both released under MIT license - © Zeno Rocha
 */
export declare class CopierService {
    private fakeElem;
    /**
     * Creates a fake textarea element, sets its value from `text` property,
     * and makes a selection on it.
     */
    createFake(text: string): void;
    removeFake(): void;
    copyText(text: string): boolean;
}
