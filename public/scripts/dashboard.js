document.addEventListener('DOMContentLoaded',async()=>{
  if(!requireAuth())return;
  const user=getStoredUser();
  document.getElementById('welcomeName').textContent=`Welcome, ${user?.name||'LifeSave User'}`;
  try{
    const d=await apiFetch('/notifications');
    document.getElementById('notificationList').innerHTML=d.notifications.length?d.notifications.slice(0,5).map(n=>`<p><strong>${escapeHtml(n.title)}</strong><br>${escapeHtml(n.message)}</p>`).join(''):'No notifications yet.';
  }catch(e){document.getElementById('notificationList').textContent=e.message}
});
