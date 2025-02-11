'use strict'

const DeliveryRound = use('App/Models/DeliveryRound')

class DeliveryRoundController {
  // อ่านข้อมูลทั้งหมด
  async index ({ response }) {
    const deliveryRounds = await DeliveryRound.all()
    return response.json(deliveryRounds)
  }

  // อ่านข้อมูลที่มี id เฉพาะ
  async show ({ params, response }) {
    const deliveryRound = await DeliveryRound.find(params.id)
    if (!deliveryRound) {
      return response.status(404).json({ message: 'Not Found' })
    }
    return response.json(deliveryRound)
  }

  // สร้างข้อมูลใหม่
  async store ({ request, response }) {
    const data = request.only(['name'])
    const deliveryRound = await DeliveryRound.create(data)
    return response.status(201).json(deliveryRound)
  }

  // อัพเดตข้อมูลที่มี id
  async update ({ params, request, response }) {
    const deliveryRound = await DeliveryRound.find(params.id)
    if (!deliveryRound) {
      return response.status(404).json({ message: 'Not Found' })
    }

    const data = request.only(['name'])
    deliveryRound.merge(data)
    await deliveryRound.save()

    return response.json(deliveryRound)
  }

  // ลบข้อมูลที่มี id
  async destroy ({ params, response }) {
    const deliveryRound = await DeliveryRound.find(params.id)
    if (!deliveryRound) {
      return response.status(404).json({ message: 'Not Found' })
    }

    await deliveryRound.delete()
    return response.status(200).json({ message: 'Deleted Successfully' })
  }
}

module.exports = DeliveryRoundController
