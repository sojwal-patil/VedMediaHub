const menuToggle = document.querySelector(".menu-toggle");
const menuBar = document.querySelector(".menu-bar");
const menuIcon = menuToggle.querySelector("i");

menuToggle.addEventListener("click", () => {
    menuBar.classList.toggle("active");

    if(menuBar.classList.contains("active")){
        menuIcon.classList.remove("fa-bars");
        menuIcon.classList.add("fa-xmark");
    }else{
        menuIcon.classList.remove("fa-xmark");
        menuIcon.classList.add("fa-bars");
    }
});

let lastScroll = 0;
const header = document.querySelector("header");

window.addEventListener("scroll", () => {

    if(menuBar.classList.contains("active")) return;

    const currentScroll = window.pageYOffset;

    if(currentScroll <= 0){
        header.classList.remove("hide");
        return;
    }

    if(currentScroll > lastScroll){
        header.classList.add("hide");
    }else{
        header.classList.remove("hide");
    }

    lastScroll = currentScroll;
});