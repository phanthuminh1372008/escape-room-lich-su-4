// Round 1: 2 câu trắc nghiệm
let round1 = [
  {id:1,type:"video",content:"https://www.youtube.com/embed/ATWuXsE9S7E",hint:"Video nói: 'Nguyễn Huệ và Quang Trung là hai người khác nhau'",correct:false},
  {id:2,type:"image",content:"https://upload.wikimedia.org/wikipedia/commons/6/65/Nguyen_Hue_Emperor.jpg",hint:"Poster ghi: 'Nguyễn Huệ và Quang Trung là một người'",correct:true}
];

// Round 2: 2 câu điền chỗ trống
let round2 = [
  {id:1,question:"Quang Trung đại phá ...... vạn quân Thanh",answer:"20",hint:"Quang Trung đánh thắng quân Thanh với 20 vạn quân"},
  {id:2,question:"Nguyễn Huệ là vua của triều ......",answer:"Tây Sơn",hint:"Nguyễn Huệ là vua triều Tây Sơn"}
];

let currentRound=1;
let puzzles=[...round1];
let attempts={};
let locked={};
let score=0;
let torch=0;

function shuffleArray(arr){
  for(let i=arr.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]]=[arr[j],arr[i]];
  }
  return arr;
}

function renderPuzzles(){
  const container=document.getElementById("roundContainer");
  container.innerHTML="";
  puzzles.forEach(p=>{
    let html=`<div class="puzzle" id="puzzle${p.id}"><h2>Câu ${p.id}</h2>`;
    if(currentRound===1){
      if(p.type==="video"){
        html+=`<div class="video-wrap"><iframe src="${p.content}" allowfullscreen></iframe></div>`;
      }else{
        html+=`<img src="${p.content}" class="poster">`;
      }
      html+=`<p class="hint">${p.hint}</p>
      <div class="choices">
        <button onclick="checkAnswerRound1(${p.id},true)">Đúng</button>
        <button onclick="checkAnswerRound1(${p.id},false)">Sai</button>
      </div>
      <p id="feedback${p.id}" class="feedback"></p>`;
    } else {
      html+=`<p>${p.question.replace("......",`<input type="text" id="input${p.id}">`)}</p>
      <button onclick="checkAnswerRound2(${p.id})">Chốt đáp án</button>
      <p id="feedback${p.id}" class="feedback"></p>`;
    }
    html+="</div>";
    container.innerHTML+=html;
  });
  updateStatus();
}

function checkAnswerRound1(id,answer){
  if(locked[id]) return;
  let p=puzzles.find(x=>x.id===id);
  let fb=document.getElementById("feedback"+id);
  if(answer===p.correct){
    attempts[id]=true;
    fb.style.color="green";
    fb.textContent="Chính xác! "+getExplanationRound1(id);
  } else{
    attempts[id]=false;
    locked[id]=true;
    fb.style.color="red";
    fb.textContent="Sai! "+getExplanationRound1(id);
  }
  updateStatus();
}

function checkAnswerRound2(id){
  let p=puzzles.find(x=>x.id===id);
  let fb=document.getElementById("feedback"+id);
  let userAns=document.getElementById("input"+id).value.trim();
  if(userAns.toLowerCase()===p.answer.toLowerCase()){
    attempts[id]=true;
    fb.style.color="green";
    fb.textContent="Chúc mừng! Câu trả lời hoàn toàn chính xác!";
  } else{
    attempts[id]=false;
    fb.style.color="red";
    fb.textContent="Sai! "+p.hint;
  }
  updateStatus();
}

function getExplanationRound1(id){
  if(id===1) return "Nguyễn Huệ chính là Quang Trung — lãnh đạo quân Tây Sơn chiến thắng quân Thanh năm 1789.";
  if(id===2) return "Poster này đúng: Quang Trung = Nguyễn Huệ, hai tên cùng một người.";
  return "";
}

function updateStatus(){
  const done=Object.values(attempts).filter(x=>x).length;
  document.getElementById("scoreDisplay").textContent="Điểm: "+done*10;
  document.getElementById("progressDisplay").textContent="Tiến độ: "+done+" / "+puzzles.length;
  document.getElementById("torchDisplay").textContent="Ngọn đuốc: "+torch;
}

document.getElementById("openDoor").addEventListener("click",()=>{
  const wrongs=puzzles.filter(p=>!attempts[p.id]);
  const doorFB=document.getElementById("doorFeedback");
  if(wrongs.length===0){
    if(currentRound===1){
      torch=Object.values(attempts).filter(x=>x).length;
      doorFB.style.color="green";
      doorFB.textContent="Bạn đã mở cửa Round 1! Chuyển sang Round 2";
      currentRound=2;
      puzzles=[...round2];
      attempts={};
      locked={};
      puzzles=shuffleArray(puzzles);
      setTimeout(()=>renderPuzzles(),500);
    }else{
      doorFB.style.color="green";
      doorFB.textContent="Chúc mừng! Bạn đã mở cửa cuối cùng!";
    }
  }else{
    doorFB.style.color="red";
    doorFB.textContent="Bạn còn câu trả lời sai. Màn chơi sẽ được xáo trộn và bắt đầu lại!";
    wrongs.forEach(p=>attempts[p.id]=false);
    wrongs.forEach(p=>locked[p.id]=false);
    puzzles=shuffleArray(puzzles);
    renderPuzzles();
  }
});

window.addEventListener("load", renderPuzzles);
