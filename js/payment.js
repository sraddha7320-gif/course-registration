// payment.js
const paymentForm = document.getElementById('paymentForm');
const payCourseEl = document.getElementById('payment-course');
const paymentMsg = document.querySelector('.payment-message');
const modal = document.getElementById('paymentModal');
const modalBody = document.getElementById('modalBody');
const modalOk = document.getElementById('modalOk');
const modalClose = document.getElementById('modalClose');

function renderPending(){
  const pending = JSON.parse(localStorage.getItem('cca_pending') || 'null');
  if(!pending){
    if(payCourseEl) payCourseEl.innerText = 'No course selected. Please register first.';
    if(paymentForm) paymentForm.style.display = 'none';
    return;
  }
  if(payCourseEl) payCourseEl.innerText = `Paying for: ${pending.course} — Amount: ₹${pending.fee}`;
  const payBtn = document.getElementById('payBtn');
  if(payBtn) payBtn.innerText = `Pay ₹${pending.fee}`;
}
renderPending();

function showModal(html){
  modalBody.innerHTML = html;
  modal.setAttribute('aria-hidden','false');
}
function hideModal(){ modal.setAttribute('aria-hidden','true'); }

if(modalOk) modalOk.addEventListener('click', hideModal);
if(modalClose) modalClose.addEventListener('click', hideModal);
modal.addEventListener('click', (e)=>{ if(e.target===modal) hideModal(); });

if(paymentForm){
  paymentForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    paymentMsg.textContent = 'Processing payment...';
    paymentMsg.style.color = '#0b63d6';

    setTimeout(()=>{
      const success = Math.random() < 0.9; // 90% success demo
      if(success){
        const pending = JSON.parse(localStorage.getItem('cca_pending') || 'null');
        const logged = JSON.parse(localStorage.getItem('cca_logged_in') || 'null') || JSON.parse(localStorage.getItem('cca_registered') || 'null');

        if(logged && pending){
          const enrollKey = 'cca_enrollments';
          const enrolls = JSON.parse(localStorage.getItem(enrollKey) || '[]');
          enrolls.push({ email: logged.email, course: pending.course, date: new Date().toISOString() });
          localStorage.setItem(enrollKey, JSON.stringify(enrolls));
        }

        localStorage.removeItem('cca_pending');

        showModal(`<h3 style="color:#00796b">Payment Successful</h3><p class="muted">Your transaction completed successfully.</p>`);
        modalOk.onclick = () => { hideModal(); window.location.href = 'congrats.html'; };
      } else {
        showModal(`<h3 style="color:#b91c1c">Payment Failed</h3><p class="muted">Transaction failed. Try again or choose another method.</p>`);
        modalOk.onclick = () => { hideModal(); };
      }
    }, 1200);
  });
}
