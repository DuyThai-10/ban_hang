
// LẤY CÁC PHẦN TỬ
const formDangNhap = document.getElementById("formDangNhap");
const formDangKy = document.getElementById("formDangKy");
const tieuDe = document.getElementById("tieuDe");
const thongBao = document.getElementById("thongBao");

// LẤY DANH SÁCH TÀI KHOẢN ADMIN
function layDanhSachAdmin() {
    return JSON.parse(localStorage.getItem("danhSachAdmin")) || [];
}

// CHUYỂN SANG FORM ĐĂNG KÝ
document.getElementById("sangDangKy").addEventListener("click", function(e) {
    e.preventDefault();

    formDangNhap.style.display = "none";
    formDangKy.style.display = "block";

    tieuDe.innerText = "Đăng ký quản trị viên";
    thongBao.innerText = "";
});

// CHUYỂN SANG FORM ĐĂNG NHẬP
document.getElementById("sangDangNhap").addEventListener("click", function(e) {
    e.preventDefault();

    formDangKy.style.display = "none";
    formDangNhap.style.display = "block";

    tieuDe.innerText = "Đăng nhập quản trị viên";
    thongBao.innerText = "";
});

// XỬ LÝ ĐĂNG KÝ
formDangKy.addEventListener("submit", function(e) {
    e.preventDefault();

    const hoTen = document.getElementById("hoTen").value.trim();
    const tenDangNhap = document.getElementById("tenDangKy").value.trim();
    const matKhau = document.getElementById("matKhauDangKy").value;
    const xacNhan = document.getElementById("xacNhanMatKhau").value;

    let danhSachAdmin = layDanhSachAdmin();

    if (matKhau.length < 6) {
        thongBao.style.color = "red";
        thongBao.innerText = "Mật khẩu phải có ít nhất 6 ký tự!";
        return;
    }

    if (matKhau !== xacNhan) {
        thongBao.style.color = "red";
        thongBao.innerText = "Mật khẩu xác nhận không khớp!";
        return;
    }

    const daTonTai = danhSachAdmin.some(admin =>
        admin.tenDangNhap.toLowerCase() === tenDangNhap.toLowerCase()
    );

    if (daTonTai) {
        thongBao.style.color = "red";
        thongBao.innerText = "Tên đăng nhập đã tồn tại!";
        return;
    }

    // THÊM TÀI KHOẢN MỚI
    danhSachAdmin.push({
        hoTen: hoTen,
        tenDangNhap: tenDangNhap,
        matKhau: matKhau
    });

    localStorage.setItem("danhSachAdmin", JSON.stringify(danhSachAdmin));

    alert("Đăng ký tài khoản thành công!");

    // QUAY LẠI FORM ĐĂNG NHẬP
    formDangKy.reset();
    formDangKy.style.display = "none";
    formDangNhap.style.display = "block";

    tieuDe.innerText = "Đăng nhập quản trị viên";

    // TỰ ĐIỀN TÊN ĐĂNG NHẬP VỪA ĐĂNG KÝ
    document.getElementById("tenDangNhap").value = tenDangNhap;

    thongBao.style.color = "green";
    thongBao.innerText = "Hãy nhập mật khẩu để đăng nhập!";
});

// XỬ LÝ ĐĂNG NHẬP
formDangNhap.addEventListener("submit", function(e) {
    e.preventDefault();

    const tenDangNhap = document.getElementById("tenDangNhap").value.trim();
    const matKhau = document.getElementById("matKhau").value;

    const danhSachAdmin = layDanhSachAdmin();

    const taiKhoan = danhSachAdmin.find(admin =>
        admin.tenDangNhap.toLowerCase() === tenDangNhap.toLowerCase() &&
        admin.matKhau === matKhau
    );

    if (taiKhoan) {

        localStorage.setItem("currentAdmin", JSON.stringify(taiKhoan));

        alert("Đăng nhập thành công!");

        window.location.href = "../admin.html";

    } else {
        thongBao.style.color = "red";
        thongBao.innerText = "Tên đăng nhập hoặc mật khẩu không chính xác!";
    }
});
