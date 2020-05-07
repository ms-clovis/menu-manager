<template>
  <div class="row">
    <div class="col-12">
      <label
        >Category:
        <select
          v-if="categories && categories.length > 0"
          v-model="menuItem.category"
        >
          <option value="" selected></option>
          <option :key="idx" v-for="(cat, idx) in categories" :value="cat">
            {{ cat.name }}
          </option>
        </select>
      </label>
      &nbsp;
      <label>
        Name:
        <input type="text" v-model="menuItem.name" placeholder="Name" />
      </label>
      &nbsp;
      <label>
        Price:
        <input
          type="number"
          v-model.number="menuItem.price"
          placeholder="Price"
        />
      </label>
      <label
        >Description:
        <input
          type="text"
          v-model="menuItem.description"
          placeholder="Description"
        />
      </label>
      <button
        style="margin: 1em"
        class="btn btn-primary"
        @click="addEditMenuItem"
      >
        {{ buttonText }}
      </button>
      <button
        style="margin: 1em"
        class="btn btn-success"
        @click="resetMenuItem"
      >
        Clear
      </button>
    </div>
  </div>
</template>

<script>
import { MenuItem } from "../models/MenuItem";

export default {
  name: "MenuItemAddEdit",
  props: {
    menuItem: {
      type: Object,
      require: true,
      default: () => MenuItem.newMenuItem()
    },
    categories: {
      type: Array,
      default: () => []
    }
  },

  methods: {
    isNewMenuItem() {
      return this.menuItem == null || this.menuItem.id === undefined;
    },
    menuItemIsComplete() {
      return (
        this.menuItem.name &&
        this.menuItem.category &&
        this.menuItem.price &&
        this.menuItem.category !== ""
      );
    },
    resetMenuItem() {
      // this.menuItem = MenuItem.newMenuItem();
      // this.setButtonText();
      this.$emit("reMI");
    },
    addEditMenuItem() {
      if (this.isNewMenuItem() && this.menuItemIsComplete()) {
        this.$emit("AddNewMI", this.menuItem);
      } else if (this.menuItemIsComplete()) {
        this.$emit("EditMI", this.menuItem);
      }
      this.resetMenuItem();
    },
    setButtonText() {
      if (!this.isNewMenuItem()) {
        this.buttonText = "Edit Menu Item";
      } else {
        this.buttonText = "Add Menu Item";
      }
    }
  },
  data() {
    return {
      buttonText: ""
    };
  },
  watch: {
    menuItem: function() {
      this.setButtonText();
    }
  },
  created() {
    this.setButtonText();
  }
};
</script>

<style scoped></style>
