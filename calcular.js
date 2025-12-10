

  const display = document.getElementById('display');

    function inserir(num) {
      display.value += num;
    }

    function limpar() {
      display.value = '';
    }

    function apagar() {
      display.value = display.value.slice(0, -1);
    }

    function calcular() {
      try {
        display.value = eval(display.value.replace('×','*').replace('÷','/'));
      } catch {
        display.value = 'Erro';
      }
    }

    function raizQuadrada() {
      const valor = parseFloat(display.value);
      if (isNaN(valor)) {
        display.value = 'Erro';
      } else if (valor < 0) {
        display.value = 'Erro (negativo)';
      } else {
        display.value = Math.sqrt(valor);
      }
    }

    // Permite usar o teclado
    document.addEventListener('keydown', function(e) {
      if (e.key >= 0 && e.key <= 9) inserir(e.key);
      if (e.key === '.') inserir('.');
      if (e.key === '+') inserir('+');
      if (e.key === '-') inserir('-');
      if (e.key === '*') inserir('*');
      if (e.key === '/') inserir('/');
      if (e.key === 'Enter') calcular();
      if (e.key === 'Backspace') apagar();
      if (e.key === 'Escape') limpar();
    });
  