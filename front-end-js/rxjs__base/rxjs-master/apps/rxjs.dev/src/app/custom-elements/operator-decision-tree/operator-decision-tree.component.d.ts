import { OnDestroy } from '@angular/core';
import { ScrollService } from 'app/shared/scroll.service';
import { Observable } from 'rxjs';
import { OperatorTreeNode } from './interfaces';
import { OperatorDecisionTreeService } from './operator-decision-tree.service';
export declare class OperatorDecisionTreeComponent implements OnDestroy {
    private operatorDecisionTreeService;
    private scrollService;
    currentSentence$: Observable<string>;
    options$: Observable<OperatorTreeNode[]>;
    isBeyondInitialQuestion$: Observable<boolean>;
    hasError$: Observable<boolean>;
    constructor(operatorDecisionTreeService: OperatorDecisionTreeService, scrollService: ScrollService);
    selectOption(optionId: string): void;
    back(): void;
    startOver(): void;
    ngOnDestroy(): void;
}
