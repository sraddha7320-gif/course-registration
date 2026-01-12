/// main.js - courses + registration

// localStorage helpers
function getUsers(){ return JSON.parse(localStorage.getItem('cca_users')||'[]'); }
function saveUsers(u){ localStorage.setItem('cca_users', JSON.stringify(u)); }
function setPending(course, fee){ localStorage.setItem('cca_pending', JSON.stringify({course, fee})); }
function getPending(){ return JSON.parse(localStorage.getItem('cca_pending') || 'null'); }

// Toggle details
document.querySelectorAll('.details-btn').forEach(btn=>{
  btn.addEventListener('click', () => {
    const card = btn.closest('.course-card');
    const details = card.querySelector('.course-details');
    details.classList.toggle('active');
    btn.textContent = details.classList.contains('active') ? 'Hide Details' : 'View Details';
    if(details.classList.contains('active')) details.scrollIntoView({behavior:'smooth', block:'start'});
  });
});

// Register redirect: set pending and go to register.html
document.querySelectorAll('.register-redirect').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const card = btn.closest('.course-card');
    const course = card.getAttribute('data-course');
    const fee = card.getAttribute('data-fee');
    setPending(course, fee);
    window.location.href = 'register.html';
  });
});

/* Registration page handling */
const registerForm = document.getElementById('registerForm');
if(registerForm){
  const pending = getPending();
  const courseSelect = document.getElementById('courseSelect');
  const selectedInfo = document.getElementById('selected-course');

  if(pending && courseSelect){
    const opts = Array.from(courseSelect.options);
    const found = opts.find(o => o.value === pending.course);
    if(found) courseSelect.value = pending.course;
    if(selectedInfo) selectedInfo.innerText = pending.course;
  }

  registerForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    const email = form.email.value.trim().toLowerCase();
    const phone = form.phone.value.trim();
    const password = form.password.value;
    const course = form.course.value;

    if(!name || !email || !password){
      alert('Please fill Name, Email and Password.');
      return;
    }

    const users = getUsers();
    const exists = users.find(u=>u.email === email);
    if(exists){
      exists.name = name; exists.phone = phone; exists.password = password; exists.course = course;
    } else {
      users.push({name,email,phone,password,course});
    }
    saveUsers(users);

    // Save pending fee if course selected
    if(course){
      const card = Array.from(document.querySelectorAll('.course-card')).find(c=>c.getAttribute('data-course') === course);
      const fee = card ? card.getAttribute('data-fee') : null;
      if(fee) setPending(course, fee);
    }

    localStorage.setItem('cca_registered', JSON.stringify({email}));
    window.location.href = 'login.html';
  });
}
