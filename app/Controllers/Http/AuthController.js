"use strict";

const User = use("App/Models/User");
// const { validateAll } = use('Validator');
// const Mail = use('Mail');
// const Token = use('App/Models/Token');

class AuthController {
  async index({ response }) {
    try {
      const users = await User.all();
      return response.json(users);
    } catch (error) {
      return response.status(500).json({ message: "Error fetching users" });
    }
  }

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

  async destroy({ params, response, auth }) {
    try {
      // ค้นหาผู้ใช้จาก ID
      const user = await User.find(params.id);
      if (!user) {
        return response.status(404).json({ message: "User not found" });
      }

      // ตรวจสอบว่าเป็น admin เท่านั้นที่สามารถลบ user ได้
      if (auth.user.role !== "admin") {
        return response.status(403).json({ message: "Unauthorized" });
      }

      await user.delete();
      return response.json({ message: "User deleted successfully" });
    } catch (error) {
      return response.status(500).json({ message: "Error deleting user" });
    }
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
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
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

  // async forgotPassword({ request, response }) {
  //   const { email } = request.only(['email']);
  
  //   // ตรวจสอบว่าอีเมลที่กรอกมีอยู่ในฐานข้อมูลหรือไม่
  //   const user = await User.findBy('email', email);
  
  //   if (!user) {
  //     return response.status(404).json({ message: 'User with this email does not exist' });
  //   }
  
  //   // สร้าง Token สำหรับการรีเซ็ตรหัสผ่าน
  //   const token = await Token.create({
  //     user_id: user.id,
  //     type: 'reset_password',  // ใช้เพื่อแยกประเภทของ token
  //     token: Math.random().toString(36).substring(7),  // สร้าง token แบบสุ่ม
  //   });
  
  //   // ส่งอีเมลให้ผู้ใช้ด้วยลิงก์การรีเซ็ตรหัสผ่าน
  //   await Mail.send('emails.reset_password', { token: token.token }, (message) => {
  //     message.to(user.email)
  //       .from('chantigo.chanachai@gmail.com')
  //       .subject('Password Reset Request');
  //   });
  
  //   return response.json({ message: 'Password reset link has been sent to your email.' });
  // }

  // async resetPassword({ request, response }) {
  //   const { token, password } = request.only(['token', 'password']);
  
  //   // ค้นหาข้อมูล token จากฐานข้อมูล
  //   const resetToken = await Token.findBy('token', token);
  
  //   if (!resetToken || resetToken.type !== 'reset_password') {
  //     return response.status(400).json({ message: 'Invalid or expired token' });
  //   }
  
  //   // ค้นหาผู้ใช้ที่เกี่ยวข้องกับ token
  //   const user = await User.find(resetToken.user_id);
  
  //   if (!user) {
  //     return response.status(404).json({ message: 'User not found' });
  //   }
  
  //   // รีเซ็ตรหัสผ่านของผู้ใช้
  //   user.password = password;
  //   await user.save();
  
  //   // ลบ token หลังจากใช้งานแล้ว
  //   await resetToken.delete();
  
  //   return response.json({ message: 'Password has been reset successfully' });
  // }
  
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
