$(document).ready(function () {
  const token = localStorage.getItem('authToken');

  // Redirect to login if not authenticated
  if (!token && window.location.pathname === '/index.html') {
    window.location.href = 'login.html';
  }

  // Login form submission
  $('#loginForm').on('submit', function (e) {
    e.preventDefault();
    const email = $('#email').val();
    const password = $('#password').val();

    axios.post('http://localhost:5000/api/users/login', { email, password })
      .then(response => {
        localStorage.setItem('authToken', response.data.token);
        window.location.href = 'index.html';
      })
      .catch(error => {
        console.error(error);
        alert('Invalid credentials');
      });
  });

  // Register form submission
  $('#registerForm').on('submit', function (e) {
    e.preventDefault();
    const name = $('#name').val();
    const email = $('#email').val();
    const password = $('#password').val();

    axios.post('http://localhost:5000/api/users/register', { name, email, password })
      .then(response => {
        localStorage.setItem('authToken', response.data.token);
        window.location.href = 'index.html';
      })
      .catch(error => {
        console.error(error);
        alert('Error registering user');
      });
  });

  // Password reset form submission
  $('#resetPasswordForm').on('submit', function (e) {
    e.preventDefault();
    const email = $('#email').val();

    axios.post('http://localhost:5000/api/users/generateResetToken', { email })
      .then(response => {
        alert('Password reset link sent to your email');
      })
      .catch(error => {
        console.error(error);
        alert('Error sending reset link');
      });
  });

  // Fetch and display users
  if (token && window.location.pathname === '/index.html') {
    axios.get('http://localhost:5000/api/users', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        const users = response.data;
        let userTableContent = '';

        users.forEach(user => {
          userTableContent += `
            <tr>
              <td>${user.name}</td>
              <td>${user.email}</td>
              <td><button class="btn btn-primary view-user" data-id="${user._id}">View</button></td>
            </tr>
          `;
        });

        $('#userTable tbody').html(userTableContent);

        // Click event for viewing user details
        $('.view-user').on('click', function () {
          const userId = $(this).data('id');

          axios.get(`http://localhost:5000/api/users/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
            .then(response => {
              const user = response.data;
              const modalContent = `
                <p><strong>Name:</strong> ${user.name}</p>
                <p><strong>Email:</strong> ${user.email}</p>
              `;

              $('#modalBody').html(modalContent);
              $('#userModal').modal('show');
            })
            .catch(error => {
              console.error(error);
              alert('Error fetching user details');
            });
        });
      })
      .catch(error => {
        console.error(error);
        alert('Error fetching users');
      });

    // Logout
    $('#logout').on('click', function () {
      localStorage.removeItem('authToken');
      window.location.href = 'login.html';
    });
  }
});
