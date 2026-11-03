document.addEventListener("DOMContentLoaded", function() {
    hienThiLichSuDonHang();
});

function hienThiLichSuDonHang() {
    // 1. Lấy thông tin tài khoản đang đăng nhập từ localStorage
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    // Nếu chưa đăng nhập thì đẩy về trang đăng nhập
    if (!currentUser) {
        alert("Vui lòng đăng nhập để xem lịch sử đơn hàng!");
        window.location.href = "../LogIn/login.html";
        return;
    }

    const container = document.getElementById("lich-su-container");
    if (!container) return;

    // 2. Lấy toàn bộ mảng tổng danhSachDonHang từ localStorage
    let danhSachDonHang = JSON.parse(localStorage.getItem("danhSachDonHang")) || [];

    // 3. Lọc các đơn hàng thuộc về đúng người dùng đang đăng nhập
    let tenDangNhapHienTai = currentUser.username || currentUser.tenDangNhap;
    let donHangCuaToi = danhSachDonHang.filter(don => don.username === tenDangNhapHienTai);

    // 4. Nếu khách chưa đặt đơn nào
    if (donHangCuaToi.length === 0) {
        container.innerHTML = `
            <div class="empty-orders">
                <i class="fa-solid fa-box-open" style="font-size: 48px; margin-bottom: 10px; color: #cbd5e1;"></i>
                <p>Bạn chưa có lịch sử đơn hàng nào.</p>
                <a href="../Products/products.html" style="color: #0D9295; font-weight: bold; text-decoration: underline;">Đi mua sắm ngay</a>
            </div>
        `;
        return;
    }

    // 5. Thêm nút "Xóa tất cả lịch sử" ở trên cùng, sau đó duyệt qua từng đơn hàng
    let htmlContent = `
        <div style="text-align: right; margin-bottom: 15px;">
            <button onclick="xoaTatCaDonHangCuaToi()" style="background-color: #ef4444; color: white; border: none; padding: 8px 14px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: bold;">
                <i class="fa-solid fa-trash"></i> Xóa tất cả lịch sử đơn
            </button>
        </div>
    `;

    donHangCuaToi.forEach(don => {
        let danhSachSanPhamHTML = "";

        // Duyệt qua mảng danhSachSanPham trong từng đơn hàng (Đã fix chuẩn cú pháp nhân giá tiền)
        don.danhSachSanPham.forEach(sp => {
            let thanhTienSP = sp.price * sp.soLuong;
            danhSachSanPhamHTML += `
                <li>${sp.name} - Số lượng: <strong>${sp.soLuong}</strong> - Giá: ${thanhTienSP.toLocaleString('vi-VN')}đ</li>
            `;
        });

        htmlContent += `
            <div class="order-card">
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px; margin-bottom: 15px;">
                    <h3 style="margin: 0; border: none; padding: 0;"><i class="fa-solid fa-receipt"></i> Mã đơn hàng: ${don.maDonHang}</h3>
                    
                    <!-- NÚT XÓA TỪNG ĐƠN HÀNG -->
                    <button onclick="xoaDonHang('${don.maDonHang}')" style="background: none; border: 1px solid #ef4444; color: #ef4444; padding: 4px 10px; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: bold;">
                        <i class="fa-solid fa-xmark"></i> Hủy / Xóa đơn
                    </button>
                </div>

                <p><strong>🕒 Ngày đặt:</strong> ${don.ngayDat}</p>
                <p><strong>📌 Trạng thái:</strong> <span class="order-status">${don.trangThai}</span></p>
                
                <div class="order-items-box">
                    <strong>🛍️ Sản phẩm đã mua:</strong>
                    <ul>${danhSachSanPhamHTML}</ul>
                </div>
                
                <div class="order-total">
                    <strong>Tổng thanh toán: <span style="color: #e74c3c; font-size: 18px;">${don.tongTien.toLocaleString('vi-VN')}đ</span></strong>
                </div>
            </div>
        `;
    });

    container.innerHTML = htmlContent;
}

// ==========================================
// HÀM XÓA MỘT ĐƠN HÀNG CỤ THỂ
// ==========================================
function xoaDonHang(maDonHang) {
    if (confirm(`Bạn có chắc chắn muốn hủy / xóa đơn hàng ${maDonHang} này không?`)) {
        let danhSachDonHang = JSON.parse(localStorage.getItem("danhSachDonHang")) || [];

        // Lọc bỏ đơn hàng có maDonHang trùng khớp
        danhSachDonHang = danhSachDonHang.filter(don => don.maDonHang !== maDonHang);

        // Cập nhật lại vào localStorage
        localStorage.setItem("danhSachDonHang", JSON.stringify(danhSachDonHang));

        alert("Đã xóa đơn hàng thành công!");
        hienThiLichSuDonHang();
    }
}

// ==========================================
// HÀM XÓA SẠCH TOÀN BỘ ĐƠN HÀNG CỦA TÀI KHOẢN HIỆN TẠI
// ==========================================
function xoaTatCaDonHangCuaToi() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) return;

    let tenDangNhapHienTai = currentUser.username || currentUser.tenDangNhap;

    if (confirm("Bạn có chắc chắn muốn XÓA SẠCH toàn bộ lịch sử đơn hàng của bạn không?")) {
        let danhSachDonHang = JSON.parse(localStorage.getItem("danhSachDonHang")) || [];

        // Chỉ giữ lại đơn hàng của người khác, xóa sạch đơn của tài khoản này
        danhSachDonHang = danhSachDonHang.filter(don => don.username !== tenDangNhapHienTai);

        localStorage.setItem("danhSachDonHang", JSON.stringify(danhSachDonHang));

        alert("Đã làm mới và xóa sạch lịch sử đơn hàng của bạn!");
        hienThiLichSuDonHang();
    }
}