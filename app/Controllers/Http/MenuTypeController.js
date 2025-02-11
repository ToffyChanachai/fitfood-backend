"use strict";

const MenuType = use("App/Models/MenuType");

class MenuTypeController {
  async store({ request, response }) {
    const data = request.only(["name"]);

    const menuType = await MenuType.create(data);

    return response.status(201).json(menuType);
  }

  async index({ response }) {
    const menuTypes = await MenuType.all();

    return response.json(menuTypes);
  }

  async show({ params, response }) {
    const menuType = await MenuType.find(params.id);

    if (!menuType) {
      return response.status(404).json({ message: "ไม่พบข้อมูล Menu type" });
    }

    return response.json(menuType);
  }

  async update({ params, request, response }) {
    const menuType = await MenuType.find(params.id);

    if (!menuType) {
      return response.status(404).json({ message: "ไม่พบข้อมูล Menu type" });
    }

    const data = request.only(["name"]);
    menuType.merge(data);
    await menuType.save();

    return response.json(menuType);
  }

  async destroy({ params, response }) {
    const menuType = await MenuType.find(params.id);

    if (!menuType) {
      return response.status(404).json({ message: "ไม่พบข้อมูล Menu type" });
    }

    await menuType.delete();

    return response.status(204).send();
  }
}

module.exports = MenuTypeController;
