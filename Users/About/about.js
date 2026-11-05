// <!-- Script kiểm tra trạng thái đăng nhập của người dùng -->
    
        // 1. Lấy thông tin tài khoản đang đăng nhập từ localStorage
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        // 2. Lấy thẻ li chứa nút đăng nhập/đăng ký dựa vào id "authMenu"
        const authMenu = document.getElementById("authMenu");

        // 3. Nếu tìm thấy tài khoản đang đăng nhập và có khung authMenu
        if (currentUser && authMenu) {
            // Thay thế giao diện nút Đăng nhập/Đăng ký thành Lời chào và nút Đăng xuất
            authMenu.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-weight: bold; color: #0D9295; display: flex; align-items: center; gap: 6px;">
                        <i class="fa-solid fa-user"></i> Chào, ${currentUser.hoTen || currentUser.tenDangNhap}
                    </span>
                    <button id="btnDangXuat" style="background-color: #e74c3c; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-weight: bold;">
                        Đăng xuất
                    </button>
                </div>
            `;

            // 4. Bắt sự kiện khi người dùng bấm vào nút Đăng xuất
            document.getElementById("btnDangXuat").addEventListener("click", function() {
                localStorage.removeItem("currentUser"); // Xóa dữ liệu đăng nhập khỏi localStorage
                alert("Đã đăng xuất thành công!"); // Hiển thị thông báo
                window.location.reload(); // Tải lại trang để cập nhật giao diện
            });
        }



 

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


    