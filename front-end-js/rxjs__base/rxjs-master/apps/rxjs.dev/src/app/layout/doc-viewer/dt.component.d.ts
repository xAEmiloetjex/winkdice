import { ElementRef } from '@angular/core';
import { DocumentContents } from 'app/documents/document.service';
export declare class DtComponent {
    on: boolean;
    doc: DocumentContents;
    docChange: any;
    dt: ElementRef;
    get text(): string;
    dtextSet(): void;
}
