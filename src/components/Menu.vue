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
        <h2 @click="editCat(cat)">{{ cat.name }}</h2>
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
          this.setCategories();
        })
        .catch(err => console.log(err));
      this.isLoading = false;
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
        if (this.catToAdd && !hasCat) {
          this.categories.push(this.catToAdd);
          this.catToAdd = "";
        }
      } else {
        let newMenuItems = [...this.menuItems];
        for (let idx = 0; idx < newMenuItems.length; idx++) {
          let menuItem = newMenuItems[idx];
          if (menuItem.category.id === this.catToAdd.id) {
            menuItem.category = this.catToAdd;
            MenuService.editMenuItem(menuItem)
              .then(response => {
                menuItem = response.data;
                this.catToAdd = Category.newCategory();
                this.addEditCat = "Add";
              })
              .catch(err => console.log(err));
          }
        }
      }
    },
    swapIsAdmin() {
      if (prompt("Enter your password", "password") === "Lewis") {
        this.isAdmin = !this.isAdmin;
      }
    },
    addMenuItem(menuItem) {
      let alreadyStored = this.menuItems.some(mi => {
        return (
          menuItem.name.toLowerCase() === mi.name.toLowerCase() &&
          mi.category.name === menuItem.category.name
        );
      });
      if (!alreadyStored) {
        MenuService.saveMenuItem(menuItem)
          .then(response => {
            this.menuItems.push(response.data);
          })
          .catch(err => console.log(err));
      }
    },
    resetMenuItem() {
      this.selectedMenuItem = MenuItem.newMenuItem();
    },
    editMenuItem(menuItem) {
      MenuService.editMenuItem(menuItem)
        .then(() => {})
        .catch(err => console.log(err));
    },
    setSelectedItem(menuItem) {
      this.selectedMenuItem = menuItem;
    },
    deleteMenuItem(menuItem) {
      MenuService.deleteMenuItem(menuItem.id)
        .then(() => {
          const idx = this.menuItems.findIndex(mi => {
            return mi.id === menuItem.id;
          });
          this.menuItems.splice(idx, 1);
        })
        .catch(err => console.log(err));
    },

    filteredMenuItems(category) {
      return this.menuItems.filter(menuItem => {
        return menuItem.category.name === category.name;
      });
    },
    setCategories() {
      // console.log("setCategories ran: " + this.menuItems);
      if (this.menuItems && this.menuItems.length > 1) {
        for (let idx = 0; idx < this.menuItems.length; idx++) {
          let hasCat = this.categories.some(c => {
            return c.name === this.menuItems[idx].category.name;
          });
          if (!hasCat) {
            this.categories.push(this.menuItems[idx].category);
          }
        }
      }
    }
  },
  async created() {
    this.isLoading = true;
    //this.getMenuItemsStatic();
    await this.setMenuItems();
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
