document.addEventListener('DOMContentLoaded',async()=>{
  if(!requireAuth())return;
  const $=id=>document.getElementById(id);
  try{
    const d=await apiFetch('/profile'),u=d.user;
    $('profileName').value=u.name||'';$('profilePhone').value=u.phone||'';$('profileGender').value=u.gender||'other';$('profileCity').value=u.city||'';$('profileDistrict').value=u.district||'';$('profileEmail').value=u.email||'';if(u.profile_image)$('profilePreview').src=u.profile_image;
  }catch(e){showMessage('message',e.message,'error')}
  $('profileForm').addEventListener('submit',async e=>{
    e.preventDefault();
    try{
      const d=await apiFetch('/profile',{method:'PUT',body:JSON.stringify({name:$('profileName').value,phone:$('profilePhone').value,gender:$('profileGender').value,city:$('profileCity').value,district:$('profileDistrict').value})});
      const old=getStoredUser();localStorage.setItem('lifesave_user',JSON.stringify({...old,...d.user,userId:d.user.user_id}));showMessage('message','Profile updated successfully');
    }catch(err){showMessage('message',err.message,'error')}
  });
  $('passwordForm').addEventListener('submit',async e=>{
    e.preventDefault();
    try{await apiFetch('/profile/password',{method:'PUT',body:JSON.stringify({currentPassword:$('currentPassword').value,newPassword:$('newPassword').value})});$('passwordForm').reset();showMessage('message','Password changed successfully')}catch(err){showMessage('message',err.message,'error')}
  });
  $('imageForm').addEventListener('submit',async e=>{
    e.preventDefault();const fd=new FormData();fd.append('profileImage',$('profileImage').files[0]);
    try{const d=await apiFetch('/profile/image',{method:'POST',body:fd});$('profilePreview').src=d.profileImage;showMessage('message','Profile image updated')}catch(err){showMessage('message',err.message,'error')}
  });
});
