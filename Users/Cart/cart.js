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

            // Bắt sự kiện khi người dùng bấm vào nút Đăng xuất
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

// 2. Hàm chính để đọc giỏ hàng và hiện ra bảng
function renderCart() {
    // Mở hộp "cart" trong localStorage ra lấy dữ liệu (nếu chưa có thì là mảng rỗng [])
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    // Lấy vị trí thẻ tbody trong bảng HTML
    const cartItemsContainer = document.getElementById("cart-items");

    // Nếu giỏ hàng trống trơn
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <tr>
                <td colspan="6" style="padding: 40px; text-align: center; color: #777; font-size: 15px;">
                    Giỏ hàng của bạn đang trống! <a href="../Products/products.html" style="color: #0D9295; font-weight: bold; text-decoration: underline;">Đi mua sắm ngay</a>
                </td>
            </tr>
        `;
        return; // Dừng, không chạy tiếp bên dưới nữa
    }

    // Nếu có sản phẩm, dùng vòng lặp để tạo các dòng HTML (tr)
    let htmlContent = "";

    cart.forEach((item, index) => {
        // Tính thành tiền riêng cho từng món (Giá x Số lượng)
        let thanhTien = item.price * item.soLuong;

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
                
                <!-- Số lượng (tạm thời để hiển thị) -->
                <td><input type="number" value="${item.soLuong}" readonly style="width: 45px; text-align: center; padding: 4px;"></td>
                
                <!-- Thành tiền -->
                <td>${thanhTien.toLocaleString('vi-VN')}đ</td>
            </tr>
        `;
    });

    // Bơm toàn bộ danh sách sản phẩm vừa tạo vào bảng HTML
    cartItemsContainer.innerHTML = htmlContent;
}

// 3. Hàm phụ trợ: Xóa món hàng khi bấm dấu X
function xoaSanPham(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    // Cắt bỏ sản phẩm tại vị trí index ra khỏi mảng
    cart.splice(index, 1);
    
    // Cập nhật lại kho localStorage và vẽ lại bảng ngay lập tức
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}