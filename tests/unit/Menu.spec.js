import { mount } from "@vue/test-utils";
import Menu from "../../src/components/Menu";
import { MenuItem } from "../../src/models/MenuItem";

describe("Menu.vue", () => {
  let wrapper = null;
  beforeEach(() => {
    wrapper = mount(Menu);
  });
  afterEach(() => {
    wrapper.destroy();
  });
  test("Menu.vue gets Data and displays category properly", async () => {
    const menuItems = [
      new MenuItem("Wings", 1, "One LB.", 8.99),
      new MenuItem("Wings", 2, "Three LBs.", 13.99)
    ];
    wrapper.setData({ menuItems: menuItems });
    expect(wrapper.vm.menuItems).toBe(menuItems);

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain("Wings");
  });

  test("Menu.vue gets Data and displays Menu Items properly", async () => {
    const menuItems = [
      new MenuItem("Wings", 1, "One LB.", 8.99),
      new MenuItem("Wings", 2, "Three LBs.", 13.99)
    ];
    wrapper.setData({ menuItems: menuItems });
    expect(wrapper.vm.menuItems).toBe(menuItems);

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain("One LB.");
    expect(wrapper.text()).toContain("Three LBs.");
  });
});
