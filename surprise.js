
document.addEventListener("DOMContentLoaded", () => {
    const popup = document.getElementById("surprisePopup");
    const openButton = document.getElementById("openSurprise");
    const yesButton = document.getElementById("yesSurprise");
    const noButton = document.getElementById("noSurprise");
    const audio = document.getElementById("surpriseAudio");

    if (!popup || !openButton || !yesButton || !noButton || !audio) {
        console.error("Surprise popup elements are missing.");
        return;
    }

    // Open popup and play music
    openButton.addEventListener("click", async () => {
        if (!popup.open) {
            popup.showModal();
        }

        try {
            await audio.play();
        } catch (error) {
            console.error("Audio could not play:", error);
        }
    });

    // Yes closes the popup and stops the music
    yesButton.addEventListener("click", () => {
        audio.pause();
        audio.currentTime = 0;
        popup.close();
    });

let lastMove = 0;

function moveNoButton() {
    const padding = 12;
    const rect = noButton.getBoundingClientRect();

    const maxX = Math.max(padding, window.innerWidth - rect.width - padding);
    const maxY = Math.max(padding, window.innerHeight - rect.height - padding);

    // Choose a position far from its current location
    let x, y;
    let attempts = 0;

    do {
        x = padding + Math.random() * (maxX - padding);
        y = padding + Math.random() * (maxY - padding);
        attempts++;
    } while (
        attempts < 20 &&
        Math.hypot(x - rect.left, y - rect.top) < 180
    );

    noButton.classList.add("running");
    noButton.style.left = `${x}px`;
    noButton.style.top = `${y}px`;

    lastMove = Date.now();
}

// Desktop: move as the pointer approaches the button
document.addEventListener("pointermove", (event) => {
    if (!popup.open || event.pointerType !== "mouse") return;

    const rect = noButton.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distance = Math.hypot(
        event.clientX - centerX,
        event.clientY - centerY
    );

    if (distance < 120 && Date.now() - lastMove > 100) {
        moveNoButton();
    }
});

// Prevent desktop clicks
noButton.addEventListener("click", (event) => {
    event.preventDefault();
    moveNoButton();
});

// Mobile: teleport on touch
noButton.addEventListener("touchstart", (event) => {
    event.preventDefault();
    moveNoButton();
}, { passive: false }); });
