const skills = [
  ["👗","ফ্রক তৈরির কাজ","Frock Making"],
  ["🪡","নকশিকাঁথার কাজ","Nakshi Kantha"],
  ["🌸","ফুলের গহনা তৈরির কাজ","Flower Jewelry"],
  ["💍","চুড়ি বানানোর কাজ","Bangle Making"],
  ["✂️","টেইলারিং কাজ","Tailoring"],
  ["🕯️","Candle বানানোর কাজ","Candle Making"],
  ["🧶","কুশিকাঁটার কাজ","Crochet"],
  ["🎨","Painting — শাড়ি, পাঞ্জাবি ও ওড়না","Fabric Painting"],
  ["✨","জামায় পুঁতি বসানোর কাজ","Bead Work"]
];

const $ = s => document.querySelector(s);
const skillsGrid = $("#skillsGrid");
let selectedSkills = JSON.parse(localStorage.getItem("we_selected_skills") || "[]");
let currentUser = JSON.parse(localStorage.getItem("we_current_user") || "null");

function renderSkills(){
  skillsGrid.innerHTML = skills.map((s,i)=>`
    <button class="skill ${selectedSkills.includes(i)?"selected":""}" data-index="${i}">
      <span class="emoji">${s[0]}</span>
      <span><strong>${s[1]}</strong><small>${s[2]}</small></span>
      <span class="skill-check">✓</span>
    </button>`).join("");
  document.querySelectorAll(".skill").forEach(btn=>{
    btn.addEventListener("click",()=>{
      const i=Number(btn.dataset.index);
      selectedSkills = selectedSkills.includes(i) ? selectedSkills.filter(x=>x!==i) : [...selectedSkills,i];
      localStorage.setItem("we_selected_skills",JSON.stringify(selectedSkills));
      renderSkills();
      if(currentUser) saveUser({skills:selectedSkills});
    });
  });
}
renderSkills();

function getUsers(){ return JSON.parse(localStorage.getItem("we_users") || "[]"); }
function saveUsers(users){ localStorage.setItem("we_users",JSON.stringify(users)); }
function saveUser(patch){
  if(!currentUser) return;
  const users=getUsers();
  const idx=users.findIndex(u=>u.userId===currentUser.userId);
  if(idx<0) return;
  users[idx]={...users[idx],...patch};
  currentUser=users[idx];
  saveUsers(users); localStorage.setItem("we_current_user",JSON.stringify(currentUser));
  renderProfile();
}
function newId(){ return "WE-"+Math.floor(100000+Math.random()*900000); }
function newReferral(){ return "REF-"+Math.random().toString(36).slice(2,8).toUpperCase(); }
function openAuth(mode="signup"){
  $("#authModal").classList.add("open"); $("#authModal").setAttribute("aria-hidden","false");
  $("#signupForm").classList.toggle("hidden",mode!=="signup");
  $("#loginForm").classList.toggle("hidden",mode!=="login");
  $("#modalTitle").textContent=mode==="signup"?"Create Account":"Welcome Back";
  $("#modalSubtitle").textContent=mode==="signup"?"আপনার নিজের তথ্য দিয়ে account তৈরি করুন":"আপনার account দিয়ে login করুন";
  $("#formMessage").textContent="";
}
function closeAuth(){ $("#authModal").classList.remove("open"); }
document.querySelectorAll("[data-open]").forEach(b=>b.addEventListener("click",()=>{
  const m=b.dataset.open;
  if(m==="login" || m==="signup") openAuth(m);
  else document.querySelector("#courses").scrollIntoView({behavior:"smooth"});
}));
$("#closeModal").onclick=closeAuth;
$("#showLogin").onclick=()=>openAuth("login");
$("#showSignup").onclick=()=>openAuth("signup");

$("#registerBtn").onclick=()=>{
  const name=$("#regName").value.trim(), email=$("#regEmail").value.trim().toLowerCase(), phone=$("#regPhone").value.trim(), password=$("#regPassword").value;
  if(!name||!email||!phone||password.length<6){$("#formMessage").textContent="সব তথ্য দিন এবং password কমপক্ষে 6 characters করুন।";return}
  const users=getUsers();
  if(users.some(u=>u.email===email)){ $("#formMessage").textContent="এই Gmail দিয়ে account আগে থেকেই আছে।"; return; }
  const user={userId:newId(),name,email,phone,password,referral:newReferral(),joined:new Date().toISOString(),photo:"",skills:[...selectedSkills]};
  users.push(user); saveUsers(users); currentUser=user; localStorage.setItem("we_current_user",JSON.stringify(user));
  closeAuth(); renderProfile(); openProfile();
};

$("#loginBtn").onclick=()=>{
  const id=$("#loginId").value.trim().toLowerCase(), pass=$("#loginPassword").value;
  const user=getUsers().find(u=>(u.email===id || u.userId.toLowerCase()===id) && u.password===pass);
  if(!user){$("#formMessage").textContent="Gmail/User ID অথবা password ভুল।";return}
  currentUser=user; selectedSkills=user.skills||[]; localStorage.setItem("we_current_user",JSON.stringify(user)); localStorage.setItem("we_selected_skills",JSON.stringify(selectedSkills));
  closeAuth(); renderSkills(); renderProfile(); openProfile();
};

function initialsData(name){
  const c=document.createElement("canvas");c.width=500;c.height=500;const x=c.getContext("2d");
  x.fillStyle="#151b30";x.fillRect(0,0,500,500);x.fillStyle="#ffffff";x.font="900 170px Arial";x.textAlign="center";x.textBaseline="middle";
  x.fillText((name||"WE").trim().split(/\s+/).map(w=>w[0]).join("").slice(0,2).toUpperCase(),250,250);
  return c.toDataURL("image/jpeg",.92);
}
function renderProfile(){
  if(!currentUser)return;
  $("#pName").textContent=currentUser.name; $("#pUserId").textContent="User ID: "+currentUser.userId;
  $("#fUserId").textContent=currentUser.userId; $("#fName").textContent=currentUser.name; $("#fEmail").textContent=currentUser.email;
  $("#fPhone").textContent=currentUser.phone; $("#fReferral").textContent=currentUser.referral;
  $("#fJoined").textContent=new Date(currentUser.joined).toLocaleDateString("en-GB");
  $("#profileImage").src=currentUser.photo||initialsData(currentUser.name);
  const link=location.origin+location.pathname+"?ref="+currentUser.referral;
  $("#refLink").value=link;
  $("#selectedSkills").innerHTML=(currentUser.skills||[]).map(i=>`<span>${skills[i]?.[0]||""} ${skills[i]?.[1]||""}</span>`).join("") || "<span>No skills selected</span>";
}
function openProfile(){if(currentUser){renderProfile();$("#profileOverlay").classList.add("open")}}
$("#closeProfile").onclick=()=>$("#profileOverlay").classList.remove("open");
$("#logoutBtn").onclick=()=>{currentUser=null;localStorage.removeItem("we_current_user");$("#profileOverlay").classList.remove("open")};

$("#photoInput").onchange=e=>{
  const file=e.target.files[0]; if(!file||!currentUser)return;
  const reader=new FileReader(); reader.onload=()=>saveUser({photo:reader.result}); reader.readAsDataURL(file);
};

$("#downloadJpg").onclick=()=>{
  if(!currentUser)return;
  const c=document.createElement("canvas");c.width=1200;c.height=800;const x=c.getContext("2d");
  const g=x.createLinearGradient(0,0,1200,800);g.addColorStop(0,"#19133e");g.addColorStop(1,"#a73e9d");x.fillStyle=g;x.fillRect(0,0,1200,800);
  x.fillStyle="#fff";x.font="900 42px Arial";x.fillText("WOMEN ENTREPRENEUR",70,90);
  x.font="900 56px Arial";x.fillText(currentUser.name,70,190);x.font="22px Arial";
  const rows=[["User ID",currentUser.userId],["Gmail",currentUser.email],["Phone",currentUser.phone],["Referral Code",currentUser.referral],["Joined Date",new Date(currentUser.joined).toLocaleDateString("en-GB")]];
  rows.forEach((r,i)=>{x.fillStyle="#cfd4ff";x.fillText(r[0],70,280+i*70);x.fillStyle="#fff";x.font="700 22px Arial";x.fillText(r[1],280,280+i*70);x.font="22px Arial"});
  const a=new Image();a.onload=()=>{x.drawImage(a,880,150,220,220);finish()};a.src=currentUser.photo||initialsData(currentUser.name);
  function finish(){const a=document.createElement("a");a.download=(currentUser.name.replace(/\s+/g,"-")||"profile")+".jpg";a.href=c.toDataURL("image/jpeg",.95);a.click()}
};

$("#shareBtn").onclick=async()=>{const v=$("#refLink").value;try{await navigator.clipboard.writeText(v);$("#shareBtn").textContent="Copied!";setTimeout(()=>$("#shareBtn").textContent="Share",1200)}catch{alert(v)}};

$("#editBtn").onclick=()=>{
  $("#editName").value=currentUser.name;$("#editPhone").value=currentUser.phone;$("#editModal").classList.add("open");
};
$("#closeEdit").onclick=()=>$("#editModal").classList.remove("open");
$("#saveEdit").onclick=()=>{
  const n=$("#editName").value.trim(),p=$("#editPhone").value.trim();
  if(!n||!p){$("#editMessage").textContent="Name এবং Phone দিন।";return}
  saveUser({name:n,phone:p});$("#editMessage").textContent="Profile updated!";setTimeout(()=>$("#editModal").classList.remove("open"),500);
};

$("#menuBtn").onclick=()=>currentUser?openProfile():openAuth("login");
$("#langBtn").onclick=()=>alert("বাংলা / English interface ready.");
window.addEventListener("keydown",e=>{if(e.key==="Escape"){closeAuth();$("#profileOverlay").classList.remove("open");$("#editModal").classList.remove("open")}});

// If an already logged-in user exists, profile remains protected and is only opened from Login/Menu.
if(currentUser){selectedSkills=currentUser.skills||selectedSkills;renderSkills();}
