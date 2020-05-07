describe("Rewrite Menu.json file for correct categories", () => {
  test("dummy test", () => {
    expect(1).toEqual(1);
  });
  console.log("works");
  // let menuItems = [];
  // let newMenuItems = [];
  // let cats = [];
  // test("Get menu Items", () => {
  //   let sms = StaticMenuService.newStaticMenuService("./menu.json");
  //   sms.setMenuItemsSync();
  //   menuItems = sms.menuItems;
  //   console.log(menuItems.length);
  //   let catID = 1;
  //   for (let idx = 0; idx < menuItems.length; idx++) {
  //     let menuItem = menuItems[idx];
  //     let cat = Category.newCategory();
  //     cat.name = menuItem.category;
  //     let hasCat = cats.some(c => {
  //       return c.name === cat.name;
  //     });
  //     if (!hasCat) {
  //       cat.id = catID++;
  //       cats.push(cat);
  //     } else {
  //       let idx = cats.findIndex(c => {
  //         return c.name === cat.name;
  //       });
  //       let newCats = [...cats];
  //       cat = newCats.splice(idx, 1)[0];
  //     }
  //     menuItem.category = cat;
  //     newMenuItems.push(menuItem);
  //   }
  //   sms.menuItems = newMenuItems;
  //   sms.writeMenuItemsToFS();
  // });
});
