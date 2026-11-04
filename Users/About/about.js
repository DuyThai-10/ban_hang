//* === === === === === === === === === === === === === === === === === === === === === === === === ==
// 1. KIỂM TRA TRẠNG THÁI ĐĂNG NHẬP
// Lấy thông tin tài khoản đang đăng nhập từ localStorage
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
// Lấy khung tài khoản trên thanh menu
const authMenu = document.getElementById("authMenu");

// Kiểm tra nếu người dùng đã đăng nhập
if (currentUser && authMenu) {

    // Hiển thị tên người dùng và nút đăng xuất
    authMenu.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-weight: bold; color: #0D9295; display: flex; align-items: center; gap: 6px;">
                <i class="fa-solid fa-user"></i>
                Chào, ${currentUser.hoTen || currentUser.tenDangNhap}
            </span>

            <button id="btnDangXuat"
                style="background-color: #e74c3c; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-weight: bold;">
                Đăng xuất
            </button>

        </div>
    `;

    // Xử lý khi người dùng bấm đăng xuất
    document.getElementById("btnDangXuat").addEventListener("click", function() {

        localStorage.removeItem("currentUser");

        alert("Đã đăng xuất thành công!");

        window.location.reload();
    });
}


/* ==========================================================================
   2. THỐNG KÊ SỐ LIỆU WEBSITE
   ========================================================================== */

// Lấy danh sách đơn hàng đã lưu
const danhSachDonHang = JSON.parse(
    localStorage.getItem("danhSachDonHang")
) || [];


// Đếm tổng số đơn hàng
const tongDonHang = danhSachDonHang.length;


// Tạo danh sách đếm số đơn hàng của từng khách hàng
const demKhachHang = {};

danhSachDonHang.forEach(function(donHang) {

    // Lấy tên đăng nhập của khách hàng
    const tenDangNhap = donHang.username;

    // Kiểm tra khách hàng có thông tin hay không
    if (tenDangNhap) {

        // Đếm số đơn hàng của khách hàng
        demKhachHang[tenDangNhap] =
            (demKhachHang[tenDangNhap] || 0) + 1;
    }
});


// Đếm khách hàng có từ 2 đơn hàng trở lên
let tongKhachHangThanThiet = 0;

for (let tenDangNhap in demKhachHang) {

    if (demKhachHang[tenDangNhap] >= 2) {

        tongKhachHangThanThiet++;
    }
}


// Hiển thị tổng số đơn hàng
document.getElementById("totalOrders").innerText =
    tongDonHang.toLocaleString("vi-VN");


// Hiển thị tổng số khách hàng thân thiết
document.getElementById("loyalCustomers").innerText =
    tongKhachHangThanThiet.toLocaleString("vi-VN");