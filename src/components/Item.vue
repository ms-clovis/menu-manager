<template>
  <div class="menuItem row">
    <div class="col-12" style="margin: 5px" @click="setSelectedItem">
      <span class="menuName" v-if="menuItem.name">{{ menuItem.name }}</span
      >{{ fixDashes() }}
      <span class="menuPrice" v-if="menuItem.price"
        >${{ menuItem.price.toFixed(2) }}
      </span>
      <i
        class="fal fa-times-octagon"
        @click="deleteMenuItem"
        v-if="isAdmin"
      ></i>
      <h6>{{ menuItem.description }}</h6>
    </div>
  </div>
</template>

<script>
import { MenuItem } from "../models/MenuItem";

export default {
  name: "Item",
  components: {},
  props: {
    menuItem: {
      type: Object,
      require: true,
      default: () => MenuItem.newMenuItem()
    },
    isAdmin: {
      type: Boolean
    }
  },
  methods: {
    deleteMenuItem() {
      this.$emit("DelItem", this.menuItem);
    },
    setSelectedItem() {
      //console.log("Sent it");
      this.$emit("SelItem", this.menuItem);
    },
    fixDashes() {
      let dashes = "-";
      if (this.menuItem.name) {
        while (dashes.length < 25 - this.menuItem.name.length) {
          dashes += "-";
        }
      }
      return dashes;
    }
  }
};
</script>

<style scoped>
.menuItem {
  font-family: "JetBrains Mono", serif;
  display: list-item;
  list-style-type: none;
  text-align: center;
  font-size: 1em;
}
.menuName,
.menuPrice {
  font-weight: 900;
}
@media (min-width: 1px) {
  .menuName,
  .menuPrice {
    font-size: 0.75em;
  }
}
@media (min-width: 992px) {
  .menuName,
  .menuPrice {
    font-size: 1em;
  }
}
</style>
