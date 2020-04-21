import { mount } from "@vue/test-utils";
import MenuItemAddEdit from "../../src/components/MenuItemAddEdit";
import { MenuItem } from "../../src/models/MenuItem";

describe("MenuItemAddEdit.vue", function() {
  let wrapper = null;
  beforeEach(() => {
    wrapper = mount(MenuItemAddEdit);
  });
  afterEach(() => {
    wrapper.destroy();
    wrapper = null;
  });
  test("Edit given menu Item", async () => {
    let menuItem = new MenuItem("Wings", 1, "One LB.", 8.49);
    const categories = ["Wings", "Subs"];
    wrapper.setProps({ menuItem: menuItem, categories: categories });
    await wrapper.vm.$nextTick();
    const button = wrapper.find("button");
    expect(button.text()).toBe("Edit Menu Item");

    const priceInput = wrapper.find("input[placeholder='Menu Item Price']");
    priceInput.setValue(8.99);

    const options = wrapper.find("select").findAll("option");
    expect(options.at(2).text()).toBe("Subs");

    options.at(2).setSelected();
    button.trigger("click");
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted().EditMI[0][0].price).toEqual(8.99);
    expect(wrapper.emitted().EditMI[0][0].category).toEqual("Subs");
  });

  test("Add new Menu Item", async () => {
    const button = wrapper.find("button");
    const categories = ["Wings", "Subs"];
    wrapper.setProps({
      menuItem: MenuItem.newMenuItem(),
      categories: categories
    });
    await wrapper.vm.$nextTick();

    expect(button.text()).toBe("Add Menu Item");
    const nameInput = wrapper.find("input[placeholder = 'Menu Item Name']");
    expect(nameInput).not.toBe(null);
    nameInput.setValue("Three LBs.");
    expect(button.text()).toBe("Add Menu Item");

    const priceInput = wrapper.find("input[placeholder = 'Menu Item Price']");
    priceInput.setValue(12.99);
    expect(button.text()).toBe("Add Menu Item");
  });
});
