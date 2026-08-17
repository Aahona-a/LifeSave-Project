const API_BASE='/api';
function getToken(){return localStorage.getItem('lifesave_token')||''}
function setSession(token,user){localStorage.setItem('lifesave_token',token);localStorage.setItem('lifesave_user',JSON.stringify(user))}
function clearSession(){localStorage.removeItem('lifesave_token');localStorage.removeItem('lifesave_user')}
function getStoredUser(){try{return JSON.parse(localStorage.getItem('lifesave_user')||'null')}catch{return null}}
async function apiFetch(path,options={}){const headers={...(options.headers||{})};if(!(options.body instanceof FormData))headers['Content-Type']='application/json';const token=getToken();if(token)headers.Authorization=`Bearer ${token}`;const response=await fetch(`${API_BASE}${path}`,{...options,headers});let data={};try{data=await response.json()}catch{}if(!response.ok){if(response.status===401&&token)clearSession();throw new Error(data.message||'Request failed')}return data}
function showMessage(id,text,type='success'){const el=document.getElementById(id);if(!el)return;el.textContent=text;el.className=`message ${type}`}

function escapeHtml(value=''){return String(value).replace(/[&<>'\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[c]))}
