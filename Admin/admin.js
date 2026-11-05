// ================= KIỂM TRA BẢO MẬT: BẮT BUỘC ĐĂNG NHẬP ADMIN =================
const currentAdmin = JSON.parse(localStorage.getItem("currentAdmin"));
if (!currentAdmin) {
    alert("Vui lòng đăng nhập tài khoản quản trị trước!");
    window.location.href = "login.html";
}

// Danh sách sản phẩm mặc định chuẩn
const danhSachMacDinh = [
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

document.addEventListener("DOMContentLoaded", function() {
    kiemTraVaKhoiTao();
    hienThiBangAdmin();
});

// Chuyển tab
function chuyenTab(tabName) {
    let secSanPham = document.getElementById("section-san-pham");
    let secDonHang = document.getElementById("section-don-hang");
    let secTaiKhoan = document.getElementById("section-tai-khoan");
    
    let menuSP = document.getElementById("menu-san-pham");
    let menuDH = document.getElementById("menu-don-hang");
    let menuTK = document.getElementById("menu-tai-khoan");

    secSanPham.style.display = "none";
    secDonHang.style.display = "none";
    secTaiKhoan.style.display = "none";
    menuSP.classList.remove("active");
    menuDH.classList.remove("active");
    menuTK.classList.remove("active");

    if (tabName === 'sanPham') {
        secSanPham.style.display = "block";
        menuSP.classList.add("active");
        hienThiBangAdmin();
    } else if (tabName === 'donHang') {
        secDonHang.style.display = "block";
        menuDH.classList.add("active");
        hienThiBangDonHang();
    } else if (tabName === 'taiKhoan') {
        secTaiKhoan.style.display = "block";
        menuTK.classList.add("active");
        hienThiBangUser();
    }
}

function kiemTraVaKhoiTao() {
    if (!localStorage.getItem("danhSachSanPham")) {
        localStorage.setItem("danhSachSanPham", JSON.stringify(danhSachMacDinh));
    }
}

// ================= 1. QUẢN LÝ SẢN PHẨM =================
function hienThiBangAdmin() {
    let danhSach = JSON.parse(localStorage.getItem("danhSachSanPham")) || [];
    let tbody = document.getElementById("admin-product-list");
    let html = "";

    if (danhSach.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #94a3b8;">Không có sản phẩm nào.</td></tr>`;
        return;
    }

    danhSach.forEach(sp => {
        html += `
            <tr>
                <td>#${sp.id}</td>
                <td><img src="${sp.image}" alt="img" style="width:45px; height:45px; object-fit:contain; background:#f1f5f9; border-radius:4px;"></td>
                <td><strong>${sp.name}</strong></td>
                <td>${sp.brand}</td>
                <td style="color: #e74c3c; font-weight: bold;">${Number(sp.price).toLocaleString('vi-VN')}đ</td>
                <td>
                    <div class="action-buttons" style="display:flex; gap:8px;">
                        <button class="btn-edit" onclick="moModalSua(${sp.id})" style="background:#fef3c7; color:#d97706; border:none; padding:6px 12px; border-radius:4px; cursor:pointer; font-weight:600;"><i class="fa-solid fa-pen"></i> Sửa</button>
                        <button class="btn-delete" onclick="xoaSanPham(${sp.id})" style="background:#fee2e2; color:#ef4444; border:none; padding:6px 12px; border-radius:4px; cursor:pointer; font-weight:600;"><i class="fa-solid fa-trash"></i> Xóa</button>
                    </div>
                </td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
}

function moModalThem() { document.getElementById("add-modal").style.display = "flex"; }
function dongModalThem() { document.getElementById("add-modal").style.display = "none"; }

function themSanPhamMoi(event) {
    event.preventDefault();
    let name = document.getElementById("input-name").value;
    let brand = document.getElementById("input-brand").value;
    let price = Number(document.getElementById("input-price").value);
    let image = document.getElementById("input-image").value;

    let danhSach = JSON.parse(localStorage.getItem("danhSachSanPham")) || [];
    let maxId = danhSach.length > 0 ? Math.max(...danhSach.map(sp => Number(sp.id) || 0)) : 0;
    let newId = maxId + 1;

    danhSach.push({ id: newId, name, brand, price, image, description: "Sản phẩm mới từ Admin." });
    localStorage.setItem("danhSachSanPham", JSON.stringify(danhSach));

    document.getElementById("form-add-product").reset();
    dongModalThem();
    hienThiBangAdmin();
    alert(`Thêm thành công sản phẩm #${newId}!`);
}

function moModalSua(id) {
    let danhSach = JSON.parse(localStorage.getItem("danhSachSanPham")) || [];
    let sp = danhSach.find(item => item.id === id);
    if (!sp) return;

    document.getElementById("edit-id").value = sp.id;
    document.getElementById("edit-name").value = sp.name;
    document.getElementById("edit-brand").value = sp.brand;
    document.getElementById("edit-price").value = sp.price;
    document.getElementById("edit-image").value = sp.image;

    document.getElementById("edit-modal").style.display = "flex";
}
function dongModalSua() { document.getElementById("edit-modal").style.display = "none"; }

function capNhatSanPham(event) {
    event.preventDefault();
    let id = Number(document.getElementById("edit-id").value);
    let name = document.getElementById("edit-name").value;
    let brand = document.getElementById("edit-brand").value;
    let price = Number(document.getElementById("edit-price").value);
    let image = document.getElementById("edit-image").value;

    let danhSach = JSON.parse(localStorage.getItem("danhSachSanPham")) || [];
    let index = danhSach.findIndex(item => item.id === id);
    if (index !== -1) {
        danhSach[index] = { ...danhSach[index], name, brand, price, image };
        localStorage.setItem("danhSachSanPham", JSON.stringify(danhSach));
        dongModalSua();
        hienThiBangAdmin();
        alert("Cập nhật thành công!");
    }
}

function xoaSanPham(id) {
    if (confirm("Xóa sản phẩm này?")) {
        let danhSach = JSON.parse(localStorage.getItem("danhSachSanPham")) || [];
        danhSach = danhSach.filter(sp => sp.id !== id);
        localStorage.setItem("danhSachSanPham", JSON.stringify(danhSach));
        hienThiBangAdmin();
        alert("Đã xóa sản phẩm!");
    }
}

// ================= 2. QUẢN LÝ ĐƠN HÀNG (Đọc từ 'danhSachDonHang') =================
function hienThiBangDonHang() {
    let danhSachDonHang = JSON.parse(localStorage.getItem("danhSachDonHang")) || [];
    let tbody = document.getElementById("admin-order-list");
    let html = "";

    if (danhSachDonHang.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #94a3b8;">Chưa có đơn hàng nào trong hệ thống.</td></tr>`;
        return;
    }

    danhSachDonHang.forEach((dh, index) => {
        let maDH = dh.maDonHang || `DH00${index + 1}`;
        let username = dh.username || dh.nguoiDat || "Khách vãng lai";
        let ngayDat = dh.ngayDat || "Vừa xong";

        html += `
            <tr>
                <td><strong>#${maDH}</strong></td>
                <td>${username}</td>
                <td>${ngayDat}</td>
                <td>
                    <button class="btn-delete" onclick="xoaDonHang('${maDH}')" style="background:#fee2e2; color:#ef4444; border:none; padding:6px 12px; border-radius:4px; cursor:pointer; font-weight:600;">
                        <i class="fa-solid fa-trash"></i> Xóa đơn
                    </button>
                </td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
}

function xoaDonHang(maDH) {
    if (confirm(`Bạn có chắc muốn xóa đơn hàng #${maDH} không?`)) {
        let danhSachDonHang = JSON.parse(localStorage.getItem("danhSachDonHang")) || [];
        danhSachDonHang = danhSachDonHang.filter(dh => dh.maDonHang !== maDH);
        localStorage.setItem("danhSachDonHang", JSON.stringify(danhSachDonHang));
        hienThiBangDonHang();
        alert("Đã xóa đơn hàng thành công!");
    }
}

// ================= 3. QUẢN LÝ TÀI KHOẢN (Đọc từ 'userList') =================
function hienThiBangUser() {
    let userList = JSON.parse(localStorage.getItem("userList")) || [];
    let tbody = document.getElementById("admin-user-list");
    let html = "";

    if (userList.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #94a3b8;">Chưa có tài khoản người dùng nào.</td></tr>`;
        return;
    }

    userList.forEach((user, index) => {
        let tenDangNhap = user.tenDangNhap || user.email || "";
        let hoTen = user.hoTen || "Không rõ";

        html += `
            <tr>
                <td>#${index + 1}</td>
                <td><strong>${hoTen}</strong></td>
                <td>${tenDangNhap}</td>
                <td>
                    <button class="btn-delete" onclick="xoaTaiKhoan('${tenDangNhap}')" style="background:#fee2e2; color:#ef4444; border:none; padding:6px 12px; border-radius:4px; cursor:pointer; font-weight:600;">
                        <i class="fa-solid fa-user-slash"></i> Xóa tài khoản
                    </button>
                </td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
}

function xoaTaiKhoan(tenDangNhap) {
    if (confirm(`Bạn có chắc chắn muốn xóa tài khoản "${tenDangNhap}" này không?`)) {
        let userList = JSON.parse(localStorage.getItem("userList")) || [];
        userList = userList.filter(u => u.tenDangNhap !== tenDangNhap && u.email !== tenDangNhap);
        localStorage.setItem("userList", JSON.stringify(userList));
        hienThiBangUser();
        alert("Đã xóa tài khoản thành công!");
    }
}

// Khôi phục sản phẩm gốc
function khoiPhucDuLieuGoc() {
    if (confirm("Khôi phục lại 12 sản phẩm gốc?")) {
        localStorage.setItem("danhSachSanPham", JSON.stringify(danhSachMacDinh));
        hienThiBangAdmin();
        alert("Đã khôi phục sản phẩm thành công!");
    }
}

// Đăng xuất Admin
function dangXuatAdmin() {
    if (confirm("Bạn có muốn đăng xuất khỏi trang quản trị?")) {
        localStorage.removeItem("currentAdmin");
        window.location.href = "login.html";
    }
}