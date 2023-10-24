const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public')); // เปิดการใช้งานไฟล์ส่วนหน้าในโฟลเดอร์ public

app.get('/', (req, res) => {
  res.sendFile(__dirname + 'public/index.html'); // ส่งไฟล์ HTML หลัก
});

app.listen(port, () => {
  console.log(`เซิร์ฟเวอร์กำลังทำงานที่ http://localhost:${port}`);
});
