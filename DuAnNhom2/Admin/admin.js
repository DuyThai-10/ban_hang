// 1. KHAI BÁO BIẾN VÀ LẤY DỮ LIỆU
        // ==========================================

        const KHOA_SAN_PHAM = "danhSachSanPham";

        let danhSachSanPham = [];

        let dangSua = false;


        // Chuyển dữ liệu cũ về cấu trúc mà trang User sử dụng
        function chuanHoaSanPham(sanPham) {

        return {
        id: sanPham.id ?? sanPham.ma ?? Date.now(),
        brand: sanPham.brand ?? sanPham.thuongHieu ?? "",
        name: sanPham.name ?? sanPham.ten ?? "",
        price: Number(sanPham.price ?? sanPham.gia ?? 0),
        image: sanPham.image ?? sanPham.hinhAnh ?? "",
        description: sanPham.description ?? sanPham.moTa ?? "",

        // Nếu chưa có số lượng thì mặc định là 10
        soLuong: Number(sanPham.soLuong ?? 10),

        danhMuc: sanPham.danhMuc ?? "Phụ kiện"
        };

    }


        // Lấy danh sách từ localStorage
       function layDuLieu() {

            try {

                const duLieu = JSON.parse(
                    localStorage.getItem(KHOA_SAN_PHAM)
                );

                danhSachSanPham = Array.isArray(duLieu)
                    ? duLieu.map(chuanHoaSanPham)
                    : [];

                // Kiểm tra xem đã cập nhật dữ liệu tồn kho cũ chưa
                const khoaCapNhat = "daCapNhatTonKho_v1";

                if (!localStorage.getItem(khoaCapNhat)) {

                    danhSachSanPham.forEach(sanPham => {

                        // Những sản phẩm đang có số lượng 0
                        // sẽ được đặt lại thành 10 trong lần đầu
                        if (sanPham.soLuong === 0) {
                            sanPham.soLuong = 10;
                        }

                    });

                    // Đánh dấu đã cập nhật để không thực hiện lại
                    localStorage.setItem(khoaCapNhat, "true");

                }

                // Lưu dữ liệu đã chuẩn hóa
                localStorage.setItem(
                    KHOA_SAN_PHAM,
                    JSON.stringify(danhSachSanPham)
                );

            } catch (loi) {

                console.error("Lỗi đọc dữ liệu sản phẩm:", loi);

                danhSachSanPham = [];

            }

        }


        // Lưu danh sách vào localStorage
        function luuDuLieu() {

            localStorage.setItem(
                KHOA_SAN_PHAM,
                JSON.stringify(danhSachSanPham)
            );

            capNhatThongKe();
            hienThiSanPham();

        }


        // Làm sạch nội dung khi đưa vào HTML
        function lamSach(chuoi) {

            return String(chuoi ?? "").replace(/[&<>"']/g, kyTu => ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            }[kyTu]));

        }


        // Định dạng tiền Việt Nam
        function dinhDangTien(gia) {

            return Number(gia || 0).toLocaleString("vi-VN") + "đ";

        }


        // ==========================================
        // 2. HIỂN THỊ DANH SÁCH SẢN PHẨM
        // ==========================================

        function hienThiSanPham() {

            const bangSanPham = document.getElementById("bangSanPham");

            const tuKhoa = document
                .getElementById("timKiem")
                .value.toLowerCase()
                .trim();

            const danhMucLoc = document
                .getElementById("locDanhMuc")
                .value;

            const danhSachLoc = danhSachSanPham.filter(sanPham => {

                const dungTuKhoa =
                    sanPham.name.toLowerCase().includes(tuKhoa) ||
                    sanPham.brand.toLowerCase().includes(tuKhoa);

                const dungDanhMuc =
                    !danhMucLoc ||
                    sanPham.danhMuc === danhMucLoc;

                return dungTuKhoa && dungDanhMuc;

            });


            if (danhSachLoc.length === 0) {

                bangSanPham.innerHTML = `
                    <tr>
                        <td colspan="8" class="khong-co-du-lieu">
                            Không tìm thấy sản phẩm nào!
                        </td>
                    </tr>
                `;

                return;

            }


            bangSanPham.innerHTML = danhSachLoc.map(sanPham => {

                const trangThai = sanPham.soLuong > 0
                    ? `<span class="trang-thai con-hang">Còn hàng</span>`
                    : `<span class="trang-thai het-hang">Hết hàng</span>`;

                const hinhAnh = sanPham.image
                    ? `<img class="anh-san-pham"
                            src="${lamSach(sanPham.image)}"
                            alt="${lamSach(sanPham.name)}"
                            onerror="this.style.display='none'">`
                    : "Chưa có ảnh";

                return `

                    <tr>

                        <td>${hinhAnh}</td>

                        <td class="ten-san-pham">
                            ${lamSach(sanPham.name)}
                        </td>

                        <td>${lamSach(sanPham.brand)}</td>

                        <td>${lamSach(sanPham.danhMuc)}</td>

                        <td class="gia-san-pham">
                            ${dinhDangTien(sanPham.price)}
                        </td>

                        <td>${sanPham.soLuong}</td>

                        <td>${trangThai}</td>

                        <td>
                            <div class="nhom-nut">

                                <button
                                    class="nut-sua"
                                    data-hanh-dong="sua"
                                    data-id="${lamSach(sanPham.id)}"
                                >
                                    Sửa
                                </button>

                                <button
                                    class="nut-xoa"
                                    data-hanh-dong="xoa"
                                    data-id="${lamSach(sanPham.id)}"
                                >
                                    Xóa
                                </button>

                            </div>
                        </td>

                    </tr>

                `;

            }).join("");

        }


        // ==========================================
        // 3. CẬP NHẬT THỐNG KÊ
        // ==========================================

        function capNhatThongKe() {

            const tongSanPham = danhSachSanPham.length;

            const conHang = danhSachSanPham.filter(
                sanPham => sanPham.soLuong > 0
            ).length;

            const hetHang = tongSanPham - conHang;

            const tongTonKho = danhSachSanPham.reduce(
                (tong, sanPham) => tong + sanPham.soLuong,
                0
            );

            document.getElementById("tongSanPham").textContent =
                tongSanPham;

            document.getElementById("sanPhamConHang").textContent =
                conHang;

            document.getElementById("sanPhamHetHang").textContent =
                hetHang;

            document.getElementById("tongTonKho").textContent =
                tongTonKho;

        }


        // ==========================================
        // 4. MỞ FORM THÊM SẢN PHẨM
        // ==========================================

        function moFormThem() {

            dangSua = false;

            document.getElementById("formSanPham").reset();

            document.getElementById("maSanPham").value = "";

            document.getElementById("tieuDeForm").textContent =
                "Thêm sản phẩm";

            document.getElementById("anhXemTruoc").style.display =
                "none";

            document.getElementById("lopPhu").classList.add("hien");

        }


        // ==========================================
        // 5. ĐÓNG FORM
        // ==========================================

        function dongForm() {

            document.getElementById("lopPhu").classList.remove("hien");

            document.getElementById("formSanPham").reset();

            document.getElementById("anhXemTruoc").style.display =
                "none";

        }


        // ==========================================
        // 6. XEM TRƯỚC HÌNH ẢNH
        // ==========================================

        function xemTruocAnh() {

            const duongDan = document.getElementById("hinhAnh").value;

            const anh = document.getElementById("anhXemTruoc");

            if (duongDan.trim() === "") {

                anh.style.display = "none";
                return;

            }

            anh.src = duongDan;
            anh.style.display = "block";

            anh.onerror = function() {
                anh.style.display = "none";
            };

        }


        // ==========================================
        // 7. LƯU SẢN PHẨM (THÊM VÀ SỬA)
        // ==========================================

        function luuSanPham(suKien) {

            suKien.preventDefault();

            const ma = document.getElementById("maSanPham").value;

            const ten = document.getElementById("tenSanPham").value.trim();

            const thuongHieu = document
                .getElementById("thuongHieu").value.trim();

            const danhMuc = document.getElementById("danhMuc").value;

            const gia = Number(document.getElementById("giaSanPham").value);

            const soLuong = Number(document.getElementById("soLuong").value);

            const hinhAnh = document.getElementById("hinhAnh").value.trim();

            const moTa = document.getElementById("moTa").value.trim();


            if (!ten || !thuongHieu || !danhMuc || !hinhAnh) {

                alert("Vui lòng nhập đầy đủ thông tin sản phẩm!");

                return;

            }

            if (!Number.isFinite(gia) || gia < 0 ||
                !Number.isInteger(soLuong) || soLuong < 0) {

                alert("Giá và số lượng không hợp lệ!");

                return;

            }


            const sanPhamMoi = {

                id: dangSua ? ma : String(Date.now()),

                brand: thuongHieu,

                name: ten,

                price: gia,

                image: hinhAnh,

                description: moTa,

                soLuong: soLuong,

                danhMuc: danhMuc

            };


            if (dangSua) {

                const viTri = danhSachSanPham.findIndex(
                    sanPham => String(sanPham.id) === String(ma)
                );

                if (viTri === -1) {

                    alert("Không tìm thấy sản phẩm cần sửa!");
                    return;

                }

                danhSachSanPham[viTri] = sanPhamMoi;

                alert("Cập nhật sản phẩm thành công!");

            } else {

                danhSachSanPham.push(sanPhamMoi);

                alert("Thêm sản phẩm thành công!");

            }


            luuDuLieu();

            dongForm();

        }


        // ==========================================
        // 8. MỞ FORM SỬA SẢN PHẨM
        // ==========================================

        function suaSanPham(ma) {

            const sanPham = danhSachSanPham.find(
                sp => String(sp.id) === String(ma)
            );

            if (!sanPham) {

                alert("Không tìm thấy sản phẩm!");
                return;

            }

            dangSua = true;

            document.getElementById("maSanPham").value = sanPham.id;

            document.getElementById("tenSanPham").value = sanPham.name;

            document.getElementById("thuongHieu").value = sanPham.brand;

            document.getElementById("danhMuc").value = sanPham.danhMuc;

            document.getElementById("giaSanPham").value = sanPham.price;

            document.getElementById("soLuong").value = sanPham.soLuong;

            document.getElementById("hinhAnh").value = sanPham.image;

            document.getElementById("moTa").value = sanPham.description;

            document.getElementById("tieuDeForm").textContent =
                "Cập nhật sản phẩm";

            xemTruocAnh();

            document.getElementById("lopPhu").classList.add("hien");

        }


        // ==========================================
        // 9. XÓA SẢN PHẨM
        // ==========================================

        function xoaSanPham(ma) {

            const xacNhan = confirm(
                "Bạn có chắc chắn muốn xóa sản phẩm này không?"
            );

            if (!xacNhan) return;

            danhSachSanPham = danhSachSanPham.filter(
                sanPham => String(sanPham.id) !== String(ma)
            );

            luuDuLieu();

            alert("Đã xóa sản phẩm thành công!");

        }


        // ==========================================
        // 10. XỬ LÝ CÁC NÚT TRÊN BẢNG
        // ==========================================

        document.getElementById("bangSanPham").addEventListener(
            "click",
            function(suKien) {

                const nut = suKien.target.closest("button");

                if (!nut) return;

                const ma = nut.dataset.id;

                const hanhDong = nut.dataset.hanhDong;

                if (hanhDong === "sua") {
                    suaSanPham(ma);
                }

                if (hanhDong === "xoa") {
                    xoaSanPham(ma);
                }

            }
        );


        // ==========================================
        // 11. TÌM KIẾM VÀ LỌC
        // ==========================================

        document.getElementById("timKiem").addEventListener(
            "input",
            hienThiSanPham
        );

        document.getElementById("locDanhMuc").addEventListener(
            "change",
            hienThiSanPham
        );


        // ==========================================
        // 12. GẮN SỰ KIỆN CHO FORM
        // ==========================================

        document.getElementById("btnThemSanPham").addEventListener(
            "click",
            moFormThem
        );

        document.getElementById("btnDong").addEventListener(
            "click",
            dongForm
        );

        document.getElementById("btnHuy").addEventListener(
            "click",
            dongForm
        );

        document.getElementById("formSanPham").addEventListener(
            "submit",
            luuSanPham
        );

        document.getElementById("hinhAnh").addEventListener(
            "input",
            xemTruocAnh
        );


        // Đóng form khi bấm ra bên ngoài
        document.getElementById("lopPhu").addEventListener(
            "click",
            function(suKien) {

                if (suKien.target.id === "lopPhu") {
                    dongForm();
                }

            }
        );


        // ==========================================
        // 13. ĐỒNG BỘ KHI CÓ THAY ĐỔI TỪ TAB KHÁC
        // ==========================================

        window.addEventListener("storage", function(suKien) {

            if (suKien.key === KHOA_SAN_PHAM) {

                layDuLieu();

                capNhatThongKe();

                hienThiSanPham();

            }

        });


        // ==========================================
        // 14. MENU ĐIỀU HƯỚNG
        // ==========================================

        document.querySelectorAll(".menu a").forEach(nut => {

            nut.addEventListener("click", function(suKien) {

                suKien.preventDefault();

                document.querySelectorAll(".menu a").forEach(
                    item => item.classList.remove("active")
                );

                nut.classList.add("active");

                const trang = nut.dataset.trang;

                const tenTrang = {
                    tongquan: "Tổng quan",
                    sanpham: "Quản lý sản phẩm",
                    donhang: "Quản lý đơn hàng",
                    khachhang: "Quản lý khách hàng",
                    danhmuc: "Quản lý danh mục",
                    caidat: "Cài đặt hệ thống"
                };

                document.getElementById("tieuDeTrang").textContent =
                    tenTrang[trang] || "WEB SHOP";

                if (trang !== "tongquan" && trang !== "sanpham") {

                    alert(
                        "Chức năng " + tenTrang[trang] +
                        " sẽ được xây dựng ở phần tiếp theo."
                    );

                }

                if (trang === "sanpham") {

                    document.querySelector(".khung-quan-ly")
                        .scrollIntoView({ behavior: "smooth" });

                }

                if (trang === "tongquan") {

                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });

                }

            });

        });


        // ==========================================
        // 15. KHỞI CHẠY TRANG ADMIN
        // ==========================================

        layDuLieu();

        capNhatThongKe();

        hienThiSanPham();