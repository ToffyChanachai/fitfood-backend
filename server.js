const http = require('http')
const { Ignitor } = require('@adonisjs/ignitor')

const port = process.env.PORT || 3333; // ใช้ PORT จาก environment variable หรือใช้พอร์ต 3333 เป็นค่าเริ่มต้น

// เริ่มต้นแอป
new Ignitor(require('@adonisjs/fold'))
  .appRoot(__dirname)
  .fireHttpServer()
  .catch(console.error)
  .then(() => {
    // เริ่มต้นเซิร์ฟเวอร์
    http.createServer((req, res) => {
      req.app.handle(req, res);  // ให้ AdonisJS จัดการคำขอ
    }).listen(port, '0.0.0.0', () => {
      console.log(`Server started on port ${port}`);
    });
  });
