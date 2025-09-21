var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { filter, map, mapTo, shareReplay, catchError } from 'rxjs/operators';
import { OperatorDecisionTreeDataService } from './operator-decision-tree-data.service';
import { isInitialDecision, nodeHasOptions, treeIsErrorFree } from './utils';
let OperatorDecisionTreeService = class OperatorDecisionTreeService {
    dataService;
    initialState = {
        previousBranchIds: ['initial'],
        currentBranchId: 'initial'
    };
    state$ = new BehaviorSubject(this.initialState);
    tree$ = this.dataService.getDecisionTree$().pipe(catchError(error => of(error)), // This helps if the JSON for some reason fails to get fetched
    shareReplay());
    currentSentence$ = combineLatest(this.tree$, this.state$).pipe(filter(([tree]) => treeIsErrorFree(tree)), map(([tree, { previousBranchIds }]) => isInitialDecision(previousBranchIds)
        ? 'Start by choosing an option from the list below.'
        : `${previousBranchIds
            .map(entityId => tree[entityId].label)
            .join(' ')}...`.trim()));
    options$ = combineLatest(this.tree$, this.state$).pipe(filter(([tree, state]) => (treeIsErrorFree(tree) &&
        !!tree[state.currentBranchId] &&
        !!tree[state.currentBranchId].options)), map(([tree, state]) => {
        // Project is currently using TypeScript 2.9.2
        // With TS 3.1+ this can be done better if we map to [tree, node] and typeguard with a tuple in a filter
        // filter((a): a is [OperatorDecisionTree, OperatorTreeNodeWithOptions] => !a[0].error && !!a[1].options)
        const node = tree[state.currentBranchId];
        return nodeHasOptions(node)
            ? node.options.map(option => tree[option])
            : tree.initial.options.map(option => tree[option]);
    }));
    isBeyondInitialQuestion$ = this.state$.pipe(map(({ currentBranchId }) => currentBranchId !== 'initial'));
    // This helps if the JSON for some reason fails to get fetched
    hasError$ = this.tree$.pipe(filter(tree => !!tree.error), mapTo(true));
    constructor(dataService) {
        this.dataService = dataService;
    }
    get snapShot() {
        return this.state$.getValue();
    }
    selectOption(optionId) {
        this.state$.next({
            previousBranchIds: [...this.snapShot.previousBranchIds, optionId],
            currentBranchId: optionId
        });
    }
    back() {
        const previousOptionId = this.snapShot.previousBranchIds[this.snapShot.previousBranchIds.length - 2];
        if (previousOptionId) {
            this.state$.next({
                previousBranchIds: [
                    ...this.snapShot.previousBranchIds.slice(0, this.snapShot.previousBranchIds.length - 1)
                ],
                currentBranchId: previousOptionId
            });
        }
    }
    startOver() {
        this.state$.next(this.initialState);
    }
};
OperatorDecisionTreeService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [OperatorDecisionTreeDataService])
], OperatorDecisionTreeService);
export { OperatorDecisionTreeService };
