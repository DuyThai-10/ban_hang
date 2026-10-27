
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
   