const swiper = new Swiper(".mySwiper", {
  navigation: {
    nextEl: ".arrow-right",
    prevEl: ".arrow-left",
  },
});

const defaultTexts = [
  "Join us for a beautiful wedding celebration",
  "With blessings, two hearts become one",
  "Save the date for a day filled with love",
];

let selectedEl = null;

function getActiveSlide() {
  return document.querySelector(".swiper-slide-active .slide-image");
}

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

addTextBtn.onclick = () => {
  const slide = getActiveSlide();

  const text = document.createElement("div");
  text.className = "text-item";
  text.innerText = "Your Text Here";

  text.style.left = "50%";
  text.style.top = "50%";
  text.style.fontSize = fontSize.value + "px";
  text.style.color = fontColor.value;
  text.style.fontFamily = fontFamily.value;
  text.style.textAlign = textAlign.value;

  slide.appendChild(text);
  makeDraggable(text, slide);
  selectText(text);
};

deleteTextBtn.onclick = () => {
  if (selectedEl) {
    selectedEl.remove();
    selectedEl = null;
  }
};

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

function makeDraggable(el, parent) {
  let isDown = false,
    startX,
    startY,
    initL,
    initT;

  el.addEventListener("pointerdown", (e) => {
    isDown = true;
    selectText(el);

    const rect = el.getBoundingClientRect();
    const pRect = parent.getBoundingClientRect();

    startX = e.clientX;
    startY = e.clientY;
    initL = rect.left - pRect.left;
    initT = rect.top - pRect.top;
  });

  window.addEventListener("pointerup", () => (isDown = false));

  window.addEventListener("pointermove", (e) => {
    if (!isDown || !selectedEl) return;

    const pRect = parent.getBoundingClientRect();

    let newLeft = initL + (e.clientX - startX);
    let newTop = initT + (e.clientY - startY);

    newLeft = Math.max(
      0,
      Math.min(newLeft, pRect.width - selectedEl.offsetWidth)
    );
    newTop = Math.max(
      0,
      Math.min(newTop, pRect.height - selectedEl.offsetHeight)
    );

    selectedEl.style.left = (newLeft / pRect.width) * 100 + "%";
    selectedEl.style.top = (newTop / pRect.height) * 100 + "%";
    selectedEl.style.transform = "translate(0,0)";
  });
}

document.querySelectorAll(".slide-image").forEach((slide, index) => {
  const text = document.createElement("div");
  text.className = "text-item";

  text.innerText = defaultTexts[index];

  text.style.left = "50%";
  text.style.top = "35%";
  text.style.fontSize = "22px";
  text.style.color = "#602020";
  text.style.fontFamily = "Dancing Script, cursive";

  slide.appendChild(text);
  makeDraggable(text, slide);
});
