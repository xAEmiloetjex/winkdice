import { ElementRef, OnInit } from '@angular/core';
export interface Option {
    title: string;
    value?: any;
}
export declare class SelectComponent implements OnInit {
    private hostElement;
    selected: Option;
    options: Option[];
    change: any;
    showSymbol: boolean;
    label: string;
    showOptions: boolean;
    constructor(hostElement: ElementRef);
    ngOnInit(): void;
    toggleOptions(): void;
    hideOptions(): void;
    select(option: Option, index: number): void;
    onClick(eventTarget: HTMLElement): void;
    onKeyDown(): void;
}
