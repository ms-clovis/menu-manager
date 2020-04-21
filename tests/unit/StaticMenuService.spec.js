import { StaticMenuService } from "../../src/services/StaticMenuService";
import { MenuItem } from "../../src/models/MenuItem";

describe("Get Menu Items from static DB", () => {
  //const path = "./menu.json";
  let menuItems = [];
  let sms = null;
  beforeEach(() => {
    sms = StaticMenuService.newStaticMenuService("./menu_bak.json");
    // StaticMenuService.getMenuItems()
    //   .then(data => {
    //     //console.log(data);
    //     menuItems = data;
    //   })
    //   .catch(err => console.log(err));
    sms.getMenuItems().then(data => {
      menuItems = data;
    });
  });
  afterEach(() => {
    menuItems = null;
    sms = null;
  });

  // console.log("Menu Items are: ");
  // console.log(menuItems);
  test("gets More than one menuItem", () => {
    //expect(menuItems.length).not.toEqual(undefined);
    expect(menuItems.length).toBeGreaterThan(0);
  });

  test("Can add, edit and delete a new MenuItem", () => {
    let menuItem = new MenuItem("Wings", null, "15 LBs.", 25.99);
    const menuItemLenBefore = menuItems.length;
    sms
      .postMenuItem(menuItem)
      .then(data => {
        menuItem = data;
      })
      .catch(err => console.log(err));
    expect(menuItem.id).toBeGreaterThan(1);
    expect(menuItems.length).toBeGreaterThan(menuItemLenBefore);

    menuItem.category = "Buffalo Wings";
    sms
      .editMenuItem(menuItem)
      .then(data => {
        const editedMenuItem = data;
        expect(menuItem.id).toEqual(editedMenuItem.id);
        expect(menuItem.category).toEqual(editedMenuItem.category);
      })
      .catch(err => console.log(err));

    let result = null;
    sms
      .deleteMenuItem(menuItem)
      .then(data => {
        result = data;
        expect(result).toBe(true);
        expect(menuItems.length).toEqual(menuItemLenBefore);
      })
      .catch(err => console.log(err));
  });
});
