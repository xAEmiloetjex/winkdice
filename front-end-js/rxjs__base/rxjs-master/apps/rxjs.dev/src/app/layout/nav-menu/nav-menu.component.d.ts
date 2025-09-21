import { CurrentNode, NavigationNode } from 'app/navigation/navigation.service';
export declare class NavMenuComponent {
    currentNode: CurrentNode | undefined;
    isWide: boolean;
    nodes: NavigationNode[];
    get filteredNodes(): NavigationNode[];
}
