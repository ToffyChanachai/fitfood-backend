'use strict'

const SelectFood = use('App/Models/SelectFood')

class SelectFoodController {
  // อ่านข้อมูลทั้งหมด
  async index ({ response }) {
    const selectFoods = await SelectFood.all()
    return response.json(selectFoods)
  }

  // อ่านข้อมูลที่มี id เฉพาะ
  async show ({ params, response }) {
    const selectFood = await SelectFood.find(params.id)
    if (!selectFood) {
      return response.status(404).json({ message: 'Not Found' })
    }
    return response.json(selectFood)
  }

  // สร้างข้อมูลใหม่
  async store ({ request, response }) {
    const data = request.only(['name'])
    const selectFood = await SelectFood.create(data)
    return response.status(201).json(selectFood)
  }

  // อัพเดตข้อมูลที่มี id
  async update ({ params, request, response }) {
    const selectFood = await SelectFood.find(params.id)
    if (!selectFood) {
      return response.status(404).json({ message: 'Not Found' })
    }

    const data = request.only(['name'])
    selectFood.merge(data)
    await selectFood.save()

    return response.json(selectFood)
  }

  // ลบข้อมูลที่มี id
  async destroy ({ params, response }) {
    const selectFood = await SelectFood.find(params.id)
    if (!selectFood) {
      return response.status(404).json({ message: 'Not Found' })
    }

    await selectFood.delete()
    return response.status(200).json({ message: 'Deleted Successfully' })
  }
}

module.exports = SelectFoodController
