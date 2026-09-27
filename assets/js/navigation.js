/* ============================================================
   JOTA EFI BEATZ — PRODUCER UNIVERSE
   navigation.js
   ------------------------------------------------------------
   Navigation System
   Desktop / Mobile / Dropdowns / Active Links
   Submenus / Outside Click / Keyboard
   ============================================================ */

"use strict";


/* ============================================================
   01. NAVIGATION CONFIG
   ============================================================ */

const JOTA_NAV = {

    selectors: {

        header: ".header",

        nav: ".nav",

        navList: ".nav__list",

        navLink: ".nav__link",

        navItem: ".nav__item",

        dropdown: ".dropdown",

        dropdownTrigger: ".dropdown__trigger",

        dropdownMenu: ".dropdown__menu",

        mobileNav: ".mobile-nav",

        mobileNavList: ".mobile-nav__list",

        mobileNavItem: ".mobile-nav__item",

        mobileNavLink: ".mobile-nav__link",

        mobileSubmenu: ".mobile-nav__submenu",

        menuToggle: ".menu-toggle",

        overlay: ".navigation-overlay"

    },

    classes: {

        active: "is-active",

        open: "is-open",

        current: "is-current",

        scrolled: "is-scrolled"

    },

    config: {

        mobileBreakpoint: 900,

        scrollOffset: 80

    }

};


/* ============================================================
   02. INITIALIZATION
   ============================================================ */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initNavigation();

    }
);


/* ============================================================
   03. MAIN INITIALIZER
   ============================================================ */

function initNavigation() {

    const navigation =
        document.querySelector(
            JOTA_NAV.selectors.nav
        );


    const mobileNavigation =
        document.querySelector(
            JOTA_NAV.selectors.mobileNav
        );


    if (!navigation && !mobileNavigation) {

        return;

    }


    setupMenuToggle();

    setupDesktopDropdowns();

    setupMobileSubmenus();

    setupOutsideClick();

    setupKeyboardNavigation();

    setupActiveLinks();

    setupNavigationResize();

    setupNavigationScroll();

    setupNavigationOverlay();

    setupPageNavigation();

}


/* ============================================================
   04. MOBILE MENU TOGGLE
   ============================================================ */

function setupMenuToggle() {

    const toggle =
        document.querySelector(
            JOTA_NAV.selectors.menuToggle
        );


    const mobileNav =
        document.querySelector(
            JOTA_NAV.selectors.mobileNav
        );


    if (!toggle || !mobileNav) {

        return;

    }


    /*
     * Garante acessibilidade.
     */

    if (
        !toggle.hasAttribute(
            "aria-expanded"
        )
    ) {

        toggle.setAttribute(
            "aria-expanded",
            "false"
        );

    }


    if (
        !toggle.hasAttribute(
            "aria-controls"
        )
    ) {

        if (!mobileNav.id) {

            mobileNav.id =
                "jota-mobile-navigation";

        }


        toggle.setAttribute(
            "aria-controls",
            mobileNav.id
        );

    }


    toggle.addEventListener(
        "click",
        event => {

            event.preventDefault();

            event.stopPropagation();


            const isOpen =
                mobileNav.classList.contains(
                    JOTA_NAV.classes.active
                );


            if (isOpen) {

                closeMobileNavigation();

            } else {

                openMobileNavigation();

            }

        }
    );

}


/* ============================================================
   05. OPEN MOBILE NAVIGATION
   ============================================================ */

function openMobileNavigation() {

    const toggle =
        document.querySelector(
            JOTA_NAV.selectors.menuToggle
        );


    const mobileNav =
        document.querySelector(
            JOTA_NAV.selectors.mobileNav
        );


    if (!mobileNav) {

        return;

    }


    mobileNav.classList.add(
        JOTA_NAV.classes.active
    );


    if (toggle) {

        toggle.classList.add(
            JOTA_NAV.classes.active
        );


        toggle.setAttribute(
            "aria-expanded",
            "true"
        );

    }


    document.body.classList.add(
        "no-scroll"
    );


    showNavigationOverlay();


    document.dispatchEvent(
        new CustomEvent(
            "jota:navigation-open"
        )
    );

}


/* ============================================================
   06. CLOSE MOBILE NAVIGATION
   ============================================================ */

function closeMobileNavigation() {

    const toggle =
        document.querySelector(
            JOTA_NAV.selectors.menuToggle
        );


    const mobileNav =
        document.querySelector(
            JOTA_NAV.selectors.mobileNav
        );


    if (!mobileNav) {

        return;

    }


    mobileNav.classList.remove(
        JOTA_NAV.classes.active
    );


    if (toggle) {

        toggle.classList.remove(
            JOTA_NAV.classes.active
        );


        toggle.setAttribute(
            "aria-expanded",
            "false"
        );

    }


    /*
     * Fecha também submenus abertos.
     */

    mobileNav
        .querySelectorAll(
            ".mobile-nav__item.is-open"
        )
        .forEach(item => {

            item.classList.remove(
                JOTA_NAV.classes.open
            );


            const trigger =
                item.querySelector(
                    ".mobile-nav__link"
                );


            if (trigger) {

                trigger.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }


            const submenu =
                item.querySelector(
                    ".mobile-nav__submenu"
                );


            if (submenu) {

                submenu.style.maxHeight =
                    null;

            }

        });


    document.body.classList.remove(
        "no-scroll"
    );


    hideNavigationOverlay();


    document.dispatchEvent(
        new CustomEvent(
            "jota:navigation-close"
        )
    );

}


/* ============================================================
   07. DESKTOP DROPDOWNS
   ============================================================ */

function setupDesktopDropdowns() {

    const dropdowns =
        document.querySelectorAll(
            JOTA_NAV.selectors.dropdown
        );


    if (!dropdowns.length) {

        return;

    }


    dropdowns.forEach(dropdown => {

        const trigger =
            dropdown.querySelector(
                JOTA_NAV.selectors.dropdownTrigger
            );


        const menu =
            dropdown.querySelector(
                JOTA_NAV.selectors.dropdownMenu
            );


        if (!trigger || !menu) {

            return;

        }


        /*
         * Acessibilidade.
         */

        trigger.setAttribute(
            "aria-haspopup",
            "true"
        );


        trigger.setAttribute(
            "aria-expanded",
            "false"
        );


        /*
         * Desktop click.
         */

        trigger.addEventListener(
            "click",
            event => {

                if (
                    window.innerWidth <=
                    JOTA_NAV.config.mobileBreakpoint
                ) {

                    return;

                }


                event.preventDefault();

                event.stopPropagation();


                const isOpen =
                    dropdown.classList.contains(
                        JOTA_NAV.classes.open
                    );


                closeAllDesktopDropdowns(
                    dropdown
                );


                if (!isOpen) {

                    openDesktopDropdown(
                        dropdown
                    );

                }

            }
        );


        /*
         * Keyboard navigation.
         */

        trigger.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {

                    if (
                        window.innerWidth <=
                        JOTA_NAV.config.mobileBreakpoint
                    ) {

                        return;

                    }


                    event.preventDefault();


                    const isOpen =
                        dropdown.classList.contains(
                            JOTA_NAV.classes.open
                        );


                    if (isOpen) {

                        closeDesktopDropdown(
                            dropdown
                        );

                    } else {

                        closeAllDesktopDropdowns(
                            dropdown
                        );

                        openDesktopDropdown(
                            dropdown
                        );

                    }

                }


                if (
                    event.key === "ArrowDown"
                ) {

                    if (
                        window.innerWidth <=
                        JOTA_NAV.config.mobileBreakpoint
                    ) {

                        return;

                    }


                    event.preventDefault();


                    openDesktopDropdown(
                        dropdown
                    );


                    focusFirstDropdownLink(
                        menu
                    );

                }

            }
        );


        /*
         * Mouse enter.
         */

        dropdown.addEventListener(
            "mouseenter",
            () => {

                if (
                    window.innerWidth <=
                    JOTA_NAV.config.mobileBreakpoint
                ) {

                    return;

                }


                openDesktopDropdown(
                    dropdown
                );

            }
        );


        /*
         * Mouse leave.
         */

        dropdown.addEventListener(
            "mouseleave",
            () => {

                if (
                    window.innerWidth <=
                    JOTA_NAV.config.mobileBreakpoint
                ) {

                    return;

                }


                closeDesktopDropdown(
                    dropdown
                );

            }
        );


        /*
         * Links dentro do dropdown.
         */

        const links =
            menu.querySelectorAll("a");


        links.forEach((link, index) => {

            link.addEventListener(
                "keydown",
                event => {

                    if (
                        event.key === "ArrowDown"
                    ) {

                        event.preventDefault();

                        const next =
                            links[index + 1];


                        if (next) {

                            next.focus();

                        } else {

                            links[0].focus();

                        }

                    }


                    if (
                        event.key === "ArrowUp"
                    ) {

                        event.preventDefault();

                        const previous =
                            links[index - 1];


                        if (previous) {

                            previous.focus();

                        } else {

                            links[
                                links.length - 1
                            ].focus();

                        }

                    }


                    if (
                        event.key === "Escape"
                    ) {

                        event.preventDefault();

                        closeDesktopDropdown(
                            dropdown
                        );


                        trigger.focus();

                    }

                }
            );

        });

    });

}


/* ============================================================
   08. OPEN DESKTOP DROPDOWN
   ============================================================ */

function openDesktopDropdown(
    dropdown
) {

    if (!dropdown) {

        return;

    }


    dropdown.classList.add(
        JOTA_NAV.classes.open
    );


    const trigger =
        dropdown.querySelector(
            JOTA_NAV.selectors.dropdownTrigger
        );


    if (trigger) {

        trigger.setAttribute(
            "aria-expanded",
            "true"
        );

    }

}


/* ============================================================
   09. CLOSE DESKTOP DROPDOWN
   ============================================================ */

function closeDesktopDropdown(
    dropdown
) {

    if (!dropdown) {

        return;

    }


    dropdown.classList.remove(
        JOTA_NAV.classes.open
    );


    const trigger =
        dropdown.querySelector(
            JOTA_NAV.selectors.dropdownTrigger
        );


    if (trigger) {

        trigger.setAttribute(
            "aria-expanded",
            "false"
        );

    }

}


/* ============================================================
   10. CLOSE ALL DROPDOWNS
   ============================================================ */

function closeAllDesktopDropdowns(
    except = null
) {

    const dropdowns =
        document.querySelectorAll(
            JOTA_NAV.selectors.dropdown
        );


    dropdowns.forEach(dropdown => {

        if (
            except &&
            dropdown === except
        ) {

            return;

        }


        closeDesktopDropdown(
            dropdown
        );

    });

}


/* ============================================================
   11. FOCUS FIRST DROPDOWN LINK
   ============================================================ */

function focusFirstDropdownLink(
    menu
) {

    if (!menu) {

        return;

    }


    const firstLink =
        menu.querySelector("a");


    if (firstLink) {

        firstLink.focus();

    }

}


/* ============================================================
   12. MOBILE SUBMENUS
   ============================================================ */

function setupMobileSubmenus() {

    const mobileItems =
        document.querySelectorAll(
            JOTA_NAV.selectors.mobileNavItem
        );


    if (!mobileItems.length) {

        return;

    }


    mobileItems.forEach(item => {

        const submenu =
            item.querySelector(
                JOTA_NAV.selectors.mobileSubmenu
            );


        if (!submenu) {

            return;

        }


        const trigger =
            item.querySelector(
                JOTA_NAV.selectors.mobileNavLink
            );


        if (!trigger) {

            return;

        }


        trigger.setAttribute(
            "aria-haspopup",
            "true"
        );


        trigger.setAttribute(
            "aria-expanded",
            "false"
        );


        trigger.addEventListener(
            "click",
            event => {

                /*
                 * Só controla submenu no mobile.
                 */

                if (
                    window.innerWidth >
                    JOTA_NAV.config.mobileBreakpoint
                ) {

                    return;

                }


                /*
                 * Se o link tiver um href real
                 * e não for apenas um trigger,
                 * ainda permitimos o primeiro clique
                 * para abrir o submenu.
                 */

                event.preventDefault();

                event.stopPropagation();


                const isOpen =
                    item.classList.contains(
                        JOTA_NAV.classes.open
                    );


                closeAllMobileSubmenus(
                    item
                );


                if (isOpen) {

                    closeMobileSubmenu(
                        item
                    );

                } else {

                    openMobileSubmenu(
                        item
                    );

                }

            }
        );

    });

}


/* ============================================================
   13. OPEN MOBILE SUBMENU
   ============================================================ */

function openMobileSubmenu(
    item
) {

    if (!item) {

        return;

    }


    const submenu =
        item.querySelector(
            JOTA_NAV.selectors.mobileSubmenu
        );


    const trigger =
        item.querySelector(
            JOTA_NAV.selectors.mobileNavLink
        );


    item.classList.add(
        JOTA_NAV.classes.open
    );


    if (trigger) {

        trigger.setAttribute(
            "aria-expanded",
            "true"
        );

    }


    if (submenu) {

        submenu.style.maxHeight =
            submenu.scrollHeight + "px";

    }

}


/* ============================================================
   14. CLOSE MOBILE SUBMENU
   ============================================================ */

function closeMobileSubmenu(
    item
) {

    if (!item) {

        return;

    }


    const submenu =
        item.querySelector(
            JOTA_NAV.selectors.mobileSubmenu
        );


    const trigger =
        item.querySelector(
            JOTA_NAV.selectors.mobileNavLink
        );


    item.classList.remove(
        JOTA_NAV.classes.open
    );


    if (trigger) {

        trigger.setAttribute(
            "aria-expanded",
            "false"
        );

    }


    if (submenu) {

        submenu.style.maxHeight =
            null;

    }

}


/* ============================================================
   15. CLOSE ALL MOBILE SUBMENUS
   ============================================================ */

function closeAllMobileSubmenus(
    except = null
) {

    const items =
        document.querySelectorAll(
            ".mobile-nav__item.is-open"
        );


    items.forEach(item => {

        if (
            except &&
            item === except
        ) {

            return;

        }


        closeMobileSubmenu(
            item
        );

    });

}


/* ============================================================
   16. OUTSIDE CLICK
   ============================================================ */

function setupOutsideClick() {

    document.addEventListener(
        "click",
        event => {

            const target =
                event.target;


            /*
             * Fecha dropdown desktop
             * quando clicar fora.
             */

            const clickedDropdown =
                target.closest(
                    JOTA_NAV.selectors.dropdown
                );


            if (!clickedDropdown) {

                closeAllDesktopDropdowns();

            }


            /*
             * Fecha menu mobile quando
             * clicar fora.
             */

            const mobileNav =
                document.querySelector(
                    JOTA_NAV.selectors.mobileNav
                );


            const toggle =
                document.querySelector(
                    JOTA_NAV.selectors.menuToggle
                );


            if (
                mobileNav &&
                mobileNav.classList.contains(
                    JOTA_NAV.classes.active
                )
            ) {

                const clickedInsideNav =
                    mobileNav.contains(
                        target
                    );


                const clickedToggle =
                    toggle &&
                    toggle.contains(
                        target
                    );


                if (
                    !clickedInsideNav &&
                    !clickedToggle
                ) {

                    closeMobileNavigation();

                }

            }

        }
    );

}


/* ============================================================
   17. KEYBOARD NAVIGATION
   ============================================================ */

function setupKeyboardNavigation() {

    document.addEventListener(
        "keydown",
        event => {

            /*
             * ESC
             */

            if (
                event.key === "Escape"
            ) {

                closeAllDesktopDropdowns();

                closeMobileNavigation();

            }


            /*
             * TAB
             *
             * Não interfere no fluxo normal
             * do teclado.
             */

        }
    );

}


/* ============================================================
   18. ACTIVE PAGE LINK
   ============================================================ */

function setupActiveLinks() {

    const links =
        document.querySelectorAll(
            "a[href]"
        );


    if (!links.length) {

        return;

    }


    const currentPath =
        normalizePath(
            window.location.pathname
        );


    links.forEach(link => {

        const href =
            link.getAttribute("href");


        if (!href) {

            return;

        }


        /*
         * Ignora:
         * #anchors
         * javascript:
         * mailto:
         * tel:
         */

        if (
            href.startsWith("#") ||
            href.startsWith("javascript:") ||
            href.startsWith("mailto:") ||
            href.startsWith("tel:")
        ) {

            return;

        }


        /*
         * Links externos não recebem
         * estado ativo.
         */

        if (
            href.startsWith("http://") ||
            href.startsWith("https://")
        ) {

            try {

                const url =
                    new URL(href);


                if (
                    url.hostname !==
                    window.location.hostname
                ) {

                    return;

                }

            } catch (error) {

                return;

            }

        }


        let linkPath = "";


        try {

            const url =
                new URL(
                    href,
                    window.location.href
                );


            linkPath =
                normalizePath(
                    url.pathname
                );

        } catch (error) {

            return;

        }


        if (
            linkPath === currentPath
        ) {

            markActiveLink(
                link
            );

        }

    });

}


/* ============================================================
   19. MARK ACTIVE LINK
   ============================================================ */

function markActiveLink(
    link
) {

    if (!link) {

        return;

    }


    link.classList.add(
        JOTA_NAV.classes.current
    );


    link.setAttribute(
        "aria-current",
        "page"
    );


    /*
     * Marca também o item pai.
     */

    const navItem =
        link.closest(
            ".nav__item, .mobile-nav__item"
        );


    if (navItem) {

        navItem.classList.add(
            JOTA_NAV.classes.current
        );

    }


    /*
     * Se estiver dentro de dropdown,
     * marca também o dropdown principal.
     */

    const dropdown =
        link.closest(
            ".dropdown"
        );


    if (dropdown) {

        dropdown.classList.add(
            JOTA_NAV.classes.current
        );


        const trigger =
            dropdown.querySelector(
                ".dropdown__trigger"
            );


        if (trigger) {

            trigger.classList.add(
                JOTA_NAV.classes.current
            );

        }

    }

}


/* ============================================================
   20. NORMALIZE PATH
   ============================================================ */

function normalizePath(
    path
) {

    if (!path) {

        return "/";

    }


    /*
     * Remove query/hash.
     */

    path =
        path.split("?")[0]
            .split("#")[0];


    /*
     * Remove barras duplicadas.
     */

    path =
        path.replace(
            /\/+/g,
            "/"
        );


    /*
     * Remove index.html.
     */

    path =
        path.replace(
            /\/index\.html$/i,
            "/"
        );


    /*
     * Remove barra final,
     * exceto root.
     */

    if (
        path.length > 1 &&
        path.endsWith("/")
    ) {

        path =
            path.slice(
                0,
                -1
            );

    }


    return path || "/";

}


/* ============================================================
   21. NAVIGATION RESIZE
   ============================================================ */

function setupNavigationResize() {

    let previousWidth =
        window.innerWidth;


    window.addEventListener(
        "resize",
        debounce(
            () => {

                const currentWidth =
                    window.innerWidth;


                /*
                 * Mudança entre desktop
                 * e mobile.
                 */

                const crossedBreakpoint =
                    (
                        previousWidth <=
                        JOTA_NAV.config.mobileBreakpoint
                        &&
                        currentWidth >
                        JOTA_NAV.config.mobileBreakpoint
                    )
                    ||
                    (
                        previousWidth >
                        JOTA_NAV.config.mobileBreakpoint
                        &&
                        currentWidth <=
                        JOTA_NAV.config.mobileBreakpoint
                    );


                if (
                    crossedBreakpoint
                ) {

                    closeMobileNavigation();

                    closeAllDesktopDropdowns();

                }


                /*
                 * Limpa estado de submenu.
                 */

                if (
                    currentWidth >
                    JOTA_NAV.config.mobileBreakpoint
                ) {

                    document
                        .querySelectorAll(
                            ".mobile-nav__item.is-open"
                        )
                        .forEach(item => {

                            closeMobileSubmenu(
                                item
                            );

                        });

                }


                previousWidth =
                    currentWidth;

            },
            150
        )
    );

}


/* ============================================================
   22. NAVIGATION SCROLL
   ============================================================ */

function setupNavigationScroll() {

    const header =
        document.querySelector(
            JOTA_NAV.selectors.header
        );


    if (!header) {

        return;

    }


    let ticking =
        false;


    const update =
        () => {

            if (
                window.scrollY >
                30
            ) {

                header.classList.add(
                    JOTA_NAV.classes.scrolled
                );

            } else {

                header.classList.remove(
                    JOTA_NAV.classes.scrolled
                );

            }


            ticking =
                false;

        };


    window.addEventListener(
        "scroll",
        () => {

            if (!ticking) {

                requestAnimationFrame(
                    update
                );

                ticking =
                    true;

            }

        },
        {
            passive: true
        }
    );


    update();

}


/* ============================================================
   23. NAVIGATION OVERLAY
   ============================================================ */

function setupNavigationOverlay() {

    /*
     * O overlay é criado apenas se
     * o menu mobile precisar dele.
     */

    const mobileNav =
        document.querySelector(
            JOTA_NAV.selectors.mobileNav
        );


    if (!mobileNav) {

        return;

    }


    let overlay =
        document.querySelector(
            JOTA_NAV.selectors.overlay
        );


    if (!overlay) {

        overlay =
            document.createElement(
                "div"
            );


        overlay.className =
            "navigation-overlay";


        overlay.setAttribute(
            "aria-hidden",
            "true"
        );


        document.body.appendChild(
            overlay
        );

    }


    overlay.addEventListener(
        "click",
        () => {

            closeMobileNavigation();

        }
    );


    /*
     * Estilos mínimos inline apenas
     * para garantir funcionamento.
     *
     * O visual definitivo pode ficar
     * no CSS.
     */

    if (
        !overlay.dataset.initialized
    ) {

        overlay.dataset.initialized =
            "true";

    }

}


/* ============================================================
   24. SHOW OVERLAY
   ============================================================ */

function showNavigationOverlay() {

    const overlay =
        document.querySelector(
            ".navigation-overlay"
        );


    if (!overlay) {

        return;

    }


    overlay.classList.add(
        JOTA_NAV.classes.active
    );

}


/* ============================================================
   25. HIDE OVERLAY
   ============================================================ */

function hideNavigationOverlay() {

    const overlay =
        document.querySelector(
            ".navigation-overlay"
        );


    if (!overlay) {

        return;

    }


    overlay.classList.remove(
        JOTA_NAV.classes.active
    );

}


/* ============================================================
   26. PAGE NAVIGATION
   ============================================================ */

function setupPageNavigation() {

    const links =
        document.querySelectorAll(
            "a[href]"
        );


    links.forEach(link => {

        link.addEventListener(
            "click",
            event => {

                const href =
                    link.getAttribute(
                        "href"
                    );


                if (!href) {

                    return;

                }


                /*
                 * Não interfere em links especiais.
                 */

                if (
                    href.startsWith("#") ||
                    href.startsWith("mailto:") ||
                    href.startsWith("tel:") ||
                    href.startsWith("javascript:")
                ) {

                    return;

                }


                /*
                 * Links com target="_blank".
                 */

                if (
                    link.target === "_blank"
                ) {

                    return;

                }


                /*
                 * Se o link for da mesma página,
                 * apenas fecha o menu mobile.
                 */

                try {

                    const url =
                        new URL(
                            href,
                            window.location.href
                        );


                    if (
                        url.origin ===
                        window.location.origin
                    ) {

                        if (
                            window.innerWidth <=
                            JOTA_NAV.config.mobileBreakpoint
                        ) {

                            closeMobileNavigation();

                        }

                    }

                } catch (error) {

                    return;

                }

            }
        );

    });

}


/* ============================================================
   27. DEBOUNCE
   ============================================================ */

function debounce(
    callback,
    delay = 150
) {

    let timeout;


    return function (...args) {

        clearTimeout(
            timeout
        );


        timeout =
            setTimeout(
                () => {

                    callback.apply(
                        this,
                        args
                    );

                },
                delay
            );

    };

}


/* ============================================================
   28. GLOBAL NAVIGATION API
   ============================================================ */

window.JotaNavigation = {

    open:
        openMobileNavigation,

    close:
        closeMobileNavigation,

    toggle:
        () => {

            const mobileNav =
                document.querySelector(
                    JOTA_NAV.selectors.mobileNav
                );


            if (!mobileNav) {

                return;

            }


            if (
                mobileNav.classList.contains(
                    JOTA_NAV.classes.active
                )
            ) {

                closeMobileNavigation();

            } else {

                openMobileNavigation();

            }

        },


    closeDropdowns:
        closeAllDesktopDropdowns,

    closeSubmenus:
        closeAllMobileSubmenus

};


/* ============================================================
   29. NAVIGATION EVENTS
   ============================================================ */

window.addEventListener(
    "beforeunload",
    () => {

        document.body.classList.remove(
            "no-scroll"
        );

    }
);


/* ============================================================
   END OF NAVIGATION.JS
   ============================================================ */