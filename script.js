let current = '', previous = '', operator = null, statsArr = [];

const display = document.getElementById('display');
const buttons = document.getElementById('buttons');
const modeSelect = document.getElementById('mode-select');
const themeToggle = document.getElementById('theme-toggle');

modeSelect.addEventListener('change', () => {
  document.body.className = 'mode-' + modeSelect.value;
  reset();
});

themeToggle.addEventListener('click', () => {
  const theme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', theme);
  themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
});

buttons.addEventListener('click', e => {
  const btn = e.target.closest('button');
  if (!btn) return;
  const mode = modeSelect.value;

  const digit = btn.dataset.digit;
  const action = btn.dataset.action;

  if (digit) return input(digit);
  if (action) return handleAction(action, mode);
});

function input(v) {
  if (v === '.' && current.includes('.')) return;
  current = current === '0' && v !== '.' ? v : current + v;
  update();
}

function handleAction(a, mode) {
  if (a === 'clear') return reset();
  if (a === 'calculate') return calculate();
  if (mode === 'scientific') return sci(a);
  if (mode === 'programmer') return prog(a);
  if (mode === 'statistics') return stat(a);
  if (mode === 'conversion') return conv(a);
  if (['add','subtract','multiply','divide'].includes(a)) return op(a);
}

function calculate() {
  if (operator && previous !== '') {
    let a = parseFloat(previous), b = parseFloat(current);
    if (operator === 'add') previous = (a + b) + '';
    if (operator === 'subtract') previous = (a - b) + '';
    if (operator === 'multiply') previous = (a * b) + '';
    if (operator === 'divide') previous = b === 0 ? 'Error' : (a / b) + '';
    current = previous; operator = null;
    update();
  }
}

function op(a) {
  if (current === '') return;
  if (previous !== '' && operator) calculate();
  operator = a;
  previous = current;
  current = '';
}

function sci(a) {
  let x = parseFloat(current); if (isNaN(x)) return;
  if (a === 'sin') current = Math.sin(x).toString();
  if (a === 'cos') current = Math.cos(x).toString();
  if (a === 'tan') current = Math.tan(x).toString();
  if (a === 'sqrt') current = Math.sqrt(x).toString();
  if (a === 'log') current = Math.log10(x).toString();
  if (a === 'ln') current = Math.log(x).toString();
  if (a === 'exp') current = Math.exp(x).toString();
  if (a === 'pow') { op('pow'); return; }
  update();
}

function prog(a) {
  let x = parseInt(current);
  if (isNaN(x)) return;
  if (['bin','oct','dec','hex'].includes(a)) {
    const map = {bin:2,oct:8,dec:10,hex:16};
    current = x.toString(map[a]).toUpperCase();
  } else if (a === 'and'||a==='or'||a==='xor') {
    if (!operator) { previous = current; operator = a; current = ''; return; }
    let y = parseInt(previous);
    let res = a === 'and'? y & x : a==='or'? y | x : y ^ x;
    current = res + ''; operator = null;
  } else if (a === 'not') current = (~x).toString();
  update();
}

function stat(a) {
  let x = parseFloat(current);
  if (!isNaN(x)) statsArr.push(x);
  if (a === 'sumx') current = statsArr.reduce((s,n)=>s+n,0).toString();
  if (a === 'sumx2') current = statsArr.reduce((s,n)=>s+n*n,0).toString();
  if (a === 'n') current = statsArr.length + '';
  if (a === 'mean') current = (statsArr.reduce((s,n)=>s+n,0)/statsArr.length).toString();
  if (a === 'stdev') {
    let m = statsArr.reduce((s,n)=>s+n,0)/statsArr.length;
    current = Math.sqrt(statsArr.reduce((s,n)=>s+(n-m)**2,0)/statsArr.length).toString();
  }
  update();
}

function conv(a) {
  let x = parseFloat(current);
  if (isNaN(x)) return;
  if (a === 'c2f') current = ((x * 9/5)+32).toFixed(2);
  if (a === 'f2c') current = ((x - 32)*5/9).toFixed(2);
  if (a === 'm2ft') current = (x * 3.28084).toFixed(2);
  if (a === 'ft2m') current = (x / 3.28084).toFixed(2);
  update();
}

function reset() {
  current = ''; previous = ''; operator = null;
  if (modeSelect.value === 'statistics') statsArr = [];
  update();
}

function update() {
  display.textContent = current || '0';
}

// initialize
reset();
