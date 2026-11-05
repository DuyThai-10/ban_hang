
/* =====================================
   1. KHAI BÁO DỮ LIỆU
===================================== */

// Lấy danh sách sản phẩm từ localStorage
let danhSachSanPham = JSON.parse(
    localStorage.getItem("danhSachSanPham")
) || [];

let anhSanPham = "";


// Nếu chưa có dữ liệu thì tạo sản phẩm mẫu
if (danhSachSanPham.length === 0) {

    danhSachSanPham = [
        {
            ma: "SP001",
            ten: "Áo thun basic",
            danhMuc: "Áo",
            gia: 250000,
            soLuong: 20,
            hinhAnh: ""
        },
        {
            ma: "SP002",
            ten: "Quần jean nam",
            danhMuc: "Quần",
            gia: 350000,
            soLuong: 15,
            hinhAnh: ""
        },
        {
            ma: "SP003",
            ten: "Giày thể thao",
            danhMuc: "Giày",
            gia: 650000,
            soLuong: 4,
            hinhAnh: ""
        },
        {
            ma: "SP004",
            ten: "Túi xách thời trang",
            danhMuc: "Phụ kiện",
            gia: 450000,
            soLuong: 0,
            hinhAnh: ""
        }
    ];

    luuDuLieu();
}


/* =====================================
   2. LƯU DỮ LIỆU
===================================== */

function luuDuLieu() {

    localStorage.setItem(
        "danhSachSanPham",
        JSON.stringify(danhSachSanPham)
    );

}


/* =====================================
   3. ĐỊNH DẠNG GIÁ TIỀN
===================================== */

function dinhDangTien(gia) {

    return Number(gia).toLocaleString("vi-VN") + "đ";

}


/* =====================================
   4. XÁC ĐỊNH TRẠNG THÁI SẢN PHẨM
===================================== */

function layTrangThai(soLuong) {

    if (soLuong <= 0) {

        return {
            ten: "Hết hàng",
            lop: "het-hang"
        };

    } else if (soLuong <= 5) {

        return {
            ten: "Sắp hết hàng",
            lop: "sap-het"
        };

    } else {

        return {
            ten: "Còn hàng",
            lop: "con-hang"
        };

    }

}


/* =====================================
   5. CẬP NHẬT THỐNG KÊ
===================================== */

function capNhatThongKe() {

    // Tổng số sản phẩm
    let tongSanPham = danhSachSanPham.length;

    // Tổng số lượng tồn kho
    let tongTonKho = danhSachSanPham.reduce(
        (tong, sanPham) => tong + Number(sanPham.soLuong),
        0
    );

    // Sản phẩm sắp hết hàng
    let sanPhamSapHet = danhSachSanPham.filter(
        sanPham => Number(sanPham.soLuong) > 0 &&
                   Number(sanPham.soLuong) <= 5
    ).length;

    // Số danh mục đang có sản phẩm
    let danhSachDanhMuc = [
        ...new Set(danhSachSanPham.map(sanPham => sanPham.danhMuc))
    ];

    // Hiển thị lên giao diện
    document.getElementById("tong-san-pham").textContent = tongSanPham;

    document.getElementById("tong-ton-kho").textContent = tongTonKho;

    document.getElementById("san-pham-sap-het").textContent = sanPhamSapHet;

    document.getElementById("tong-danh-muc").textContent = danhSachDanhMuc.length;

}


/* =====================================
   6. HỖ TRỢ HIỂN THỊ AN TOÀN
===================================== */

function chuyenThanhChuAnToan(noiDung) {

    return String(noiDung).replace(/[&<>"']/g, kyTu => {

        const bangKyTu = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return bangKyTu[kyTu];

    });

}


/* =====================================
   7. HIỂN THỊ DANH SÁCH SẢN PHẨM
===================================== */

function hienThiSanPham() {

    let bangSanPham = document.getElementById("danh-sach-san-pham");

    let tuKhoa = document.getElementById("tu-khoa")
        .value.toLowerCase().trim();

    let danhMuc = document.getElementById("loc-danh-muc").value;

    let trangThai = document.getElementById("loc-trang-thai").value;


    // Lọc sản phẩm theo điều kiện
    let danhSachHienThi = danhSachSanPham.filter(sanPham => {

        let dungTen = sanPham.ten.toLowerCase().includes(tuKhoa);

        let dungDanhMuc = danhMuc === "" ||
                          sanPham.danhMuc === danhMuc;

        let trangThaiSanPham = layTrangThai(Number(sanPham.soLuong));

        let dungTrangThai = trangThai === "" ||
                            trangThaiSanPham.lop === trangThai;

        return dungTen && dungDanhMuc && dungTrangThai;

    });


    // Xóa nội dung cũ
    bangSanPham.innerHTML = "";


    // Nếu không tìm thấy sản phẩm
    if (danhSachHienThi.length === 0) {

        document.getElementById("thong-bao-trong").style.display = "block";

    } else {

        document.getElementById("thong-bao-trong").style.display = "none";

    }


    // Duyệt từng sản phẩm và hiển thị
    danhSachHienThi.forEach(sanPham => {

        let trangThaiSanPham = layTrangThai(Number(sanPham.soLuong));

        let anhHienThi = sanPham.hinhAnh
            ? `<img src="${sanPham.hinhAnh}" class="anh-trong-bang" alt="Ảnh sản phẩm">`
            : `<div class="anh-mac-dinh">
                    <i class="fa-solid fa-box"></i>
               </div>`;


        let dong = document.createElement("tr");

        dong.innerHTML = `
            <td>${anhHienThi}</td>

            <td>${chuyenThanhChuAnToan(sanPham.ma)}</td>

            <td>${chuyenThanhChuAnToan(sanPham.ten)}</td>

            <td>${chuyenThanhChuAnToan(sanPham.danhMuc)}</td>

            <td>${dinhDangTien(sanPham.gia)}</td>

            <td>${sanPham.soLuong}</td>

            <td>
                <span class="trang-thai ${trangThaiSanPham.lop}">
                    ${trangThaiSanPham.ten}
                </span>
            </td>

            <td>
                <div class="nhom-thao-tac">

                    <button class="nut-sua"
                        title="Sửa sản phẩm"
                        onclick="moFormSua('${chuyenThanhChuAnToan(sanPham.ma)}')">

                        <i class="fa-solid fa-pen"></i>

                    </button>

                    <button class="nut-xoa"
                        title="Xóa sản phẩm"
                        onclick="xoaSanPham('${chuyenThanhChuAnToan(sanPham.ma)}')">

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </div>
            </td>
        `;

        bangSanPham.appendChild(dong);

    });


    // Cập nhật số liệu thống kê
    capNhatThongKe();

}


/* =====================================
   8. MỞ FORM THÊM SẢN PHẨM
===================================== */

function moFormThem() {

    document.getElementById("form-san-pham").reset();

    document.getElementById("vi-tri-sua").value = "";

    document.getElementById("ma-san-pham").disabled = false;

    document.getElementById("tieu-de-form").textContent = "Thêm sản phẩm";

    document.getElementById("anh-xem-truoc").src = "";

    document.getElementById("anh-xem-truoc").style.display = "none";

    document.getElementById("huong-dan-anh").style.display = "block";

    anhSanPham = "";

    document.getElementById("lop-phu").classList.add("hien-thi");

}


/* =====================================
   9. ĐÓNG FORM
===================================== */

function dongForm() {

    document.getElementById("lop-phu").classList.remove("hien-thi");

    document.getElementById("form-san-pham").reset();

    document.getElementById("vi-tri-sua").value = "";

    document.getElementById("ma-san-pham").disabled = false;

    document.getElementById("anh-xem-truoc").src = "";

    document.getElementById("anh-xem-truoc").style.display = "none";

    document.getElementById("huong-dan-anh").style.display = "block";

    anhSanPham = "";

}


/* =====================================
   10. XEM TRƯỚC HÌNH ẢNH
===================================== */

function xemTruocAnh(event) {

    let tepAnh = event.target.files[0];

    if (!tepAnh) {
        return;
    }

    // Kiểm tra định dạng hình ảnh
    if (!tepAnh.type.startsWith("image/")) {

        alert("Vui lòng chọn một file hình ảnh!");

        event.target.value = "";

        return;

    }

    // Giới hạn dung lượng 2MB
    if (tepAnh.size > 2 * 1024 * 1024) {

        alert("Hình ảnh không được vượt quá 2MB!");

        event.target.value = "";

        return;

    }

    let boDocAnh = new FileReader();

    boDocAnh.onload = function (ketQua) {

        anhSanPham = ketQua.target.result;

        document.getElementById("anh-xem-truoc").src = anhSanPham;

        document.getElementById("anh-xem-truoc").style.display = "block";

        document.getElementById("huong-dan-anh").style.display = "none";

    };

    boDocAnh.readAsDataURL(tepAnh);

}


/* =====================================
   11. LƯU SẢN PHẨM
===================================== */

document.getElementById("form-san-pham").addEventListener("submit", function(event) {

    event.preventDefault();


    // Lấy dữ liệu từ form
    let maSanPham = document.getElementById("ma-san-pham").value.trim();

    let tenSanPham = document.getElementById("ten-san-pham").value.trim();

    let danhMuc = document.getElementById("danh-muc").value;

    let giaSanPham = Number(document.getElementById("gia-san-pham").value);

    let soLuong = Number(document.getElementById("so-luong").value);

    let viTriSua = document.getElementById("vi-tri-sua").value;


    // Kiểm tra dữ liệu
    if (!maSanPham || !tenSanPham || !danhMuc) {

        alert("Vui lòng nhập đầy đủ thông tin!");

        return;

    }

    if (!Number.isFinite(giaSanPham) || giaSanPham < 0 ||
        !Number.isInteger(soLuong) || soLuong < 0) {

        alert("Giá bán và số lượng không hợp lệ!");

        return;

    }


    // Kiểm tra mã sản phẩm bị trùng
    let maBiTrung = danhSachSanPham.some(sanPham => {

        return sanPham.ma.toLowerCase() === maSanPham.toLowerCase() &&
               sanPham.ma !== viTriSua;

    });

    if (maBiTrung) {

        alert("Mã sản phẩm đã tồn tại!");

        return;

    }


    // Nếu đang sửa sản phẩm
    if (viTriSua !== "") {

        let viTri = danhSachSanPham.findIndex(
            sanPham => sanPham.ma === viTriSua
        );

        if (viTri !== -1) {

            danhSachSanPham[viTri] = {

                ma: maSanPham,

                ten: tenSanPham,

                danhMuc: danhMuc,

                gia: giaSanPham,

                soLuong: soLuong,

                hinhAnh: anhSanPham || danhSachSanPham[viTri].hinhAnh

            };

            alert("Cập nhật sản phẩm thành công!");

        }

    } else {

        // Thêm sản phẩm mới
        let sanPhamMoi = {

            ma: maSanPham,

            ten: tenSanPham,

            danhMuc: danhMuc,

            gia: giaSanPham,

            soLuong: soLuong,

            hinhAnh: anhSanPham

        };

        danhSachSanPham.push(sanPhamMoi);

        alert("Thêm sản phẩm thành công!");

    }


    // Lưu và cập nhật giao diện
    luuDuLieu();

    hienThiSanPham();

    dongForm();

});


/* =====================================
   12. MỞ FORM SỬA SẢN PHẨM
===================================== */

function moFormSua(maSanPham) {

    let sanPham = danhSachSanPham.find(
        sanPham => sanPham.ma === maSanPham
    );

    if (!sanPham) {

        alert("Không tìm thấy sản phẩm!");

        return;

    }


    // Điền dữ liệu cũ vào form
    document.getElementById("vi-tri-sua").value = sanPham.ma;

    document.getElementById("ma-san-pham").value = sanPham.ma;

    document.getElementById("ma-san-pham").disabled = true;

    document.getElementById("ten-san-pham").value = sanPham.ten;

    document.getElementById("danh-muc").value = sanPham.danhMuc;

    document.getElementById("gia-san-pham").value = sanPham.gia;

    document.getElementById("so-luong").value = sanPham.soLuong;


    // Hiển thị ảnh cũ
    anhSanPham = sanPham.hinhAnh || "";

    if (anhSanPham !== "") {

        document.getElementById("anh-xem-truoc").src = anhSanPham;

        document.getElementById("anh-xem-truoc").style.display = "block";

        document.getElementById("huong-dan-anh").style.display = "none";

    } else {

        document.getElementById("anh-xem-truoc").style.display = "none";

        document.getElementById("huong-dan-anh").style.display = "block";

    }


    document.getElementById("tieu-de-form").textContent = "Chỉnh sửa sản phẩm";

    document.getElementById("lop-phu").classList.add("hien-thi");

}


/* =====================================
   13. XÓA SẢN PHẨM
===================================== */

function xoaSanPham(maSanPham) {

    let xacNhan = confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?");

    if (!xacNhan) {
        return;
    }


    danhSachSanPham = danhSachSanPham.filter(
        sanPham => sanPham.ma !== maSanPham
    );


    luuDuLieu();

    hienThiSanPham();

    alert("Đã xóa sản phẩm thành công!");

}


/* =====================================
   14. KHỞI TẠO TRANG
===================================== */

hienThiSanPham();
