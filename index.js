const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

// =========================
// Mock data sinh viên mẫu
// =========================
const studentData = {
  SV001: {
    ten: "Huỳnh Bảo Minh",
    khoa: "Kỹ thuật dữ liệu",
    hocphi: "18.000.000 VNĐ",
    han_dong: "30/10/2025",
    lichhoc: [
      { ngay: "Thứ 2", mon: "Cấu trúc dữ liệu", gio: "7h30", phong: "A101" },
      { ngay: "Thứ 3", mon: "Mạng máy tính", gio: "9h30", phong: "B202" },
      { ngay: "Thứ 5", mon: "Cơ sở dữ liệu", gio: "13h00", phong: "C303" },
    ],
  },
};

// Hàm tiện ích: lấy lịch học hôm nay
function getTodaySchedule(studentId) {
  const today = "Thứ 2"; 
  const info = studentData[studentId]?.lichhoc.find(l => l.ngay === today);
  if (!info) return "Hôm nay bạn không có tiết học nào.";
  return `Hôm nay bạn học môn ${info.mon} lúc ${info.gio} tại phòng ${info.phong}.`;
}

// =========================
// Endpoint 1: /profile
// =========================
app.post('/profile', (req, res) => {
  const studentId = req.body.queryResult.parameters.student_id;
  const student = studentData[studentId];

  let responseText;
  if (student) {
    responseText = `Bạn tên là ${student.ten}, mã sinh viên ${studentId}, thuộc khoa ${student.khoa}.`;
  } else {
    responseText = `Không tìm thấy thông tin cho mã sinh viên ${studentId}.`;
  }

  res.json({
    fulfillmentMessages: [{ text: { text: [responseText] } }]
  });
});

// =========================
// Endpoint 2: /schedule
// =========================
app.post('/schedule', (req, res) => {
  const studentId = req.body.queryResult.parameters.student_id;
  const student = studentData[studentId];

  let responseText;
  if (student) {
    responseText = getTodaySchedule(studentId);
  } else {
    responseText = `Không tìm thấy thời khóa biểu cho mã sinh viên ${studentId}.`;
  }

  res.json({
    fulfillmentMessages: [{ text: { text: [responseText] } }]
  });
});

// =========================
// Endpoint 3: /tuition
// =========================
app.post('/tuition', (req, res) => {
  const studentId = req.body.queryResult.parameters.student_id;
  const student = studentData[studentId];

  let responseText;
  if (student) {
    responseText = `Học phí học kỳ này của bạn là ${student.hocphi}. Hạn nộp: ${student.han_dong}.`;
  } else {
    responseText = `Không tìm thấy học phí cho mã sinh viên ${studentId}.`;
  }

  res.json({
    fulfillmentMessages: [{ text: { text: [responseText] } }]
  });
});

// =========================
// Test route
// =========================
app.get('/', (req, res) => res.send('Webhook sinh viên đang hoạt động'));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Webhook đang chạy trên cổng ${PORT}`));
