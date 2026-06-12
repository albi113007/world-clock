const clockDisplay = document.getElementById('clockDisplay');
const themeBtn = document.getElementById('themeBtn');
const timezoneSelect = document.getElementById('timezoneSelect');
const designBtns = document.querySelectorAll('.designBtn');

let currentDesign = 'digital';
let currentTimezone = 'UTC';

function getTime() {
  const now = new Date();
const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: currentTimezone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
  const parts = formatter.formatToParts(now);
  const h = parseInt(parts.find(p => p.type === 'hour').value);
  const m = parseInt(parts.find(p => p.type === 'minute').value);
  const s = parseInt(parts.find(p => p.type === 'second').value);
  return { h, m, s };
}

function updateClock() {
  const { h, m, s } = getTime();

  if (currentDesign === 'digital') {
    const hh = String(h).padStart(2, '0');
    const mm = String(m).padStart(2, '0');
    const ss = String(s).padStart(2, '0');
const ampm = h >= 12 ? 'PM' : 'AM';
const h12 = h % 12 || 12;
const hh12 = String(h12).padStart(2, '0');
clockDisplay.innerHTML = `${hh12}:${mm}:${ss} <span style="font-size:32px">${ampm}</span>`;
    clockDisplay.style.fontSize = '72px';
    clockDisplay.style.fontFamily = "'Courier New', monospace";
  }

  else if (currentDesign === 'analog') {
    const hDeg = ((h % 12) / 12) * 360 + (m / 60) * 30;
    const mDeg = (m / 60) * 360 + (s / 60) * 6;
    const sDeg = (s / 60) * 360;

    clockDisplay.style.fontSize = '';
    clockDisplay.innerHTML = `
      <svg width="220" height="220" viewBox="0 0 220 220">
        <circle cx="110" cy="110" r="105" fill="none" stroke="#333" stroke-width="4"/>
        ${[...Array(12)].map((_, i) => {
          const angle = (i * 30) * Math.PI / 180;
          const x1 = 110 + 90 * Math.sin(angle);
          const y1 = 110 - 90 * Math.cos(angle);
          const x2 = 110 + 100 * Math.sin(angle);
          const y2 = 110 - 100 * Math.cos(angle);
          return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#333" stroke-width="2"/>`;
        }).join('')}
        <line x1="110" y1="110"
          x2="${110 + 60 * Math.sin(hDeg * Math.PI / 180)}"
          y2="${110 - 60 * Math.cos(hDeg * Math.PI / 180)}"
          stroke="#a71717" stroke-width="6" stroke-linecap="round"/>
        <line x1="110" y1="110"
          x2="${110 + 80 * Math.sin(mDeg * Math.PI / 180)}"
          y2="${110 - 80 * Math.cos(mDeg * Math.PI / 180)}"
          stroke="#bd4848" stroke-width="4" stroke-linecap="round"/>
        <line x1="110" y1="110"
          x2="${110 + 90 * Math.sin(sDeg * Math.PI / 180)}"
          y2="${110 - 90 * Math.cos(sDeg * Math.PI / 180)}"
          stroke="red" stroke-width="2" stroke-linecap="round"/>
        <circle cx="110" cy="110" r="5" fill="#635d5d"/>
      </svg>
    `;
  }

  else if (currentDesign === 'binary') {
    const toBinary = (num, bits) => num.toString(2).padStart(bits, '0').split('');

    const rows = [
      { label: 'H', bits: toBinary(h, 6) },
      { label: 'M', bits: toBinary(m, 6) },
      { label: 'S', bits: toBinary(s, 6) },
    ];

    clockDisplay.style.fontSize = '';
    clockDisplay.innerHTML = `
      <div style="display:flex; flex-direction:column; align-items:center; gap:14px; padding:20px;">
        ${rows.map(row => `
          <div style="display:flex; align-items:center; gap:10px;">
            <span style="font-size:16px; font-weight:bold; width:20px;">${row.label}</span>
            <div style="display:flex; gap:8px;">
              ${row.bits.map(bit => `
                <div style="
                  width:28px; height:28px; border-radius:50%;
                  background:${bit === '1' ? '#ffcc00' : '#555'};
                  border: 2px solid #ffcc00;
                "></div>
              `).join('')}
            </div>
          </div>
        `).join('')}
        <p style="font-size:12px; color:#aaa; margin-top:8px;">H = Hours &nbsp; M = Minutes &nbsp; S = Seconds</p>
      </div>
    `;
  }
}

themeBtn.addEventListener('click', function () {
  document.body.classList.toggle('darkMode');
  themeBtn.textContent = document.body.classList.contains('darkMode')
    ? '☀️ Light Mode' : '🌙 Dark Mode';
});

timezoneSelect.addEventListener('change', function (e) {
  currentTimezone = e.target.value;
  updateClock();
});

designBtns.forEach(btn => {
  btn.addEventListener('click', function () {
    designBtns.forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    currentDesign = this.dataset.design;
    updateClock();
  });
});

setInterval(updateClock, 1000);
updateClock();
document.querySelector('[data-design="digital"]').classList.add('active');