import { Observable } from 'rxjs';
import { OperatorTreeNode } from './interfaces';
import { OperatorDecisionTreeDataService } from './operator-decision-tree-data.service';
export declare class OperatorDecisionTreeService {
    private dataService;
    private initialState;
    private state$;
    private tree$;
    currentSentence$: Observable<string>;
    options$: Observable<(OperatorTreeNode)[]>;
    isBeyondInitialQuestion$: Observable<boolean>;
    hasError$: any;
    constructor(dataService: OperatorDecisionTreeDataService);
    private get snapShot();
    selectOption(optionId: string): void;
    back(): void;
    startOver(): void;
}
