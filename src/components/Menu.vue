<template>
  <div id="menu" class="container">
    <div class="vld-parent">
      <loading
        :active.sync="isLoading"
        :can-cancel="true"
        :is-full-page="true"
        color="#000"
      ></loading>
    </div>
    <div class="row">
      <h1 class="col-12" style="text-align: center" @click="swapIsAdmin">
        Trum Tavern Menu
      </h1>
    </div>
    <div class="row">
      <div class="category col-12" v-for="cat in categories" :key="cat.name">
        <h2 @click="editCat(cat)">
          {{ cat.name
          }}<i
            class="fal fa-times-octagon"
            @click="deleteCategory(cat)"
            v-if="isAdmin"
          ></i>
        </h2>
        <h6>{{ cat.description }}</h6>

        <div class="row">
          <Item
            @SelItem="setSelectedItem"
            @DelItem="deleteMenuItem"
            v-for="(menuItem, idx) in filteredMenuItems(cat)"
            :key="idx"
            :menu-item="menuItem"
            :is-admin="isAdmin"
          ></Item>
        </div>
        <h6>{{ cat.addendum }}</h6>
      </div>
    </div>
    <div class="row" v-if="isAdmin">
      <div class="col-12">
        <label>
          New Category:
          <input type="text" v-model="catToAdd.name" placeholder="Name" />
          <input
            type="text"
            v-model="catToAdd.description"
            placeholder="Description"
          />
          <input
            type="text"
            v-model="catToAdd.addendum"
            placeholder="Addendum"
          />
        </label>
        <button class="btn btn-primary" @click="addCategory">
          {{ addEditCat }} Category
        </button>
        &nbsp;
        <button class="btn btn-success" @click="clearCat">Clear</button>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <MenuItemAddEdit
          @reMI="resetMenuItem"
          @AddNewMI="addMenuItem"
          @EditMI="editMenuItem"
          :categories="categories"
          v-if="isAdmin"
          :menu-item="selectedMenuItem"
        ></MenuItemAddEdit>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <h2 style="text-align: center">
          (215) 538-2445
        </h2>
      </div>
    </div>
  </div>
</template>

<script>
import Item from "./Item";
import MenuService from "../services/MenuService";
import MenuItemAddEdit from "./MenuItemAddEdit";
import { MenuItem } from "../models/MenuItem";
import { StaticMenuService } from "../services/StaticMenuService";
// eslint-disable-next-line no-unused-vars
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import { Category } from "../models/Category";
import moment from "moment";
import AWSMenuService from "../services/AWSMenuService";
export default {
  name: "Menu",
  components: { MenuItemAddEdit, Item, Loading },
  data() {
    return {
      isLoading: true,
      menuItems: [],
      categories: [],
      isAdmin: false,
      selectedMenuItem: {},
      catToAdd: Category.newCategory(),
      addEditCat: "Add"
    };
  },
  watch: {
    menuItems: function() {
      //console.log("watch menu Items triggered");
      this.setCategories();
    }
  },
  methods: {
    deleteCategory(cat) {
      const idx = this.categories.findIndex(c => {
        return c.name === cat.name;
      });
      this.categories.splice(idx, 1);
      for (let i = 0; i < this.menuItems.length; i++) {
        if (this.menuItems[i].category.name === cat.name) {
          this.menuItems.splice(i, 1);
          i--;
        }
      }
      this.saveMenu();
    },
    clearCat() {
      this.catToAdd = Category.newCategory();
      this.addEditCat = "Add";
    },
    editCat(cat) {
      this.catToAdd = cat;
      this.addEditCat = "Edit";
    },
    getMenuItemsStatic() {
      const sms = StaticMenuService.newStaticMenuService("./menu.json");
      this.isLoading = true;
      sms
        .getMenuItems()
        .then(data => {
          this.menuItems = data;

          // this.saveMenu();
        })
        .catch(err => console.log(err));
      this.isLoading = false;
    },
    async saveMenu() {
      AWSMenuService.saveMenu({ menuItems: this.menuItems })
        .then(response => {
          //console.log("AWS data: ");
          //console.log(response.data.menuItems);
          this.menuItems = response.data.menuItems;
        })
        .catch(err => console.log(err));
    },

    async setMenuItems() {
      await MenuService.getMenuItems()
        .then(response => {
          this.menuItems = response.data;

          this.setCategories();
        })
        .catch(err => {
          console.log(err);
          this.getMenuItemsStatic();
        });
    },
    addCategory() {
      if (this.addEditCat === "Add") {
        let hasCat = this.categories.some(c => {
          return c.name === this.catToAdd.name;
        });
        if (
          this.catToAdd &&
          !hasCat &&
          !this.catToAdd.name.toLowerCase().indexOf("special") > 0
        ) {
          let maxCatID = this.getMaxCatID();
          this.catToAdd.id = maxCatID + 1;
          this.categories.push(this.catToAdd);
          this.catToAdd = "";
        } else if (this.catToAdd && !hasCat) {
          this.catToAdd.id = this.getMaxCatID() + 1;
          this.categories.unshift(this.catToAdd);
          this.categories[0].description = moment().format("ddd, MMM Do, YYYY");
          this.catToAdd = "";
        }
      } else {
        //let newMenuItems = [...this.menuItems];
        for (let idx = 0; idx < this.menuItems.length; idx++) {
          //let menuItem = this.menuItems[idx];
          if (this.menuItems[idx].category.id === this.catToAdd.id) {
            this.menuItems[idx].category = this.catToAdd;
            // menuItem.category = this.catToAdd;
            // this.menuItems.splice(idx, 1);
            // this.menuItems.push(menuItem);
          }
        }
        this.saveMenu();
        this.catToAdd = Category.newCategory();
      }
    },
    swapIsAdmin() {
      if (prompt("Enter your password", "password") === "Lewis") {
        this.isAdmin = !this.isAdmin;
      }
    },
    addMenuItem(menuItem) {
      console.log("ADDING MENU ITEM");
      let alreadyStored = this.menuItems.some(mi => {
        return (
          menuItem.name.toLowerCase() === mi.name.toLowerCase() &&
          mi.category.name === menuItem.category.name
        );
      });
      if (!alreadyStored) {
        menuItem.id = this.getMaxMenuItemID() + 1;
        this.menuItems.push(menuItem);
        this.saveMenu();
        // MenuService.saveMenuItem(menuItem)
        //   .then(response => {
        //     this.menuItems.push(response.data);
        //   })
        //   .catch(err => console.log(err));
      }
    },
    getMaxCatID() {
      let maxCatID = 0;
      this.categories.forEach(c => {
        if (c.id > maxCatID) {
          maxCatID = c.id;
        }
      });
      return maxCatID;
    },
    getMaxMenuItemID() {
      let maxID = 0;
      this.menuItems.forEach(mi => {
        if (mi.id > maxID) {
          maxID = mi.id;
        }
      });
      return maxID;
    },
    resetMenuItem() {
      this.selectedMenuItem = MenuItem.newMenuItem();
    },
    editMenuItem(menuItem) {
      const idx = this.menuItems.findIndex(mi => {
        return mi.id === menuItem.id;
      });
      this.menuItems.splice(idx, 1);
      this.menuItems.push(menuItem);
      this.saveMenu();
      // MenuService.editMenuItem(menuItem)
      //   .then(() => {})
      //   .catch(err => console.log(err));
    },
    setSelectedItem(menuItem) {
      this.selectedMenuItem = menuItem;
    },
    deleteMenuItem(menuItem) {
      const idx = this.menuItems.findIndex(mi => {
        return mi.id === menuItem.id;
      });
      this.menuItems.splice(idx, 1);
      this.saveMenu();
    },

    filteredMenuItems(category) {
      return this.menuItems.filter(menuItem => {
        return menuItem.category.name === category.name;
      });
    },
    setCategories() {
      // console.log("setCategories ran: " + this.menuItems);
      let saveSpecial = {};
      let isSpecial = false;
      if (this.menuItems && this.menuItems.length > 1) {
        for (let idx = 0; idx < this.menuItems.length; idx++) {
          isSpecial = false;
          saveSpecial = {};
          let hasCat = this.categories.some(c => {
            return c.name === this.menuItems[idx].category.name;
          });
          if (
            this.menuItems[idx].category.name.toLowerCase().indexOf("special") >
              0 &&
            !hasCat
          ) {
            // const mi = this.menuItems[idx];
            // this.menuItems.splice(idx, 1);
            // this.menuItems.unshift(mi);
            isSpecial = true;
            saveSpecial = this.menuItems[idx].category;
            saveSpecial.description = moment().format("ddd, MMM Do, YYYY");
          }
          if (!hasCat && !isSpecial) {
            this.categories.push(this.menuItems[idx].category);
          }
          if (!hasCat && isSpecial) {
            this.categories.unshift(saveSpecial);
          }
        }
      }
    }
  },
  async created() {
    this.isLoading = true;
    await this.getMenuItemsStatic();
    await this.setCategories();
    //await this.setMenuItems();
    this.isLoading = false;
  }
};
</script>

<style scoped>
@custom-media --viewport-4 (min-width: 480px);
@custom-media --viewport-7 (min-width: 768px);
@custom-media --viewport-9 (min-width: 992px);
@custom-media --viewport-12 (min-width: 1200px);
#menu {
  //background-image: url("../assets/30426.jpg");
  background: beige url("../../public/backgroundImage.jpg") repeat fixed center;
  color: black;
}
.category {
  display: list-item;
  list-style-type: none;
  font-family: cursive;
  font-size: 1.5em;
  text-align: center;
  font-style: italic;
}
</style>
