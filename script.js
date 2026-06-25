const iconMenuBtn = document.getElementById("icon-button")

/**
 * Event listener on the hamburger icon used for the mobile navigation.
 */
if (iconMenuBtn) {
    iconMenuBtn.addEventListener("click", showMobileMenu)
}

/**
 * This displays the mobile navigation and removes the hamburger icon
 * when the icon itself is clicked.
 */
function showMobileMenu() {
    iconMenuBtn.style.display = "none"

    const menu = document.querySelector("nav > ul")
    menu.style.display = "flex"

    const blurEl = document.getElementById("blur")
    blurEl.style.display = "block"
}