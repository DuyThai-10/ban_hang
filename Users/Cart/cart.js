// ==========================================
// 1. KIỂM TRA TRẠNG THÁI ĐĂNG NHẬP
// ==========================================
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
const authMenu = document.getElementById("authMenu");

if (currentUser && authMenu) {
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

    document.getElementById("btnDangXuat").addEventListener("click", function () {
        localStorage.removeItem("currentUser");
        alert("Đã đăng xuất thành công!");
        window.location.reload();
    });
}

// ==========================================
// 2. GIỎ HÀNG
// ==========================================
document.addEventListener("DOMContentLoaded", function () {
    renderCart();
});

function layGioHang() {
    try {
        const cart = JSON.parse(localStorage.getItem("cart"));
        return Array.isArray(cart) ? cart : [];
    } catch (e) {
        return [];
    }
}

function renderCart() {
    const cart = layGioHang();

    const cartItemsContainer = document.getElementById("cart-items");
    const cartSubtotal = document.getElementById("cartSubtotal");
    const cartTotal = document.getElementById("cartTotal");

    if (!cartItemsContainer) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <tr>
                <td colspan="6" style="padding: 40px; text-align: center; color: #777; font-size: 15px;">
                    Giỏ hàng của bạn đang trống! <a href="../Products/products.html" style="color: #0D9295; font-weight: bold; text-decoration: underline;">Đi mua sắm ngay</a>
                </td>
            </tr>
        `;
        if (cartSubtotal) cartSubtotal.innerText = "0đ";
        if (cartTotal) cartTotal.innerText = "0đ";
        return;
    }

    let htmlContent = "";
    let tongTienHang = 0;

    cart.forEach((item, index) => {
        const gia = Number(item.price);
        const thanhTien = gia * item.soLuong;
        tongTienHang += thanhTien;

        htmlContent += `
            <tr>
                <td><button onclick="xoaSanPham(${index})" style="background: none; border: none; color: red; cursor: pointer; font-size: 16px;"><i class="fa-solid fa-xmark"></i></button></td>
                <td><img src="${item.image}" width="60" style="border-radius: 6px;"></td>
                <td>${item.name}</td>
                <td>${gia.toLocaleString('vi-VN')}đ</td>
                <td>
                    <input type="number" min="1" value="${item.soLuong}"
                        onchange="doiSoLuong(${index}, this.value)"
                        style="width: 50px; text-align: center; padding: 4px; border: 1px solid #ddd; border-radius: 4px;">
                </td>
                <td>${thanhTien.toLocaleString('vi-VN')}đ</td>
            </tr>
        `;
    });

    cartItemsContainer.innerHTML = htmlContent;

    const tienFormatted = tongTienHang.toLocaleString('vi-VN') + "đ";
    if (cartSubtotal) cartSubtotal.innerText = tienFormatted;
    if (cartTotal) cartTotal.innerText = tienFormatted;
}

function doiSoLuong(index, soLuongMoi) {
    const cart = layGioHang();
    const soLuongMoiInt = parseInt(soLuongMoi);

    if (isNaN(soLuongMoiInt) || soLuongMoiInt <= 0) {
        if (confirm("Bạn có muốn xóa sản phẩm này khỏi giỏ hàng không?")) {
            cart.splice(index, 1);
        } else {
            cart[index].soLuong = 1;
        }
    } else {
        cart[index].soLuong = soLuongMoiInt;
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}

function xoaSanPham(index) {
    const cart = layGioHang();
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}

// ==========================================
// 3. ĐẶT HÀNG + GỬI EMAIL XÁC NHẬN QUA EMAILJS
// ==========================================
const EMAILJS_SERVICE_ID = "service_0al4ayx";
const EMAILJS_TEMPLATE_ID = "template_yinrr0a";

let dangDatHang = false; // chặn bấm nút nhiều lần

function datHang() {
    if (dangDatHang) return;

    // 1. Kiểm tra đăng nhập
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) {
        alert("Vui lòng đăng nhập trước khi tiến hành thanh toán!");
        window.location.href = "../LogIn/login.html";
        return;
    }

    // 2. Kiểm tra giỏ hàng
    const cart = layGioHang();
    if (cart.length === 0) {
        alert("Giỏ hàng của bạn đang trống, không thể đặt hàng!");
        return;
    }

    // 3. Tính tổng tiền
    const tongTienHang = cart.reduce((tong, sp) => tong + Number(sp.price) * sp.soLuong, 0);

    // 4. Tạo và lưu đơn hàng
    const donHangMoi = {
        maDonHang: "DH" + Math.floor(100000 + Math.random() * 900000),
        username: user.username || user.tenDangNhap,
        ngayDat: new Date().toLocaleString('vi-VN'),
        danhSachSanPham: cart,
        tongTien: tongTienHang,
        trangThai: "Đang chuẩn bị hàng"
    };

    const danhSachDonHang = JSON.parse(localStorage.getItem("danhSachDonHang")) || [];
    danhSachDonHang.push(donHangMoi);
    localStorage.setItem("danhSachDonHang", JSON.stringify(danhSachDonHang));

    // 5. Hàm hoàn tất: chỉ chạy SAU khi gửi email xong (tránh reload làm hủy request)
    const hoanTat = function () {
        localStorage.removeItem("cart");
        alert(`Đặt hàng thành công! Mã đơn hàng của bạn là: ${donHangMoi.maDonHang}`);
        window.location.reload();
    };

    // 6. Soạn nội dung email
    let chiTietSanPhamText = "";
    cart.forEach((item, index) => {
        chiTietSanPhamText += `${index + 1}. ${item.name} - Số lượng: ${item.soLuong} - Giá: ${Number(item.price).toLocaleString('vi-VN')}đ\n`;
    });
    chiTietSanPhamText += `\nTỔNG TIỀN THANH TOÁN: ${tongTienHang.toLocaleString('vi-VN')}đ`;
    chiTietSanPhamText += `\nMã đơn hàng của bạn là: ${donHangMoi.maDonHang}`;

    const templateParams = {
        to_name: user.hoTen || user.tenDangNhap,
        email: user.email,
        message: chiTietSanPhamText
    };

    // 7. Kiểm tra điều kiện trước khi gửi
    if (typeof emailjs === 'undefined') {
        console.error("Chưa tải được thư viện EmailJS! Kiểm tra lại thẻ <script> trong cart.html (phải là email.min.js).");
        hoanTat();
        return;
    }

    if (!user.email) {
        console.error("Tài khoản không có trường 'email' trong localStorage nên không gửi được mail.");
        hoanTat();
        return;
    }

    // 8. Gửi email
    dangDatHang = true;
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
        .then(function (response) {
            console.log("Gửi email xác nhận thành công!", response.status, response.text);
        })
        .catch(function (error) {
            console.error("Gửi email thất bại:", error);
        })
        .finally(function () {
            dangDatHang = false;
            hoanTat();
        });
}