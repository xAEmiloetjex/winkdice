import { OnInit } from '@angular/core';
export declare class NotificationComponent implements OnInit {
    private currentDate;
    private storage;
    dismissOnContentClick: boolean;
    notificationId: string;
    expirationDate: string;
    dismissed: any;
    showNotification: 'show' | 'hide';
    constructor(window: Window, currentDate: Date);
    ngOnInit(): void;
    contentClick(): void;
    dismiss(): void;
}
