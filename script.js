const galleryItems = Array.from(document.querySelectorAll(".photo-slot")).filter((item) => {
  return item.querySelector("img");
});

const lightbox = document.querySelector("#lightbox");
const lightboxImage = lightbox.querySelector(".lightbox-image");
const lightboxCaption = lightbox.querySelector(".lightbox-caption");
const closeButton = lightbox.querySelector(".lightbox-close");
const prevButton = lightbox.querySelector(".lightbox-prev");
const nextButton = lightbox.querySelector(".lightbox-next");
let currentGalleryIndex = 0;

const phoneRevealLinks = document.querySelectorAll(".phone-reveal");

function revealPhoneNumbers() {
  phoneRevealLinks.forEach((link) => {
    const displayNumber = link.dataset.display;
    const phoneNumber = link.dataset.phone;
    link.textContent = `Zadzwoń: ${displayNumber}`;
    link.href = `tel:${phoneNumber}`;
    link.dataset.revealed = "true";
    link.setAttribute("aria-label", `Zadzwoń: ${displayNumber}`);
  });
}

phoneRevealLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    if (link.dataset.revealed === "true") {
      return;
    }

    event.preventDefault();
    revealPhoneNumbers();
  });
});

function showGalleryImage(index) {
  currentGalleryIndex = (index + galleryItems.length) % galleryItems.length;
  const item = galleryItems[currentGalleryIndex];
  const image = item.querySelector("img");
  const caption = item.querySelector("span")?.textContent || image.alt || "Zdjęcie domu";
  lightboxImage.src = image.currentSrc || image.src;
  lightboxImage.alt = image.alt || caption;
  lightboxCaption.textContent = caption;
}

function openLightbox(index) {
  showGalleryImage(index);
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  closeButton.focus();
}

function closeLightbox() {
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  lightboxImage.src = "";
}

galleryItems.forEach((item, index) => {
  const label = item.querySelector("span")?.textContent || "dom";
  item.setAttribute("tabindex", "0");
  item.setAttribute("role", "button");
  item.setAttribute("aria-label", `Powiększ: ${label}`);
  item.addEventListener("click", () => openLightbox(index));
  item.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openLightbox(index);
    }
  });
});

closeButton.addEventListener("click", closeLightbox);
prevButton.addEventListener("click", () => showGalleryImage(currentGalleryIndex - 1));
nextButton.addEventListener("click", () => showGalleryImage(currentGalleryIndex + 1));

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (!lightbox.classList.contains("is-open")) {
    return;
  }

  if (event.key === "Escape") {
    closeLightbox();
  }

  if (event.key === "ArrowLeft") {
    showGalleryImage(currentGalleryIndex - 1);
  }

  if (event.key === "ArrowRight") {
    showGalleryImage(currentGalleryIndex + 1);
  }
});
