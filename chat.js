
  // === CfirebaseConfig ===
const firebaseConfig = {
    apiKey: "AIzaSyDhURTGDUqOuuvbClVqMRiEcYYvfDt_FPU",
    authDomain: "code-fb13e.firebaseapp.com",
    projectId: "code-fb13e",
    storageBucket: "code-fb13e.appspot.com",
    messagingSenderId: "749917957333",
    appId: "1:749917957333:web:6fc820b2bebb8e8234465c"
  };  

  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.database();
  const storage = firebase.storage();

  let meuUID = null;
  const janelas = {};

  function cadastrar() {
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;
    if (!email || !senha) return alert("Preencha tudo!");
    auth.createUserWithEmailAndPassword(email, senha);
  }

  function entrar() {
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;
    auth.signInWithEmailAndPassword(email, senha);
  }

  auth.onAuthStateChanged(user => {
    if (user) {
      meuUID = user.uid;
      document.getElementById("login").style.display = "none";

      db.ref("usuarios/" + meuUID).once("value", snap => {
        if (!snap.exists() || !snap.val().nome) {
          document.getElementById("perfil-form").style.display = "flex";
        } else {
          entrarNoChat();
        }
      });
    }
  });

  function salvarPerfil() {
    const nome = document.getElementById("nome").value.trim();
    const turma = document.getElementById("turma").value.trim();
      const fot = document.getElementById("img").value.trim();
    
    const fotoFile = document.getElementById("foto").files[0];

    if (!nome || !turma) return alert("Preencha nome e turma!");

    const salvar = () => {
      db.ref("usuarios/" + meuUID).set({
        nome, turma, fot, email: auth.currentUser.email, online: true
      }).then(() => entrarNoChat());
    };

    if (fotoFile) {
      const ref = storage.ref("fotos/" + meuUID);
      ref.put(fotoFile).then(snap => {
        snap.ref.getDownloadURL().then(url => {
          db.ref("usuarios/" + meuUID).update({foto: url}).then(salvar);
        });
      });
    } else {
      salvar();
    }
  }

  function entrarNoChat() {
    document.getElementById("perfil-form").style.display = "none";
    document.getElementById("app").style.display = "block";
    carregarPessoas();
    carregarGrupos();
    db.ref("usuarios/" + meuUID + "/online").set(true);
    db.ref("usuarios/" + meuUID + "/online").onDisconnect().set(false);
  }

  function aba(t) {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".lista").forEach(l => l.style.display = "none");
    document.querySelector(`.tab-btn[onclick="aba('${t}')"]`).classList.add("active");
    document.getElementById("lista-" + t).style.display = "block";
  }

  function carregarPessoas() {
    const lista = document.getElementById("lista-pessoas");
    db.ref("usuarios").on("value", snap => {
      lista.innerHTML = "";
      const todos = [];
      snap.forEach(c => {
        if (c.key === meuUID) return;
        todos.push({uid: c.key, data: c.val()});
      });

      db.ref("melhores_amigos/" + meuUID).once("value", m => {
        const melhores = Object.keys(m.val() || {});
        todos.sort((a,b) => melhores.includes(b.uid) - melhores.includes(a.uid));

        todos.forEach(p => {
          const div = document.createElement("div");
          div.className = `item ${melhores.includes(p.uid) ? "melhor" : ""}`;
          div.innerHTML = `
            <img class="avatar" src="${p.data.foto || 'https://via.placeholder.com/60'}">
            <img class="img" src="${p.data.fot}.jpg"/>
            <div class="info">
            
              <div class="nome">${p.data.nome}</div>
              <div class="turma">${p.data.turma || "Aluno ou professor"}</div>
            </div>
            <i class="fas fa-star estrela ${melhores.includes(p.uid) ? "ativo" : ""}" 
               onclick="event.stopPropagation(); toggleMelhor('${p.uid}', this)"></i>
            ${p.data.online ? '<div class="online"></div>' : ''}
          `;
          div.onclick = () => abrirChat(p.data, p.uid);
          lista.appendChild(div);
        });
      });
    });
  }

  function toggleMelhor(uid, el) {
      
    const ref = db.ref("melhores_amigos/" + meuUID + "/" + uid);
    ref.once("value", s => {
      s.val() ? ref.remove() : ref.set(true);
    });
  }

  function abrirChat(user, uid) {
    if (janelas[uid]) return;
    const chatId = [meuUID, uid].sort().join("_");
    const box = document.createElement("div");
    box.className = "chat-box";
    box.id = "box-" + uid;
    box.innerHTML = `
      <div class="chat-header">
        <div>${user.nome}</div>
        <div class="close" onclick="fechar('${uid}')">×</div>
      </div>
      <div class="chat-messages" id="msgs-${uid}"></div>
      <div class="chat-input">
        <input type="text" placeholder="Mensagem..." onkeypress="if(event.key==='Enter') enviar('${uid}', this)">
        <button onclick="enviar('${uid}', this.previousElementSibling)">Enviar</button>
      </div>
    `;
      document.getElementById("app").style.display = "none"
    document.getElementById("janelas").appendChild(box);
    janelas[uid] = true;

    db.ref("chats/" + chatId).on("child_added", m => {
      const msg = m.val();
      const div = document.createElement("div");
      div.className = `msg ${msg.de === meuUID ? "eu" : "outro"}`;
      div.textContent = msg.texto;
      document.getElementById("msgs-" + uid).appendChild(div);
      div.scrollIntoView();
    });
  }

  function enviar(uid, input) {
    const texto = input.value.trim();
    if (!texto) return;
    const chatId = [meuUID, uid].sort().join("_");
    db.ref("chats/" + chatId).push({de: meuUID, texto});
    input.value = "";
  }

  function fechar(uid) {
    document.getElementById("box-" + uid)?.remove();
      document.getElementById("app").style.display = "block"

    delete janelas[uid];
  }

  function carregarGrupos() {
    // (mesmo código anterior de grupos)
  }
