let contactForm = document.getElementById("contactForm");
contactForm.onsubmit = function(event) {
    // Ngăn trang tải lại khi gửi form
    event.preventDefault();
    // Lấy phần tử thông báo
    const successMessage = document.getElementById("successMessage");
    // Hiển thị thông báo thành công
    successMessage.style.display = "block";
    successMessage.textContent = "Gửi tin nhắn thành công!";
    // Hiển thị thông báo trong 3 giây rồi ẩn đi
    setTimeout(function() {
        successMessage.style.display = "none";
    }, 3000);
    // Xóa dữ liệu đã nhập
    contactForm.reset();
};