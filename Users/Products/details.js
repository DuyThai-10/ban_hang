function hienThiSanPham(ds) {
    const container = document.getElementById("productContainer");

    if (!container) return;

    let htmlContent = "";

    ds.forEach(sp => {
        let giaFormatted = sp.price.toLocaleString("vi-VN") + "đ";

        htmlContent += `
            <div class="pro" onclick="xemChiTiet(${sp.id})">

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

                <button
                    onclick="event.stopPropagation(); themVaoGioHang(${sp.id})"
                    class="cart-btn"
                    title="Thêm vào giỏ hàng"
                >
                    <i class="fa-solid fa-cart-shopping"></i>
                </button>

            </div>
        `;
    });

    container.innerHTML = htmlContent;
}

// Chuyển sang trang chi tiết của sản phẩm được chọn
function xemChiTiet(idSanPham) {
    window.location.href = `details.html?id=${idSanPham}`;
}