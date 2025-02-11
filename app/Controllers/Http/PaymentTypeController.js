'use strict'

const PaymentType = use('App/Models/PaymentType')

class PaymentTypeController {
  // Create a new payment type
  async store({ request, response }) {
    const { name } = request.only(['name'])
    const paymentType = await PaymentType.create({ name })
    return response.status(201).json({
      message: 'Payment type created successfully',
      data: paymentType,
    })
  }

  // Get all payment types
  async index({ response }) {
    const paymentTypes = await PaymentType.all()
    return response.status(200).json({
      message: 'Payment types retrieved successfully',
      data: paymentTypes,
    })
  }

  // Get a single payment type by id
  async show({ params, response }) {
    const paymentType = await PaymentType.find(params.id)
    if (!paymentType) {
      return response.status(404).json({ message: 'Payment type not found' })
    }
    return response.status(200).json({
      message: 'Payment type retrieved successfully',
      data: paymentType,
    })
  }

  // Update a payment type
  async update({ params, request, response }) {
    const paymentType = await PaymentType.find(params.id)
    if (!paymentType) {
      return response.status(404).json({ message: 'Payment type not found' })
    }

    const { name } = request.only(['name'])
    paymentType.name = name
    await paymentType.save()

    return response.status(200).json({
      message: 'Payment type updated successfully',
      data: paymentType,
    })
  }

  // Delete a payment type
  async destroy({ params, response }) {
    const paymentType = await PaymentType.find(params.id)
    if (!paymentType) {
      return response.status(404).json({ message: 'Payment type not found' })
    }
    await paymentType.delete()

    return response.status(200).json({
      message: 'Payment type deleted successfully',
    })
  }
}

module.exports = PaymentTypeController
