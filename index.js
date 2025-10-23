const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// data
const students = {
  "20230001": {
    name: "Huỳnh Bảo Minh",
    birth: "2005-30-02",
    faculty: "Kỹ thuật dữ liệu",
    class: "23133A",
    schedule: [
      { day: "Thứ 2", subject: "Cấu trúc dữ liệu", room: "A101", time: "07:30 - 09:30" },
      { day: "Thứ 3", subject: "Cơ sở dữ liệu", room: "B201", time: "09:40 - 11:40" }
    ],
    tuition: {
      total: 8500000,
      paid: 5000000,
      deadline: "2025-11-15",
      payment_methods: [
        "Chuyển khoản ngân hàng",
        "Thanh toán qua ví Momo",
        "Đóng trực tiếp tại phòng tài vụ"
      ]
    },
    exams: [
      { subject: "Cấu trúc dữ liệu", date: "2025-12-10", time: "08:00 - 10:00", room: "P201" },
      { subject: "Cơ sở dữ liệu", date: "2025-12-15", time: "13:00 - 15:00", room: "P203" }
    ]
  },
  "20230002": {
    name: "Võ Lê Minh Chiến",
    birth: "2005-31-02",
    faculty: "Kỹ thuật dữ liệu",
    class: "23133C",
    schedule: [
      { day: "Thứ 4", subject: "Điện toán đám mây", room: "C102", time: "08:00 - 10:00" },
      { day: "Thứ 5", subject: "BigData", room: "C105", time: "10:15 - 12:15" }
    ],
    tuition: {
      total: 7800000,
      paid: 7800000,
      deadline: "2025-11-10",
      payment_methods: ["Chuyển khoản ngân hàng"]
    },
    exams: [
      { subject: "Điện toán đám mây", date: "2025-12-18", time: "08:00 - 10:00", room: "P205" },
      { subject: "BigData", date: "2025-12-22", time: "13:00 - 15:00", room: "P208" }
    ]
  }
};


// -------------------------
// Hàm xử lý intent
// -------------------------
app.post("/webhook", (req, res) => {
  const intent = req.body.queryResult.intent.displayName;
  const studentId = req.body.queryResult.parameters.student_id;

  console.log("Nhận yêu cầu từ intent:", intent, "student_id:", studentId);

  const student = students[studentId];
  if (!student) {
    return res.json({
      fulfillmentText: `Không tìm thấy thông tin cho mã sinh viên ${studentId}. Vui lòng kiểm tra lại.`
    });
  }

  let responseText = "";

  switch (intent) {
    case "student_profile":
      responseText = `Lý lịch sinh viên:
- Họ tên: ${student.name}
- Ngày sinh: ${student.birth}
- Khoa: ${student.faculty}
- Lớp: ${student.class}`;
      break;

    case "student_schedule":
      responseText = ` Lịch học của ${student.name}:\n` +
        student.schedule.map(
          (s) => `${s.day}: ${s.subject} (${s.room}, ${s.time})`
        ).join("\n");
      break;

    case "student_tuition":
      const { total, paid, deadline, payment_methods } = student.tuition;
      const remaining = total - paid;
      responseText = `Thông tin học phí của ${student.name}:
- Tổng học phí: ${total.toLocaleString()} VNĐ
- Đã đóng: ${paid.toLocaleString()} VNĐ
- Còn nợ: ${remaining.toLocaleString()} VNĐ
- Hạn đóng: ${deadline}
- Hình thức thanh toán: ${payment_methods.join(", ")}`;
      break;
      
    case "student_exam_schedule":
      responseText = `🧾 Lịch thi của ${student.name}:\n` +
        student.exams.map(
          (e) => `${e.subject}: ${e.date} (${e.time}) - Phòng ${e.room}`
        ).join("\n");
      break;
      
    default:
      responseText = "Xin lỗi, tôi chưa được lập trình cho yêu cầu này.";
  }

  return res.json({
    fulfillmentText: responseText
  });
});

// -------------------------
//  Khởi động server
// -------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Webhook đang chạy trên cổng ${PORT}`);
});


