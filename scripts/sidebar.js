initSidebarBtns();


/**
 * Converts a string to a valid CSS selector.
 * @param {String} str The string to be converted
 * @returns The selector
 */
function convertToValidCSSSelector(str) {
    str = str.replace(/[<>]/g, "");
    str = str.trim();
    str = str.replace(/[ ]/g, "-");
    return str.toLowerCase();
}

/**
 * Generates the side bar btns
 */
function initSidebarBtns() {
    const standardBtns = new Map([
        ["Home", "fa-solid fa-house"],
        ["Shorts", "fa-brands fa-square-youtube"],
        ["Subscriptions", "fa-brands fa-youtube"]
    ]);
    const youSectionBtns = new Map([
        ["Your Channel", "fa-regular fa-id-badge"],
        ["History", "fa-solid fa-clock-rotate-left"],
        ["Playlists", "fa-solid fa-forward"],
        ["Your videos", "fa-regular fa-circle-play"],
        ["Watch later", "fa-regular fa-clock"],
        ["Liked videos", "fa-regular fa-thumbs-up"]
    ]);
    const exploreBtns = new Map([
        ["Trending", "fa-brands fa-gripfire"],
        ["Music", "fa-solid fa-music"],
        ["Movies & TV", "fa-solid fa-clapperboard"],
        ["Live", "fa-solid fa-tower-broadcast"],
        ["Gaming", "fa-solid fa-gamepad"],
        ["News", "fa-regular fa-newspaper"],
        ["Sports", "fa-solid fa-trophy"],
        ["Learning", "fa-regular fa-lightbulb"],
        ["Fashion & Beauty", "fa-solid fa-shirt"],
        ["Podcasts", "fa-solid fa-podcast"],
        ["Playables", "fa-solid fa-gamepad"]
    ]);
    const moreFromYtBtns = new Map([
        ["Youtube Premium", "fa-brands fa-youtube text-red"],
        ["Youtube Studio", "fa-brands fa-youtube text-red"],
        ["Youtube Music", "fa-brands fa-youtube text-red"],
        ["Youtube Kids", "fa-brands fa-youtube text-red"]
    ]);
    const settingsBtns = new Map([
        ["Settings", "fa-solid fa-gear"],
        ["Report history", "fa-regular fa-flag"],
        ["Help", "fa-regular fa-circle-question"],
        ["Send feedback", "fa-regular fa-message"]
    ]);
    const footerBtns = new Map([
        ["About Us", ""],
        ["Press", ""],
        ["Copyright", ""],
        ["Contact Us", ""],
        ["Creators", ""],
        ["Advertise", ""],
        ["Developers", ""],
        ["Terms", ""],
        ["Privacy", ""],
        ["Policy & Safety", ""],
        ["How Youtube works", ""],
        ["Test new features", ""]
    ]);

    const sidebarBtnsContent = new Map([
        ["Main", standardBtns],
        ["You >", youSectionBtns],
        ["Explore", exploreBtns],
        ["More from Youtube", moreFromYtBtns],
        ["Settings", settingsBtns],
        ["Footer", footerBtns]
    ]);

    const sidebar = document.getElementById("sidebar");

    for (let kv of sidebarBtnsContent) {
        let sectionTitle = kv[0];
        let sectionContent = kv[1];

        let section;
        if (sectionTitle === 'Footer')
            section = document.createElement('footer');
        else
            section = document.createElement("div");
        section.id = `${convertToValidCSSSelector(sectionTitle)}-controls`;
        if (sectionTitle !== 'Footer')
            section.innerHTML = `<h5> ${sectionTitle} </h5>`;

        for (let btnContent of sectionContent) {
            let icon = document.createElement("i");
            if (btnContent[1].length != 0){
                let classes = btnContent[1].split(" ");
                for (let c of classes) {
                    icon.classList.add(c);
                }
            }

            let span = document.createElement("span");
            span.textContent = btnContent[0];

            let btn = document.createElement("button");
            if (sectionTitle !== "Footer")
                btn.appendChild(icon);
            btn.appendChild(span);

            section.appendChild(btn);
        }

        sidebar.appendChild(section);
        sidebar.appendChild(document.createElement("hr"));
    }
}