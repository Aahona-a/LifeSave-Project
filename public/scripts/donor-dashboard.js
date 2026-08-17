function donationTable(rows){return rows.length?`<table><thead><tr><th>Date</th><th>Blood Group</th><th>Patient</th><th>Hospital</th><th>Units</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${escapeHtml(r.donation_date?.slice(0,10)||'')}</td><td>${escapeHtml(r.blood_group||'')}</td><td>${escapeHtml(r.patient_name||'Direct donation')}</td><td>${escapeHtml(r.hospital||'')}</td><td>${Number(r.units)}</td></tr>`).join('')}</tbody></table>`:'<p>No donation history yet.</p>'}
async function loadDonorDashboard(){
  const $=id=>document.getElementById(id);
  try{
    const me=await apiFetch('/donors/me');$('donorPanel').classList.toggle('hidden',!me.donor);$('becomePanel').classList.toggle('hidden',!!me.donor);
    if(me.donor){const d=me.donor;$('donorSummary').innerHTML=`<div class="stats-grid"><div class="stat-card"><strong>${escapeHtml(d.bloodGroup)}</strong>Blood Group</div><div class="stat-card"><strong>${d.isEligible?'Eligible':'Waiting'}</strong>${escapeHtml(d.status)}</div><div class="stat-card"><strong>${d.isAvailable?'Yes':'No'}</strong>Available</div></div>`;$('availabilityToggle').checked=d.isAvailable;$('lastDonationDate').value=d.lastDonation?String(d.lastDonation).slice(0,10):''}
    const hist=await apiFetch('/donations/mine');$('donationHistory').innerHTML=donationTable(hist.donations);
  }catch(e){showMessage('donorMessage',e.message,'error')}
}
document.addEventListener('DOMContentLoaded',()=>{
  if(!requireAuth())return;
  const $=id=>document.getElementById(id);
  $('availabilityToggle').addEventListener('change',async()=>{try{await apiFetch('/donors/availability',{method:'PATCH',body:JSON.stringify({isAvailable:$('availabilityToggle').checked})});showMessage('donorMessage','Availability updated');loadDonorDashboard()}catch(e){showMessage('donorMessage',e.message,'error')}});
  $('lastDonationForm').addEventListener('submit',async e=>{e.preventDefault();try{await apiFetch('/donors/last-donation',{method:'PATCH',body:JSON.stringify({lastDonation:$('lastDonationDate').value||null})});showMessage('donorMessage','Last donation updated');loadDonorDashboard()}catch(err){showMessage('donorMessage',err.message,'error')}});
  $('becomeForm').addEventListener('submit',async e=>{e.preventDefault();try{await apiFetch('/donors/become',{method:'POST',body:JSON.stringify({bloodGroup:$('bdBlood').value,age:Number($('bdAge').value),weight:Number($('bdWeight').value),location:$('bdLocation').value})});showMessage('donorMessage','Donor profile created');loadDonorDashboard()}catch(err){showMessage('donorMessage',err.message,'error')}});
  loadDonorDashboard();
});
