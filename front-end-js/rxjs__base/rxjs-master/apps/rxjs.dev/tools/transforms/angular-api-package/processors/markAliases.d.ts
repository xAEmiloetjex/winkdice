import { DocCollection, Processor } from 'dgeni';
export declare function markAliases(log: any): MarkAliases;
declare class MarkAliases implements Processor {
    private log;
    $runAfter: string[];
    $runBefore: string[];
    constructor(log: any);
    $process(docs: DocCollection): void;
    private findDuplicateDocs;
}
export {};
