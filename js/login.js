const loginForm = document.getElementById('loginForm');
if(loginForm){
  loginForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const email = loginForm.email.value.trim().toLowerCase();
    const password = loginForm.password.value;

    const users = JSON.parse(localStorage.getItem('cca_users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    const msg = document.getElementById('login-msg');
    if(user){
      localStorage.setItem('cca_logged_in', JSON.stringify({email:user.email, name:user.name}));
      if(msg){ msg.textContent = 'Login successful. Redirecting...'; msg.style.color = '#00796b'; }
      setTimeout(()=>{
        const pending = JSON.parse(localStorage.getItem('cca_pending') || 'null');
        if(pending) window.location.href = 'payment.html'; else window.location.href = 'courses.html';
      }, 900);
    } else {
      if(msg){ msg.textContent = 'Invalid credentials. Try again.'; msg.style.color = 'red'; }
    }
  });
}
