"use strict";
const Program = use("App/Models/Program");

class ProgramController {
  async index({ request, response }) {
    try {
      const programId = request.input("program_id");
      if (programId) {
        const programs = await Program.query()
          .where("id", programId) 
          .with("promotionType") 
          .fetch();

        return response.status(200).json(programs);
      }
      const programs = await Program.query().with("promotionType").fetch();
      return response.status(200).json(programs);
    } catch (error) {
      return response
        .status(500)
        .json({ message: "Error fetching programs", error });
    }
  }

  async store({ request, response }) {
    const { name, promotion_type_id } = request.only([
      "name",
      "promotion_type_id",
    ]);

    if (!name || !promotion_type_id) {
      return response
        .status(400)
        .send({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
    }
    try {
      const program = await Program.create({
        name,
        promotion_type_id,
      });

      return response.status(201).send(program);
    } catch (error) {
      console.error("Error adding program:", error);
      return response
        .status(500)
        .send({ message: "เกิดข้อผิดพลาดในการเพิ่มข้อมูล" });
    }
  }
  async show({ params, response }) {
    try {
      const program = await Program.query()
        .where("id", params.id) // ค้นหา Program ตาม ID
        .with("packages") // ดึงข้อมูลที่สัมพันธ์ (associations)
        .first();

      if (!program) {
        return response.status(404).json({ message: "Program not found" });
      }

      return response.json(program);
    } catch (error) {
      console.error("Error fetching program:", error);
      return response
        .status(500)
        .json({ message: "Error fetching program", error });
    }
  }

  async update({ params, request, response }) {
    const program = await Program.find(params.id);
    try {
      if (!program) {
        return response.status(404).json({ message: "Program not found" });
      }

      const { name, promotion_type_id } = request.only([
        "name",
        "promotion_type_id",
      ]);

      program.name = name || program.name;
      program.promotion_type_id =
        promotion_type_id || program.promotion_type_id;
      await program.save();
      return response.status(200).json(program);
    } catch (error) {
      return response
        .status(500)
        .json({ message: "Error updating program", error });
    }
  }

  async destroy({ params, response }) {
    try {
      const program = await Program.find(params.id);
      if (!program) {
        return response.status(404).json({ message: "Program not found" });
      }
      await program.delete();
      return response
        .status(200)
        .json({ message: "Program deleted successfully" });
    } catch (error) {
      return response
        .status(500)
        .json({ message: "Error deleting program", error });
    }
  }
}

module.exports = ProgramController;
