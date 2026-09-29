const categories=[
["👗","ফ্রক তৈরির কাজ","Frock Making"],["🪡","নকশিকাঁথার কাজ","Nakshi Kantha"],["🌸","ফুলের গহনা তৈরির কাজ","Flower Jewelry"],["💍","চুড়ি বানানোর কাজ","Bangle Making"],["✂️","টেইলারিং কাজ","Tailoring"],["🕯️","Candle বানানোর কাজ","Candle Making"],["🧶","কুশিকাঁটার কাজ","Crochet"],["🎨","Painting — শাড়ি, পাঞ্জাবি ও ওড়না","Fabric Painting"],["✨","জামায় পুঁতি বসানোর কাজ","Bead Work"]
];
const $=id=>document.getElementById(id);
let users=JSON.parse(localStorage.getItem("we_users")||"[]");
let current=JSON.parse(localStorage.getItem("we_current")||"null");
const catBox=$("categories");
categories.forEach((c,i)=>{const d=document.createElement("div");d.className="category";d.dataset.i=i;d.innerHTML=`<span class="emoji">${c[0]}</span><div><b>${c[1]}</b><small>${c[2]}</small></div>`;d.onclick=()=>{if(!current){openModal("login");return}d.classList.toggle("selected");syncSkills()};catBox.appendChild(d)});
function openModal(type="login"){$("modal").classList.remove("hidden");switchForm(type)}
function switchForm(type){$("loginForm").classList.toggle("hidden",type!=="login");$("registerForm").classList.toggle("hidden",type!=="register");$("message").textContent=""}
function closeModal(){$("modal").classList.add("hidden")}
document.querySelectorAll("[data-open]").forEach(b=>b.onclick=()=>openModal(b.dataset.open));
document.querySelectorAll("[data-switch]").forEach(b=>b.onclick=()=>switchForm(b.dataset.switch));
$("closeModal").onclick=closeModal;
$("registerSubmit").onclick=()=>{
 const name=$("regName").value.trim(),email=$("regEmail").value.trim().toLowerCase(),phone=$("regPhone").value.trim(),pass=$("regPass").value;
 if(!name||!email||!phone||!pass){$("message").textContent="সব তথ্য পূরণ করুন।";return}
 if(users.some(u=>u.email===email)){$("message").textContent="এই Gmail দিয়ে account আছে।";return}
 const user={id:"WE-"+Math.floor(100000+Math.random()*900000),name,email,phone,pass,ref:"WE-"+Math.random().toString(36).slice(2,8).toUpperCase(),joined:new Date().toLocaleDateString("en-GB"),photo:"",skills:[]};
 users.push(user);localStorage.setItem("we_users",JSON.stringify(users));current=user;localStorage.setItem("we_current",JSON.stringify(current));closeModal();renderProfile();
};
$("loginSubmit").onclick=()=>{
 const email=$("loginEmail").value.trim().toLowerCase(),pass=$("loginPass").value;
 const u=users.find(x=>x.email===email&&x.pass===pass);
 if(!u){$("message").textContent="Gmail অথবা password সঠিক নয়।";return}
 current=u;localStorage.setItem("we_current",JSON.stringify(u));closeModal();renderProfile();
};
function renderProfile(){
 if(!current)return;
 $("profile").classList.remove("hidden");
 $("profileTitle").textContent=current.name+" — Personal Profile";
 $("pUserId").value=current.id;$("pName").value=current.name;$("pEmail").value=current.email;$("pPhone").value=current.phone;$("pReferral").value=current.ref;$("pJoined").value=current.joined;
 $("profilePhoto").src=current.photo||"assets/logo.jpg";
 document.querySelectorAll(".category").forEach((d,i)=>d.classList.toggle("selected",(current.skills||[]).includes(i)));
 renderSkills();$("profile").scrollIntoView({behavior:"smooth",block:"start"});
}
function syncSkills(){current.skills=[...document.querySelectorAll(".category.selected")].map(d=>+d.dataset.i);saveCurrent();renderSkills()}
function renderSkills(){$("profileCategories").innerHTML=(current.skills||[]).map(i=>`<span>${categories[i][0]} ${categories[i][1]}</span>`).join("")||"<span>No skill selected yet</span>"}
function saveCurrent(){users=users.map(u=>u.id===current.id?current:u);localStorage.setItem("we_users",JSON.stringify(users));localStorage.setItem("we_current",JSON.stringify(current))}
$("logoutBtn").onclick=()=>{current=null;localStorage.removeItem("we_current");$("profile").classList.add("hidden");window.scrollTo({top:0,behavior:"smooth"})};
$("photoInput").onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{current.photo=r.result;saveCurrent();renderProfile()};r.readAsDataURL(f)};
$("downloadJpg").onclick=()=>{const a=document.createElement("a");a.href=$("profilePhoto").src;a.download=(current?.name||"profile")+".jpg";a.click()};
$("editBtn").onclick=()=>{["pName","pPhone"].forEach(id=>$(id).readOnly=false);$("editBtn").classList.add("hidden");$("saveBtn").classList.remove("hidden")};
$("saveBtn").onclick=()=>{current.name=$("pName").value.trim();current.phone=$("pPhone").value.trim();["pName","pPhone"].forEach(id=>$(id).readOnly=true);saveCurrent();$("saveBtn").classList.add("hidden");$("editBtn").classList.remove("hidden");renderProfile()};
$("langBtn").onclick=()=>document.body.classList.toggle("english");
$("menuBtn").onclick=()=>window.scrollTo({top:document.body.scrollHeight,behavior:"smooth"});
if(current)renderProfile();
