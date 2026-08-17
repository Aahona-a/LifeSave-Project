function eligibilityFromDate(lastDonationDate, gender) {
  if (!lastDonationDate) return { eligible: true, status: 'Available', remainingDays: 0 };
  const last = new Date(lastDonationDate);
  const today = new Date();
  const elapsed = Math.max(0, Math.floor((today - last) / 86400000));
  const requiredDays = gender === 'female' ? 120 : 90;
  const remainingDays = Math.max(0, requiredDays - elapsed);
  return remainingDays === 0 ? { eligible: true, status: 'Available', remainingDays: 0 } : { eligible: false, status: `Eligible in ${remainingDays} days`, remainingDays };
}
function haversine(lat1, lon1, lat2, lon2) {
  if ([lat1, lon1, lat2, lon2].some(v => v === null || v === undefined || Number.isNaN(Number(v)))) return null;
  const toRad = d => Number(d) * Math.PI / 180;
  const dLat = toRad(Number(lat2) - Number(lat1));
  const dLon = toRad(Number(lon2) - Number(lon1));
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
function maskPhone(phone = '') {
  return phone.length >= 11 ? `${phone.slice(0, 3)}******${phone.slice(-2)}` : 'Protected';
}
module.exports = { eligibilityFromDate, haversine, maskPhone };
