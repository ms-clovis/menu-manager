export class MenuItem {
  constructor(category, id, name, price) {
    this.id = id;
    this.category = category;
    this.name = name;
    this.price = price;
  }
  static newMenuItem() {
    return new MenuItem();
  }
}
