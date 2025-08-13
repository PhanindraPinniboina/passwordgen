// Elements
const result = document.getElementById('result');
const copyBtn = document.getElementById('copy');
const refreshBtn = document.getElementById('refresh');
const generateBtn = document.getElementById('generate');
const msg = document.getElementById('msg');

const lenRange = document.getElementById('length');
const lenNumber = document.getElementById('lengthNumber');
const lenValueLabel = document.getElementById('lengthValue');

const lowerCb = document.getElementById('lower');
const upperCb = document.getElementById('upper');
const numberCb = document.getElementById('number');
const symbolCb = document.getElementById('symbol');

// Character sets
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUM = "0123456789";
const SYM = "!@#$%^&*()-_=+[]{};:,.<>?/|\\";

// Helpers
const rand = max => Math.floor(Math.random() * max);
const pick = s => s[rand(s.length)];
function shuffle(array){
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Sync length inputs
function clampLen(v){ return Math.max(8, Math.min(20, Number(v) || 20)); }
function syncLength(v){
  const val = clampLen(v);
  lenRange.value = val;
  lenNumber.value = val;
  lenValueLabel.textContent = val;
}

lenRange.addEventListener('input', e => syncLength(e.target.value));
lenNumber.addEventListener('input', e => syncLength(e.target.value));

// Generate password ensuring at least one of each selected type
function generate(){
  const length = clampLen(lenRange.value);
  const sets = [];
  if (lowerCb.checked) sets.push(LOWER);
  if (upperCb.checked) sets.push(UPPER);
  if (numberCb.checked) sets.push(NUM);
  if (symbolCb.checked) sets.push(SYM);

  if (sets.length === 0){
    msg.textContent = "Select at least one character type.";
    result.value = "";
    return;
  }

  const all = sets.join("");
  const chars = [];

  // Guarantee one char from each selected set
  sets.forEach(set => chars.push(pick(set)));

  // Fill the rest
  for (let i = chars.length; i < length; i++){
    chars.push(pick(all));
  }

  // Shuffle to avoid predictable positions
  shuffle(chars);

  const password = chars.join("");
  result.value = password;
  msg.textContent = "New password ready.";
}

// Copy password
async function copy(){
  const text = result.value;
  if (!text){ msg.textContent = "Nothing to copy."; return; }
  try{
    await navigator.clipboard.writeText(text);
    msg.textContent = "Copied to clipboard ✔";
  }catch(err){
    // Fallback
    result.select();
    document.execCommand('copy');
    msg.textContent = "Copied to clipboard ✔";
  }
}

// Events
copyBtn.addEventListener('click', copy);
refreshBtn.addEventListener('click', generate);
generateBtn.addEventListener('click', generate);

// Initialize
syncLength(20);
generate();
