let puzzles = [
  {id:1,type:"video",content:"https://www.youtube.com/embed/ATWuXsE9S7E",correct:true,feedbackCorrect:"Đúng!",feedbackWrong:"Sai! Nguyễn Huệ là Quang Trung."},
  {id:2,type:"image",content:"https://upload.wikimedia.org/wikipedia/commons/6/65/Nguyen_Hue_Emperor.jpg",correct:true,feedbackCorrect:"Đúng!",feedbackWrong:"Sai! Đây là hình Quang Trung."},
  {id:3,type:"fill",question:"Quang Trung đại phá ...... quân Thanh",answer:"20 vạn",feedbackCorrect:"Đúng! Bạn nhận 1 ngọn đuốc.",feedbackWrong:"Sai! Đáp án: 20 vạn",item:true},
  {id:4,type:"findError",question:"Quang Trung đại phá 20 vạn quân Minh",options:["Quang Trung","20","vạn","quân Minh"],correct:"quân Minh",feedbackCorrect:"Đúng!",feedbackWrong:"Sai!"}
];

let attempts={}, locked={}, torch=0;

function render(){
  const container=document.getElementById("roundContainer");
  container.innerHTML="";
  puzzles.forEach(p=>{
    let html=`<div class="puzzle" id="puzzle${p.id}"><h2>Câu ${p.id}</h2>`;
    if(p.type==="video"){
      html+=`<div class="video-wrap"><iframe src="${p.content}" allowfullscreen></iframe></div>
      <button onclick="checkChoice(${p.id},true)">Đúng</button>
      <button onclick="checkChoice(${p.id},false)">Sai</button>`;
    } else if(p.type==="image"){
      html+=`<img src="${p.content}" class="poster">
      <button onclick="checkChoice(${p.id},true)">Đúng</button>
      <button onclick="checkChoice(${p.id},false)">Sai</button>`;
    } else if(p.type==="fill"){
      html+=`<p>${p.question.replace("......",`<input type="text" id="input${p.id}">`)}</p>
      <button onclick="checkFill(${p.id})">Chốt đáp án</button>`;
    } else if(p.type==="findError"){
      html+=`<p>`;
      p.options.forEach(opt=>{
        html+=`<span class="underline" onclick="checkFindError('${p.id}','${opt}')">${opt}</span>`;
      });
      html+=`</p>`;
    }
    html+=`<p id="feedback${p.id}" class="feedback"></p></div>`;
    container.innerHTML+=html;
  });
}
function checkChoice(id,answer){
  if(locked[id]) return;
  let p=puzzles.find(x=>x.id===id);
  let fb=document.getElementById("feedback"+id);
  if(answer===p.correct){
    attempts[id]=true;
    fb.style.color="green"; fb.textContent=p.feedbackCorrect;
  } else{
    attempts[id]=false; locked[id]=true;
    fb.style.color="red"; fb.textContent=p.feedbackWrong;
  }
}
function checkFill(id){
  if(locked[id]) return;
  let p=puzzles.find(x=>x.id===id);
  let input=document.getElementById("input"+id).value.trim();
  let fb=document.getElementById("feedback"+id);
  if(input.toLowerCase()===p.answer.toLowerCase()){
    attempts[id]=true; fb.style.color="green"; fb.textContent=p.feedbackCorrect;
    if(p.item) torch++;
  } else{
    attempts[id]=false; locked[id]=true;
    fb.style.color="red"; fb.textContent=p.feedbackWrong;
  }
}
function checkFindError(id,opt){
  if(locked[id]) return;
  let p=puzzles.find(x=>x.id==id);
  let fb=document.getElementById("feedback"+id);
  if(opt===p.correct){ attempts[id]=true; fb.style.color="green"; fb.textContent=p.feedbackCorrect;}
  else{ attempts[id]=false; locked[id]=true; fb.style.color="red"; fb.textContent=p.feedbackWrong;}
}

document.getElementById("goNext").addEventListener("click",()=>{
  let wrongs=puzzles.filter(p=>!attempts[p.id]);
  if(wrongs.length>0){
    alert("Bạn còn câu sai, chơi lại Round 1!");
    attempts={}; locked={}; torch=0; render();
  } else{
    localStorage.setItem("torch",torch);
    window.location.href="escape-room-round2.html";
  }
});

window.addEventListener("load",render);
