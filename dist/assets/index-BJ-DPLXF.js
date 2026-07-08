const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/index-CaZnEEKT.js","assets/index-CPSgxc7X.css"])))=>i.map(i=>d[i]);
import{_ as I,p as A,a as F}from"./index-CaZnEEKT.js";let P=!1,B=!1;function Q(){return P}function S(e){P=e}function V(){return B}function z(e){B=e}function C(e,t,o){var a;const r=document.getElementById(`modal-${e}`);r&&r.remove();const n=document.createElement("div");n.id=`modal-${e}`,n.style.cssText=`
        position:fixed;top:0;left:0;right:0;bottom:0;
        background:rgba(0,0,0,0.6);
        display:flex;align-items:center;justify-content:center;
        z-index:1000;
        backdrop-filter:blur(4px);
        animation:fadeIn 0.2s ease;
    `;const d=document.createElement("div");d.style.cssText=`
        background:var(--bg-primary);
        border-radius:24px;
        max-width:500px;
        width:90%;
        max-height:90vh;
        overflow-y:auto;
        padding:24px;
        box-shadow:0 20px 60px rgba(0,0,0,0.3);
        border:1px solid var(--glass-border);
        animation:slideUp 0.3s ease;
    `,d.innerHTML=`
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
            <h2 style="font-size:20px;font-weight:700;margin:0;">${t}</h2>
            <button id="closeModalBtn" style="background:none;border:none;font-size:24px;cursor:pointer;color:var(--text-muted);padding:4px 8px;">✕</button>
        </div>
        <div>${o}</div>
    `,n.appendChild(d),document.body.appendChild(n),(a=document.getElementById("closeModalBtn"))==null||a.addEventListener("click",()=>{p(e)}),n.addEventListener("click",s=>{s.target===n&&p(e)});const i=s=>{s.key==="Escape"&&(p(e),document.removeEventListener("keydown",i))};document.addEventListener("keydown",i)}function p(e){const t=document.getElementById(`modal-${e}`);t&&t.remove(),e==="entryModal"&&S(!1),e==="exitModal"&&z(!1)}let c=null;function T(e,t="success"){const o=document.getElementById("app");if(!o)return;const r={success:"rgba(0,255,136,0.08)",error:"rgba(255,45,85,0.08)",warning:"rgba(255,107,53,0.08)",info:"rgba(0,212,255,0.08)"},n={success:"rgba(0,255,136,0.15)",error:"rgba(255,45,85,0.15)",warning:"rgba(255,107,53,0.15)",info:"rgba(0,212,255,0.15)"},d={success:"var(--accent)",error:"var(--danger)",warning:"var(--warning)",info:"var(--secondary)"},i=document.getElementById("toast-message");i&&(i.remove(),c&&(clearTimeout(c),c=null));const a=document.createElement("div");a.id="toast-message",a.style.cssText=`
        position:fixed;bottom:100px;left:50%;transform:translateX(-50%);
        padding:16px 24px;border-radius:16px;
        background:${r[t]||r.success};
        border:1px solid ${n[t]||n.success};
        color:${d[t]||d.success};
        font-weight:500;font-size:14px;
        z-index:9999;max-width:90%;
        text-align:center;
        animation:slideUp 0.3s ease;
    `,a.textContent=e,o.appendChild(a),c=setTimeout(()=>{a.style.opacity="0",a.style.transition="opacity 0.3s ease",setTimeout(()=>{a.remove(),c=null},300)},3e3)}function D(){const t=`today_count_${new Date().toDateString()}`,o=parseInt(localStorage.getItem(t)||"0");localStorage.setItem(t,String(o+1)),y()}function M(){const t=`today_count_${new Date().toDateString()}`,o=parseInt(localStorage.getItem(t)||"0");o>0&&localStorage.setItem(t,String(o-1)),y()}function y(){const t=`today_count_${new Date().toDateString()}`,o=parseInt(localStorage.getItem(t)||"0"),r=document.getElementById("todayCount");r&&(r.textContent=o)}function _(e){const t=document.getElementById("activeCount");t&&(t.textContent=e)}async function x(){y();try{const{getDashboard:e}=await I(async()=>{const{getDashboard:o}=await import("./index-CaZnEEKT.js").then(r=>r.b);return{getDashboard:o}},__vite__mapDeps([0,1])),t=await e();t&&t.activeSessions!==void 0&&_(t.activeSessions)}catch(e){e.message&&!e.message.includes("401")&&!e.message.includes("Session expired")&&console.warn("Failed to fetch dashboard data:",e.message)}}const O=Object.freeze(Object.defineProperty({__proto__:null,decrementTodayCount:M,incrementTodayCount:D,refreshData:x,updateActiveSessions:_,updateTodayCountDisplay:y},Symbol.toStringTag,{value:"Module"}));function q(e){if(!e||e.length<3)return{valid:!1,error:"License plate or QR code is required"};const t=e.toUpperCase().trim();return/^[A-Z0-9]+(-[A-Z0-9]+)+$/.test(t)?{valid:!0,value:t,type:"qr"}:/^[A-Z]{3}\d{3}[A-Z]?$/.test(t.replace(/\s/g,""))?{valid:!0,value:t,type:"plate"}:{valid:!1,error:"Invalid format. Use: KDG832A or a valid QR code"}}function U(e){if(!e)return{valid:!1,error:"Phone number is required"};const t=e.replace(/\s/g,"");return/^(?:\+254|254|0)(7\d{8}|1\d{8})$/.test(t)?{valid:!0,value:t}:{valid:!1,error:"Invalid phone format. Use: 0712345678 or +254712345678"}}function j(e){return!e||e.length<2?{valid:!1,error:"Driver name is required"}:{valid:!0,value:e.trim()}}function Z(e){const t=[],o=q(e.plate);o.valid||t.push(o.error);const r=j(e.driver);r.valid||t.push(r.error);const n=U(e.phone);return n.valid||t.push(n.error),{valid:t.length===0,errors:t,data:{plate:o.valid?o.value:e.plate,driver:r.valid?r.value:e.driver,phone:n.valid?n.value:e.phone,type:o.type||"plate"}}}function G(){var t;if(Q())return;S(!0),C("entryModal","🟦 New Entry",`
        <form id="entryForm">
            <div style="margin-bottom:12px;">
                <label style="font-size:12px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;display:block;margin-bottom:4px;">
                    License Plate or QR Code *
                </label>
                <input type="text" id="entryPlate" placeholder="e.g. KDG832A or TEST-QR-123" style="text-transform:uppercase;width:100%;padding:12px 16px;border-radius:16px;border:1px solid var(--glass-border);background:var(--glass-bg);color:var(--text-primary);font-size:16px;">
                <div style="font-size:11px;color:var(--text-muted);margin-top:4px;">Format: KDG832A (plate) or TEST-QR-123 (QR code)</div>
            </div>
            <div style="margin-bottom:12px;">
                <label style="font-size:12px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;display:block;margin-bottom:4px;">Driver Name *</label>
                <input type="text" id="entryDriver" placeholder="Full name" style="width:100%;padding:12px 16px;border-radius:16px;border:1px solid var(--glass-border);background:var(--glass-bg);color:var(--text-primary);font-size:16px;">
            </div>
            <div style="margin-bottom:12px;">
                <label style="font-size:12px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;display:block;margin-bottom:4px;">Phone Number *</label>
                <input type="tel" id="entryPhone" placeholder="e.g. 0712345678" style="width:100%;padding:12px 16px;border-radius:16px;border:1px solid var(--glass-border);background:var(--glass-bg);color:var(--text-primary);font-size:16px;">
                <div style="font-size:11px;color:var(--text-muted);margin-top:4px;">Format: 0712345678 or +254712345678</div>
            </div>
            <div style="margin-bottom:12px;">
                <label style="font-size:12px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;display:block;margin-bottom:4px;">Vehicle Type</label>
                <select id="entryVehicleType" style="width:100%;padding:12px 16px;border-radius:16px;border:1px solid var(--glass-border);background:var(--glass-bg);color:var(--text-primary);font-size:16px;">
                    <option value="Sedan">🚗 Sedan</option>
                    <option value="SUV/4x4">🚙 SUV/4x4</option>
                    <option value="Pickup">🛻 Pickup</option>
                    <option value="Motorbike">🏍️ Motorbike</option>
                    <option value="Matatu">🚐 Matatu</option>
                    <option value="Bus">🚌 Bus</option>
                    <option value="Bicycle">🚲 Bicycle</option>
                    <option value="Other">🚘 Other</option>
                </select>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px;">
                <label style="display:flex;align-items:center;gap:8px;font-size:14px;cursor:pointer;">
                    <input type="checkbox" id="entryVIP"> ⭐ VIP
                </label>
                <label style="display:flex;align-items:center;gap:8px;font-size:14px;cursor:pointer;">
                    <input type="checkbox" id="entryStaff"> 👤 Staff
                </label>
            </div>
            <button type="submit" class="btn-primary" style="padding:16px;font-size:18px;">✅ Check In</button>
            <div id="entryError" style="display:none;padding:12px;border-radius:12px;margin-top:12px;background:rgba(255,45,85,0.1);color:var(--danger);font-size:14px;"></div>
        </form>
    `),(t=document.getElementById("entryForm"))==null||t.addEventListener("submit",async o=>{o.preventDefault(),await K()})}async function K(){var m,g,v,b,f,h,E,k,w;const e=(g=(m=document.getElementById("entryPlate"))==null?void 0:m.value)==null?void 0:g.trim(),t=(b=(v=document.getElementById("entryDriver"))==null?void 0:v.value)==null?void 0:b.trim(),o=(h=(f=document.getElementById("entryPhone"))==null?void 0:f.value)==null?void 0:h.trim(),r=((E=document.getElementById("entryVehicleType"))==null?void 0:E.value)||"Sedan",n=((k=document.getElementById("entryVIP"))==null?void 0:k.checked)||!1,d=((w=document.getElementById("entryStaff"))==null?void 0:w.checked)||!1,i=document.getElementById("entryError"),a=Z({plate:e,driver:t,phone:o});if(!a.valid){i.textContent=`❌ ${a.errors.join(`
`)}`,i.style.display="block";return}i.style.display="none";const{plate:s,driver:R,phone:$}=a.data,L=s;try{const u=document.querySelector("#entryForm .btn-primary");u.textContent="⏳ Saving...",u.disabled=!0;const l=await A(L,"gate-a","test-org",{vehicle:{licensePlate:s,type:r},driver:{name:R,phone:$},isVIP:n,isStaff:d,locationId:"church_a",credentialType:a.data.type||"plate"});if(l.success)D(),p("entryModal"),T(`✅ ${s} checked in successfully!`,"success"),await x();else throw new Error(l.error||"Entry failed")}catch(u){i.textContent=`❌ ${u.message}`,i.style.display="block";const l=document.querySelector("#entryForm .btn-primary");l.textContent="✅ Check In",l.disabled=!1}}function N(e){if(!e||e.length<3)return{valid:!1,error:"License plate or QR code is required"};const t=e.toUpperCase().trim();return/^[A-Z0-9]+(-[A-Z0-9]+)+$/.test(t)?{valid:!0,value:t,type:"qr"}:/^[A-Z]{3}\d{3}[A-Z]?$/.test(t.replace(/\s/g,""))?{valid:!0,value:t,type:"plate"}:{valid:!1,error:"Invalid format. Use: KDG832A or a valid QR code"}}function H(e){const t=[],o=N(e.plate);return o.valid||t.push(o.error),{valid:t.length===0,errors:t,data:{plate:o.valid?o.value:e.plate,type:o.type||"plate"}}}function W(){var t;if(V())return;z(!0),C("exitModal","🚗 Vehicle Exit",`
        <form id="exitForm">
            <div style="margin-bottom:16px;">
                <label style="font-size:12px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;display:block;margin-bottom:4px;">
                    License Plate or QR Code *
                </label>
                <input type="text" id="exitPlate" placeholder="e.g. KDG832A or TEST-QR-123" style="text-transform:uppercase;width:100%;padding:12px 16px;border-radius:16px;border:1px solid var(--glass-border);background:var(--glass-bg);color:var(--text-primary);font-size:16px;">
                <div style="font-size:11px;color:var(--text-muted);margin-top:4px;">Format: KDG832A (plate) or TEST-QR-123 (QR code)</div>
            </div>
            <div style="background:rgba(255,165,0,0.1);border:1px solid var(--warning);border-radius:12px;padding:12px;margin-bottom:16px;color:var(--text-muted);font-size:14px;">
                ⚠️ This will process the exit for the vehicle. Please confirm the vehicle is leaving.
            </div>
            <button type="submit" class="btn-danger" style="padding:16px;font-size:18px;width:100%;border:none;border-radius:16px;background:var(--danger);color:white;font-weight:600;cursor:pointer;">🚗 Process Exit</button>
            <div id="exitError" style="display:none;padding:12px;border-radius:12px;margin-top:12px;background:rgba(255,45,85,0.1);color:var(--danger);font-size:14px;"></div>
        </form>
    `),(t=document.getElementById("exitForm"))==null||t.addEventListener("submit",async o=>{o.preventDefault(),await X()})}async function X(){var d,i;const e=(i=(d=document.getElementById("exitPlate"))==null?void 0:d.value)==null?void 0:i.trim(),t=document.getElementById("exitError"),o=H({plate:e});if(!o.valid){t.textContent=`❌ ${o.errors.join(`
`)}`,t.style.display="block";return}t.style.display="none";const{plate:r}=o.data,n=r;try{const a=document.querySelector("#exitForm .btn-danger");a.textContent="⏳ Processing...",a.disabled=!0;const s=await F(n,"gate-a","test-org",{locationId:"church_a",credentialType:o.data.type||"plate"});if(s.success)M(),p("exitModal"),T(`✅ ${r} exited successfully!`,"success"),await x();else throw new Error(s.error||"Exit failed")}catch(a){t.textContent=`❌ ${a.message}`,t.style.display="block";const s=document.querySelector("#exitForm .btn-danger");s.textContent="🚗 Process Exit",s.disabled=!1}}function Y(e){var t,o,r;e.innerHTML=`
        <div style="padding:20px;max-width:1200px;margin:0 auto;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
                <h1 style="font-size:24px;font-weight:700;">🚗 Parking Yetu</h1>
                <div style="display:flex;gap:10px;">
                    <button id="entryButton" class="btn-primary" style="padding:10px 20px;border-radius:12px;border:none;background:var(--primary);color:white;font-weight:600;cursor:pointer;font-size:14px;">📥 Entry</button>
                    <button id="exitButton" class="btn-danger" style="padding:10px 20px;border-radius:12px;border:none;background:var(--danger);color:white;font-weight:600;cursor:pointer;font-size:14px;">📤 Exit</button>
                    <button id="logoutButton" class="btn-secondary" style="padding:10px 20px;border-radius:12px;border:1px solid var(--glass-border);background:var(--glass-bg);color:var(--text-primary);cursor:pointer;font-size:14px;">🚪 Logout</button>
                </div>
            </div>
            
            <div id="statsContainer" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;margin-bottom:20px;">
                <div class="stat-card" style="padding:16px;border-radius:16px;border:1px solid var(--glass-border);background:var(--glass-bg);">
                    <div style="font-size:12px;color:var(--text-muted);">Today's Entries</div>
                    <div id="todayCount" style="font-size:32px;font-weight:700;">0</div>
                </div>
                <div class="stat-card" style="padding:16px;border-radius:16px;border:1px solid var(--glass-border);background:var(--glass-bg);">
                    <div style="font-size:12px;color:var(--text-muted);">Active Sessions</div>
                    <div id="activeCount" style="font-size:32px;font-weight:700;">0</div>
                </div>
            </div>
            
            <div id="activityFeed" style="border-radius:16px;border:1px solid var(--glass-border);background:var(--glass-bg);padding:16px;min-height:200px;">
                <h3 style="margin-bottom:12px;">📋 Recent Activity</h3>
                <div id="activityList" style="display:flex;flex-direction:column;gap:8px;">
                    <div style="color:var(--text-muted);text-align:center;padding:20px;">No recent activity</div>
                </div>
            </div>
        </div>
    `,(t=document.getElementById("entryButton"))==null||t.addEventListener("click",G),(o=document.getElementById("exitButton"))==null||o.addEventListener("click",W),(r=document.getElementById("logoutButton"))==null||r.addEventListener("click",()=>{var n;(n=window.handleLogout)==null||n.call(window)}),I(()=>Promise.resolve().then(()=>O),void 0).then(n=>{n.refreshData()})}console.log("✅ workstation/index.js loaded");function ee(){console.log("✅ initWorkstation() called");var e=document.getElementById("app");e&&Y(e)}export{ee as default};
//# sourceMappingURL=index-BJ-DPLXF.js.map
