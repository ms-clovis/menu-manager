import { MenuItem } from "../../src/models/MenuItem";
import { shallowMount } from "@vue/test-utils";
import Item from "../../src/components/Item";

describe("Item.vue renders MenuItem prop", () => {
  let wrapper = null;
  beforeEach(() => {
    wrapper = shallowMount(Item);
  });

  afterEach(() => {
    wrapper.destroy();
    wrapper = null;
  });
  // const wrapper = shallowMount(Item);
  test("Pass Menu Item as a prop", async () => {
    let menuItem = new MenuItem("Wings", 0, "One LB.", 8.99);
    wrapper.setProps({ menuItem: menuItem });
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain(menuItem.name);
  });

  test("Delete Icon not there when Not Admin", async () => {
    let menuItem = new MenuItem("Wings", 0, "One LB.", 8.99);
    wrapper.setProps({ menuItem: menuItem }); // not setting isAdmin .. default is false
    await wrapper.vm.$nextTick();

    expect(wrapper.find("i").exists()).toBe(false);
  });

  test("Delete Menu Item by clicking Icon when an Administrator", async () => {
    let menuItem = new MenuItem("Wings", 1, "One LB.", 8.99);
    wrapper.setProps({ menuItem: menuItem, isAdmin: true });
    await wrapper.vm.$nextTick();
    const xIcon = wrapper.find("i");
    xIcon.trigger("click");
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted().DelItem[0][0].price).toEqual(8.99);
    expect(wrapper.emitted().DelItem[0][0].id).toEqual(1);
  });
});
