function requestCard(r,accept=true){return `<article class="request-card ${escapeHtml(r.urgency)}"><h3>${escapeHtml(r.blood_group)} • ${escapeHtml(r.patient_name)}</h3><p><strong>${Number(r.units)} unit(s)</strong> • ${escapeHtml(String(r.urgency).toUpperCase())}</p><p>🏥 ${escapeHtml(r.hospital)}</p><p>📍 ${escapeHtml(r.location)}</p><p>⏰ ${escapeHtml(new Date(r.needed_at).toLocaleString())}</p><p>Status: <strong>${escapeHtml(r.status)}</strong></p>${accept&&r.status==='open'?`<button class="secondary-action accept-btn" data-id="${Number(r.request_id)}">Accept Request</button>`:''}</article>`}
async function refreshRequests(){
  const openBox=document.getElementById('openRequests');
  const mineBox=document.getElementById('myRequests');
  try{
    const open=await apiFetch('/blood-requests/open');openBox.innerHTML=open.requests.map(r=>requestCard(r,true)).join('')||'<p>No open requests.</p>';
    document.querySelectorAll('.accept-btn').forEach(b=>b.addEventListener('click',async()=>{try{await apiFetch(`/blood-requests/${b.dataset.id}/accept`,{method:'POST'});showMessage('message','Request accepted');refreshRequests()}catch(e){showMessage('message',e.message,'error')}}));
    const mine=await apiFetch('/blood-requests/mine');mineBox.innerHTML=mine.requests.map(r=>requestCard(r,false)).join('')||'<p>You have not posted any requests.</p>';
  }catch(e){showMessage('message',e.message,'error')}
}
document.addEventListener('DOMContentLoaded',()=>{
  if(!requireAuth())return;
  const $=id=>document.getElementById(id);
  $('requestForm').addEventListener('submit',async e=>{
    e.preventDefault();
    try{
      await apiFetch('/blood-requests',{method:'POST',body:JSON.stringify({patientName:$('patientName').value,bloodGroup:$('requestBloodGroup').value,units:Number($('units').value),hospital:$('hospital').value,location:$('requestLocation').value,neededAt:new Date($('neededAt').value).toISOString(),urgency:$('urgency').value,contactPhone:$('contactPhone').value,notes:$('notes').value})});
      $('requestForm').reset();showMessage('message','Blood request posted');refreshRequests();
    }catch(err){showMessage('message',err.message,'error')}
  });
  refreshRequests();
});
