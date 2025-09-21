import { OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LocationService } from 'app/shared/location.service';
import { SearchResults } from 'app/search/interfaces';
import { SearchService } from 'app/search/search.service';
export declare class FileNotFoundSearchComponent implements OnInit {
    private location;
    private search;
    searchResults: Observable<SearchResults>;
    constructor(location: LocationService, search: SearchService);
    ngOnInit(): void;
}
