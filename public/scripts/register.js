document.addEventListener('DOMContentLoaded',()=>{
  const form=document.getElementById('registerForm');
  const donorToggle=document.getElementById('isDonor');
  const donorFields=document.getElementById('donorFields');
  donorToggle.addEventListener('change',()=>donorFields.classList.toggle('hidden',!donorToggle.checked));
  form.addEventListener('submit',async e=>{
    e.preventDefault();
    const donor=donorToggle.checked;
    const age=Number(document.getElementById('age').value);
    const weight=Number(document.getElementById('weight').value);
    if(donor&&(age<18||age>65||weight<50)){showMessage('message','Donor registration requires age 18-65 and weight at least 50 kg.','error');return}
    const body={
      name:document.getElementById('name').value,
      email:document.getElementById('email').value,
      phone:document.getElementById('phone').value,
      gender:document.getElementById('gender').value,
      password:document.getElementById('password').value,
      isDonor:donor
    };
    if(donor)Object.assign(body,{age,weight,bloodGroup:document.getElementById('bloodGroupReg').value,location:document.getElementById('regLocation').value,lastDonation:document.getElementById('lastDonation').value||null});
    try{const d=await apiFetch('/auth/register',{method:'POST',body:JSON.stringify(body)});setSession(d.token,d.user);location.href='dashboard.html'}catch(err){showMessage('message',err.message,'error')}
  });
});
