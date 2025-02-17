"use strict";

const User = use("App/Models/User");
// const PasswordReset = use('App/Models/PasswordReset')
// const Mail = use('Mail')
// const crypto = require('crypto')

class AuthController {
  async register({ request, response }) {
    const { firstname, lastname, username, email, password, role } =
      request.only([
        "firstname",
        "lastname",
        "username",
        "email",
        "password",
        "role",
      ]);

    // ตรวจสอบว่า role มีค่าหรือไม่ ถ้าไม่มีให้กำหนดเป็น "customer"
    const userRole = role || "customer";

    // สร้าง user พร้อม role
    const user = await User.create({
      username,
      email,
      password,
      firstname,
      lastname,
      role: userRole,
    });

    return response.status(201).json({
      message: "User registered successfully",
      user,
    });
  }

  async login({ request, auth, response }) {
    const { identifier, password } = request.only(["identifier", "password"]);

    try {
      // ค้นหา user จาก email หรือ username
      const user = await User.query()
        .where("email", identifier)
        .orWhere("username", identifier)
        .first();

      // if (!user) {
      //   return response.status(400).json({ message: "Username or Email not found" });
      // }

      // ใช้ auth.attempt() เพื่อตรวจสอบรหัสผ่านและสร้าง token
      const token = await auth.attempt(user.email, password);

      return response.json({ token: token.token });
    } catch (error) {
      return response.status(400).json({ message: "Invalid credentials" });
    }
  }

  async logout({ auth, response }) {
    try {
      // ลบ token โดยใช้วิธีการ logout ของ AdonisJS
      await auth.logout();

      return response.json({ message: "Logged out successfully" });
    } catch (error) {
      return response.status(500).json({ message: "Error logging out" });
    }
  }

  async profile({ auth, response }) {
    try {
      const user = await auth.getUser();
      return response.json({
        id: user.id,
        username: user.username,
        role: user.role, // ส่ง role ไปพร้อมข้อมูลผู้ใช้
      });
    } catch (error) {
      console.log("Error in authentication:", error);
      return response.status(401).json({ message: "Unauthenticated" }); // ถ้าไม่มี token หรือ token ไม่ถูกต้อง
    }
  }

  async updateRole({ params, request, response, auth }) {
    const user = await User.find(params.id);
    if (!user) {
      return response.status(404).json({ message: "User not found" });
    }

    // ดึง role ใหม่จาก request
    const { role } = request.only(["role"]);

    // ตรวจสอบว่า role มีค่าที่ถูกต้อง (admin, customer)
    const allowedRoles = ["admin", "customer"];
    if (!allowedRoles.includes(role)) {
      return response.status(400).json({ message: "Invalid role" });
    }

    // ตรวจสอบว่าเป็น admin ก่อนเปลี่ยน role
    if (auth.user.role !== "admin") {
      return response.status(403).json({ message: "Unauthorized" });
    }

    // อัปเดต role
    user.role = role;
    await user.save();

    return response.json({
      message: "User role updated successfully",
      user,
    });
  }

  async changePassword({ request, response, auth }) {
    const user = await auth.getUser(); // ดึงข้อมูลผู้ใช้ที่ล็อกอินอยู่

    const { oldPassword, newPassword } = request.only([
      "oldPassword",
      "newPassword",
    ]);

    try {
      // ตรวจสอบรหัสผ่านเก่าด้วย auth.attempt
      await auth.attempt(user.username, oldPassword); // ลองใช้ username และ oldPassword เพื่อยืนยันตัวตน

      // ตรวจสอบความยาวของรหัสผ่านใหม่ (ในที่นี้ตัวอย่างเป็นการตั้งข้อกำหนดว่าต้องมีอย่างน้อย 6 ตัวอักษร)
      const rules = {
        newPassword: "min:6",
      };

      const validation = await validate({ newPassword }, rules);
      if (validation.fails()) {
        return response
          .status(400)
          .json({
            message: "New password must be at least 6 characters long.",
          });
      }

      // อัปเดตข้อมูลรหัสผ่านใหม่ในฐานข้อมูล
      user.password = await Hash.make(newPassword); // สร้าง hash สำหรับรหัสผ่านใหม่
      await user.save();

      return response
        .status(200)
        .json({ message: "Password updated successfully." });
    } catch (error) {
      return response
        .status(400)
        .json({ message: "Old password is incorrect." }); // ถ้า auth.attempt ล้มเหลว
    }
  }
}

module.exports = AuthController;

// async forgotPassword({ request, response }) {
//   const { email } = request.only(['email'])

//   // ค้นหาผู้ใช้
//   const user = await User.findBy('email', email)
//   if (!user) {
//     return response.status(404).json({ message: 'Email not found' })
//   }

//   // สร้าง token
//   const token = crypto.randomBytes(32).toString('hex')

//   // บันทึก token ลงฐานข้อมูล
//   await PasswordReset.create({ email, token })

//   // ส่งอีเมลรีเซ็ตรหัสผ่าน
//   await Mail.send('emails.reset_password', { token }, (message) => {
//     message
//       .to(email)
//       .from('noreply@yourapp.com')
//       .subject('Reset Your Password')
//   })

//   return response.json({ message: 'Reset link sent to your email' })
// }

// async resetPassword({ request, response }) {
//   const { token, password } = request.only(['token', 'password'])

//   // ตรวจสอบ token
//   const resetRecord = await PasswordReset.findBy('token', token)
//   if (!resetRecord) {
//     return response.status(400).json({ message: 'Invalid token' })
//   }

//   // อัปเดตรหัสผ่านใหม่
//   const user = await User.findBy('email', resetRecord.email)
//   user.password = password
//   await user.save()

//   // ลบ token หลังจากใช้แล้ว
//   await resetRecord.delete()

//   return response.json({ message: 'Password reset successfully' })
// }
