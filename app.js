
//progresss
// Seleciona a barra de progresso
const progressBar = document.querySelector('.progress');

// Define a largura inicial da barra de progresso
let width = 0;

// Define a função que atualiza a largura da barra de progresso
function updateProgress() {
  width += 1;
  progressBar.style.width = width + '%';
    document.getElementById('main').style.display = "none";
  if (width >= 100) {
    // Redireciona para outra página após 5 segund
     document.getElementById('main').style.display = "block";
document.querySelector('.progress-bar').style.display = "none";
  } else {
    setTimeout(updateProgress, 50); // 50ms * 100 = 5s
  }
}

// Inicia a atualização da barra de progresso
updateProgress();
// color quadro
function colors(){
    
    document.getElementById("colors").style.display = "block"

}
function exit(){
    
    document.getElementById("colors").style.display = "none"

}

function colorWhite(){
    
    document.getElementById("editor").style.background = "white"
    document.getElementById("editor").style.color = ""

}
function colorGray(){
    
    document.getElementById("editor").style.background = "gray"
    document.getElementById("editor").style.color = "white"

}
function colorEscuro(){
    
    document.getElementById("editor").style.background = "#222"
    document.getElementById("editor").style.color = "white"

}
function colorBurl(){
    
    document.getElementById("editor").style.background = "burlywood"
    document.getElementById("editor").style.color = "white"

}
// calculador
function calculadora(){
    
    document.getElementById("calculador").style.display = "block"
    //document.getElementById("editior").style.color = "white"

}
//perfil
function perfil(){
  //  document.getElementById("app").style.display = "none";
  
   // document.getElementById("nameModal").style.display = "block"
 document.getElementById("perfil-form").style.display = "block";
  
    
    //document.getElementById("editor").style.color = "white"

}
function perfils(){
    document.getElementById("app").style.display = "none"
  
    document.getElementById("nameModal").style.display = "block"
   // document.getElementById("perfil-form").style.display = "block"
  
    
    //document.getElementById("editor").style.color = "white"

}
//add
function add(){
    document.getElementById("add").style.display = "block"
}
function tirar(){
    document.getElementById("add").style.display = "none"
}
//mais pessoas
function mais(){
   // document.getElementById("c").style.display = "none"
   document.getElementById("a").style.display = "none"

}
// anpliar no quadro
function dese(){
document.querySelector(".Anpliar").innerHTML =`
      <svg onclick="anpliar();" fill="#757575" opacity="1.0" width="24" height="24" viewBox="0 0 24 24"><path d="M21 15v6h-6l2.297-2.297-2.906-2.859 1.453-1.453 2.859 2.906zM9 21H3v-6l2.297 2.297 2.859-2.906 1.453 1.453-2.906 2.859zM3 9V3h6L6.703 5.297l2.906 2.859-1.453 1.453-2.859-2.906zm12-6h6v6l-2.297-2.297-2.859 2.906-1.453-1.453 2.906-2.859z"/></svg>
    
    `
   document.getElementById("body1").style.display = "none"
document.getElementById("editor").style.display = "block"

}
function anpliar(){
   document.querySelector(".Anpliar").innerHTML =`
     <svg onclick="dese();" fill="#757575" opacity="1.0" width="24" height="24" viewBox="0 0 24 24"><path d="M21 15v6h-6l2.297-2.297-2.906-2.859 1.453-1.453 2.859 2.906zM9 21H3v-6l2.297 2.297 2.859-2.906 1.453 1.453-2.906 2.859zM3 9V3h6L6.703 5.297l2.906 2.859-1.453 1.453-2.859-2.906zm12-6h6v6l-2.297-2.297-2.859 2.906-1.453-1.453 2.906-2.859z"/></svg>
      
      `
   document.getElementById("body1").style.display = "block"
document.getElementById("editor").style.display = "block"

}
// adionado reAdOnly

const textarea = document.getElementById('editor');
const botao = document.getElementById('btnR');

botao.addEventListener('click', () => {
  textarea.readOnly = !textarea.readOnly;
});
//teclados

   //sair da sala
/*const sairSala = document.getElementById('sairSala');

sairSala.addEventListener('click', () => {
    window.location.href = 'index.html';
});*/
function sairSala(){
  window.location.href = 'index.html';
}
// Insere o texto no cursor (funciona mesmo se o textarea estiver com texto selecionado)
function insertAtCaret(areaId, text) {
    const area = document.getElementById(areaId);
    const start = area.selectionStart;
    const end = area.selectionEnd;
    const value = area.value;
    
    area.value = value.substring(0, start) + text + value.substring(end);
    area.selectionStart = area.selectionEnd = start + text.length;
    area.focus();
}

// Adiciona o evento de clique a todos os botões do teclado
document.querySelectorAll('#mathKeyboard button').forEach(btn => {
    if (!btn.onclick) {  // evita sobrescrever os botões especiais (Limpar, etc.)
        btn.onclick = () => insertAtCaret('editor', btn.textContent);
    }
});




