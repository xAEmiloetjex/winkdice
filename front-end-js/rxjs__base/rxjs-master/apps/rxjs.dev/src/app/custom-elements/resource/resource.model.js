export class Category {
    id; // "education"
    title; // "Education"
    order; // 2
    subCategories;
}
export class SubCategory {
    id; // "books"
    title; // "Books"
    order; // 1
    resources;
}
export class Resource {
    category; // "Education"
    subCategory; // "Books"
    id; // "-KLI8vJ0ZkvWhqPembZ7"
    desc; // "This books shows all the steps necessary for the development of SPA"
    rev; // true (always true in the original)
    title; // "Practical Angular 2",
    url; // "https://leanpub.com/practical-angular-2"
}
