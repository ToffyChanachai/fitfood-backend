"use strict";
const PackageType = use("App/Models/PackageType");

class PackageTypeController {
  async index({ response }) {
    const packageTypes = await PackageType.all();
    return response.json(packageTypes);
  }

  async store({ request, response }) {
    const { name } = request.post();

    try {
      const packageType = await PackageType.create({ name });
      return response.status(201).json(packageType);
    } catch (error) {
      return response.status(400).json({ error: "Cannot create package type" });
    }
  }

  async show({ params, response }) {
    try {
      const packageType = await PackageType.findOrFail(params.id);
      return response.json(packageType);
    } catch (error) {
      return response.status(404).json({ error: "Package type not found" });
    }
  }

  async update({ params, request, response }) {
    try {
      const packageType = await PackageType.findOrFail(params.id);
      const { name } = request.post();
      packageType.merge({ name });
      await packageType.save();
      return response.json(packageType);
    } catch (error) {
      return response.status(400).json({ error: "Cannot update package type" });
    }
  }

  async destroy({ params, response }) {
    try {
      const packageType = await PackageType.findOrFail(params.id);
      await packageType.delete();
      return response.status(204).json(null);
    } catch (error) {
      return response.status(400).json({ error: "Cannot delete package type" });
    }
  }
}

module.exports = PackageTypeController;
