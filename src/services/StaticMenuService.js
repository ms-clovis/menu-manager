//import fs from "fs";
const fs = require("fs");

export class StaticMenuService {
  constructor(path) {
    this.path = path;
    try {
      this.menuItems = JSON.parse(fs.readFileSync(path).toString()).menuItems;
    } catch (e) {
      console.log(e);
      this.menuItems = [];
    }
  }
  static newStaticMenuService(path) {
    const sms = new StaticMenuService(path);
    sms.setMenuItems(path);
    return sms;
  }
  setMenuItems() {
    this.menuItems = JSON.parse(
      fs.readFileSync(this.path).toString()
    ).menuItems;
  }
  getMenuItems() {
    // const path = "./menu.json";
    // try {
    //   const jsonString = fs.readFileSync(path);
    //   return Promise.resolve(JSON.parse(jsonString.toString()).menuItems);
    // } catch (e) {
    //   return e;
    // }
    return Promise.resolve(this.menuItems);
  }

  postMenuItem(newMenuItem) {
    // const path = "./menu.json";
    // let maxID = 0;
    // let menuItems = null;
    let maxID = 0;
    try {
      //menuItems = JSON.parse(fs.readFileSync(path).toString()).menuItems;
      this.menuItems.forEach(mi => {
        if (mi.id > maxID) {
          maxID = mi.id;
        }
      });

      newMenuItem.id = maxID + 1;
      this.menuItems.push(newMenuItem);
      this.writeMenuItemsToFS();

      return Promise.resolve(newMenuItem);
    } catch (e) {
      return e;
    }
  }
  editMenuItem(menuItem) {
    try {
      this.deleteMenuItem(menuItem); // will delete by ID
      this.menuItems.push(menuItem);
      this.writeMenuItemsToFS();
      return Promise.resolve(menuItem);
    } catch (e) {
      return e;
    }
  }
  deleteMenuItem(menuItem) {
    try {
      const idx = this.menuItems.findIndex(mi => {
        return mi.id === menuItem.id;
      });
      this.menuItems.splice(idx, 1);
      this.writeMenuItemsToFS();
      return Promise.resolve(true);
    } catch (e) {
      return e;
    }
  }

  writeMenuItemsToFS() {
    const jsonObj = {};
    jsonObj.menuItems = this.menuItems;
    fs.writeFileSync(this.path, JSON.stringify(jsonObj, null, 2));
  }
}
