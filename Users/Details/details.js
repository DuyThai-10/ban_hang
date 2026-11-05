let sanPhamHienTai = null;

document.addEventListener("DOMContentLoaded", function() {
    hienThiChiTietSanPham();
});

// 1. Đọc ID từ URL và tìm sản phẩm trong localStorage
function hienThiChiTietSanPham() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    if (!productId) {
        hienThiThongBaoLoi("Không tìm thấy mã sản phẩm trong đường dẫn!");
        return;
    }

    // Lấy danh sách sản phẩm từ localStorage
    const danhSachSanPham = JSON.parse(localStorage.getItem("danhSachSanPham")) || [];

    // Tìm sản phẩm khớp ID
    sanPhamHienTai = danhSachSanPham.find(sp => String(sp.id) === String(productId));

    if (!sanPhamHienTai) {
        hienThiThongBaoLoi("Sản phẩm không tồn tại hoặc đã bị xóa!");
        return;
    }

    // Đổ dữ liệu thật ra giao diện
    document.getElementById("detail-img").src = sanPhamHienTai.image || "https://via.placeholder.com/400";
    document.getElementById("detail-name").innerText = sanPhamHienTai.name;
    document.getElementById("detail-price").innerText = (sanPhamHienTai.price || 0).toLocaleString('vi-VN') + "đ";
    
    const moTaText = sanPhamHienTai.desc || sanPhamHienTai.description || "Sản phẩm chất lượng cao, thiết kế hiện đại, đáp ứng tốt mọi nhu cầu của bạn.";
    document.getElementById("detail-desc").innerText = moTaText;
}

// Hàm thông báo khi lỗi
function hienThiThongBaoLoi(noiDung) {
    const container = document.querySelector(".container");
    container.innerHTML = `
        <div style="text-align: center; margin-top: 60px; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
            <i class="fa-solid fa-triangle-exclamation" style="font-size: 50px; color: #e74c3c; margin-bottom: 15px;"></i>
            <h2 style="color: #1e293b; margin-bottom: 15px;">${noiDung}</h2>
            <a href="../Home/home.html" style="color: #0D9295; font-weight: bold; text-decoration: none; border: 1px solid #0D9295; padding: 10px 20px; border-radius: 6px; display: inline-block;">Quay về trang chủ</a>
        </div>
    `;
}

// 2. Tăng / Giảm số lượng
function tangSoLuong() {
    const input = document.getElementById("quantity-input");
    input.value = parseInt(input.value) + 1;
}

function giamSoLuong() {
    const input = document.getElementById("quantity-input");
    if (parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
    }
}

// 3. Thêm vào giỏ hàng (`localStorage` khóa `"cart"`)
function themVaoGioHangChitiet() {
    if (!sanPhamHienTai) return;

    const soLuongMua = parseInt(document.getElementById("quantity-input").value);
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let viTri = cart.findIndex(sp => String(sp.id) === String(sanPhamHienTai.id));

    if (viTri !== -1) {
        cart[viTri].soLuong += soLuongMua;
    } else {
        cart.push({
            id: sanPhamHienTai.id,
            name: sanPhamHienTai.name,
            price: sanPhamHienTai.price,
            image: sanPhamHienTai.image,
            soLuong: soLuongMua
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`Đã thêm thành công ${soLuongMua} sản phẩm "${sanPhamHjson = sanPhamHienTai.name}" vào giỏ hàng!`);
}