import { ShoppingListItem } from "./shopping-list-item";

export interface ShoppingList {
    id?: number;
    name: string;
    items: ShoppingListItem[];
}
