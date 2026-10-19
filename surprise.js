
document.addEventListener("DOMContentLoaded", () => {
    const popup = document.getElementById("surprisePopup");
    const openButton = document.getElementById("openSurprise");
    const yesButton = document.getElementById("yesSurprise");
    const noButton = document.getElementById("noSurprise");
    const audio = document.getElementById("surpriseAudio");

    const thankYouPopup = document.getElementById("thankYouPopup");
    const promiseButton = document.getElementById("promiseButton");

    if (!popup || !openButton || !yesButton || !noButton || !audio) {
        console.error("Surprise popup elements are missing.");
        return;
    }

    // ========================================
    // PLAYLIST: Add more songs inside this array
    // ========================================
    const playlist = [
        "resources/Lord Huron - The Night We Met (Official Audio) - Lord Huron.mp3",

        // Add more songs below:
        // "resources/song2.mp3",
        // "resources/song3.mp3",
        // "resources/song4.mp3"
    ];

    let currentSong = 0;

    // Load the first song
    audio.src = playlist[currentSong];
    audio.loop = false; // Let JavaScript advance through the playlist.

    // Play the next song when the current song ends.
    // After the last song, return to the first song.
    audio.addEventListener("ended", () => {
        currentSong = (currentSong + 1) % playlist.length;

        audio.src = playlist[currentSong];

        audio.play().catch(error => {
            console.error("Could not play the next song:", error);
        });
    });

    // Open the first popup and start the playlist.
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

    // Yes: switch to the second popup.
    // Music continues playing.
    yesButton.addEventListener("click", () => {
        if (!thankYouPopup) {
            console.error("Second dialog is missing from the HTML.");
            return;
        }

        popup.close();
        thankYouPopup.showModal();
    });

    // Promise: close the second popup and stop/reset the playlist.
    if (promiseButton && thankYouPopup) {
        promiseButton.addEventListener("click", () => {
            thankYouPopup.close();

            audio.pause();
            audio.currentTime = 0;

            // Start from the first song next time.
            currentSong = 0;
            audio.src = playlist[currentSong];
            audio.load();
        });
    }

    // ========================================
    // DODGING "NO" BUTTON
    // ========================================
    let lastMove = 0;

    function moveNoButton() {
        const padding = 12;
        const rect = noButton.getBoundingClientRect();

        const maxX = Math.max(
            padding,
            window.innerWidth - rect.width - padding
        );

        const maxY = Math.max(
            padding,
            window.innerHeight - rect.height - padding
        );

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

    // Desktop: dodge when the pointer gets close.
    document.addEventListener("pointermove", event => {
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

    // Desktop: dodge if clicked.
    noButton.addEventListener("click", event => {
        event.preventDefault();
        moveNoButton();
    });

    // Mobile: dodge when touched.
    noButton.addEventListener("touchstart", event => {
        event.preventDefault();
        moveNoButton();
    }, { passive: false });
});
