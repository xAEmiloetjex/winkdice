import { OnChanges } from '@angular/core';
import { SearchResult, SearchResults, SearchArea } from 'app/search/interfaces';
/**
 * A component to display search results in groups
 */
export declare class SearchResultsComponent implements OnChanges {
    /**
     * The results to display
     */
    searchResults: SearchResults | null;
    /**
     * Emitted when the user selects a search result
     */
    resultSelected: any;
    readonly defaultArea = "other";
    notFoundMessage: string;
    readonly topLevelFolders: string[];
    searchAreas: SearchArea[];
    ngOnChanges(): void;
    onResultSelected(page: SearchResult, event: MouseEvent): void;
    private processSearchResults;
    private computeAreaName;
}
