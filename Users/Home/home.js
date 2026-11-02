
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


        // Lắng nghe sự kiện toàn bộ tài liệu HTML đã được tải xong xuôi thì mới chạy code bên trong
        document.addEventListener("DOMContentLoaded", function () {
            hienThiSanPhamTrangChu(); // Gọi hàm hiển thị sản phẩm ngay khi vừa mở trang chủ
        });

        // Hàm dùng để lấy trực tiếp mảng danhSachSanPham có sẵn trong localStorage ra để render
        function hienThiSanPhamTrangChu() {
            // Tìm đến vị trí thẻ HTML có id là "home-product-container" để chuẩn bị chứa danh sách sản phẩm
            const container = document.getElementById("home-product-container");
            if (!container) return; // Nếu không tìm thấy thẻ này trên trang thì dừng lại luôn để tránh lỗi

            // Lấy kho dữ liệu tổng danhSachSanPham từ localStorage, nếu trống thì trả về mảng rỗng []
            let danhSachSanPham = JSON.parse(localStorage.getItem("danhSachSanPham")) || [];
            
            // Cắt lấy 4 sản phẩm đầu tiên từ kho chung để hiển thị nổi bật ở trang chủ
            let sanPhamNoiBat = danhSachSanPham.slice(0, 4);
            let htmlContent = ""; // Biến tạm để lưu chuỗi các đoạn mã HTML sản phẩm sẽ tạo ra

            // Duyệt qua từng sản phẩm trong 4 sản phẩm nổi bật vừa cắt ra
            sanPhamNoiBat.forEach(sp => {
                // Định dạng lại giá tiền thành kiểu tiền tệ Việt Nam (Ví dụ: 350000 thành 350.000đ)
                let giaFormatted = sp.price.toLocaleString('vi-VN') + "đ";

                // Tạo cấu trúc HTML cho từng ô sản phẩm dựa theo đúng mẫu của trang Products
                htmlContent += `
                    <div class="pro">
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
                        <!-- Nút thêm vào giỏ hàng gắn sự kiện onclick truyền vào ID sản phẩm và dùng chung class CSS -->
                        <button onclick="themVaoGioHang(${sp.id})" class="cart-btn">
                            <i class="fa-solid fa-cart-shopping"></i>
                        </button>
                    </div>
                `;
            });

            // Đẩy toàn bộ chuỗi HTML vừa ghép xong vào bên trong khung chứa sản phẩm ở trang chủ
            container.innerHTML = htmlContent;
        }

        // Hàm xử lý khi người dùng bấm vào nút "Thêm vào giỏ hàng"
        function themVaoGioHang(idSanPham) {
            // Kiểm tra xem người dùng hiện tại đã đăng nhập hay chưa (thông qua currentUser trong localStorage)
            const currentUser = JSON.parse(localStorage.getItem("currentUser"));

            // Nếu chưa đăng nhập (currentUser không tồn tại) thì chặn lại, báo lỗi và chuyển hướng sang trang đăng nhập
            if (!currentUser) {
                alert("Vui lòng đăng nhập trước khi thêm sản phẩm vào giỏ hàng!");
                window.location.href = "../LogIn/login.html";
                return; // Thoát hàm ngay lập tức
            }

            // Lấy lại danh sách sản phẩm từ kho chung trong localStorage
            let danhSachSanPham = JSON.parse(localStorage.getItem("danhSachSanPham")) || [];
            // Tìm đúng thông tin chi tiết sản phẩm dựa vào cái idSanPham vừa được bấm
            const sanPhamChon = danhSachSanPham.find(sp => sp.id === idSanPham);
            if (!sanPhamChon) return; // Nếu không tìm thấy thì thoát

            // Lấy giỏ hàng hiện tại ra (nếu chưa có giỏ hàng nào thì khởi tạo mảng rỗng [])
            let gioHang = JSON.parse(localStorage.getItem("cart")) || [];
            // Kiểm tra xem sản phẩm này đã từng được thêm vào giỏ hàng trước đó chưa
            const index = gioHang.findIndex(item => item.id === idSanPham);

            // Nếu sản phẩm đã có trong giỏ hàng rồi thì chỉ cần cộng dồn số lượng lên 1
            if (index !== -1) {
                gioHang[index].soLuong += 1;
            } else {
                // Nếu sản phẩm chưa có trong giỏ hàng thì đẩy đối tượng mới vào với số lượng mặc định là 1
                gioHang.push({
                    id: sanPhamChon.id,
                    name: sanPhamChon.name,
                    price: sanPhamChon.price,
                    image: sanPhamChon.image,
                    soLuong: 1
                });
            }

            // Lưu ngược lại mảng giỏ hàng mới đã cập nhật vào lại localStorage
            localStorage.setItem("cart", JSON.stringify(gioHang));
            // Thông báo cho người dùng biết đã thêm thành công
            alert(`Đã thêm sản phẩm "${sanPhamChon.name}" vào giỏ hàng thành công!`);
        }