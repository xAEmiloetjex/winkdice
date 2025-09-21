import { ElementRef, OnInit } from '@angular/core';
import { Logger } from 'app/shared/logger.service';
import { ElementsLoader } from './elements-loader';
export declare class LazyCustomElementComponent implements OnInit {
    private elementRef;
    private elementsLoader;
    private logger;
    selector: string;
    constructor(elementRef: ElementRef, elementsLoader: ElementsLoader, logger: Logger);
    ngOnInit(): void;
}
