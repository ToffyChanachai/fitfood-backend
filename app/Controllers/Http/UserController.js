"use strict";

const User = use("App/Models/User");
const Hash = use("Hash");

class UserController {
  async register({ request, response }) {
    const data = request.only(["username", "email", "password", "role"]);

    // ป้องกันไม่ให้ user ทั่วไปสมัครเป็น admin
    if (data.role && data.role !== "customer") {
      return response.unauthorized({ message: "You cannot assign this role" });
    }

    data.password = await Hash.make(data.password); // เข้ารหัสรหัสผ่าน
    const user = await User.create({ ...data, role: "customer" }); // ตั้งค่า default เป็น customer

    return response.created({ message: "User registered successfully", user });
  }

  async login({ request, auth, response }) {
    const { email, password } = request.only(["email", "password"]);
    const user = await User.findBy("email", email);
    if (!user) {
      console.log("User not found", email); // ตรวจสอบว่า user มีในฐานข้อมูลหรือไม่
      return response.unauthorized({ message: "Invalid credentials" });
    }

    //     const isPasswordValid = await Hash.verify(password, user.password);
    //     if (!isPasswordValid) {
    //       console.log("Invalid password", password, user.password);
    //       console.log('Email:', email);
    // console.log('Password:', password);
    // console.log('User found:', user);

    //       return response.unauthorized({ message: "Invalid credentials" });
    //     }
    const isPasswordValid = await Hash.verify(password, user.password);
    if (!isPasswordValid) {
      console.log("Invalid password"); // ตรวจสอบให้ชัดเจน
      return response.unauthorized({ message: "Invalid credentials" });
    }

    const token = await auth.generate(user)
    console.log('Generated Token:', token);

    return response.ok({ message: "Login successful", user, token });
  }

  async makeAdmin({ params, response }) {
    const user = await User.find(params.id);

    if (!user) {
      return response.notFound({ message: "User not found" });
    }

    user.role = "admin";
    await user.save();

    return response.ok({ message: `${user.username} is now an admin`, user });
  }
}

module.exports = UserController;
