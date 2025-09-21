export declare function Navbar(items: TNavbarItems, parent: string): string;
type TNavbarItems = INavbarItem[];
interface INavbarItem {
    path: string;
    label: string;
    icon?: string | null;
    type: "anchor" | "button" | string;
}
export {};
