setMainHeight();

/**
 * Sets the height of main section (which is the section that contains the videos)
 */
function setMainHeight() {
    const mainInlineStyle = document.getElementById("main").style;
    const navbarStyle = window.getComputedStyle(document.getElementById("navbar"));

    const clientHeight = document.documentElement.clientHeight;
    const mainNewHeight = clientHeight - parseInt(navbarStyle.height) - parseInt(navbarStyle.paddingBottom) - parseInt(navbarStyle.paddingTop);

    mainInlineStyle.setProperty("height", `${mainNewHeight}px`);
}