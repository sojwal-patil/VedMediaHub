let lastScroll = 0;
const header = document.querySelector("header");

window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;

    // Always show at the top
    if (currentScroll <= 0) {
        header.classList.remove("hide");
        return;
    }

    // Scrolling down
    if (currentScroll > lastScroll) {
        header.classList.add("hide");
    }
    // Scrolling up
    else {
        header.classList.remove("hide");
    }

    lastScroll = currentScroll;
});
