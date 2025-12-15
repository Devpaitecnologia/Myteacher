// === CONFIGURAÇÃO DO FIREBASE ===
const firebaseConfig = {
  apiKey: "AIzaSyDhURTGDUqOuuvbClVqMRiEcYYvfDt_FPU",
  authDomain: "code-fb13e.firebaseapp.com",
  databaseURL: "https://code-fb13e-default-rtdb.firebaseio.com",
  projectId: "code-fb13e",
  storageBucket: "code-fb13e.appspot.com",
  messagingSenderId: "749917957333",
  appId: "1:749917957333:web:6fc820b2bebb8e8234465c"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Elementos DOM
const editor = document.getElementById('editor');
const status = document.getElementById('status');
const usersList = document.getElementById('usersList');
const onlineCount = document.getElementById('onlineCount');
const modal = document.getElementById('nameModal');
const enterBtn = document.getElementById('enterBtn');
const nameInput = document.getElementById('nameInput');

const newRoomBtn = document.getElementById('newRoomBtn');
const joinRoomBtn = document.getElementById('joinRoomBtn');
const roomIdInput = document.getElementById('roomIdInput');
const currentRoomInfo = document.getElementById('currentRoomInfo');
const shareLink = document.getElementById('shareLink');
const copyLinkBtn = document.getElementById('copyLinkBtn');
const copyRoomIdBtn = document.getElementById('copyRoomIdBtn');

// Variáveis
let meuNome = localStorage.getItem('meuNomeEditor') || '';
let meuId = localStorage.getItem('meuIdEditor') || null;
let currentRoomId = null;
let textoRef = null;
let presencesRef = null;
let meuPresenceRef = null;
let ignoreLocalChange = false;
const CHAVE_SALA_PERMANENTE = 'salaPermanenteEditor';


// Funções de tema (mantidas)
function colors() { document.getElementById('colors').classList.toggle('active'); }
function exit() { document.getElementById('colors').classList.remove('active'); }
function colorWhite() { document.body.className = 'white'; exit(); }
function colorGray() { document.body.className = 'gray'; exit(); }
function colorEscuro() { document.body.className = 'dark'; exit(); }
function colorBurl() { document.body.className = 'burl'; exit(); }

   // Salvar sala como permanente
        function salvarSalaPermanente(roomId) {
            localStorage.setItem(CHAVE_SALA_PERMANENTE, roomId);
        }

        // Carregar sala permanente (se existir)
        function carregarSalaPermanente() {
            const salaSalva = localStorage.getItem(CHAVE_SALA_PERMANENTE);
            if (salaSalva) {
                loadRoom(salaSalva);
            }
        }
// Gerar ID único para o usuário
function getOrCreateMyId() {
  if (!meuId) {
    meuId = 'user_' + Math.random().toString(36).substring(2, 12);
    localStorage.setItem('meuIdEditor', meuId);
  }
  return meuId;
}

// Gerar ID curto para sala (ex: abc123)
function generateRoomId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result.toUpperCase();
}

// Obter sala da URL
function getRoomFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('sala');
}

// Atualizar URL com ID da sala
function updateUrl(roomId) {
  const url = new URL(window.location);
  if (roomId) {
    url.searchParams.set('sala', roomId);
  } else {
    url.searchParams.delete('sala');
  }
  window.history.replaceState({}, '', url);
}

// Carregar sala (criar ou entrar)
function loadRoom(roomId) {
  if (!roomId) return;

  currentRoomId = roomId;
  roomIdInput.value = roomId;
  updateUrl(roomId);

  // Atualizar interface
  currentRoomInfo.textContent = `Sala atual: ${roomId}`;
  shareLink.innerHTML = `<a href="\ ${window.location.href}" target="_blank"> \ ${window.location.href}</a>`;

  // Referências Firebase da sala
  textoRef = db.ref(`salas/${roomId}/texto`);
  presencesRef = db.ref(`salas/${roomId}/presences`);

  // Limpar presença antiga
  if (meuPresenceRef) meuPresenceRef.remove();

  // Presença do usuário
  db.ref('.info/connected').on('value', (snap) => {
    if (snap.val() === true) {
      meuPresenceRef = presencesRef.child(meuId);
      meuPresenceRef.set({
        nome: meuNome,
        online: true,
        ultimaVez: firebase.database.ServerValue.TIMESTAMP
      });
      meuPresenceRef.onDisconnect().remove();
    }
  });

  // Lista de usuários na sala
  presencesRef.on('value', (snap) => {
    const users = snap.val() || {};
    const total = Object.keys(users).length;

    onlineCount.textContent = total === 1 ? '1 pessoa na sala' : `${total} pessoas na sala`;
    currentRoomInfo.textContent = `Sala atual: \( ${roomId} ( \)${total} online)`;

    let html = '';
    for (let id in users) {
      html += `<div class="user-item"><span class="dot"></span>${users[id].nome || 'Anônimo'}</div>`;
    }
    usersList.innerHTML = html || 'Você está sozinho na sala...';
  });

  // Sincronização do texto
  textoRef.on('value', (snapshot) => {
    const texto = snapshot.val() || '';
    if (editor.value !== texto) {
      ignoreLocalChange = true;
      editor.value = texto;
      ignoreLocalChange = false;
    }
  });

  editor.addEventListener('input', () => {
    if (ignoreLocalChange) return;
    textoRef.set(editor.value);
  });

  status.textContent = `Conectado à sala ${roomId} — Edição em tempo real`;
  editor.style.display = 'block';
  editor.focus();
}

// Botões
newRoomBtn.addEventListener('click', () => {
  const newId = generateRoomId();
  loadRoom(newId);
});

joinRoomBtn.addEventListener('click', () => {
  let id = roomIdInput.value.trim().toUpperCase();
  if (!id) {
    alert('Digite o ID da sala!');
    return;
  }
  loadRoom(id);
});

// Enter no input
roomIdInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') joinRoomBtn.click();
});

// Copiar link completo
copyLinkBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(window.location.href).then(() => {
    copyLinkBtn.textContent = 'Copiado!';
    setTimeout(() => { copyLinkBtn.textContent = 'Copiar Link'; }, 2000);
  });
});

// Copiar só o ID da sala
copyRoomIdBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(currentRoomId).then(() => {
    copyRoomIdBtn.textContent = 'ID Copiado!';
    setTimeout(() => { copyRoomIdBtn.textContent = 'Copiar ID da Sala'; }, 2000);
  });
});
// Se já tem nome salvo, pula o modal
  if (meuNome) {
    modal.style.display = 'none';
    
    iniciarComNome(meuNome);
  }
// Salvar nome
function salvarNome() {
  let nome = nameInput.value.trim();
  if (!nome) nome = 'Anônimo';
  meuNome = nome.substring(0, 25);
  localStorage.setItem('meuNomeEditor', meuNome);
  modal.style.display = 'none';
  document.getElementById("app").style.display = "block";

  iniciarApp();
}

enterBtn.addEventListener('click', salvarNome);
nameInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') salvarNome();
});

// Iniciar aplicativo
function iniciarApp() {
  getOrCreateMyId();

  // Ver se tem sala na URL
  const roomFromUrl = getRoomFromUrl();
  if (roomFromUrl) {
    loadRoom(roomFromUrl.toUpperCase());
  } else {
    // Se não, mostra apenas os controles (usuário cria ou entra)
    currentRoomInfo.textContent = 'Crie uma sala ou entre em uma existente';
    status.textContent = 'Escolha ou crie uma sala para começar';
  }
}

// Iniciar se já tem nome
if (meuNome) {
  modal.style.display = 'none';
  iniciarApp();
}