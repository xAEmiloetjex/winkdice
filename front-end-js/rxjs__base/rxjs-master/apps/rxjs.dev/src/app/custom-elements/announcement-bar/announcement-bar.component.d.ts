import { OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Logger } from 'app/shared/logger.service';
export interface Announcement {
    imageUrl: string;
    message: string;
    linkUrl: string;
    startDate: string;
    endDate: string;
}
/**
 * Display the latest live announcement. This is used on the homepage.
 *
 * The data for the announcements is kept in `aio/content/marketing/announcements.json`.
 *
 * The format for that data file looks like:
 *
 * ```
 * [
 *   {
 *     "startDate": "2018-02-01",
 *     "endDate": "2018-03-01",
 *     "message": "This is an <b>important</b> announcement",
 *     "imageUrl": "url/to/image",
 *     "linkUrl": "url/to/website"
 *   },
 *   ...
 * ]
 * ```
 *
 * Only one announcement will be shown at any time. This is determined as the first "live"
 * announcement in the file, where "live" means that its start date is before today, and its
 * end date is after today.
 *
 * **Security Note:**
 * The `message` field can contain unsanitized HTML but this field should only updated by
 * verified members of the Angular team.
 */
export declare class AnnouncementBarComponent implements OnInit {
    private http;
    private logger;
    announcement: Announcement;
    constructor(http: HttpClient, logger: Logger);
    ngOnInit(): void;
    /**
     * Get the first date in the list that is "live" now
     */
    private findCurrentAnnouncement;
}
