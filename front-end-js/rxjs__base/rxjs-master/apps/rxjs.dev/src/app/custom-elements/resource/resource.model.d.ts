export declare class Category {
    id: string;
    title: string;
    order: number;
    subCategories: SubCategory[];
}
export declare class SubCategory {
    id: string;
    title: string;
    order: number;
    resources: Resource[];
}
export declare class Resource {
    category: string;
    subCategory: string;
    id: string;
    desc: string;
    rev: boolean;
    title: string;
    url: string;
}
