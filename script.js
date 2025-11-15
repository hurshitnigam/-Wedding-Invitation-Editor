/* -------------------- SWIPER SETUP -------------------- */
const swiper = new Swiper(".mySwiper", {
  navigation: {
    nextEl: ".arrow-right",
    prevEl: ".arrow-left",
  },
});

/* -------------------- GLOBALS -------------------- */
let selectedEl = null;

/* -------------------- HELPERS -------------------- */
function getActiveSlide() {
  return document.querySelector(".swiper-slide-active .slide-image");
}

/* Select a text item */
function selectText(el) {
  if (selectedEl) selectedEl.classList.remove("selected");
  selectedEl = el;
  el.classList.add("selected");

  textContent.value = el.innerText;
  fontSize.value = parseInt(el.style.fontSize);
  fontColor.value = el.style.color;
  fontFamily.value = el.style.fontFamily;
  textAlign.value = el.style.textAlign;
}

/* -------------------- CREATE TEXT ELEMENT -------------------- */
function createTextElement(str) {
  const text = document.createElement("div");
  text.className = "text-item";
  text.setAttribute("contenteditable", "true");

  text.innerText = str;

  text.style.left = "50%";
  text.style.top = "50%";
  text.style.fontSize = fontSize.value + "px";
  text.style.color = fontColor.value;
  text.style.fontFamily = fontFamily.value;
  text.style.textAlign = textAlign.value;

  return text;
}

/* -------------------- ADD TEXT -------------------- */
addTextBtn.onclick = () => {
  const slide = getActiveSlide();
  const text = createTextElement("Your Text Here");

  slide.appendChild(text);
  makeDraggable(text, slide);
  selectText(text);
};

/* -------------------- DELETE TEXT -------------------- */
deleteTextBtn.onclick = () => {
  if (selectedEl) {
    selectedEl.remove();
    selectedEl = null;
  }
};

/* -------------------- CLICK TO EDIT -------------------- */
document.addEventListener("click", (e) => {
  const textItem = e.target.closest(".text-item");
  if (textItem) {
    selectText(textItem);
    textItem.focus();
  }
});

/* -------------------- SIDEBAR CONTROLS -------------------- */
textContent.oninput = () =>
  selectedEl && (selectedEl.innerText = textContent.value);
fontSize.oninput = () =>
  selectedEl && (selectedEl.style.fontSize = fontSize.value + "px");
fontColor.oninput = () =>
  selectedEl && (selectedEl.style.color = fontColor.value);
fontFamily.onchange = () =>
  selectedEl && (selectedEl.style.fontFamily = fontFamily.value);
textAlign.onchange = () =>
  selectedEl && (selectedEl.style.textAlign = textAlign.value);

/* -------------------- DRAGGING LOGIC -------------------- */
function makeDraggable(el, parent) {
  let isDown = false,
    isDragging = false;
  let startX, startY, initL, initT;

  el.addEventListener("pointerdown", (e) => {
    isDown = true;
    isDragging = false;

    selectText(el);

    const rect = el.getBoundingClientRect();
    const pRect = parent.getBoundingClientRect();

    startX = e.clientX;
    startY = e.clientY;
    initL = rect.left - pRect.left;
    initT = rect.top - pRect.top;
  });

  window.addEventListener("pointermove", (e) => {
    if (!isDown || !selectedEl) return;

    const diffX = e.clientX - startX;
    const diffY = e.clientY - startY;

    if (!isDragging && Math.abs(diffX) < 5 && Math.abs(diffY) < 5) return;

    isDragging = true;
    el.blur(); // prevent typing mode while dragging

    const pRect = parent.getBoundingClientRect();

    let newLeft = initL + diffX;
    let newTop = initT + diffY;

    newLeft = Math.max(0, Math.min(newLeft, pRect.width - el.offsetWidth));
    newTop = Math.max(0, Math.min(newTop, pRect.height - el.offsetHeight));

    el.style.left = (newLeft / pRect.width) * 100 + "%";
    el.style.top = (newTop / pRect.height) * 100 + "%";
    el.style.transform = "translate(0,0)";
  });

  window.addEventListener("pointerup", () => (isDown = false));
}

/* -------------------- DEFAULT TEXT PER SLIDE -------------------- */
const defaultTexts = [
  "Join us for a beautiful wedding celebration",
  "With blessings, two hearts become one",
  "Save the date for a day filled with love",
];

document.querySelectorAll(".slide-image").forEach((slide, i) => {
  const text = createTextElement(defaultTexts[i]);

  slide.appendChild(text);
  makeDraggable(text, slide);
});
