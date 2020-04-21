<template>
  <div id="menu" class="container">
    <div class="row">
      <h1 class="col-12" style="text-align: center" @click="swapIsAdmin">
        Trum Menu
      </h1>
    </div>

    <div class="row">
      <div class="category col-12" v-for="cat in categories" :key="cat">
        {{ cat }}
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
      </div>
    </div>
    <div class="row" v-if="isAdmin">
      <div class="col-12">
        <label>
          New Category:
          <input type="text" v-model="catToAdd" placeholder="New Category" />
        </label>
        <button class="btn btn-primary" @click="addCategory">
          Add Category
        </button>
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
  </div>
</template>

<script>
import Item from "./Item";
import MenuService from "../services/MenuService";
import MenuItemAddEdit from "./MenuItemAddEdit";
import { MenuItem } from "../models/MenuItem";
export default {
  name: "Menu",
  components: { MenuItemAddEdit, Item },
  data() {
    return {
      menuItems: [],
      categories: [],
      isAdmin: false,
      selectedMenuItem: {},
      catToAdd: ""
    };
  },
  watch: {
    menuItems: function() {
      //console.log("watch menu Items triggered");
      this.setCategories();
    }
  },
  methods: {
    addCategory() {
      if (this.catToAdd && !this.categories.includes(this.catToAdd)) {
        this.categories.push(this.catToAdd);
        this.catToAdd = "";
      }
    },
    swapIsAdmin() {
      this.isAdmin = !this.isAdmin;
    },
    addMenuItem(menuItem) {
      MenuService.saveMenuItem(menuItem)
        .then(response => {
          this.menuItems.push(response.data);
        })
        .catch(err => console.log(err));
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
        return menuItem.category === category;
      });
    },
    setCategories() {
      //console.log("setCategories ran: " + this.menuItems.length);
      for (let idx = 0; idx < this.menuItems.length; idx++) {
        if (!this.categories.includes(this.menuItems[idx].category)) {
          this.categories.push(this.menuItems[idx].category);
        }
      }
    }
  },
  created() {
    MenuService.getMenuItems()
      .then(response => {
        this.menuItems = response.data;
      })
      .catch(err => console.log(err));
    this.setCategories();
  }
};
</script>

<style scoped>
#menu {
  //background-image: url("../assets/30426.jpg");
  background: black url("https://cdn.wallpapersafari.com/63/77/CNFTlh.jpg")
    repeat fixed center;
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
