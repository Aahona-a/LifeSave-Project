function adminGuard(){const u=getStoredUser();if(!getToken()||u?.role!=='admin'){location.href='admin-login.html';return false}return true}
function renderUsers(users){return `<table><thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Action</th></tr></thead><tbody>${users.map(u=>`<tr><td>${Number(u.user_id)}</td><td>${escapeHtml(u.name)}</td><td>${escapeHtml(u.email)}</td><td>${escapeHtml(u.role)}</td><td>${escapeHtml(u.status)}</td><td>${u.role==='admin'?'—':`<button class="secondary-action status-btn" data-id="${Number(u.user_id)}" data-status="${u.status==='active'?'suspended':'active'}">${u.status==='active'?'Suspend':'Activate'}</button>`}</td></tr>`).join('')}</tbody></table>`}
function renderDonors(rows){return `<table><thead><tr><th>ID</th><th>Name</th><th>Blood</th><th>Location</th><th>Available</th><th>Action</th></tr></thead><tbody>${rows.map(d=>`<tr><td>${Number(d.donor_id)}</td><td>${escapeHtml(d.name)}</td><td>${escapeHtml(d.blood_group)}</td><td>${escapeHtml(d.location)}</td><td>${d.is_available?'Yes':'No'}</td><td><button class="secondary-action donor-status-btn" data-id="${Number(d.donor_id)}" data-next="${d.is_available?'false':'true'}">${d.is_available?'Disable':'Enable'}</button></td></tr>`).join('')}</tbody></table>`}
function renderRequests(rows){return `<table><thead><tr><th>ID</th><th>Patient</th><th>Blood</th><th>Hospital</th><th>Urgency</th><th>Status</th><th>Action</th></tr></thead><tbody>${rows.map(q=>`<tr><td>${Number(q.request_id)}</td><td>${escapeHtml(q.patient_name)}</td><td>${escapeHtml(q.blood_group)}</td><td>${escapeHtml(q.hospital)}</td><td>${escapeHtml(q.urgency)}</td><td>${escapeHtml(q.status)}</td><td><select class="request-status-select" data-id="${Number(q.request_id)}"><option ${q.status==='open'?'selected':''}>open</option><option ${q.status==='accepted'?'selected':''}>accepted</option><option ${q.status==='completed'?'selected':''}>completed</option><option ${q.status==='cancelled'?'selected':''}>cancelled</option></select></td></tr>`).join('')}</tbody></table>`}
async function loadAdmin(){
  const [a,u,d,r,rep]=await Promise.all([apiFetch('/admin/analytics'),apiFetch('/admin/users'),apiFetch('/admin/donors'),apiFetch('/admin/blood-requests'),apiFetch('/admin/reports')]);
  const x=a.analytics;
  document.getElementById('adminStats').innerHTML=`<div class="stat-card"><strong>${Number(x.users)}</strong>Users</div><div class="stat-card"><strong>${Number(x.donors)}</strong>Donors</div><div class="stat-card"><strong>${Number(x.availableDonors)}</strong>Available</div><div class="stat-card"><strong>${Number(x.donations)}</strong>Donations</div>`;
  document.getElementById('userTable').innerHTML=renderUsers(u.users);
  document.getElementById('donorTable').innerHTML=renderDonors(d.donors);
  document.getElementById('requestTable').innerHTML=renderRequests(r.requests);
  document.getElementById('reportContent').innerHTML=`<h3>Donors by Blood Group</h3><p>${rep.report.bloodGroups.map(b=>`${escapeHtml(b.blood_group)}: <strong>${Number(b.donors)}</strong>`).join(' • ')||'No donor data'}</p>`;
  document.querySelectorAll('.status-btn').forEach(b=>b.addEventListener('click',async()=>{await apiFetch(`/admin/users/${b.dataset.id}/status`,{method:'PATCH',body:JSON.stringify({status:b.dataset.status})});loadAdmin()}));
  document.querySelectorAll('.donor-status-btn').forEach(b=>b.addEventListener('click',async()=>{await apiFetch(`/admin/donors/${b.dataset.id}/availability`,{method:'PATCH',body:JSON.stringify({isAvailable:b.dataset.next==='true'})});loadAdmin()}));
  document.querySelectorAll('.request-status-select').forEach(s=>s.addEventListener('change',async()=>{await apiFetch(`/admin/blood-requests/${s.dataset.id}/status`,{method:'PATCH',body:JSON.stringify({status:s.value})});loadAdmin()}));
}
document.addEventListener('DOMContentLoaded',()=>{
  const form=document.getElementById('adminLoginForm');
  if(form){form.addEventListener('submit',async e=>{e.preventDefault();try{const d=await apiFetch('/admin/login',{method:'POST',body:JSON.stringify({email:document.getElementById('adminEmail').value,password:document.getElementById('adminPassword').value})});setSession(d.token,d.user);location.href='admin-dashboard.html'}catch(err){showMessage('message',err.message,'error')}});return}
  if(!adminGuard())return;
  document.getElementById('logoutBtn').addEventListener('click',()=>{clearSession();location.href='admin-login.html'});
  loadAdmin().catch(e=>alert(e.message));
});
