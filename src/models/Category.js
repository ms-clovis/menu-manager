export class Category {
  constructor(id, name, description, addendum) {
    this.id = id;
    this.name = name;
    this.addendum = addendum;
    this.description = description;
  }

  static newCategory() {
    return new Category();
  }
}
