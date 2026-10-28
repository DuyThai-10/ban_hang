
        // Thay vì khai báo mảng cứng, ta lấy từ localStorage (nếu chưa có thì tạo mới 12 sản phẩm mẫu)
        let danhSachSanPham = JSON.parse(localStorage.getItem("danhSachSanPham"));

        if (!danhSachSanPham) {
            danhSachSanPham = [
                {
                    id: 1,
                    brand: "Adidas",
                    name: "Áo thun Cotton Premium",
                    price: 350000,
                    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600",
                    description: "Áo thun cotton cao cấp, thấm hút mồ hôi cực tốt, thiết kế trẻ trung năng động."
                },
                {
                    id: 2,
                    brand: "Nike",
                    name: "Giày Sneaker Đỏ Nổi Bật",
                    price: 1250000,
                    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
                    description: "Giày thể thao Nike chính hãng, êm chân, phối màu đỏ cá tính và nổi bật."
                },
                {
                    id: 3,
                    brand: "Casio",
                    name: "Đồng hồ thông minh Unisex",
                    price: 890000,
                    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
                    description: "Đồng hồ thời trang phong cách hiện đại, chống nước tốt, phù hợp cho cả nam và nữ."
                },
                {
                    id: 4,
                    brand: "Sony",
                    name: "Tai nghe chống ồn Wireless",
                    price: 1500000,
                    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
                    description: "Tai nghe không dây âm thanh sống động, công nghệ chống ồn đỉnh cao."
                },
                {
                    id: 5,
                    brand: "Zara",
                    name: "Áo sơ mi nam công sở lịch lãm",
                    price: 420000,
                    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600",
                    description: "Áo sơ mi thiết kế form slim-fit tôn dáng, chất liệu ít nhăn, lịch sự khi đi làm."
                },
                {
                    id: 6,
                    brand: "Levi's",
                    name: "Quần Jean nam slim-fit",
                    price: 750000,
                    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600",
                    description: "Quần jean Denim bền bỉ, co giãn nhẹ, mang lại cảm giác thoải mái suốt cả ngày."
                },
                {
                    id: 7,
                    brand: "Uniqlo",
                    name: "Áo khoác dù chống nắng cao cấp",
                    price: 590000,
                    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600",
                    description: "Áo khoác nhẹ mỏng thoáng khí, cản gió và chống tia UV hiệu quả khi đi đường."
                },
                {
                    id: 8,
                    brand: "Mango",
                    name: "Đầm nữ dáng dài dạo phố",
                    price: 680000,
                    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600",
                    description: "Đầm thiết kế thanh lịch, nhẹ nhàng, rất thích hợp cho các buổi dạo phố hoặc dự tiệc nhẹ."
                },
                {
                    id: 9,
                    brand: "H&M",
                    name: "Áo polo nam thể thao thoáng mát",
                    price: 290000,
                    image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600",
                    description: "Áo polo lịch sự nhưng không kém phần năng động, dễ phối đồ với quần short hoặc jean."
                },
                {
                    id: 10,
                    brand: "Puma",
                    name: "Bộ đồ thể thao năng động",
                    price: 950000,
                    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600",
                    description: "Bộ trang phục thể thao co giãn 4 chiều, thích hợp cho việc tập gym hoặc chạy bộ."
                },
                {
                    id: 11,
                    brand: "Calvin Klein",
                    name: "Túi đeo chéo thời trang",
                    price: 550000,
                    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600",
                    description: "Túi đeo chéo nhỏ gọn, kiểu dáng hiện đại, đựng vừa điện thoại và các vật dụng cá nhân."
                },
                {
                    id: 12,
                    brand: "Converse",
                    name: "Mũ lưỡi trai cá tính",
                    price: 220000,
                    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600",
                    description: "Mũ lưỡi trai phong cách unisex, dễ điều chỉnh kích thước, bảo vệ bạn dưới nắng."
                }
            ];
            // Lưu mảng mặc định này vào localStorage ngay lần đầu tiên chạy
            localStorage.setItem("danhSachSanPham", JSON.stringify(danhSachSanPham));
        }

        // Bước 2: Lấy vị trí thẻ HTML có id là "productContainer" để chuẩn bị đổ dữ liệu vào
        const container = document.getElementById("productContainer");

        // Bước 3: Viết hàm dùng để hiển thị (render) danh sách sản phẩm lên trang web
        function hienThiSanPham() {
            let htmlContent = ""; // Biến lưu chuỗi HTML sẽ tạo ra

            // Dùng vòng lặp duyệt qua từng sản phẩm trong mảng danhSachSanPham ở trên
            danhSachSanPham.forEach(sp => {
                // Định dạng lại giá tiền có dấu chấm phân cách (Ví dụ: 350000 thành 350.000đ)
                let giaFormatted = sp.price.toLocaleString('vi-VN') + "đ";

                // Ghép từng khối HTML cho mỗi sản phẩm
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
                        <!-- Nút thêm vào giỏ hàng, gắn sự kiện onclick truyền vào ID của sản phẩm -->
                        <button onclick="themVaoGioHang(${sp.id})" class="cart-btn">
                            <i class="fa-solid fa-cart-shopping"></i>
                        </button>
                    </div>
                `;
            });

            // Đẩy toàn bộ chuỗi HTML vừa tạo vào bên trong thẻ chứa sản phẩm
            container.innerHTML = htmlContent;
        }

        // Bước 4: Viết hàm xử lý khi người dùng bấm nút "Thêm vào giỏ hàng"
        function themVaoGioHang(idSanPham) {
            // Kiểm tra xem người dùng đã đăng nhập chưa (dựa vào thông tin currentUser đã lưu lúc đăng nhập)
            const currentUser = JSON.parse(localStorage.getItem("currentUser"));
            
            if (!currentUser) {
                alert("Vui lòng đăng nhập trước khi thêm sản phẩm vào giỏ hàng!");
                window.location.href = "../LogIn/login.html"; // Chưa đăng nhập thì đá sang trang login
                return;
            }

            // Tìm sản phẩm trong mảng dựa vào idSanPham được bấm
            const sanPhamChon = danhSachSanPham.find(sp => sp.id === idSanPham);

            // Lấy danh sách giỏ hàng hiện tại trong localStorage (nếu chưa có thì tạo mảng trống [])
            let gioHang = JSON.parse(localStorage.getItem("cart")) || [];

            // Kiểm tra xem sản phẩm đó đã có trong giỏ hàng trước đó chưa
            const index = gioHang.findIndex(item => item.id === idSanPham);

            if (index !== -1) {
                // Nếu sản phẩm đã có trong giỏ rồi thì tăng số lượng lên 1
                gioHang[index].soLuong += 1;
            } else {
                // Nếu chưa có thì thêm sản phẩm mới vào giỏ hàng kèm số lượng mặc định là 1
                gioHang.push({
                    id: sanPhamChon.id,
                    name: sanPhamChon.name,
                    price: sanPhamChon.price,
                    image: sanPhamChon.image,
                    soLuong: 1
                });
            }

            // Lưu lại giỏ hàng mới vào localStorage
            localStorage.setItem("cart", JSON.stringify(gioHang));

            alert(`Đã thêm sản phẩm "${sanPhamChon.name}" vào giỏ hàng thành công!`);
        }

        // Gọi hàm hiển thị sản phẩm ngay khi trang vừa được tải xong
        hienThiSanPham();






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
    
    