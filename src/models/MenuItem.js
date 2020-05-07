export class MenuItem {
  constructor(category, id, name, price, description) {
    this.id = id;
    this.category = category;
    this.name = name;
    this.price = price;
    this.description = description;
  }
  static newMenuItem() {
    return new MenuItem();
  }
}
