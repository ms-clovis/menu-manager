import MenuService from "../../src/services/MenuService";
import { MenuItem } from "../../src/models/MenuItem";

describe("Testing axios service", () => {
  let menuItems;

  beforeEach(() => {
    menuItems = [];
  });
  test("Gets the Menu items", async () => {
    await MenuService.getMenuItems()
      .then(response => {
        menuItems = response.data;
      })
      .catch(err => console.log(err));
    expect(menuItems.length).toBeGreaterThan(0);
  });

  test("Can add, edit, delete menuItem", async () => {
    await MenuService.getMenuItems()
      .then(response => {
        menuItems = response.data;
      })
      .catch(err => console.log(err));
    let origMenuItemsLen = menuItems.length;
    expect(origMenuItemsLen).toBeGreaterThan(0);
    let menuItem = new MenuItem("Foo", null, "Foo Wings", 99.99, null);
    await MenuService.saveMenuItem(menuItem)
      .then(response => {
        menuItem = response.data;
      })
      .catch(err => console.log(err));
    await MenuService.getMenuItems()
      .then(response => {
        menuItems = response.data;
      })
      .catch(err => console.log(err));
    expect(menuItem.id).toBeGreaterThan(0);
    expect(origMenuItemsLen).toBeLessThan(menuItems.length);

    menuItem.category = "Bar";
    await MenuService.editMenuItem(menuItem)
      .then(response => {
        menuItem = response.data;
      })
      .catch(err => console.log(err));

    expect(menuItem.category).toBe("Bar");
    let status = 0;
    await MenuService.deleteMenuItem(menuItem.id)
      .then(response => {
        status = response.status;
      })
      .catch(err => console.log(err));
    expect(status).toBeGreaterThan(0);
  });
});
