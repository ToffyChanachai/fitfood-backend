"use strict";
const ZoneDeliveryType = use('App/Models/ZoneDeliveryType')

class ZoneDeliveryTypeController {
  async index({ response }) {
    const zoneDeliveryTypes = await ZoneDeliveryType.all();

    return response.status(200).json(zoneDeliveryTypes);
  }

  async store({ request, response }) {
    const { name } = request.only(["name"]);

    const zoneDeliveryType = await ZoneDeliveryType.create({
      name,
    });

    return response.status(201).json(zoneDeliveryType);
  }

  async show({ params, response }) {
    const zoneDeliveryType = await ZoneDeliveryType.find(params.id);

    if (!zoneDeliveryType) {
      return response
        .status(404)
        .json({ message: "Zone delivery type not found" });
    }

    return response.status(200).json(zoneDeliveryType);
  }

  async update({ params, request, response }) {
    const zoneDeliveryType = await ZoneDeliveryType.find(params.id);

    if (!zoneDeliveryType) {
      return response
        .status(404)
        .json({ message: "Zone delivery type not found" });
    }

    const { name } = request.only(["name"]);

    zoneDeliveryType.name = name || zoneDeliveryType.name;

    await zoneDeliveryType.save();

    return response.status(200).json(zoneDeliveryType);
  }

  async destroy({ params, response }) {
    const zoneDeliveryType = await ZoneDeliveryType.find(params.id);

    if (!zoneDeliveryType) {
      return response
        .status(404)
        .json({ message: "Zone delivery type not found" });
    }

    await zoneDeliveryType.delete();

    return response
      .status(200)
      .json({ message: "Zone delivery type deleted successfully" });
  }
}

module.exports = ZoneDeliveryTypeController;
