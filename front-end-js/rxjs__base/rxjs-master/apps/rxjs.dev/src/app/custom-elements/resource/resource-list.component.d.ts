import { OnInit } from '@angular/core';
import { PlatformLocation } from '@angular/common';
import { Category } from './resource.model';
import { ResourceService } from './resource.service';
export declare class ResourceListComponent implements OnInit {
    private resourceService;
    categories: Category[];
    location: string;
    scrollPos: number;
    constructor(location: PlatformLocation, resourceService: ResourceService);
    href(cat: {
        id: string;
    }): string;
    ngOnInit(): void;
    onScroll(target: any): void;
}
