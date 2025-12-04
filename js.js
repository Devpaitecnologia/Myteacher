

 // === SUAS CONFIGS DO FIREBASE ===
   const firebaseConfig = {
    apiKey: "AIzaSyDhURTGDUqOuuvbClVqMRiEcYYvfDt_FPU",
    authDomain: "code-fb13e.firebaseapp.com",
    projectId: "code-fb13e",
    storageBucket: "code-fb13e.appspot.com",
    messagingSenderId: "749917957333",
    appId: "1:749917957333:web:6fc820b2bebb8e8234465c"
  };  
  // =================================

  firebase.initializeApp(firebaseConfig);
  const db = firebase.database();

  const textoRef = db.ref('texto');
  const presencesRef = db.ref('presences');
  const editor = document.getElementById('editor');
  const status = document.getElementById('status');
  const usersList = document.getElementById('usersList');
  const onlineCount = document.getElementById('onlineCount');
  const modal = document.getElementById('nameModal');

  let meuId = null;
  let meuNome = localStorage.getItem('meuNomeEditor') || '';
  let ignorarChange = false;

  // Se já tem nome salvo, pula o modal
  if (meuNome) {
    modal.style.display = 'none';
    iniciarComNome(meuNome);
  }

  function salvarNome() {
    let nome = document.getElementById('nameInput').value.trim();
    if (!nome) nome = 'Anônimo';
    meuNome = nome.substring(0, 25);
    localStorage.setItem('meuNomeEditor', meuNome);
    modal.style.display = 'none';
    iniciarComNome(meuNome);
  }

  function iniciarComNome(nome) {
    // Sistema de presença com nome
    db.ref('.info/connected').on('value', (snap) => {
      if (snap.val() === true) {
        meuId = presencesRef.push().key;
        const minhaPresenca = presencesRef.child(meuId);
        minhaPresenca.set({ nome: nome, online: true, ultimaVez: firebase.database.ServerValue.TIMESTAMP });
        minhaPresenca.onDisconnect().remove();

        status.textContent = 'Conectado como ' + nome;
        status.classList.remove('offline');
      }
    });

    // Atualiza lista de usuários online
    presencesRef.on('value', (snap) => {
      const users = snap.val() || {};
      const total = Object.keys(users).length;

      onlineCount.textContent = total === 1 ? '1 pessoa online' : `${total} pessoas online`;

      let html = '';
      for (let id in users) {
        const user = users[id];
        html += `<div class="user-item"><span class="dot"></span>${user.nome || 'Anônimo'}</div>`;
      }
      usersList.innerHTML = html || 'Ninguém online ainda...';
    });
  }

  // Sincronização do texto
  textoRef.on('value', (snapshot) => {
    const texto = snapshot.val() || '';
    if (editor.value !== texto) {
      ignorarChange = true;
      editor.value = texto;
    }
  });

  editor.addEventListener('input', () => {
    if (ignorarChange) {
      ignorarChange = false;
      return;
    }
    textoRef.set(editor.value);
  });

  // Enter no input do nome
  document.getElementById('nameInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') salvarNome();
  });