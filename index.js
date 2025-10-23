const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

// Mock data (thông tin sinh viên)
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

// Hàm tiện ích lấy thông tin mẫu
function getTodaySchedule(studentId) {
  const today = "Thứ 2"; 
  const info = studentData[studentId]?.lichhoc.find(l => l.ngay === today);
  if (!info) return "Hôm nay bạn không có tiết học nào.";
  return `Hôm nay bạn học môn ${info.mon} lúc ${info.gio} tại phòng ${info.phong}.`;
}

// ==============================
// Xử lý request từ Dialogflow
// ==============================
app.post('/webhook', (req, res) => {
  const intent = req.body.queryResult.intent.displayName;
  const studentId = "23133999"; 
  const student = studentData[studentId];

  let responseText = "";

  switch (intent) {
    case "view_profile":
      responseText = `Bạn tên là ${student.ten}, mã sinh viên ${studentId}, thuộc khoa ${student.khoa}.`;
      break;

    case "update_profile":
      responseText = "Bạn muốn cập nhật thông tin nào? (số điện thoại, email, địa chỉ,...)";
      break;

    case "view_schedule_today":
      responseText = getTodaySchedule(studentId);
      break;

    case "view_schedule_week":
      responseText = "Tuần này bạn có 3 môn: Cấu trúc dữ liệu, Mạng máy tính, Cơ sở dữ liệu.";
      break;

    case "view_exam_schedule":
      responseText = "Bạn có lịch thi môn Cấu trúc dữ liệu vào 10/12/2025 tại phòng D201.";
      break;

    case "view_tuition_balance":
      responseText = `Học phí học kỳ này của bạn là ${student.hocphi}.`;
      break;

    case "view_tuition_deadline":
      responseText = `Hạn nộp học phí học kỳ này là ${student.han_dong}.`;
      break;

    case "view_payment_methods":
      responseText = "Bạn có thể thanh toán qua ngân hàng ACB hoặc Vietcombank bằng mã sinh viên của bạn.";
      break;

    case "Default Welcome Intent":
      responseText = "Xin chào! Tôi là trợ lý sinh viên. Bạn muốn xem lịch học, học phí hay thông tin cá nhân?";
      break;

    case "Default Fallback Intent":
      responseText = "Xin lỗi, tôi chưa hiểu ý bạn. Bạn có thể nói rõ hơn không?";
      break;

    default:
      responseText = "Tôi chưa được lập trình để xử lý yêu cầu này.";
  }

  res.json({
    fulfillmentMessages: [
      { text: { text: [responseText] } }
    ]
  });
});

app.get('/', (req, res) => res.send('Webhook sinh viên đang hoạt động'));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Webhook đang chạy trên cổng ${PORT}`));