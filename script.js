let selectedDate = "";
let selectedTime = "";
let selectedActivity = "";
let selectedDetail = "";

const FORM_URL = "https://formspree.io/f/mykqqlqo";

flatpickr("#dateInput", {
  locale: "tr",
  dateFormat: "Y-m-d",
  minDate: "today",
  disableMobile: true
});

function goToScreen(number, direction = "next") {
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active", "back");
  });

  const target = document.getElementById("screen" + number);

  if (direction === "back") {
    target.classList.add("back");
    setTimeout(() => {
      target.classList.remove("back");
      target.classList.add("active");
    }, 20);
  } else {
    target.classList.add("active");
  }
}

function nextScreen(number) {
  goToScreen(number, "next");
}

function prevScreen(number) {
  goToScreen(number, "back");
}

function saveDateTime() {
  selectedDate = document.getElementById("dateInput").value;
  selectedTime = document.getElementById("timeInput").value;

  if (!selectedDate || !selectedTime) {
    alert("Tarih ve saat seçmelisin 💗");
    return;
  }

  nextScreen(3);
}

function chooseActivity(activity) {
  selectedActivity = activity;
  selectedDetail = "";

  if (activity === "Bilardo") {
    showSummary();
    return;
  }

  if (activity === "Yemek") {
    showSubOptions("Ne yiyelim?", ["Pide", "Pizza", "Burger", "Diğer"]);
    return;
  }

  if (activity === "Cafe") {
    showSubOptions("Nereye gidelim?", ["Nofs", "Naomi", "MacBear", "Diğer"]);
    return;
  }

  if (activity === "Diğer") {
    showTextInput("Aklındaki aktivite ne?");
  }
}

function showSubOptions(title, options) {
  const card = document.getElementById("subOptionsCard");

  card.innerHTML = `
    <div class="emoji">💗</div>
    <h1>${title}</h1>

    <div class="option-grid">
      ${options.map(option => `
        <button onclick="chooseDetail('${option}')">${option}</button>
      `).join("")}
    </div>

    <button class="back-btn" onclick="prevScreen(3)">← Geri</button>
  `;

  nextScreen(4);
}

function chooseDetail(detail) {
  if (detail === "Diğer") {
    showTextInput("Ne olsun?");
    return;
  }

  selectedDetail = detail;
  showSummary();
}

function showTextInput(title) {
  const card = document.getElementById("subOptionsCard");

  card.innerHTML = `
    <div class="emoji">✨</div>
    <h1>${title}</h1>

    <textarea id="customInput" placeholder="Buraya yaz..."></textarea>

    <button onclick="saveCustomText()">Devam 💌</button>
    <button class="back-btn" onclick="prevScreen(3)">← Geri</button>
  `;

  nextScreen(4);
}

function saveCustomText() {
  const value = document.getElementById("customInput").value.trim();

  if (!value) {
    alert("Bir şey yazmalısın 💗");
    return;
  }

  selectedDetail = value;
  showSummary();
}

function formatDate(dateValue) {
  const date = new Date(dateValue);
  return date.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

function showSummary() {
  const summary = document.getElementById("summary");

  summary.innerHTML = `
    📅 Tarih: ${formatDate(selectedDate)}<br>
    🕒 Saat: ${selectedTime}<br>
    💗 Plan: ${selectedActivity}${selectedDetail ? " → " + selectedDetail : ""}
  `;

  nextScreen(5);
}

function sendAnswer() {
  fetch(FORM_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      tarih: formatDate(selectedDate),
      saat: selectedTime,
      aktivite: selectedActivity,
      detay: selectedDetail || "-"
    })
  })
  .then(response => {
    if (response.ok) {
      launchConfetti();
      setTimeout(() => {
        nextScreen(6);
      }, 500);
    } else {
      alert("Bir hata oldu, tekrar dene 💗");
    }
  })
  .catch(() => {
    alert("Bağlantı hatası oldu 💗");
  });
}

function createHearts() {
  const heartsContainer = document.querySelector(".hearts");

  setInterval(() => {
    const heart = document.createElement("div");
    heart.classList.add("heart");
    heart.innerHTML = Math.random() > 0.5 ? "💗" : "💕";

    heart.style.left = Math.random() * 100 + "vw";
    heart.style.fontSize = Math.random() * 18 + 14 + "px";
    heart.style.animationDuration = Math.random() * 5 + 5 + "s";

    heartsContainer.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 10000);
  }, 450);
}

function launchConfetti() {
  const emojis = ["🎊", "💗", "🌸", "✨", "💕", "💋"];

  for (let i = 0; i < 45; i++) {
    const confetti = document.createElement("div");
    confetti.classList.add("confetti");
    confetti.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];

    confetti.style.left = Math.random() * 100 + "vw";
    confetti.style.animationDuration = Math.random() * 1.5 + 1.8 + "s";

    document.body.appendChild(confetti);

    setTimeout(() => {
      confetti.remove();
    }, 3500);
  }
}

createHearts();