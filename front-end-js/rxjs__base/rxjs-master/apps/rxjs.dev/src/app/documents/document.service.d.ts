import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DocumentContents } from './document-contents';
export { DocumentContents } from './document-contents';
import { LocationService } from 'app/shared/location.service';
import { Logger } from 'app/shared/logger.service';
export declare const FILE_NOT_FOUND_ID = "file-not-found";
export declare const FETCHING_ERROR_ID = "fetching-error";
export declare const CONTENT_URL_PREFIX = "generated/";
export declare const DOC_CONTENT_URL_PREFIX: string;
export declare class DocumentService {
    private logger;
    private http;
    private cache;
    currentDocument: Observable<DocumentContents>;
    constructor(logger: Logger, http: HttpClient, location: LocationService);
    private getDocument;
    private fetchDocument;
    private getFileNotFoundDoc;
    private getErrorDoc;
}
