const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/index-DZPozdaT.js","assets/index-CI_ZyYGx.css"])))=>i.map(i=>d[i]);
import{g as z,a as xt,c as u,_ as rt}from"./index-DZPozdaT.js";import{serverTimestamp as x,doc as h,collection as w,setDoc as ct,getDoc as pt,query as L,where as D,getDocs as N,updateDoc as ut,orderBy as ot,limit as ht,deleteDoc as bt,addDoc as wt}from"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";import"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";import"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";import"https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";let c={isEntryModalOpen:!1,isKnownVehicleModalOpen:!1,isScannerActive:!1,knownVehicleData:null,scannerSessionData:null};if(!document.getElementById("workstation-modals-style")){const e=document.createElement("style");e.id="workstation-modals-style",e.textContent=`
        @keyframes slideUp {
            from { opacity: 0; transform: translateX(-50%) translateY(20px); }
            to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .modal-close {
            background: transparent;
            border: none;
            color: var(--text-secondary);
            font-size: 24px;
            cursor: pointer;
            min-height: auto;
            width: auto;
            padding: 4px 8px;
        }
        .modal-close:hover {
            color: var(--text-primary);
        }
    `,document.head.appendChild(e)}function kt(){return c.isEntryModalOpen}function It(){return c.isKnownVehicleModalOpen}function Et(){return c.isScannerActive}function Dt(){return c.knownVehicleData}function Pt(){return c.scannerSessionData}function zt(e){c.isEntryModalOpen=e}function Tt(e){c.isKnownVehicleModalOpen=e}function At(e){c.isScannerActive=e}function Bt(e){c.knownVehicleData=e}function Ct(e){c.scannerSessionData=e}function X(e,t,n,i=null){var o;if(document.getElementById(e))return document.getElementById(e);const r=document.createElement("div");return r.id=e,r.style.cssText=`
        position:fixed;top:0;left:0;right:0;bottom:0;
        background:rgba(0,0,0,0.7);backdrop-filter:blur(8px);
        z-index:1000;display:flex;align-items:center;justify-content:center;
        padding:20px;animation:fadeIn 0.3s ease;
    `,r.innerHTML=`
        <div style="background:var(--bg-secondary);border-radius:32px;padding:32px;max-width:480px;width:100%;border:1px solid var(--glass-border);max-height:90vh;overflow-y:auto;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
                <h3 style="font-family:Orbitron,monospace;font-size:20px;">${t}</h3>
                <button class="modal-close" data-modal-id="${e}">✕</button>
            </div>
            ${n}
        </div>
    `,document.body.appendChild(r),(o=r.querySelector(".modal-close"))==null||o.addEventListener("click",()=>{P(e)}),r.addEventListener("click",a=>{a.target===r&&P(e)}),setTimeout(()=>{const a=r.querySelector("input");a&&a.focus()},100),r}function P(e){const t=document.getElementById(e);switch(t&&t.remove(),e){case"entryModal":c.isEntryModalOpen=!1;break;case"knownVehicleModal":c.isKnownVehicleModalOpen=!1,c.knownVehicleData=null;break;case"scannerModal":c.isScannerActive=!1,c.scannerSessionData=null;break}}class _{constructor({id:t,licensePlate:n,make:i,model:r,color:o,type:a,organizationId:s,blacklisted:l,ownerId:d}){this.id=t||null,this.licensePlate=(n==null?void 0:n.toUpperCase())||"",this.make=i||"",this.model=r||"",this.color=o||"",this.type=a||"Sedan",this.organizationId=s||"org_church_a",this.blacklisted=l||!1,this.blacklistReason="",this.ownerId=d||"",this.createdAt=new Date,this.updatedAt=new Date}generateId(){return"veh_"+Date.now()+"_"+Math.random().toString(36).substring(2,6)}isValidPlate(){return/^[A-Z]{3}\d{3}[A-Z]?$/.test(this.licensePlate.replace(/\s/g,""))}getDisplayName(){return this.licensePlate+(this.make?` (${this.make} ${this.model})`:"")}createSnapshot(){return{plate:this.licensePlate,make:this.make,model:this.model,type:this.type,color:this.color}}toPlain(){return{id:this.id,licensePlate:this.licensePlate,make:this.make,model:this.model,color:this.color,type:this.type,organizationId:this.organizationId,blacklisted:this.blacklisted,blacklistReason:this.blacklistReason,ownerId:this.ownerId,createdAt:this.createdAt,updatedAt:this.updatedAt}}static fromPlain(t){const n=new _({id:t.id,licensePlate:t.licensePlate,make:t.make,model:t.model,color:t.color,type:t.type,organizationId:t.organizationId,blacklisted:t.blacklisted||!1,ownerId:t.ownerId});return n.blacklistReason=t.blacklistReason||"",n.createdAt=t.createdAt||new Date,n.updatedAt=t.updatedAt||new Date,n}}class O{constructor({id:t,vehicleId:n,vehiclePlate:i,driverName:r,driverPhone:o,gate:a,locationId:s,organizationId:l,status:d,entryTime:g}){this.id=t||null,this.vehicleId=n,this.vehiclePlate=i||"",this.driverName=r||"",this.driverPhone=o||"",this.gate=a||"Gate A",this.locationId=s||"church_a",this.organizationId=l||"org_church_a",this.status=d||"PARKED",this.entryTime=g||new Date,this.exitTime=null,this.exitGate=null,this.duration=0,this.isVIP=!1,this.isStaff=!1,this.notes=[],this.correlationId=this.generateCorrelationId(),this.createdAt=new Date,this.updatedAt=new Date}generateCorrelationId(){return"corr_"+Date.now()+"_"+Math.random().toString(36).substring(2,10)}isActive(){return this.status==="PARKED"}isOverdue(t=180){return this.isActive()?this.getDuration()>t:!1}getDuration(){return this.status==="EXITED"?this.duration:Math.floor((Date.now()-this.entryTime.getTime())/6e4)}getDurationText(){const t=this.getDuration(),n=Math.floor(t/60),i=t%60;return n>0?`${n}h ${i}m`:`${i}m`}exit(t){if(this.status==="EXITED")throw new Error("Session already exited");return this.status="EXITED",this.exitTime=new Date,this.exitGate=t,this.duration=this.getDuration(),this.updatedAt=new Date,this}addNote(t,n){return this.notes.push({text:t,author:n||"System",timestamp:new Date}),this.updatedAt=new Date,this}setVIP(){return this.isVIP=!0,this.updatedAt=new Date,this}setStaff(){return this.isStaff=!0,this.updatedAt=new Date,this}toPlain(){return{id:this.id,vehicleId:this.vehicleId,vehiclePlate:this.vehiclePlate,driverName:this.driverName,driverPhone:this.driverPhone,gate:this.gate,locationId:this.locationId,organizationId:this.organizationId,status:this.status,entryTime:this.entryTime,exitTime:this.exitTime,exitGate:this.exitGate,duration:this.duration,isVIP:this.isVIP,isStaff:this.isStaff,notes:this.notes,correlationId:this.correlationId,createdAt:this.createdAt,updatedAt:this.updatedAt}}static fromPlain(t){const n=new O({id:t.id,vehicleId:t.vehicleId,vehiclePlate:t.vehiclePlate,driverName:t.driverName,driverPhone:t.driverPhone,gate:t.gate,locationId:t.locationId,organizationId:t.organizationId,status:t.status,entryTime:t.entryTime});return n.exitTime=t.exitTime||null,n.exitGate=t.exitGate||null,n.duration=t.duration||0,n.isVIP=t.isVIP||!1,n.isStaff=t.isStaff||!1,n.notes=t.notes||[],n.correlationId=t.correlationId||n.generateCorrelationId(),n.createdAt=t.createdAt||new Date,n.updatedAt=t.updatedAt||new Date,n}}function at(e){return e?e.toDate?e.toDate():e:null}const T={fromFirestore:e=>{const t=e.data?e.data():e;return _.fromPlain({...t,id:t.id||e.id,createdAt:at(t.createdAt)||new Date,updatedAt:at(t.updatedAt)||new Date})},toFirestore:e=>{const t=e.toPlain();return{licensePlate:t.licensePlate,make:t.make,model:t.model,color:t.color,type:t.type,organizationId:t.organizationId,blacklisted:t.blacklisted||!1,blacklistReason:t.blacklistReason||"",ownerId:t.ownerId||"",createdAt:x(),updatedAt:x()}},toFirestoreUpdate:e=>{const t=e.toPlain();return{licensePlate:t.licensePlate,make:t.make,model:t.model,color:t.color,type:t.type,blacklisted:t.blacklisted||!1,blacklistReason:t.blacklistReason||"",ownerId:t.ownerId||"",updatedAt:x()}}},I="vehicles";class St{constructor(t){this.db=t||z()}async create(t){const n=t.id||h(w(this.db,I)).id;t.id=n;const i=T.toFirestore(t);return await ct(h(this.db,I,n),i),t}async getById(t){const n=h(this.db,I,t),i=await pt(n);return i.exists()?T.fromFirestore(i):null}async findByPlate(t,n){const i=L(w(this.db,I),D("licensePlate","==",t.toUpperCase()),D("organizationId","==",n||"org_church_a")),r=await N(i);return r.empty?null:T.fromFirestore(r.docs[0])}async getByOrganization(t){const n=L(w(this.db,I),D("organizationId","==",t)),i=await N(n),r=[];return i.forEach(o=>r.push(T.fromFirestore(o))),r}async update(t){const n=T.toFirestoreUpdate(t);return await ut(h(this.db,I,t.id),n),t}}let K=null;function yt(){return K||(K=new St(z())),K}function M(e){return e?e.toDate?e.toDate():e:null}const A={fromFirestore:e=>{const t=e.data?e.data():e;return O.fromPlain({...t,id:t.id||e.id,entryTime:M(t.entryTime)||new Date,exitTime:M(t.exitTime)||null,createdAt:M(t.createdAt)||new Date,updatedAt:M(t.updatedAt)||new Date})},toFirestore:e=>{const t=e.toPlain();return{vehicleId:t.vehicleId,vehiclePlate:t.vehiclePlate,driverName:t.driverName,driverPhone:t.driverPhone,gate:t.gate,locationId:t.locationId,organizationId:t.organizationId,status:t.status,entryTime:x(),exitTime:t.exitTime||null,exitGate:t.exitGate||null,duration:t.duration||0,isVIP:t.isVIP||!1,isStaff:t.isStaff||!1,notes:t.notes||[],correlationId:t.correlationId,createdAt:x(),updatedAt:x()}},toFirestoreUpdate:e=>{const t=e.toPlain();return{status:t.status,exitTime:t.exitTime||null,exitGate:t.exitGate||null,duration:t.duration||0,updatedAt:x()}}},E="parking_sessions";class Vt{constructor(t){this.db=t||z()}async create(t){const n=h(w(this.db,E));t.id=n.id;const i=A.toFirestore(t);return await ct(n,i),t}async getById(t){const n=h(this.db,E,t),i=await pt(n);return i.exists()?A.fromFirestore(i):null}async getActive(t,n=50){const i=L(w(this.db,E),D("organizationId","==",t),D("status","==","PARKED"),ot("entryTime","desc"),ht(n)),r=await N(i),o=[];return r.forEach(a=>o.push(A.fromFirestore(a))),o}async getByVehicle(t){const n=L(w(this.db,E),D("vehicleId","==",t),ot("entryTime","desc")),i=await N(n),r=[];return i.forEach(o=>r.push(A.fromFirestore(o))),r}async update(t){const n=A.toFirestoreUpdate(t);return await ut(h(this.db,E,t.id),n),t}async delete(t){return await bt(h(this.db,E,t)),!0}async exit(t,n){const i=await this.getById(t);if(!i)throw new Error("Session not found");return i.exit(n),await this.update(i)}}let q=null;function F(){return q||(q=new Vt(z())),q}const Ot="audit_logs";class Rt{constructor(t){this.db=t||z()}async log(t){const n={...t,timestamp:x()};return{id:(await wt(w(this.db,Ot),n)).id,...n}}}let H=null;function $t(){return H||(H=new Rt(z())),H}const p={},b={on(e,t){return p[e]||(p[e]=[]),p[e].push(t),()=>this.off(e,t)},off(e,t){p[e]&&(p[e]=p[e].filter(n=>n!==t))},async emit(e,t={}){if(!p[e])return;const n=p[e].map(async i=>{try{await i(t)}catch(r){console.error(`Error in event handler for ${e}:`,r)}});await Promise.allSettled(n)},emitSync(e,t={}){p[e]&&p[e].forEach(n=>{try{queueMicrotask(()=>n(t))}catch(i){console.error(`Error in event handler for ${e}:`,i)}})},clear(e){e?delete p[e]:Object.keys(p).forEach(t=>delete p[t])}},G=b.emit.bind(b);b.emitSync.bind(b);b.on.bind(b);b.off.bind(b);const Mt=$t(),W={async log({action:e,targetId:t,targetType:n,details:i={},correlationId:r=null}){try{const o=xt(),a={action:e,userId:(o==null?void 0:o.id)||"anonymous",userRole:(o==null?void 0:o.role)||"unknown",organizationId:(o==null?void 0:o.organizationId)||"unknown",locationId:(o==null?void 0:o.locationId)||"unknown",targetId:t||null,targetType:n||null,details:i,correlationId:r||null};return G("audit:log",a),await Mt.log(a)}catch(o){return console.error("Audit log error:",o),null}},async login(e){return this.log({action:"USER_LOGIN",targetId:e.id,targetType:"user",details:{email:e.email}})},async logout(e){return this.log({action:"USER_LOGOUT",targetId:e.id,targetType:"user"})},async vehicleEntry(e){return this.log({action:"VEHICLE_ENTERED",targetId:e.id,targetType:"parking_session",details:{plate:e.vehiclePlate,driver:e.driverName,gate:e.gate},correlationId:e.correlationId})},async vehicleExit(e){return this.log({action:"VEHICLE_EXITED",targetId:e.id,targetType:"parking_session",details:{plate:e.vehiclePlate,duration:e.duration,gate:e.exitGate},correlationId:e.correlationId})},async userCreated(e){return this.log({action:"USER_CREATED",targetId:e.id,targetType:"user",details:{email:e.email,role:e.role}})}};let B=null;function V(e,t="success"){const n=document.getElementById("app");if(!n)return;const i={success:"rgba(0,255,136,0.08)",error:"rgba(255,45,85,0.08)",warning:"rgba(255,107,53,0.08)",info:"rgba(0,212,255,0.08)"},r={success:"rgba(0,255,136,0.15)",error:"rgba(255,45,85,0.15)",warning:"rgba(255,107,53,0.15)",info:"rgba(0,212,255,0.15)"},o={success:"var(--accent)",error:"var(--danger)",warning:"var(--warning)",info:"var(--secondary)"},a=document.getElementById("toast-message");a&&(a.remove(),B&&(clearTimeout(B),B=null));const s=document.createElement("div");s.id="toast-message",s.style.cssText=`
        position:fixed;bottom:100px;left:50%;transform:translateX(-50%);
        padding:16px 24px;border-radius:16px;
        background:${i[t]||i.success};
        border:1px solid ${r[t]||r.success};
        color:${o[t]||o.success};
        font-weight:500;font-size:14px;
        z-index:9999;max-width:90%;
        text-align:center;
        animation:slideUp 0.3s ease;
    `,s.textContent=e,n.appendChild(s),B=setTimeout(()=>{s.style.opacity="0",s.style.transition="opacity 0.3s ease",setTimeout(()=>{s.remove(),B=null},300)},3e3)}function Y(e){if(!e)return"Never";const t=Date.now()-e.getTime(),n=Math.floor(t/6e4),i=Math.floor(n/60),r=Math.floor(i/24);return r>0?`${r}d ago`:i>0?`${i}h ago`:n>0?`${n}m ago`:"Just now"}function Lt(){const e=new Date;return e.setHours(0,0,0,0),e}function Nt(){const e=new Date;return e.setHours(0,0,0,0),e.setDate(e.getDate()+1),e}function _t(e){const t=document.getElementById("activityFeed"),n=document.getElementById("activityCount");if(!t)return;if(!e||e.length===0){t.innerHTML=`
            <div style="text-align:center;padding:20px;color:var(--text-muted);font-size:13px;">
                No active vehicles
            </div>
        `,n&&(n.textContent="0 active");return}n&&(n.textContent=`${e.length} active`);const r=[...e].sort((o,a)=>new Date(a.entryTime)-new Date(o.entryTime)).slice(0,10);t.innerHTML=r.map(o=>{const a=o.getDurationText?o.getDurationText():`${o.duration||0}m`,s=o.vehiclePlate||"Unknown",l=o.driverName||"Unknown",d=o.isVIP||!1,g=o.isOverdue?o.isOverdue():!1;let m="🟢",y="";d&&(m="⭐",y='<span style="background:var(--gradient-primary);padding:2px 8px;border-radius:12px;font-size:10px;color:white;font-weight:700;margin-left:4px;">VIP</span>'),g&&(m="⚠️",y='<span style="background:rgba(255,45,85,0.2);padding:2px 8px;border-radius:12px;font-size:10px;color:var(--danger);font-weight:700;margin-left:4px;">OVERDUE</span>');const v=o.entryTime?new Date(o.entryTime):new Date,k=Y(v);return`
            <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:var(--bg-card);border-radius:12px;border:1px solid var(--glass-border);">
                <div style="display:flex;align-items:center;gap:10px;flex:1;min-width:0;">
                    <span style="font-size:18px;">${m}</span>
                    <div style="min-width:0;">
                        <div style="font-weight:600;font-family:Orbitron,monospace;font-size:14px;letter-spacing:0.5px;">
                            ${s} ${y}
                        </div>
                        <div style="font-size:12px;color:var(--text-muted);">
                            👤 ${l} • ${k} • 🕐 ${a}
                        </div>
                    </div>
                </div>
                <div style="font-size:12px;color:var(--text-muted);">
                    Gate ${o.gate||"A"}
                </div>
            </div>
        `}).join("")}let Ft=F(),Gt=[],S=0,Q=0;const Ut=3e5;function C(e,t,n="textContent"){const i=document.getElementById(e);i&&(n==="style"?Object.assign(i.style,t):i[n]=t)}async function Z(){try{const e=u.app.defaultOrganization,t=u.parking.maxCapacity,n=await Ft.getActive(e);Gt=n;const i=n.length;C("insideCount",i),C("availableCount",Math.max(0,t-i));const r=Math.min(i/t*100,100),o=document.getElementById("occupancyBar");o&&(o.style.width=r+"%"),C("occupancyPercent",Math.round(r)+"%");const a=await qt(e);return C("todayCount",a),_t(n),Kt(n),{sessions:n,count:i,todayCount:a}}catch(e){return console.error("Error refreshing data:",e),null}}function Kt(e){const t=document.getElementById("lastActivityTime");if(t)if(e.length>0){const i=[...e].sort((o,a)=>new Date(a.entryTime)-new Date(o.entryTime))[0],r=i.entryTime?new Date(i.entryTime):new Date;t.textContent=`🟢 Last entry: ${Y(r)}`}else t.textContent="🟢 Last entry: --"}async function qt(e){const t=Date.now();if(t-Q<Ut)return S;try{const{getDb:n}=await rt(async()=>{const{getDb:y}=await import("./index-DZPozdaT.js").then(v=>v.f);return{getDb:y}},__vite__mapDeps([0,1])),{collection:i,query:r,where:o,getDocs:a}=await rt(async()=>{const{collection:y,query:v,where:k,getDocs:R}=await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js");return{collection:y,query:v,where:k,getDocs:R}},[]),s=n(),l=Lt(),d=Nt(),g=r(i(s,"parking_sessions"),o("organizationId","==",e),o("entryTime",">=",l),o("entryTime","<",d));return S=(await a(g)).size,Q=t,S}catch(n){return console.error("Error getting today entries:",n),0}}function gt(){S+=1,Q=Date.now(),C("todayCount",S)}const st=yt(),Ht=F();function jt(e){return!e||e.length<3?{valid:!1,error:"License plate is required"}:/^[A-Z]{3}\d{3}[A-Z]?$/.test(e.toUpperCase().replace(/\s/g,""))?{valid:!0,value:e.toUpperCase()}:{valid:!1,error:"Invalid plate format. Use: KDG832A"}}function Qt(e){if(!e)return{valid:!1,error:"Phone number is required"};const t=e.replace(/\s/g,"");return/^(?:\+254|254|0)(7\d{8}|1\d{8})$/.test(t)?{valid:!0,value:t}:{valid:!1,error:"Invalid phone format. Use: 0712345678 or +254712345678"}}function Xt(e){return!e||e.length<2?{valid:!1,error:"Driver name is required"}:{valid:!0,value:e.trim()}}function Wt(e){const t=[],n=jt(e.plate);n.valid||t.push(n.error);const i=Xt(e.driver);i.valid||t.push(i.error);const r=Qt(e.phone);return r.valid||t.push(r.error),{valid:t.length===0,errors:t,data:{plate:n.valid?n.value:e.plate,driver:i.valid?i.value:e.driver,phone:r.valid?r.value:e.phone}}}function mt(){var t;if(kt())return;zt(!0),X("entryModal","🟦 New Entry",`
        <form id="entryForm">
            <div style="margin-bottom:12px;">
                <label style="font-size:12px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;display:block;margin-bottom:4px;">License Plate *</label>
                <input type="text" id="entryPlate" placeholder="e.g. KDG832A" style="text-transform:uppercase;width:100%;padding:12px 16px;border-radius:16px;border:1px solid var(--glass-border);background:var(--glass-bg);color:var(--text-primary);font-size:16px;">
                <div style="font-size:11px;color:var(--text-muted);margin-top:4px;">Format: 3 letters + 3 numbers + optional letter (e.g. KDG832A)</div>
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
    `),(t=document.getElementById("entryForm"))==null||t.addEventListener("submit",async n=>{n.preventDefault(),await Yt()})}async function Yt(){var m,y,v,k,R,J,tt,et,nt;const e=(y=(m=document.getElementById("entryPlate"))==null?void 0:m.value)==null?void 0:y.trim(),t=(k=(v=document.getElementById("entryDriver"))==null?void 0:v.value)==null?void 0:k.trim(),n=(J=(R=document.getElementById("entryPhone"))==null?void 0:R.value)==null?void 0:J.trim(),i=((tt=document.getElementById("entryVehicleType"))==null?void 0:tt.value)||"Sedan",r=((et=document.getElementById("entryVIP"))==null?void 0:et.checked)||!1,o=((nt=document.getElementById("entryStaff"))==null?void 0:nt.checked)||!1,a=document.getElementById("entryError"),s=Wt({plate:e,driver:t,phone:n});if(!s.valid){a.textContent=`❌ ${s.errors.join(`
`)}`,a.style.display="block";return}a.style.display="none";const{plate:l,driver:d,phone:g}=s.data;try{const $=document.querySelector("#entryForm .btn-primary");$.textContent="⏳ Saving...",$.disabled=!0;let f=await st.findByPlate(l);f||(f=new _({licensePlate:l,type:i,organizationId:u.app.defaultOrganization}),f=await st.create(f));const U=new O({vehicleId:f.id,vehiclePlate:l,driverName:d,driverPhone:g,gate:u.app.defaultGate,locationId:u.app.defaultLocation,organizationId:u.app.defaultOrganization});r&&U.setVIP(),o&&U.setStaff();const it=await Ht.create(U);await W.vehicleEntry(it),await G("vehicle:entered",{session:it}),gt(),P("entryModal"),V(`✅ ${l} checked in successfully!`,"success"),await Z()}catch($){a.textContent=`❌ ${$.message}`,a.style.display="block";const f=document.querySelector("#entryForm .btn-primary");f.textContent="✅ Check In",f.disabled=!1}}const Zt=yt(),vt=F();function Jt(){var t,n,i,r;if(It())return;Tt(!0),X("knownVehicleModal","🟩 Known Vehicle",`
        <div style="margin-bottom:16px;">
            <label style="font-size:12px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;display:block;margin-bottom:4px;">Search by Plate</label>
            <div style="display:flex;gap:8px;">
                <input type="text" id="knownPlate" placeholder="e.g. KDG832A" style="text-transform:uppercase;flex:1;padding:12px 16px;border-radius:16px;border:1px solid var(--glass-border);background:var(--glass-bg);color:var(--text-primary);font-size:16px;">
                <button id="knownSearchBtn" class="btn-secondary" style="padding:12px 20px;min-height:auto;width:auto;font-size:14px;">🔍 Search</button>
            </div>
        </div>

        <div id="knownResult" style="display:none;padding:16px;background:var(--glass-bg);border-radius:16px;border:1px solid var(--glass-border);margin-bottom:16px;">
            <div style="display:flex;justify-content:space-between;align-items:center;">
                <div>
                    <div style="font-family:Orbitron,monospace;font-size:20px;font-weight:700;" id="knownPlateDisplay">KDG832A</div>
                    <div style="font-size:13px;color:var(--text-muted);" id="knownDriverDisplay">👤 John Otieno</div>
                    <div style="font-size:13px;color:var(--text-muted);" id="knownPhoneDisplay">📱 0712345678</div>
                </div>
                <div style="text-align:right;">
                    <div style="font-size:11px;color:var(--text-muted);">Last visit</div>
                    <div style="font-size:13px;color:var(--text-secondary);" id="knownLastVisit">2 days ago</div>
                </div>
            </div>
            <button id="knownQuickEntryBtn" class="btn-success" style="margin-top:12px;padding:12px;font-size:16px;">✅ Quick Entry</button>
        </div>

        <div id="knownNotFound" style="display:none;padding:16px;text-align:center;color:var(--text-muted);">
            ❌ Vehicle not found. <button id="knownRegisterBtn" style="background:transparent;border:none;color:var(--primary);cursor:pointer;font-weight:600;min-height:auto;width:auto;padding:0;">Register as new</button>
        </div>

        <div id="knownError" style="display:none;padding:12px;border-radius:12px;margin-top:12px;background:rgba(255,45,85,0.1);color:var(--danger);font-size:14px;"></div>
    `),(t=document.getElementById("knownSearchBtn"))==null||t.addEventListener("click",dt),(n=document.getElementById("knownPlate"))==null||n.addEventListener("keypress",o=>{o.key==="Enter"&&dt()}),(i=document.getElementById("knownQuickEntryBtn"))==null||i.addEventListener("click",te),(r=document.getElementById("knownRegisterBtn"))==null||r.addEventListener("click",()=>{P("knownVehicleModal"),mt()})}async function dt(){var r,o,a;const e=(a=(o=(r=document.getElementById("knownPlate"))==null?void 0:r.value)==null?void 0:o.trim())==null?void 0:a.toUpperCase(),t=document.getElementById("knownResult"),n=document.getElementById("knownNotFound"),i=document.getElementById("knownError");if(!e){i.textContent="❌ Enter a plate number",i.style.display="block";return}i.style.display="none",t.style.display="none",n.style.display="none";try{const s=await Zt.findByPlate(e);if(!s){n.style.display="block";return}const l=await vt.getByVehicle(s.id),d=l.length>0?l[0]:null;document.getElementById("knownPlateDisplay").textContent=s.licensePlate,document.getElementById("knownDriverDisplay").textContent=`👤 ${(d==null?void 0:d.driverName)||"No previous visits"}`,document.getElementById("knownPhoneDisplay").textContent=`📱 ${(d==null?void 0:d.driverPhone)||"N/A"}`,document.getElementById("knownLastVisit").textContent=d?Y(d.entryTime):"No visits",t.style.display="block",Bt({vehicle:s,lastSession:d})}catch(s){i.textContent="❌ Error: "+s.message,i.style.display="block"}}async function te(){const e=Dt();if(!e)return;const{vehicle:t,lastSession:n}=e;try{const i=new O({vehicleId:t.id,vehiclePlate:t.licensePlate,driverName:(n==null?void 0:n.driverName)||"Known Driver",driverPhone:(n==null?void 0:n.driverPhone)||"N/A",gate:u.app.defaultGate,locationId:u.app.defaultLocation,organizationId:u.app.defaultOrganization}),r=await vt.create(i);await W.vehicleEntry(r),await G("vehicle:entered",{session:r}),gt(),P("knownVehicleModal"),V(`✅ ${t.licensePlate} checked in!`,"success"),await Z()}catch(i){V("❌ Error: "+i.message,"error")}}const ft=F();function ee(){var t,n,i;if(Et())return;At(!0),X("scannerModal","📷 Scan QR",`
        <div id="scannerContainer" style="background:var(--glass-bg);border-radius:16px;padding:20px;border:2px dashed var(--glass-border);min-height:200px;display:flex;align-items:center;justify-content:center;flex-direction:column;">
            <div style="font-size:48px;margin-bottom:12px;">📷</div>
            <div style="color:var(--text-muted);">Camera will open here</div>
            <div style="font-size:12px;color:var(--text-muted);margin-top:8px;">For now, enter plate manually below</div>
        </div>

        <div style="margin-top:16px;">
            <input type="text" id="scannerPlateInput" placeholder="Enter plate to exit" style="text-transform:uppercase;width:100%;padding:12px 16px;border-radius:16px;border:1px solid var(--glass-border);background:var(--glass-bg);color:var(--text-primary);font-size:16px;">
            <button id="scannerExitBtn" class="btn-danger" style="margin-top:8px;padding:14px;font-size:16px;">🔍 Find & Exit</button>
        </div>

        <div id="scannerResult" style="display:none;margin-top:12px;padding:16px;background:var(--glass-bg);border-radius:16px;border:1px solid var(--glass-border);">
            <div id="scannerVehicleInfo"></div>
            <button id="scannerConfirmExit" class="btn-success" style="margin-top:12px;padding:12px;font-size:16px;">✅ Confirm Exit</button>
        </div>

        <div id="scannerError" style="display:none;padding:12px;border-radius:12px;margin-top:12px;background:rgba(255,45,85,0.1);color:var(--danger);font-size:14px;"></div>
    `),(t=document.getElementById("scannerExitBtn"))==null||t.addEventListener("click",lt),(n=document.getElementById("scannerPlateInput"))==null||n.addEventListener("keypress",r=>{r.key==="Enter"&&lt()}),(i=document.getElementById("scannerConfirmExit"))==null||i.addEventListener("click",ne)}async function lt(){var i,r,o;const e=(o=(r=(i=document.getElementById("scannerPlateInput"))==null?void 0:i.value)==null?void 0:r.trim())==null?void 0:o.toUpperCase(),t=document.getElementById("scannerResult"),n=document.getElementById("scannerError");if(!e){n.textContent="❌ Enter a plate number",n.style.display="block";return}n.style.display="none",t.style.display="none";try{const s=(await ft.getActive(u.app.defaultOrganization)).find(m=>m.vehiclePlate===e);if(!s){n.textContent="❌ No active session found for this vehicle",n.style.display="block";return}Ct(s);const l=s.getDurationText?s.getDurationText():`${s.duration||0}m`,d=s.isVIP?"⭐ ":"",g=s.isStaff?"👤 ":"";document.getElementById("scannerVehicleInfo").innerHTML=`
            <div style="font-family:Orbitron,monospace;font-size:24px;font-weight:700;color:var(--primary);">${s.vehiclePlate}</div>
            <div style="font-size:13px;color:var(--text-secondary);">${d}${g}${s.driverName||"Unknown"}</div>
            <div style="font-size:13px;color:var(--text-muted);">🕐 ${l} • 🚪 ${s.gate||"Gate A"}</div>
        `,t.style.display="block"}catch(a){n.textContent="❌ Error: "+a.message,n.style.display="block"}}async function ne(){const e=Pt();if(e)try{const t=await ft.exit(e.id,u.app.defaultGate);await W.vehicleExit(t),await G("vehicle:exited",{session:t}),P("scannerModal"),V(`✅ ${t.vehiclePlate} exited successfully!`,"success"),await Z()}catch(t){V("❌ Error: "+t.message,"error")}}function j(e){return document.getElementById(e)}function ie(e){e.innerHTML=re(),oe()}function re(){return`
        <!-- Header -->
        <div style="padding:16px 20px;background:var(--glass-bg);border-radius:24px;border:1px solid var(--glass-border);margin-bottom:16px;">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
                <div>
                    <div style="font-family:Orbitron,monospace;font-size:24px;font-weight:900;background:var(--gradient-primary);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">
                        🚗 Parking Yetu
                    </div>
                    <div style="font-size:11px;color:var(--text-muted);letter-spacing:2px;text-transform:uppercase;">
                        Gate Operations
                    </div>
                </div>
                <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
                    <div style="font-size:13px;color:var(--text-muted);" id="liveClock"></div>
                    <div style="background:var(--glass-bg);padding:4px 12px;border-radius:20px;border:1px solid var(--glass-border);font-size:12px;color:var(--text-secondary);">
                        👤 Operator
                    </div>
                </div>
            </div>
            <div style="display:flex;gap:12px;margin-top:10px;flex-wrap:wrap;font-size:12px;color:var(--text-muted);">
                <span>🚪 Gate: <strong style="color:var(--text-secondary);">Gate A</strong></span>
                <span id="lastActivityTime">🟢 Last entry: --</span>
            </div>
        </div>

        <!-- Stats -->
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:16px;">
            <div style="background:var(--glass-bg);padding:16px;border-radius:16px;border:1px solid var(--glass-border);text-align:center;">
                <div style="font-family:Orbitron,monospace;font-size:28px;font-weight:700;color:var(--accent);" id="insideCount">0</div>
                <div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;">Vehicles Inside</div>
            </div>
            <div style="background:var(--glass-bg);padding:16px;border-radius:16px;border:1px solid var(--glass-border);text-align:center;">
                <div style="font-family:Orbitron,monospace;font-size:28px;font-weight:700;color:var(--secondary);" id="availableCount">0</div>
                <div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;">Available Spaces</div>
                <div style="margin-top:4px;height:6px;background:var(--glass-bg);border-radius:4px;overflow:hidden;border:1px solid var(--glass-border);">
                    <div id="occupancyBar" style="height:100%;width:0%;background:var(--gradient-primary);border-radius:4px;transition:width 0.8s cubic-bezier(0.34,1.56,0.64,1);"></div>
                </div>
                <div style="font-size:11px;color:var(--text-muted);margin-top:4px;" id="occupancyPercent">0%</div>
            </div>
            <div style="background:var(--glass-bg);padding:16px;border-radius:16px;border:1px solid var(--glass-border);text-align:center;">
                <div style="font-family:Orbitron,monospace;font-size:28px;font-weight:700;color:var(--primary);" id="todayCount">0</div>
                <div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;">Today's Entries</div>
            </div>
        </div>

        <!-- Action Buttons -->
        <div style="display:grid;gap:12px;margin-bottom:16px;">
            <button id="newEntryBtn" class="btn-primary" style="padding:20px;font-size:18px;min-height:72px;text-align:left;display:flex;align-items:center;gap:12px;">
                <span style="font-size:28px;">🟦</span>
                <div>
                    <div style="font-weight:700;">NEW ENTRY</div>
                    <div style="font-size:12px;font-weight:400;opacity:0.7;text-transform:none;">Register a new vehicle</div>
                </div>
            </button>
            <button id="knownVehicleBtn" class="btn-secondary" style="padding:20px;font-size:18px;min-height:72px;text-align:left;display:flex;align-items:center;gap:12px;">
                <span style="font-size:28px;">🟩</span>
                <div>
                    <div style="font-weight:700;">KNOWN VEHICLE</div>
                    <div style="font-size:12px;font-weight:400;opacity:0.7;text-transform:none;">Quick entry for returning vehicles</div>
                </div>
            </button>
            <button id="scanQrBtn" class="btn-danger" style="padding:20px;font-size:18px;min-height:72px;text-align:left;display:flex;align-items:center;gap:12px;">
                <span style="font-size:28px;">🟥</span>
                <div>
                    <div style="font-weight:700;">SCAN QR</div>
                    <div style="font-size:12px;font-weight:400;opacity:0.7;text-transform:none;">Process exit or access</div>
                </div>
            </button>
        </div>

        <!-- Recent Activity -->
        <div style="background:var(--glass-bg);border-radius:16px;border:1px solid var(--glass-border);padding:16px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                <h3 style="font-family:Orbitron,monospace;font-size:14px;text-transform:uppercase;letter-spacing:1px;color:var(--text-secondary);">
                    ⚡ Recent Activity
                </h3>
                <span style="font-size:11px;color:var(--text-muted);" id="activityCount">0 active</span>
            </div>
            <div id="activityFeed" style="max-height:300px;overflow-y:auto;display:flex;flex-direction:column;gap:6px;">
                <div style="text-align:center;padding:20px;color:var(--text-muted);font-size:13px;">
                    No active vehicles
                </div>
            </div>
        </div>
    `}function oe(){const e=j("newEntryBtn"),t=j("knownVehicleBtn"),n=j("scanQrBtn");e&&e.addEventListener("click",mt),t&&t.addEventListener("click",Jt),n&&n.addEventListener("click",ee)}console.log("✅ workstation/index.js loaded");function pe(){console.log("✅ initWorkstation() called");var e=document.getElementById("app");e&&ie(e)}export{pe as default};
//# sourceMappingURL=index-8NeW3UI2.js.map
