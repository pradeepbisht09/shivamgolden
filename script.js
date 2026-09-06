const ERP_API = (window.SGT_ERP_API || "http://localhost:3000").replace(/\/$/, "");

const trackingForm = document.getElementById("trackingForm");
const result = document.getElementById("trackResult");
const stationGrid = document.getElementById("stationGrid");
const branchGrid = document.getElementById("branchGrid");
const branchSearch = document.getElementById("branchSearch");

function formatDate(v){
  if(!v) return "-";
  const m=String(v).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if(m) return `${m[3]}/${m[2]}/${m[1]}`;
  const d=new Date(v);
  if(Number.isNaN(d.getTime())) return String(v);
  return String(d.getDate()).padStart(2,"0")+"/"+String(d.getMonth()+1).padStart(2,"0")+"/"+d.getFullYear();
}
function formatDateTime(v){
  if(!v) return "-";
  const d=new Date(v);
  if(Number.isNaN(d.getTime())) return String(v);
  return String(d.getDate()).padStart(2,"0")+"/"+String(d.getMonth()+1).padStart(2,"0")+"/"+d.getFullYear()+" "+String(d.getHours()).padStart(2,"0")+":"+String(d.getMinutes()).padStart(2,"0");
}
function escapeHtml(str){return String(str??"").replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));}

function renderStations(stations){
  if(!stationGrid) return;
  stationGrid.innerHTML = stations.length ? stations.map(s=>`<div class="station-chip"><span>●</span>${escapeHtml(s.name||s)}</div>`).join("") : `<p>No service stations available.</p>`;
}

let allBranches=[];
function renderBranches(items){
  if(!branchGrid) return;
  branchGrid.innerHTML = items.length ? items.map(b=>`<article class="branch-card">
    <div class="branch-icon">⌂</div>
    <div><h3>${escapeHtml(b.name||"Branch")}</h3>
    ${b.station?`<p><b>Station:</b> ${escapeHtml(b.station)}</p>`:""}
    ${b.address?`<p><b>Address:</b> ${escapeHtml(b.address)}</p>`:""}
    ${b.phone?`<p><b>Phone:</b> <a href="tel:${escapeHtml(b.phone)}">${escapeHtml(b.phone)}</a></p>`:""}
    </div></article>`).join("") : `<p>No branches found.</p>`;
}
function filterBranches(){
  const term=(branchSearch?.value||"").trim().toLowerCase();
  renderBranches(allBranches.filter(b=>`${b.name||""} ${b.station||""} ${b.address||""} ${b.phone||""}`.toLowerCase().includes(term)));
}

async function loadPublicConfig(){
  try{
    const r=await fetch(`${ERP_API}/api/public/config`,{cache:"no-store"});
    if(!r.ok) throw new Error("ERP public config unavailable");
    const data=await r.json();
    renderStations(Array.isArray(data.stations)?data.stations:[]);
    allBranches=Array.isArray(data.branches)?data.branches:[];
    renderBranches(allBranches);
  }catch(err){
    renderStations([]); allBranches=[]; renderBranches([]);
    if(branchGrid) branchGrid.innerHTML=`<p>Branches will load automatically when the ERP is online.</p>`;
  }
}

if(branchSearch) branchSearch.addEventListener("input",filterBranches);
loadPublicConfig();

trackingForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const value = document.getElementById("lrNumber").value.trim().toUpperCase();
  if(!value) return;
  result.classList.add("show");
  result.innerHTML = `<b>TRACKING...</b><br><small>Connecting to Shivam Golden Transport ERP.</small>`;
  try {
    const r = await fetch(`${ERP_API}/api/public/track/${encodeURIComponent(value)}`, {cache:"no-store"});
    const data = await r.json().catch(()=>({}));
    if(!r.ok) throw new Error(data.error || "Consignment not found");
    const history = Array.isArray(data.history) ? data.history : [];
    result.innerHTML = `<div class="live-track-result">
      <b>${escapeHtml(data.status || "Booked")}</b><br>
      LR / GR: ${escapeHtml(data.lrNo || value)}<br>
      ${escapeHtml(data.from || "-")} → ${escapeHtml(data.to || "-")}<br>
      Booking Date: ${formatDate(data.bookingDate)}<br>
      Packages: ${escapeHtml(String(data.packages ?? 0))} &nbsp; | &nbsp; Weight: ${escapeHtml(String(data.weight ?? 0))} kg
      ${data.vehicleNo ? `<br>Vehicle: ${escapeHtml(data.vehicleNo)}` : ""}
      <div class="tracking-history">${history.map(h=>`<div><strong>${escapeHtml(h.status||"")}</strong> — ${escapeHtml(h.location||"")}<br><small>${formatDateTime(h.changed_at)}${h.remarks?" • "+escapeHtml(h.remarks):""}</small></div>`).join("")}</div>
    </div>`;
  } catch (err) {
    result.innerHTML = `<b>Tracking unavailable</b><br><small>${escapeHtml(err.message || "Unable to connect to ERP")}</small>`;
  }
});

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
menuToggle.addEventListener("click", () => nav.classList.toggle("open"));
document.querySelectorAll(".nav a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));

const contactForm = document.getElementById("contactForm");
const contactStatus = document.getElementById("contactStatus");
contactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(contactForm);
  const subject = encodeURIComponent(`Transport Enquiry - ${data.get("name")}`);
  const body = encodeURIComponent(`Name: ${data.get("name")}\nPhone: ${data.get("phone")}\nCompany: ${data.get("company") || "-"}\nRequirement: ${data.get("message")}`);
  window.location.href = `mailto:info@shivamgoldentransport.com?subject=${subject}&body=${body}`;
  contactStatus.textContent = "Your email app should open with the enquiry ready to send.";
  contactStatus.classList.add("ok");
});

const sections = document.querySelectorAll("section[id]");
const links = document.querySelectorAll(".nav a");
const observer = new IntersectionObserver(entries => entries.forEach(entry => { if(entry.isIntersecting) links.forEach(l=>l.classList.toggle("active",l.getAttribute("href")===`#${entry.target.id}`)); }), {rootMargin:"-40% 0px -50% 0px"});
sections.forEach(s=>observer.observe(s));
