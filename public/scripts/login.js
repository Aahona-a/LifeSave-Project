document.addEventListener('DOMContentLoaded',()=>{
  if(getToken()){location.href='dashboard.html';return}
  const form=document.getElementById('loginForm');
  const email=document.getElementById('loginEmail');
  const password=document.getElementById('loginPassword');
  form.addEventListener('submit',async e=>{
    e.preventDefault();
    try{
      const d=await apiFetch('/auth/login',{method:'POST',body:JSON.stringify({email:email.value,password:password.value})});
      setSession(d.token,d.user);
      location.href=d.user.role==='admin'?'admin-dashboard.html':'dashboard.html';
    }catch(err){showMessage('message',err.message,'error')}
  });
});
