
    // SCRIPT XỬ LÝ ĐĂNG NHẬP / ĐĂNG XUẤT CHUNG

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

            document.getElementById("btnDangXuat").addEventListener("click", function() {
                localStorage.removeItem("currentUser");
                alert("Đã đăng xuất thành công!");
                window.location.reload();
            });
        }

        // Lấy sn từ kho



        document.addEventListener("DOMContentLoaded", function () {
    renderHomeProducts();
});

// 1. Lấy trực tiếp từ kho danhSachSanPham có sẵn trong localStorage để hiển thị
function renderHomeProducts() {
    const container = document.getElementById("home-product-container");
    if (!container) return;

    // Lấy đúng kho danhSachSanPham hiện có của bạn
    let danhSachSanPham = JSON.parse(localStorage.getItem("danhSachSanPham")) || [];
    
    // Lấy 4 sản phẩm đầu tiên ra trang chủ
    let sanPhamTrangChu = danhSachSanPham.slice(0, 4); 
    let html = "";

    sanPhamTrangChu.forEach((item) => {
        let giaFormatted = Number(item.price).toLocaleString('vi-VN') + "đ";

        html += `
            <div class="pro">
                <img src="${item.image}" alt="${item.name}">
                <div class="des">
                    <span>${item.brand || "Fashion"}</span>
                    <h3>${item.name}</h3>
                    <div class="star">
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                    </div>
                    <h4>${giaFormatted}</h4>
                </div>
                <!-- Nút thêm vào giỏ hàng gọi theo ID của kho chung -->
                <button onclick="themVaoGioHangTheoId(${item.id})" class="cart-btn" style="background:none; border:none; cursor:pointer;">
                    <i class="fa-solid fa-cart-shopping"></i>
                </button>
            </div>
        `;
    });

    container.innerHTML = html;
}

// 2. Hàm thêm sản phẩm vào giỏ hàng dựa trên ID đã có sẵn trong kho chung
function themVaoGioHangTheoId(idSanPham) {
    let danhSachSanPham = JSON.parse(localStorage.getItem("danhSachSanPham")) || [];
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Tìm đúng sản phẩm trong kho chung bằng ID
    let sanPhamChon = danhSachSanPham.find(p => p.id === idSanPham);

    if (!sanPhamChon) {
        alert("Không tìm thấy sản phẩm trong kho!");
        return;
    }

    // Kiểm tra xem sản phẩm đã có trong giỏ hàng (`cart`) chưa
    let existingItem = cart.find(item => item.id === idSanPham);

    if (existingItem) {
        existingItem.soLuong += 1; // Đã có thì tăng số lượng lên
    } else {
        cart.push({
            id: sanPhamChon.id,
            name: sanPhamChon.name,
            price: Number(sanPhamChon.price),
            image: sanPhamChon.image,
            soLuong: 1
        });
    }

    // Lưu lại vào giỏ hàng
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`Đã thêm "${sanPhamChon.name}" vào giỏ hàng!`);
}