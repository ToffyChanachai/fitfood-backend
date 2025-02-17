'use strict'

class IsAdmin {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {Function} next
   */
  async handle ({ auth, response }, next) {
    try {
      // ดึง user ที่เข้าสู่ระบบจาก auth
      const user = await auth.getUser()

      // ตรวจสอบว่า role ของ user เป็น 'admin' หรือไม่
      if (user.role !== 'admin') {
        return response.status(403).json({
          message: 'You do not have permission to access this resource'
        })
      }
      await next()
    } catch (error) {
      // ถ้า user ไม่ได้ล็อกอินหรือ token ไม่ถูกต้อง ให้ตอบกลับ 401
      return response.status(401).json({
        message: 'Unauthenticated'
      })
    }
  }
}

module.exports = IsAdmin
