const $ = id => document.getElementById(id);

let selected = null;
let zoom = 1;
let projects = JSON.parse(localStorage.getItem("titaeko_projects") || "[]");

const canvas = $("thumbnail");
const content = $("canvasContent");
const panel = $("panel");
const panelContent = $("panelContent");


// ================================
// PANELS
// ================================

const panelData = {

templates:{
 title:"Templates",
 sub:"Professional starting layouts",
 html:`
 <div class="panel-section">
   <div class="section-title">Gaming</div>
   <div class="card-grid">
     <button class="option-card" onclick="applyTemplate('gaming')">
       <div class="big">🎮</div><span>Gaming</span>
     </button>
     <button class="option-card" onclick="applyTemplate('fire')">
       <div class="big">🔥</div><span>Fire</span>
     </button>
     <button class="option-card" onclick="applyTemplate('money')">
       <div class="big">💰</div><span>Money</span>
     </button>
     <button class="option-card" onclick="applyTemplate('dark')">
       <div class="big">🖤</div><span>Dark</span>
     </button>
   </div>
 </div>`
},

text:{
 title:"Text",
 sub:"Add and style typography",
 html:`
 <div class="panel-section">
   <div class="section-title">Add text</div>

   <button class="control" onclick="addText('BIG TITLE')">
     ＋ Big Heading
   </button>

   <button class="control" onclick="addText('YOUR TEXT')">
     ＋ Normal Text
   </button>

   <button class="control" onclick="addText('🔥 EPIC 🔥')">
     ＋ Styled Text
   </button>
 </div>`
},

elements:{
 title:"Elements",
 sub:"Shapes and graphic elements",
 html:`
 <div class="panel-section">
   <div class="section-title">Shapes</div>

   <div class="card-grid">
     <button class="option-card" onclick="addShape('circle')">
       <div class="big">●</div><span>Circle</span>
     </button>

     <button class="option-card" onclick="addShape('square')">
       <div class="big">■</div><span>Square</span>
     </button>

     <button class="option-card" onclick="addShape('arrow')">
       <div class="big">➜</div><span>Arrow</span>
     </button>

     <button class="option-card" onclick="addShape('star')">
       <div class="big">★</div><span>Star</span>
     </button>
   </div>
 </div>`
},

emoji:{
 title:"Emoji & Stickers",
 sub:"Huge reaction library",
 html:`
 <div class="panel-section">
   <input class="control"
          placeholder="Search emoji..."
          oninput="searchEmoji(this.value)">

   <div class="card-grid" id="emojiGrid">
   </div>
 </div>`
},

images:{
 title:"Images",
 sub:"Add your own pictures",
 html:`
 <div class="panel-section">

   <button class="control" onclick="$('imageInput').click()">
     🖼️ Upload Image
   </button>

   <p style="color:#778093;font-size:10px;line-height:1.5">
     Your image is processed directly in the browser.
   </p>

 </div>`
},

background:{
 title:"Colors & Background",
 sub:"Build your own visual style",
 html:`
 <div class="panel-section">

   <div class="section-title">Quick backgrounds</div>

   <div class="color-row">

     <button class="color"
       style="background:#080808"
       onclick="setBackground('#080808')"></button>

     <button class="color"
       style="background:#25105e"
       onclick="setBackground('#25105e')"></button>

     <button class="color"
       style="background:#082f49"
       onclick="setBackground('#082f49')"></button>

     <button class="color"
       style="background:#4c0519"
       onclick="setBackground('#4c0519')"></button>

     <button class="color"
       style="background:#14532d"
       onclick="setBackground('#14532d')"></button>

   </div>

   <br>

   <div class="section-title">Custom</div>

   <input type="color"
          class="control"
          value="#17132d"
          onchange="setBackground(this.value)">

 </div>`
},

layers:{
 title:"Layers",
 sub:"Control everything",
 html:`
 <div class="panel-section">
   <div id="layerList"></div>
 </div>`
},

settings:{
 title:"Settings",
 sub:"Thumbnail configuration",
 html:`
 <div class="panel-section">

   <div class="section-title">Canvas</div>

   <button class="control">
     YouTube Thumbnail
     <small style="color:#778093;float:right">
       1280 × 720
     </small>
   </button>

   <button class="control" onclick="clearSelection()">
     Clear Selection
   </button>

 </div>`
}

};


// ================================
// OPEN PANEL
// ================================

function openPanel(name){

  if(name === "projects"){
    openProjects();
    return;
  }

  const data = panelData[name];
  if(!data) return;

  $("panelTitle").textContent = data.title;
  $("panelSub").textContent = data.sub;

  panelContent.innerHTML = data.html;
  panel.classList.add("open");

  document.querySelectorAll(".tool")
    .forEach(x => x.classList.remove("active"));

  document.querySelectorAll(`[data-panel="${name}"]`)
    .forEach(x => x.classList.add("active"));

  if(name === "emoji") loadEmoji();
  if(name === "layers") refreshLayers();
}


document.querySelectorAll("[data-panel]")
.forEach(btn=>{
  btn.addEventListener("click",()=>{
    openPanel(btn.dataset.panel);
  });
});

$("closePanel").onclick = ()=>{
  panel.classList.remove("open");
};


// ================================
// EMOJI
// ================================

const emojis = [
"😀","😂","🤣","😍","😎","🤯","😱","😈",
"💀","👑","🔥","💥","⚡","💎","💰","🚨",
"❗","❓","⭐","✨","🎯","🏆","🥶","🤡",
"👀","🤔","😡","😭","😴","🤩","😮","🤑",
"🎮","🕹️","🎲","⚽","🏎️","🚗","🏍️","✈️",
"🐉","🦁","🐺","👻","🎃","☠️","❤️","💔",
"👍","👎","👏","🙏","👉","👈","☝️","👇",
"🧠","💪","🛡️","⚔️","🔫","🧨","🚀","🌎"
];

function loadEmoji(list=emojis){

  const grid = $("emojiGrid");
  if(!grid) return;

  grid.innerHTML = list.map(e=>`
    <button class="option-card"
            onclick="addEmoji('${e}')">
      <div class="big">${e}</div>
      <span>Add</span>
    </button>
  `).join("");
}

function searchEmoji(value){

  const result = emojis.filter(e => e.includes(value));
  loadEmoji(result.length ? result : emojis);
}


// ================================
// ADD ELEMENTS
// ================================

function makeLayer(text,className){

  const el = document.createElement("div");

  el.className = `layer ${className}`;
  el.textContent = text;

  el.style.left = "40%";
  el.style.top = "40%";

  content.appendChild(el);

  makeDraggable(el);
  selectLayer(el);

  refreshLayers();
}


function addText(text){
  makeLayer(text,"text-layer title-layer");
}

function addEmoji(emoji){
  makeLayer(emoji,"emoji-layer");
}

function addShape(type){

  const el = document.createElement("div");

  el.className = "layer";

  const symbols = {
    circle:"●",
    square:"■",
    arrow:"➜",
    star:"★"
  };

  el.textContent = symbols[type] || "◆";

  el.style.left="45%";
  el.style.top="45%";
  el.style.fontSize="70px";
  el.style.color="#ffffff";
  el.style.textShadow="0 5px 15px #000";

  content.appendChild(el);

  makeDraggable(el);
  selectLayer(el);
  refreshLayers();
}


// ================================
// DRAG
// ================================

function makeDraggable(el){

  let dragging=false;
  let startX=0;
  let startY=0;
  let startLeft=0;
  let startTop=0;

  el.addEventListener("pointerdown",e=>{

    e.stopPropagation();

    dragging=true;

    startX=e.clientX;
    startY=e.clientY;

    startLeft=el.offsetLeft;
    startTop=el.offsetTop;

    el.setPointerCapture(e.pointerId);

    selectLayer(el);
  });

  el.addEventListener("pointermove",e=>{

    if(!dragging)return;

    const dx=(e.clientX-startX)/zoom;
    const dy=(e.clientY-startY)/zoom;

    el.style.left=(startLeft+dx)+"px";
    el.style.top=(startTop+dy)+"px";
  });

  el.addEventListener("pointerup",()=>{
    dragging=false;
  });
}


// ================================
// SELECT
// ================================

function selectLayer(el){

  document.querySelectorAll(".layer")
    .forEach(x=>x.classList.remove("selected"));

  selected=el;

  el.classList.add("selected");

  $("selectedName").textContent =
    el.textContent.substring(0,22);

  showProperties(el);
}

function clearSelection(){

  document.querySelectorAll(".layer")
    .forEach(x=>x.classList.remove("selected"));

  selected=null;

  $("selectedName").textContent="Nothing selected";

  $("propertiesContent").innerHTML=`
    <div class="empty-properties">
      <div>✦</div>
      <strong>Select an element</strong>
      <span>Click anything on the canvas to edit it.</span>
    </div>`;
}


document.querySelectorAll(".layer")
.forEach(makeDraggable);

document.querySelectorAll(".layer")
.forEach(el=>{
  el.addEventListener("click",e=>{
    e.stopPropagation();
    selectLayer(el);
  });
});


// ================================
// PROPERTIES
// ================================

function showProperties(el){

  $("propertiesContent").innerHTML=`

  <div class="panel-section">

    <div class="section-title">Text</div>

    <input class="control"
      value="${escapeHtml(el.textContent)}"
      oninput="selected.textContent=this.value">

    <div class="section-title">Color</div>

    <input type="color"
      class="control"
      onchange="selected.style.color=this.value">

    <div class="section-title">Size</div>

    <input class="control"
      type="range"
      min="10"
      max="180"
      value="60"
      oninput="selected.style.fontSize=this.value+'px'">

    <button class="control"
      onclick="duplicateSelected()">
      ⧉ Duplicate
    </button>

    <button class="control"
      onclick="deleteSelected()"
      style="color:#ff7188">
      🗑 Delete
    </button>

  </div>
  `;
}

function escapeHtml(str){
  return str.replace(/"/g,"&quot;");
}

function duplicateSelected(){

  if(!selected)return;

  const copy=selected.cloneNode(true);

  copy.style.left=(selected.offsetLeft+25)+"px";
  copy.style.top=(selected.offsetTop+25)+"px";

  content.appendChild(copy);

  makeDraggable(copy);
  selectLayer(copy);

  refreshLayers();
}

function deleteSelected(){

  if(!selected)return;

  selected.remove();
  selected=null;

  refreshLayers();
  clearSelection();
}


// ================================
// LAYERS
// ================================

function refreshLayers(){

  const list=$("layerList");
  if(!list)return;

  const layers=[...document.querySelectorAll(".layer")];

  list.innerHTML=layers.reverse().map((el,i)=>`

    <button class="control"
      onclick="selectLayer(document.querySelectorAll('.layer')[${layers.length-1-i}])">
      ${el.textContent.substring(0,18) || "Layer"}
    </button>

  `).join("");
}


// ================================
// BACKGROUND
// ================================

function setBackground(color){

  content.style.background =
    `radial-gradient(circle at 70% 35%, ${color}, #07080c 90%)`;
}


// ================================
// TEMPLATES
// ================================

function applyTemplate(type){

  if(type==="gaming"){
    setBackground("#26165f");
    document.querySelector(".title-layer").textContent="INSANE PLAY";
    document.querySelector(".small-layer").textContent="ULTIMATE GAMING";
    document.querySelector(".emoji-layer").textContent="🔥";
  }

  if(type==="fire"){
    setBackground("#6b1020");
    document.querySelector(".title-layer").textContent="100% FIRE";
    document.querySelector(".small-layer").textContent="THIS IS CRAZY";
    document.querySelector(".emoji-layer").textContent="💥";
  }

  if(type==="money"){
    setBackground("#07552e");
    document.querySelector(".title-layer").textContent="RICH MODE";
    document.querySelector(".small-layer").textContent="BIG MONEY";
    document.querySelector(".emoji-layer").textContent="💰";
  }

  if(type==="dark"){
    setBackground("#111111");
    document.querySelector(".title-layer").textContent="DARK MODE";
    document.querySelector(".small-layer").textContent="NO ESCAPE";
    document.querySelector(".emoji-layer").textContent="💀";
  }
}


// ================================
// ZOOM
// ================================

function updateZoom(){

  canvas.style.transform=`scale(${zoom})`;

  $("zoomValue").textContent=
    Math.round(zoom*100)+"%";
}

$("zoomIn").onclick=()=>{
  zoom=Math.min(2,zoom+.1);
  updateZoom();
};

$("zoomOut").onclick=()=>{
  zoom=Math.max(.5,zoom-.1);
  updateZoom();
};

$("fitBtn").onclick=()=>{
  zoom=1;
  updateZoom();
};


// ================================
// SAVE SYSTEM
// ================================

$("saveBtn").onclick=()=>{

  $("saveName").value=
    $("projectName").value || "Untitled Thumbnail";

  $("saveModal").classList.add("show");
};

$("closeSave").onclick=closeSave;
$("cancelSave").onclick=closeSave;

function closeSave(){
  $("saveModal").classList.remove("show");
}


$("confirmSave").onclick=()=>{

  const name=
    $("saveName").value.trim() ||
    "Untitled Thumbnail";

  const id=
    Date.now().toString();

  const data={
    id,
    name,
    created:new Date().toLocaleString(),
    html:content.innerHTML,
    background:content.style.background
  };

  projects.unshift(data);

  localStorage.setItem(
    "titaeko_projects",
    JSON.stringify(projects)
  );

  $("projectName").value=name;

  closeSave();

  alert("✅ Project saved!");

  openProjects();
};


// ================================
// PROJECT LIBRARY
// ================================

function openProjects(){

  renderProjects();

  $("projectsModal").classList.add("show");
}

$("closeProjects").onclick=()=>{
  $("projectsModal").classList.remove("show");
};


function renderProjects(){

  const list=$("projectList");

  if(projects.length===0){

    list.innerHTML=`
      <div class="empty-properties">
        <div>▤</div>
        <strong>No projects yet</strong>
        <span>Save your first thumbnail and it will appear here.</span>
      </div>`;

    return;
  }

  list.innerHTML=projects.map(p=>`

    <div class="project-item">

      <div class="project-preview">
        <div style="
          width:100%;
          height:100%;
          background:${p.background || "#171b26"};
          display:grid;
          place-items:center;
          font-size:35px;
          font-weight:900;
          padding:20px;
          text-align:center;
        ">
          ${escapeText(p.name)}
        </div>
      </div>

      <div class="project-info">

        <div>
          <strong>${escapeText(p.name)}</strong>
          <span>${p.created}</span>
        </div>

      </div>

      <div class="project-buttons">

        <button class="open"
          onclick="loadProject('${p.id}')">
          Continue Editing
        </button>

        <button
          onclick="duplicateProject('${p.id}')">
          Duplicate
        </button>

        <button
          onclick="deleteProject('${p.id}')">
          Delete
        </button>

      </div>

    </div>

  `).join("");
}


function escapeText(text){

  return text
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;");
}


function loadProject(id){

  const p=projects.find(x=>x.id===id);

  if(!p)return;

  content.innerHTML=p.html;
  content.style.background=p.background;

  $("projectName").value=p.name;

  document.querySelectorAll(".layer")
    .forEach(el=>{
      makeDraggable(el);

      el.addEventListener("click",e=>{
        e.stopPropagation();
        selectLayer(el);
      });
    });

  $("projectsModal").classList.remove("show");

  refreshLayers();
}


function duplicateProject(id){

  const p=projects.find(x=>x.id===id);

  if(!p)return;

  const copy={
    ...p,
    id:Date.now().toString(),
    name:p.name+" Copy",
    created:new Date().toLocaleString()
  };

  projects.unshift(copy);

  localStorage.setItem(
    "titaeko_projects",
    JSON.stringify(projects)
  );

  renderProjects();
}


function deleteProject(id){

  if(!confirm("Delete this project?"))return;

  projects=
    projects.filter(p=>p.id!==id);

  localStorage.setItem(
    "titaeko_projects",
    JSON.stringify(projects)
  );

  renderProjects();
}


// ================================
// IMAGE UPLOAD
// ================================

$("imageInput").addEventListener("change",e=>{

  const file=e.target.files[0];

  if(!file)return;

  const reader=new FileReader();

  reader.onload=event=>{

    const img=document.createElement("img");

    img.src=event.target.result;

    img.className="layer";

    img.style.width="260px";
    img.style.left="50%";
    img.style.top="50%";

    content.appendChild(img);

    makeDraggable(img);
    selectLayer(img);

    refreshLayers();
  };

  reader.readAsDataURL(file);
});


// ================================
// KEYBOARD
// ================================

document.addEventListener("keydown",e=>{

  if(e.key==="Delete"){
    deleteSelected();
  }

  if((e.ctrlKey||e.metaKey) && e.key==="s"){

    e.preventDefault();
    $("saveBtn").click();

  }
});


// ================================
// START
// ================================

openPanel("templates");
updateZoom();
