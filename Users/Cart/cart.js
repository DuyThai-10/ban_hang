//  2. Script nội bộ kiểm tra trạng thái đăng nhập của người dùng 
    
        // Lấy thông tin tài khoản đang đăng nhập từ kho localStorage
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        // Lấy phần tử chứa menu tài khoản trên thanh điều hướng
        const authMenu = document.getElementById("authMenu");

        // Nếu phát hiện có người đang đăng nhập và khung menu tồn tại
        if (currentUser && authMenu) {
            // Thay đổi giao diện menu thành Tên người dùng và nút Đăng xuất
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

            // sự kiện khi người dùng bấm vào nút Đăng xuất
            document.getElementById("btnDangXuat").addEventListener("click", function() {
                localStorage.removeItem("currentUser"); // Xóa dữ liệu đăng nhập khỏi localStorage
                alert("Đã đăng xuất thành công!"); // Thông báo
                window.location.reload(); // Tải lại trang để cập nhật giao diện
            });
        }




    // GIỎ HÀNG



    // 1. Ngay khi trang giỏ hàng vừa tải xong, gọi hàm vẽ danh sách
    document.addEventListener("DOMContentLoaded", function () {
        renderCart();
    });

    // 2. Hàm chính để đọc giỏ hàng, vẽ bảng và tính tổng tiền
    function renderCart() {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        
        const cartItemsContainer = document.getElementById("cart-items");
        const cartSubtotal = document.getElementById("cartSubtotal");
        const cartTotal = document.getElementById("cartTotal");

        // Nếu giỏ hàng trống trơn
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
            let thanhTien = item.price * item.soLuong;
            tongTienHang += thanhTien;

            htmlContent += `
                <tr>
                    <!-- Nút xóa món hàng -->
                    <td><button onclick="xoaSanPham(${index})" style="background: none; border: none; color: red; cursor: pointer; font-size: 16px;"><i class="fa-solid fa-xmark"></i></button></td>
                    
                    <!-- Hình ảnh sản phẩm -->
                    <td><img src="${item.image}" width="60" style="border-radius: 6px;"></td>
                    
                    <!-- Tên sản phẩm -->
                    <td>${item.name}</td>
                    
                    <!-- Giá tiền -->
                    <td>${item.price.toLocaleString('vi-VN')}đ</td>
                    
                    <!-- Số lượng (cho phép đổi trực tiếp ngay trong giỏ) -->
                    <td>
                        <input type="number" min="1" value="${item.soLuong}" 
                            onchange="doiSoLuong(${index}, this.value)" 
                            style="width: 50px; text-align: center; padding: 4px; border: 1px solid #ddd; border-radius: 4px;">
                    </td>
                    
                    <!-- Thành tiền -->
                    <td>${thanhTien.toLocaleString('vi-VN')}đ</td>
                </tr>
            `;
        });

        // Bơm danh sách sản phẩm vào bảng
        cartItemsContainer.innerHTML = htmlContent;

        // Cập nhật tổng tiền ra khung bên phải
        let tienFormatted = tongTienHang.toLocaleString('vi-VN') + "đ";
        if (cartSubtotal) cartSubtotal.innerText = tienFormatted;
        if (cartTotal) cartTotal.innerText = tienFormatted;
    }

    // 3. Hàm thay đổi số lượng trực tiếp
    function doiSoLuong(index, soLuongMoi) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        let soLuongMoiInt = parseInt(soLuongMoi);

        if (soLuongMoiInt <= 0) {
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

    // 4. Hàm xóa sản phẩm khi bấm dấu X
    function xoaSanPham(index) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
    }


   // ==========================================
// HÀM XỬ LÝ ĐẶT HÀNG / THANH TOÁN 
// ==========================================
function datHang() {
    // 1. Lấy thông tin tài khoản đang đăng nhập
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
        alert("Vui lòng đăng nhập trước khi tiến hành thanh toán!");
        window.location.href = "../LogIn/login.html";
        return;
    }

    // 2. Lấy giỏ hàng từ localStorage
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (!Array.isArray(cart) || cart.length === 0) {
        alert("Giỏ hàng của bạn đang trống, không thể đặt hàng!");
        return;
    }

    // 3. Tính tổng tiền hàng (Đã khai báo tường minh ở đây)
    let tongTienHang = cart.reduce((tong, sanPham) => tong + (sanPham.price * sanPham.soLuong), 0);

    // 4. Tạo đối tượng đơn hàng mới lưu vào hệ thống
    const donHangMoi = {
        maDonHang: "DH" + Math.floor(100000 + Math.random() * 900000),
        username: currentUser.username || currentUser.tenDangNhap,
        ngayDat: new Date().toLocaleString('vi-VN'),
        danhSachSanPham: cart,
        tongTien: tongTienHang,
        trangThai: "Đang chuẩn bị hàng"
    };

    let danhSachDonHang = JSON.parse(localStorage.getItem("danhSachDonHang")) || [];
    danhSachDonHang.push(donHangMoi);
    localStorage.setItem("danhSachDonHang", JSON.stringify(danhSachDonHang));

    // ==========================================
    // 5. GỬI EMAIL XÁC NHẬN QUA EMAILJS
    // ==========================================
    let chiTietSanPhamText = "";
    cart.forEach((item, index) => {
        chiTietSanPhamText += `${index + 1}. ${item.name} - Số lượng: ${item.soLuong} - Giá: ${item.price.toLocaleString('vi-VN')}đ\n`;
    });
    chiTietSanPhamText += `\nTỔNG TIỀN THANH TOÁN: ${tongTienHang.toLocaleString('vi-VN')}đ`;
    chiTietSanPhamText += `\nMã đơn hàng của bạn là: ${donHangMoi.maDonHang}`;

    let templateParams = {
        to_name: currentUser.hoTen || currentUser.tenDangNhap,
        email: currentUser.email,
        message: chiTietSanPhamText
    };

    // Gọi hàm gửi mail (Nhớ thay Service ID và Template ID thật của bạn)
    emailjs.send('service_0al4ayx', 'template_yinrr0a', templateParams)
        .then(function(response) {
            console.log('Gửi email xác nhận thành công!', response.status, response.text);
        }, function(error) {
            console.log('Gửi email thất bại...', error);
        });
    // ==========================================

    // 6. Xóa giỏ hàng, thông báo và tải lại trang
    localStorage.removeItem("cart");
    alert(`Đặt hàng thành công! Mã đơn hàng của bạn là: ${donHangMoi.maDonHang}`);
    window.location.reload();
}
