import { OnInit } from '@angular/core';
import { ContributorGroup } from './contributors.model';
import { ContributorService } from './contributor.service';
import { LocationService } from 'app/shared/location.service';
export declare class ContributorListComponent implements OnInit {
    private contributorService;
    private locationService;
    private groups;
    groupNames: string[];
    selectedGroup: ContributorGroup;
    constructor(contributorService: ContributorService, locationService: LocationService);
    ngOnInit(): void;
    selectGroup(name: string): void;
}
