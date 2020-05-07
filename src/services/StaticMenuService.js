//import fs from "fs";
const fs = require("fs");
import $ from "jquery";

export class StaticMenuService {
  constructor(path) {
    this.path = path;
    //this.setMenuItems();
    // try {
    //   //this.menuItems = JSON.parse(fs.readFileSync(path).toString()).menuItems;
    //   this.setMenuItems()
    //     .then()
    //     .catch();
    // } catch (e) {
    //   console.log(e);
    //   this.menuItems = [];
    // }
  }
  static newStaticMenuService(path) {
    return new StaticMenuService(path);
    // sms.setMenuItems();
    // return sms;
  }
  setMenuItemsSync() {
    this.menuItems = JSON.parse(
      fs.readFileSync(this.path).toString()
    ).menuItems;
  }
  async setMenuItems() {
    // this.menuItems = JSON.parse(
    //     //   fs.readFileSync(this.path).toString()
    //     // ).menuItems;
    // http://holdinghandsdemo.net
    try {
      await $.getJSON("/menu.json", data => {
        //console.log(data.menuItems);
        this.menuItems = data.menuItems;
        // console.log("Got file");
        // console.log(this.menuItems);
      });
    } catch (e) {
      console.log(e);
    }
  }
  async getMenuItems() {
    if (!this.menuItems || this.menuItems.length === 0) {
      await this.setMenuItems();
    }

    return Promise.resolve(this.menuItems);
  }

  postMenuItem(newMenuItem) {
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
