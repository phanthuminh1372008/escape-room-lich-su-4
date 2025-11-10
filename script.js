let puzzles=[
  {id:1,type:"video",content:"https://www.youtube.com/embed/ATWuXsE9S7E",correct:true,feedbackCorrect:"Đúng! Video xem ổn.",feedbackWrong:"Sai! Nguyễn Huệ là Quang Trung."},
  {id:2,type:"fill",question:"Quang Trung đại phá ...... quân Thanh",answer:"20 vạn",feedbackCorrect:"Chúc mừng! Bạn nhận 1 ngọn đuốc.",feedbackWrong:"Sai rồi! Đáp án: 20 vạn",item:true}
];

let attempts={}, locked={}, score=0, torch=0;

function render(){
  const container=document.getElementById("roundContainer");
  container.innerHTML="";
  puzzles.forEach(p=>{
    let html=`<div class="puzzle" id="puzzle${p.id}"><h2>Câu ${p.id}</h2>`;
    if(p.type==="video"){
      html+=`<div class="video-wrap"><iframe src="${p.content}" allowfullscreen></iframe></div>
      <button onclick="checkChoice(${p.id},true)">Đúng</button>
      <button onclick="checkChoice(${p.id},false)">Sai</button>`;
    } else if(p.type==="fill"){
      html+=`<p>${p.question.replace("......",`<input type="text" id="input${p.id}">`)}</p>
      <button onclick="checkFill(${p.id})">Chốt đáp án</button>`;
    }
    html+=`<p id="feedback${p.id}" class="feedback"></p></div>`;
    container.innerHTML+=html;
  });
  updateStatus();
}

function checkChoice(id,answer){
  if(locked[id]) return;
  let p=puzzles.find(x=>x.id===id);
  let fb=document.getElementById("feedback"+id);
  if(answer===p.correct){
    attempts[id]=true;
    fb.style.color="green"; fb.textContent=p.feedbackCorrect;
  } else{
    attempts[id]=false;
    locked[id]=true;
    fb.style.color="red"; fb.textContent=p.feedbackWrong;
  }
  updateStatus();
}

function checkFill(id){
  if(locked[id]) return;
  let p=puzzles.find(x=>x.id===id);
  let input=document.getElementById("input"+id).value.trim();
  let fb=document.getElementById("feedback"+id);
  if(input.toLowerCase()===p.answer.toLowerCase()){
    attempts[id]=true;
    fb.style.color="green"; fb.textContent=p.feedbackCorrect;
    if(p.item) torch++;
  } else{
    attempts[id]=false;
    locked[id]=true;
    fb.style.color="red"; fb.textContent=p.feedbackWrong;
  }
  updateStatus();
}

function updateStatus(){
  score=Object.values(attempts).filter(x=>x).length;
  document.getElementById("scoreDisplay").textContent="Điểm: "+score;
  document.getElementById("torchDisplay").textContent="Ngọn đuốc: "+torch;
}

document.getElementById("openDoor").addEventListener("click",()=>{
  let wrongs=puzzles.filter(p=>!attempts[p.id]);
  let doorFB=document.getElementById("doorFeedback");
  if(wrongs.length===0){
    doorFB.style.color="green";
    doorFB.textContent="Chúc mừng! Bạn mở cửa thành công!";
  } else {
    doorFB.style.color="red";
    doorFB.textContent="Bạn còn câu sai, chơi lại màn!";
    // Reset lại các câu sai
    wrongs.forEach(p=>attempts[p.id]=false);
    wrongs.forEach(p=>locked[p.id]=false);
    render();
  }
});

window.addEventListener("load",render);
