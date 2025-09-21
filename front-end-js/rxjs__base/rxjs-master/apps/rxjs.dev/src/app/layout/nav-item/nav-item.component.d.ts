import { OnChanges } from '@angular/core';
import { NavigationNode } from 'app/navigation/navigation.model';
export declare class NavItemComponent implements OnChanges {
    isWide: boolean;
    level: number;
    node: NavigationNode;
    isParentExpanded: boolean;
    selectedNodes: NavigationNode[] | undefined;
    isExpanded: boolean;
    isSelected: boolean;
    classes: {
        [index: string]: boolean;
    };
    nodeChildren: NavigationNode[];
    ngOnChanges(): void;
    setClasses(): void;
    headerClicked(): void;
}
