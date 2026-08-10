const pageOrder = ["cover", "profile", "tech-art", "three-d", "game-design", "motion", "contact"];
const pageNames = ["Обложка", "Обо мне", "Technical Art", "3D-путь", "Game Design", "Анимация", "Контакты"];
const visitedPages = new Set();
let currentPageIndex = 0;

const chapters = [...document.querySelectorAll(".chapter")];
const tabs = [...document.querySelectorAll(".book-tabs [data-page]")];
const progressBar = document.querySelector(".chapter-progress__bar i");
const progressText = document.querySelector(".chapter-progress b");
const currentPageText = document.querySelector(".current-page");
const pageCountText = document.querySelector(".page-count");
const previousButton = document.querySelector(".page-arrow--prev");
const nextButton = document.querySelector(".page-arrow--next");
const stampToast = document.querySelector(".stamp-toast");
let toastTimer;

function updateProgress() {
  const count = visitedPages.size;
  progressBar.style.width = `${(count / 6) * 100}%`;
  progressText.textContent = `${count} / 6 глав`;
  document.querySelectorAll(".collected-stamps [data-stamp]").forEach((stamp) => {
    stamp.classList.toggle("is-collected", visitedPages.has(stamp.dataset.stamp));
  });
}

function showStampToast() {
  stampToast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => stampToast.classList.remove("is-visible"), 1700);
}

function showPage(pageName, updateHash = true) {
  const nextIndex = pageOrder.indexOf(pageName);
  if (nextIndex < 0) return;

  const oldChapter = chapters.find((chapter) => !chapter.hidden);
  const newChapter = chapters.find((chapter) => chapter.dataset.chapter === pageName);
  if (oldChapter !== newChapter) {
    const direction = nextIndex > currentPageIndex ? "forward" : "backward";
    oldChapter?.querySelectorAll("video").forEach((video) => video.pause());
    oldChapter?.classList.remove("is-active");
    oldChapter?.setAttribute("hidden", "");
    newChapter.classList.remove("turn-forward", "turn-backward");
    newChapter.classList.add(direction === "forward" ? "turn-forward" : "turn-backward");
    newChapter.removeAttribute("hidden");
    requestAnimationFrame(() => newChapter.classList.add("is-active"));
  }

  currentPageIndex = nextIndex;
  tabs.forEach((tab) => tab.classList.toggle("is-active", tab.dataset.page === pageName));
  currentPageText.textContent = pageNames[currentPageIndex];
  pageCountText.textContent = `${currentPageIndex + 1} / ${pageOrder.length}`;
  previousButton.disabled = currentPageIndex === 0;
  nextButton.disabled = currentPageIndex === pageOrder.length - 1;

  if (pageName !== "cover" && !visitedPages.has(pageName)) {
    visitedPages.add(pageName);
    updateProgress();
    showStampToast();
  }

  if (updateHash && window.location.hash !== `#${pageName}`) {
    history.pushState({ page: pageName }, "", `#${pageName}`);
  }
  document.querySelector(".book").scrollIntoView({ block: "start", behavior: "smooth" });
}

tabs.forEach((tab) => tab.addEventListener("click", () => showPage(tab.dataset.page)));
document.querySelectorAll("[data-go]").forEach((button) => button.addEventListener("click", () => showPage(button.dataset.go)));
previousButton.addEventListener("click", () => showPage(pageOrder[currentPageIndex - 1]));
nextButton.addEventListener("click", () => showPage(pageOrder[currentPageIndex + 1]));
document.addEventListener("keydown", (event) => {
  if (document.querySelector(".lightbox").open) return;
  if (event.key === "ArrowLeft" && currentPageIndex > 0) showPage(pageOrder[currentPageIndex - 1]);
  if (event.key === "ArrowRight" && currentPageIndex < pageOrder.length - 1) showPage(pageOrder[currentPageIndex + 1]);
});

const galleries = {
  neonCash: ["images/neonCash/bgRegular.jpg", "images/neonCash/bgFree.jpg"],
  blade: ["images/3d_Blade/blade_1.png", "images/3d_Blade/blade_2.png", "images/3d_Blade/blade_3.png"],
  practice3d: ["images/3D_continue/robot.jpg", "images/3D_continue/maya.jpg", "images/3D_continue/deer.jpg"]
};
const lightbox = document.querySelector(".lightbox");
const lightboxImage = lightbox.querySelector("img");
const lightboxCaption = lightbox.querySelector("figcaption");
let activeGallery = [];
let activeImageIndex = 0;

function renderGalleryImage() {
  lightboxImage.src = activeGallery[activeImageIndex];
  lightboxImage.alt = `Изображение ${activeImageIndex + 1} из ${activeGallery.length}`;
  lightboxCaption.textContent = `${activeImageIndex + 1} / ${activeGallery.length}`;
}

document.querySelectorAll("[data-gallery]").forEach((button) => button.addEventListener("click", () => {
  activeGallery = galleries[button.dataset.gallery] || [];
  if (!activeGallery.length) return;
  activeImageIndex = 0;
  renderGalleryImage();
  lightbox.showModal();
}));

function moveGallery(direction) {
  activeImageIndex = (activeImageIndex + direction + activeGallery.length) % activeGallery.length;
  renderGalleryImage();
}

lightbox.querySelector(".lightbox__close").addEventListener("click", () => lightbox.close());
lightbox.querySelector(".lightbox__nav--prev").addEventListener("click", () => moveGallery(-1));
lightbox.querySelector(".lightbox__nav--next").addEventListener("click", () => moveGallery(1));
lightbox.addEventListener("click", (event) => { if (event.target === lightbox) lightbox.close(); });
document.addEventListener("keydown", (event) => {
  if (!lightbox.open) return;
  if (event.key === "ArrowLeft") moveGallery(-1);
  if (event.key === "ArrowRight") moveGallery(1);
});

const initialHash = window.location.hash.slice(1);
showPage(pageOrder.includes(initialHash) ? initialHash : "cover", false);
window.addEventListener("popstate", () => {
  const hashPage = window.location.hash.slice(1);
  showPage(pageOrder.includes(hashPage) ? hashPage : "cover", false);
});
