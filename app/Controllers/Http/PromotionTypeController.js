"use strict";
const PromotionType = use("App/Models/PromotionType");

class PromotionTypeController {

  async index({ response }) {
    try {
      const promotionTypes = await PromotionType.query().fetch();
      return response.status(200).json(promotionTypes);
    } catch (error) {
      return response.status(500).json({ message: 'Error fetching promotionTypes', error });
    }
  }

  async store({ request, response }) {
    const { name } = request.only(['name'])
    try {
      const promotionType = await PromotionType.create({ name })
      return response.status(201).json(promotionType)
    } catch (error) {
      return response.status(500).json({ message: 'Error creating promotion type', error })
    }
  }

  async show({ params, response }) {
    try {
      const promotionType = await PromotionType.find(params.id)
      if (!promotionType) {
        return response.status(404).json({ message: 'Promotion Type not found' })
      }
      return response.status(200).json(promotionType)
    } catch (error) {
      return response.status(500).json({ message: 'Error fetching promotion type', error })
    }
  }

  async update({ params, request, response }) {
    const { name } = request.only(['name'])
    try {
      const promotionType = await PromotionType.find(params.id)
      if (!promotionType) {
        return response.status(404).json({ message: 'Promotion Type not found' })
      }
      promotionType.name = name || promotionType.name
      await promotionType.save()
      return response.status(200).json(promotionType)
    } catch (error) {
      return response.status(500).json({ message: 'Error updating promotion type', error })
    }
  }

  async destroy({ params, response }) {
    try {
      const promotionType = await PromotionType.find(params.id)
      if (!promotionType) {
        return response.status(404).json({ message: 'Promotion Type not found' })
      }
      await promotionType.delete()
      return response.status(200).json({ message: 'Promotion Type deleted successfully' })
    } catch (error) {
      return response.status(500).json({ message: 'Error deleting promotion type', error })
    }
  }
}

module.exports = PromotionTypeController;
