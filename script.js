const iconMenuBtn = document.getElementById("icon-button")

if (iconMenuBtn) {
    iconMenuBtn.addEventListener("click", showMobileMenu)
}

function showMobileMenu() {
    iconMenuBtn.style.display = "none"

    const menu = document.querySelector("nav > ul")
    menu.style.display = "flex"

    const blurEl = document.getElementById("blur")
    blurEl.style.display = "block"
}