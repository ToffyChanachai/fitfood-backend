"use strict";
const ZoneDelivery = use("App/Models/ZoneDelivery");

class ZoneDeliveryController {
  async index({ request, response }) {
    try {
      const zoneTypeId = request.input('zone_type_id')
      if (zoneTypeId) {
        const zoneDeliveries = await ZoneDelivery.query()
          .where('zone_type_id', zoneTypeId)
          .with('zoneType')
          .fetch()
  
        return response.status(200).json(zoneDeliveries)
      }
      const zoneDeliveries = await ZoneDelivery.query().with('zoneType').fetch()
      return response.status(200).json(zoneDeliveries)
    } catch (error) {
      return response
        .status(500)
        .json({ message: 'Error fetching zone deliveries', error })
    }
  }
  

  async store({ request, response }) {
    const { name, price, zone_type_id } = request.only([
      "name",
      "price",
      "zone_type_id",
    ]);

    const zoneDelivery = await ZoneDelivery.create({
      name,
      price,
      zone_type_id,
    });

    return response.status(201).json(zoneDelivery);
  }

  async show({ params, response }) {
    const zoneDelivery = await ZoneDelivery.find(params.id);

    if (!zoneDelivery) {
      return response.status(404).json({ message: "Zone delivery not found" });
    }

    return response.status(200).json(zoneDelivery);
  }

  async update({ params, request, response }) {
    const zoneDelivery = await ZoneDelivery.find(params.id);

    if (!zoneDelivery) {
      return response.status(404).json({ message: "Zone delivery not found" });
    }

    const { name, price, zone_type_id } = request.only([
      "name",
      "price",
      "zone_type_id",
    ]);

    zoneDelivery.name = name || zoneDelivery.name;
    zoneDelivery.price = price || zoneDelivery.price;
    zoneDelivery.zone_type_id = zone_type_id || zoneDelivery.zone_type_id;

    await zoneDelivery.save();

    return response.status(200).json(zoneDelivery);
  }

  async destroy({ params, response }) {
    const zoneDelivery = await ZoneDelivery.find(params.id);

    if (!zoneDelivery) {
      return response.status(404).json({ message: "Zone delivery not found" });
    }

    await zoneDelivery.delete();

    return response
      .status(200)
      .json({ message: "Zone delivery deleted successfully" });
  }
}

module.exports = ZoneDeliveryController;
