const courses=[
  ["Digital Marketing","Social media, content & campaign fundamentals.","✦"],
  ["Graphic Design","Design essentials for business and branding.","◇"],
  ["Video Editing","Create engaging videos for social platforms.","▶"],
  ["Freelancing","Build a profile and understand digital work.","↗"],
  ["Facebook Marketing","Learn practical page and ad strategies.","f"],
  ["E-Commerce","Explore online selling and store basics.","◆"],
  ["AI for Business","Use modern AI tools for productivity.","AI"],
  ["Content Creation","Plan, write and publish useful content.","✎"]
];
const grid=document.getElementById("courseGrid");
grid.innerHTML=courses.map(c=>`<article class="course"><div class="course-cover">${c[2]}</div><div class="course-body"><h3>${c[0]}</h3><p>${c[1]}</p><button class="btn btn-outline" onclick="alert('Course preview: ${c[0]}')">View Course →</button></div></article>`).join("");

const drawer=document.getElementById("drawer"), backdrop=document.getElementById("backdrop");
document.getElementById("menuBtn").onclick=()=>{drawer.classList.add("open");backdrop.classList.add("show")};
document.getElementById("drawerClose").onclick=closeDrawer;
backdrop.onclick=closeDrawer;
document.querySelectorAll(".drawer a").forEach(a=>a.onclick=closeDrawer);
function closeDrawer(){drawer.classList.remove("open");backdrop.classList.remove("show")}

function openModal(id){document.getElementById(id).classList.add("show");document.getElementById(id).setAttribute("aria-hidden","false")}
function closeModals(){document.querySelectorAll(".modal").forEach(m=>{m.classList.remove("show");m.setAttribute("aria-hidden","true")})}
document.querySelectorAll("[data-open]").forEach(b=>b.addEventListener("click",e=>{e.preventDefault();openModal(b.dataset.open)}));
document.querySelectorAll(".modal-close").forEach(b=>b.onclick=closeModals);
document.querySelectorAll(".modal").forEach(m=>m.addEventListener("click",e=>{if(e.target===m)closeModals()}));

function nextId(){
  const n=Number(localStorage.getItem("we_next_id")||100001);
  localStorage.setItem("we_next_id",String(n+1));
  return `WE-${n}`;
}
function saveStudent(student){localStorage.setItem("we_student_"+student.id,JSON.stringify(student));localStorage.setItem("we_last_student",student.id)}

document.getElementById("registerForm").addEventListener("submit",e=>{
  e.preventDefault();
  const f=new FormData(e.target), id=nextId(), referral=id.replace("-","");
  const student={id,referral,name:f.get("name"),email:f.get("email"),phone:f.get("phone"),referredBy:f.get("referral")||null,createdAt:new Date().toISOString()};
  saveStudent(student);
  const out=document.getElementById("registerResult");
  out.className="result show";
  out.innerHTML=`<b>Account created!</b><br>Student ID: <strong>${id}</strong><br>Referral Code: <strong>${referral}</strong><br><small>This demo stores data in this browser only. Connect a backend/database for real multi-user accounts.</small>`;
  e.target.reset();
  document.getElementById("demoStudentId").textContent=id;
  document.getElementById("demoReferral").textContent=referral;
});
document.getElementById("loginForm").addEventListener("submit",e=>{
  e.preventDefault();
  const f=new FormData(e.target), key=String(f.get("id")).trim();
  const id=key.startsWith("WE-")?key:localStorage.getItem("we_last_student");
  const student=localStorage.getItem("we_student_"+id);
  const out=document.getElementById("loginResult");out.className="result show";
  out.innerHTML=student?`Welcome back, <b>${JSON.parse(student).name}</b>!<br>Student ID: <strong>${id}</strong>`:`Demo account not found in this browser. Create an account first.`;
});
document.getElementById("copyDemo").onclick=async()=>{
  const code=document.getElementById("demoReferral").textContent;
  try{await navigator.clipboard.writeText(code);document.getElementById("copyDemo").textContent="Copied ✓"}catch{alert(code)}
};
