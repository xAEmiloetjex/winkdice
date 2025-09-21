export declare class ContributorGroup {
    name: string;
    order: number;
    contributors: Contributor[];
}
export declare class Contributor {
    group: string;
    name: string;
    picture?: string;
    website?: string;
    twitter?: string;
    github?: string;
    bio?: string;
    isFlipped?: boolean;
}
