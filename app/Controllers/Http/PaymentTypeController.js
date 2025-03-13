'use strict'

const PaymentType = use('App/Models/PaymentType')

class PaymentTypeController {
  // อ่านข้อมูลทั้งหมด
  async index ({ response }) {
    const payment_types = await PaymentType.all()
    return response.json(payment_types)
  }

  // อ่านข้อมูลที่มี id เฉพาะ
  async show ({ params, response }) {
    const paymentType = await PaymentType.find(params.id)
    if (!paymentType) {
      return response.status(404).json({ message: 'Not Found' })
    }
    return response.json(paymentType)
  }

  // สร้างข้อมูลใหม่
  async store ({ request, response }) {
    const data = request.only(['name'])
    const paymentType = await PaymentType.create(data)
    return response.status(201).json(paymentType)
  }

  // อัพเดตข้อมูลที่มี id
  async update ({ params, request, response }) {
    const paymentType = await PaymentType.find(params.id)
    if (!paymentType) {
      return response.status(404).json({ message: 'Not Found' })
    }

    const data = request.only(['name'])
    paymentType.merge(data)
    await paymentType.save()

    return response.json(paymentType)
  }

  // ลบข้อมูลที่มี id
  async destroy ({ params, response }) {
    const paymentType = await PaymentType.find(params.id)
    if (!paymentType) {
      return response.status(404).json({ message: 'Not Found' })
    }

    await paymentType.delete()
    return response.status(200).json({ message: 'Deleted Successfully' })
  }
}

module.exports = PaymentTypeController
