
    function togglePassword() {
      const input = document.getElementById('loginPassword');
      const icon = document.getElementById('eyeIcon');

      if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fas fa-eye-slash';
      } else {
        input.type = 'password';
        icon.className = 'fas fa-eye';
      }
    }

    document.getElementById('loginForm').addEventListener('submit', function (e) {
      e.preventDefault();

      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value.trim();

      if (!email.endsWith('@fpt.com')) {
        alert('Chỉ chấp nhận email @fpt.com');
        return;
      }

      if (!password) {
        alert('Vui lòng nhập mật khẩu');
        return;
      }

      alert('Đăng nhập demo thành công!');
    });
