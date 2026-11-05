// Lắng nghe sự kiện toàn bộ tài liệu HTML trên trang products đã được tải xong xuôi
document.addEventListener("DOMContentLoaded", function() {
    
    // 1. Xử lý hiển thị thông tin người dùng và nút đăng xuất trên Header
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const authMenu = document.getElementById("authMenu");

    // Nếu người dùng đã đăng nhập và tìm thấy khung chứa menu tài khoản trên header
    if (currentUser && authMenu) {
        // Thay thế nội dung HTML bằng lời chào kèm nút đăng xuất
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

        // Lắng nghe sự kiện khi bấm nút đăng xuất
        document.getElementById("btnDangXuat").addEventListener("click", function() {
            localStorage.removeItem("currentUser"); // Xóa thông tin đăng nhập khỏi localStorage
            alert("Đã đăng xuất thành công!");
            window.location.reload(); // Tải lại trang
        });
    }

    // 2. Khởi tạo kho dữ liệu sản phẩm mặc định trong localStorage nếu chưa tồn tại
    let danhSachSanPham = JSON.parse(localStorage.getItem("danhSachSanPham"));
    if (!danhSachSanPham) {
        danhSachSanPham = [
            { id: 1, brand: "Adidas", name: "Áo thun Cotton Premium", price: 350000, image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600", description: "Áo thun cotton cao cấp..." },
            { id: 2, brand: "Nike", name: "Giày Sneaker Đỏ Nổi Bật", price: 1250000, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600", description: "Giày thể thao Nike chính hãng..." },
            { id: 3, brand: "Casio", name: "Đồng hồ thông minh Unisex", price: 890000, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600", description: "Đồng hồ thời trang..." },
            { id: 4, brand: "Sony", name: "Tai nghe chống ồn Wireless", price: 1500000, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600", description: "Tai nghe không dây..." },
            { id: 5, brand: "Zara", name: "Áo sơ mi nam công sở lịch lãm", price: 420000, image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600", description: "Áo sơ mi thiết kế form slim-fit..." },
            { id: 6, brand: "Levi's", name: "Quần Jean nam slim-fit", price: 750000, image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600", description: "Quần jean Denim bền bỉ..." },
            { id: 7, brand: "Uniqlo", name: "Áo khoác dù chống nắng cao cấp", price: 590000, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600", description: "Áo khoác nhẹ mỏng thoáng khí..." },
            { id: 8, brand: "Mango", name: "Đầm nữ dáng dài dạo phố", price: 680000, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600", description: "Đầm thiết kế thanh lịch..." },
            { id: 9, brand: "H&M", name: "Áo polo nam thể thao thoáng mát", price: 290000, image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600", description: "Áo polo lịch sự..." },
            { id: 10, brand: "Puma", name: "Bộ đồ thể thao năng động", price: 950000, image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600", description: "Bộ trang phục thể thao..." },
            { id: 11, brand: "Calvin Klein", name: "Túi đeo chéo thời trang", price: 550000, image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600", description: "Túi đeo chéo nhỏ gọn..." },
            { id: 12, brand: "Converse", name: "Mũ lưỡi trai cá tính", price: 220000, image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600", description: "Mũ lưỡi trai phong cách..." }
            
        ];
        // Lưu mảng mẫu này vào localStorage để sử dụng cho các lần sau
        localStorage.setItem("danhSachSanPham", JSON.stringify(danhSachSanPham));
    }

    // 3. Đọc tham số tìm kiếm được truyền qua đường dẫn URL (ví dụ: ?search=ao)
    const urlParams = new URLSearchParams(window.location.search);
    const tuKhoa = urlParams.get("search");

    // Tạo biến lưu danh sách mang ra hiển thị (mặc định lấy toàn bộ danh sách)
    let danhSachHienThi = danhSachSanPham;

    // Nếu trên URL có chứa từ khóa tìm kiếm
    if (tuKhoa) {
        let keyword = tuKhoa.toLowerCase().trim(); // Chuyển về chữ thường và loại bỏ khoảng trắng thừa
        
        // Tiến hành lọc mảng sản phẩm theo tên hoặc thương hiệu có chứa từ khóa
        danhSachHienThi = danhSachSanPham.filter(sp => 
            sp.name.toLowerCase().includes(keyword) || 
            (sp.brand && sp.brand.toLowerCase().includes(keyword))
        );
    }

    // 4. Gọi hàm hiển thị, truyền vào danh sách sản phẩm đã được lọc (hoặc danh sách gốc nếu không tìm kiếm)
    hienThiSanPham(danhSachHienThi);
});

// ==========================================
// HÀM VẼ GIAO DIỆN SẢN PHẨM LÊN TRANG (ĐÃ TÍCH HỢP LINK CHI TIẾT)
// ==========================================
function hienThiSanPham(ds) {
    // Tìm đến khung chứa sản phẩm có id là "productContainer" trong file HTML
    const container = document.getElementById("productContainer");
    if (!container) return; // Nếu không tìm thấy khung thì dừng lại để tránh lỗi

    let htmlContent = ""; // Biến lưu chuỗi mã HTML cấu trúc các sản phẩm

    // Duyệt qua từng sản phẩm trong danh sách được truyền vào
    ds.forEach(sp => {
        // Định dạng giá tiền kiểu Việt Nam (Ví dụ: 350000 thành 350.000đ)
        let giaFormatted = sp.price.toLocaleString('vi-VN') + "đ";

        // Tạo khung HTML giao diện cho từng sản phẩm
        htmlContent += `
            <div class="pro">
                <!-- ⭐ Bọc ảnh và thông tin trong thẻ <a> để khi nhấn vào sẽ chuyển sang trang chi tiết -->
                <a href="../Details/details.html?id=${sp.id}" style="text-decoration: none; color: inherit; display: block;">
                    <img src="${sp.image}" alt="${sp.name}">
                    <div class="des">
                        <span>${sp.brand}</span>
                        <h3>${sp.name}</h3>
                        <div class="star">
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                        </div>
                        <h4>${giaFormatted}</h4>
                    </div>
                </a>

                <!-- Nút thêm vào giỏ hàng gọi hàm themVaoGioHang kèm theo ID sản phẩm -->
                <button onclick="themVaoGioHang(${sp.id})" class="cart-btn">
                    <i class="fa-solid fa-cart-shopping"></i>
                </button>
            </div>
        `;
    });

    // Chèn toàn bộ chuỗi HTML vừa tạo vào bên trong thẻ chứa sản phẩm trên trang
    container.innerHTML = htmlContent;
}

// ==========================================
// HÀM THÊM VÀO GIỎ HÀNG
// ==========================================
function themVaoGioHang(idSanPham) {
    // Kiểm tra xem người dùng đã đăng nhập hay chưa
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    
    // Nếu chưa đăng nhập thì hiển thị thông báo và chuyển hướng sang trang đăng nhập
    if (!currentUser) {
        alert("Vui lòng đăng nhập trước khi thêm sản phẩm vào giỏ hàng!");
        window.location.href = "../LogIn/login.html";
        return;
    }

    // Lấy toàn bộ danh sách sản phẩm từ localStorage
    let danhSachSanPham = JSON.parse(localStorage.getItem("danhSachSanPham")) || [];
    // Tìm thông tin sản phẩm khớp với ID được người dùng bấm vào
    const sanPhamChon = danhSachSanPham.find(sp => sp.id === idSanPham);
    if (!sanPhamChon) return;

    // Lấy giỏ hàng hiện tại ra từ localStorage (nếu chưa có thì trả về mảng rỗng)
    let gioHang = JSON.parse(localStorage.getItem("cart")) || [];
    // Kiểm tra xem sản phẩm này đã có trong giỏ hàng trước đó chưa
    const index = gioHang.findIndex(item => item.id === idSanPham);

    // Nếu sản phẩm đã tồn tại trong giỏ hàng thì tăng số lượng lên 1 đơn vị
    if (index !== -1) {
        gioHang[index].soLuong += 1;
    } else {
        // Nếu chưa có thì thêm mới sản phẩm đó vào giỏ hàng với số lượng mặc định là 1
        gioHang.push({
            id: sanPhamChon.id,
            name: sanPhamChon.name,
            price: sanPhamChon.price,
            image: sanPhamChon.image,
            soLuong: 1
        });
    }

    // Lưu ngược lại mảng giỏ hàng mới đã cập nhật vào localStorage
    localStorage.setItem("cart", JSON.stringify(gioHang));
    // Thông báo thêm thành công cho người dùng
    alert(`Đã thêm sản phẩm "${sanPhamChon.name}" vào giỏ hàng thành công!`);
}