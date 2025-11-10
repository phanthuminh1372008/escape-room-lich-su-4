let torch = parseInt(localStorage.getItem("torch"))||0;
let puzzles=[
  {id:1,type:"fill",question:"Round 2: Quang Trung đã chiến thắng bao nhiêu quân?",answer:"20 vạn",feedbackCorrect:"Đúng!",feedbackWrong:"Sai!",item:true},
  {id:2,type:"findError",question:"Round 2: Quân lính Quang Trung có số lượng đúng?",options:["10 vạn","20 vạn","15 vạn"],correct:"20 vạn",feedbackCorrect:"Đúng!",feedbackWrong:"Sai!"}
];
let attempts={}, locked={};

function render(){
  const container=document.getElementById("roundContainer");
  container.innerHTML="";
  puzzles.forEach(p=>{
    let html=`<div class="puzzle" id="puzzle${p.id}"><h2>Câu ${p.id}</h2>`;
    if(p.type==="fill"){
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
function checkFill(id){
  if(locked[id]) return;
  let p=puzzles.find(x=>x.id===id);
  let input=document.getElementById("input"+id).value.trim();
  let fb=document.getElementById("feedback"+id);
  if(input.toLowerCase()===p.answer.toLowerCase()){
    attempts[id]=true; fb.style.color="green"; fb.textContent=p.feedbackCorrect;
    if(p.item) torch++;
  } else{
    attempts[id]=false; locked[id]=true; fb.style.color="red"; fb.textContent=p.feedbackWrong;
  }
}
function checkFindError(id,opt){
  if(locked[id]) return;
  let p=puzzles.find(x=>x.id==id);
  let fb=document.getElementById("feedback"+id);
  if(opt===p.correct){ attempts[id]=true; fb.style.color="green"; fb.textContent=p.feedbackCorrect;}
  else{ attempts[id]=false; locked[id]=true; fb.style.color="red"; fb.textContent=p.feedbackWrong;}
}

document.getElementById("finish").addEventListener("click",()=>{
  let wrongs=puzzles.filter(p=>!attempts[p.id]);
  if(wrongs.length>0){
    alert("Bạn còn câu sai, chơi lại Round 2!");
    attempts={}; locked={}; render();
  } else{
    alert("Chúc mừng! Bạn đã mở cửa thoát Escape Room!");
    localStorage.removeItem("torch");
  }
});

window.addEventListener("load",render);
