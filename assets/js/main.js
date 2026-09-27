/* ============================================================
   JOTA EFI BEATZ — PRODUCER UNIVERSE
   main.js
   ------------------------------------------------------------
   Global JavaScript
   Loading / Scroll / Reveal / Search / Modal / Accordion
   Cursor / Toast / Counters / Navigation helpers
   ============================================================ */

"use strict";


/* ============================================================
   01. GLOBAL CONFIG
   ============================================================ */

const JOTA_EFI = {

    selectors: {

        body: "body",

        header: ".header",

        menuToggle: ".menu-toggle",

        mobileNav: ".mobile-nav",

        searchTrigger: "[data-search-open]",

        searchClose: "[data-search-close]",

        searchOverlay: ".search-overlay",

        searchInput: ".search-overlay__input",

        modalTrigger: "[data-modal-open]",

        modalClose: "[data-modal-close]",

        modal: ".modal",

        accordionTrigger: ".accordion__trigger",

        reveal: ".reveal",

        imageReveal: ".image-reveal",

        counter: "[data-counter]",

        toastTrigger: "[data-toast]",

        cursorHover: "a, button, [data-cursor-hover]",

        smoothScroll: 'a[href^="#"]',

        loadingScreen: ".loading-screen",

        marquee: ".marquee__track"

    },

    classes: {

        active: "is-active",

        open: "is-open",

        visible: "is-visible",

        loaded: "is-loaded",

        noScroll: "no-scroll",

        customCursor: "has-custom-cursor",

        cursorHover: "cursor-hover"

    },

    config: {

        scrollOffset: 80,

        revealThreshold: 0.12,

        counterDuration: 1600,

        cursorEnabled: true

    }

};


/* ============================================================
   02. DOM READY
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    initLoadingScreen();

    initMobileNavigation();

    initSearch();

    initSmoothScroll();

    initScrollReveal();

    initImageReveal();

    initAccordions();

    initModals();

    initCounters();

    initCustomCursor();

    initToastSystem();

    initHeaderScroll();

    initLazyImages();

    initExternalLinks();

    initKeyboardControls();

    initMarquee();

});


/* ============================================================
   03. WINDOW LOAD
   ============================================================ */

window.addEventListener("load", () => {

    document.body.classList.add("page-ready");

    document.dispatchEvent(
        new CustomEvent("jota:page-ready")
    );

});


/* ============================================================
   04. LOADING SCREEN
   ============================================================ */

function initLoadingScreen() {

    const loadingScreen = document.querySelector(
        JOTA_EFI.selectors.loadingScreen
    );

    if (!loadingScreen) {
        return;
    }

    const minimumTime = 700;

    const startTime = performance.now();

    const hideLoadingScreen = () => {

        const elapsed = performance.now() - startTime;

        const remaining = Math.max(
            minimumTime - elapsed,
            0
        );

        setTimeout(() => {

            loadingScreen.classList.add(
                JOTA_EFI.classes.loaded
            );

            document.body.classList.remove(
                JOTA_EFI.classes.noScroll
            );

            setTimeout(() => {

                loadingScreen.remove();

            }, 800);

        }, remaining);

    };

    document.body.classList.add(
        JOTA_EFI.classes.noScroll
    );

    if (document.readyState === "complete") {

        hideLoadingScreen();

    } else {

        window.addEventListener(
            "load",
            hideLoadingScreen,
            { once: true }
        );

    }

}


/* ============================================================
   05. MOBILE NAVIGATION
   ============================================================ */

function initMobileNavigation() {

    const toggle = document.querySelector(
        JOTA_EFI.selectors.menuToggle
    );

    const mobileNav = document.querySelector(
        JOTA_EFI.selectors.mobileNav
    );

    if (!toggle || !mobileNav) {
        return;
    }


    const closeMenu = () => {

        toggle.classList.remove(
            JOTA_EFI.classes.active
        );

        mobileNav.classList.remove(
            JOTA_EFI.classes.active
        );

        document.body.classList.remove(
            JOTA_EFI.classes.noScroll
        );

        toggle.setAttribute(
            "aria-expanded",
            "false"
        );

    };


    const openMenu = () => {

        toggle.classList.add(
            JOTA_EFI.classes.active
        );

        mobileNav.classList.add(
            JOTA_EFI.classes.active
        );

        document.body.classList.add(
            JOTA_EFI.classes.noScroll
        );

        toggle.setAttribute(
            "aria-expanded",
            "true"
        );

    };


    toggle.addEventListener("click", () => {

        const isOpen =
            mobileNav.classList.contains(
                JOTA_EFI.classes.active
            );

        if (isOpen) {

            closeMenu();

        } else {

            openMenu();

        }

    });


    const mobileLinks =
        mobileNav.querySelectorAll("a");

    mobileLinks.forEach(link => {

        link.addEventListener("click", () => {

            closeMenu();

        });

    });


    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {

            closeMenu();

        }

    });


    window.addEventListener("resize", () => {

        if (window.innerWidth > 900) {

            closeMenu();

        }

    });

}


/* ============================================================
   06. SEARCH SYSTEM
   ============================================================ */

function initSearch() {

    const overlay = document.querySelector(
        JOTA_EFI.selectors.searchOverlay
    );

    if (!overlay) {
        return;
    }


    const openButtons =
        document.querySelectorAll(
            JOTA_EFI.selectors.searchTrigger
        );

    const closeButtons =
        document.querySelectorAll(
            JOTA_EFI.selectors.searchClose
        );

    const input =
        overlay.querySelector(
            JOTA_EFI.selectors.searchInput
        );


    const openSearch = () => {

        overlay.classList.add(
            JOTA_EFI.classes.active
        );

        document.body.classList.add(
            JOTA_EFI.classes.noScroll
        );

        setTimeout(() => {

            if (input) {
                input.focus();
            }

        }, 150);

    };


    const closeSearch = () => {

        overlay.classList.remove(
            JOTA_EFI.classes.active
        );

        document.body.classList.remove(
            JOTA_EFI.classes.noScroll
        );

    };


    openButtons.forEach(button => {

        button.addEventListener(
            "click",
            event => {

                event.preventDefault();

                openSearch();

            }
        );

    });


    closeButtons.forEach(button => {

        button.addEventListener(
            "click",
            event => {

                event.preventDefault();

                closeSearch();

            }
        );

    });


    overlay.addEventListener("click", event => {

        if (event.target === overlay) {

            closeSearch();

        }

    });


    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {

            closeSearch();

        }

    });

}


/* ============================================================
   07. SMOOTH SCROLL
   ============================================================ */

function initSmoothScroll() {

    const links =
        document.querySelectorAll(
            JOTA_EFI.selectors.smoothScroll
        );


    links.forEach(link => {

        link.addEventListener("click", event => {

            const href =
                link.getAttribute("href");

            if (!href || href === "#") {
                return;
            }


            const target =
                document.querySelector(href);

            if (!target) {
                return;
            }


            event.preventDefault();


            const targetPosition =
                target.getBoundingClientRect().top +
                window.scrollY -
                JOTA_EFI.config.scrollOffset;


            window.scrollTo({

                top: targetPosition,

                behavior: "smooth"

            });

        });

    });

}


/* ============================================================
   08. SCROLL REVEAL
   ============================================================ */

function initScrollReveal() {

    const elements =
        document.querySelectorAll(
            JOTA_EFI.selectors.reveal
        );

    if (!elements.length) {
        return;
    }


    if (
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches
    ) {

        elements.forEach(element => {

            element.classList.add(
                JOTA_EFI.classes.visible
            );

        });

        return;

    }


    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) {
                        return;
                    }


                    entry.target.classList.add(
                        JOTA_EFI.classes.visible
                    );


                    observer.unobserve(
                        entry.target
                    );

                });

            },
            {
                threshold:
                    JOTA_EFI.config.revealThreshold,

                rootMargin: "0px 0px -50px 0px"

            }
        );


    elements.forEach(element => {

        observer.observe(element);

    });

}


/* ============================================================
   09. IMAGE REVEAL
   ============================================================ */

function initImageReveal() {

    const elements =
        document.querySelectorAll(
            JOTA_EFI.selectors.imageReveal
        );

    if (!elements.length) {
        return;
    }


    if (
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches
    ) {

        elements.forEach(element => {

            element.classList.add(
                JOTA_EFI.classes.visible
            );

        });

        return;

    }


    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) {
                        return;
                    }


                    entry.target.classList.add(
                        JOTA_EFI.classes.visible
                    );


                    observer.unobserve(
                        entry.target
                    );

                });

            },
            {
                threshold: 0.15
            }
        );


    elements.forEach(element => {

        observer.observe(element);

    });

}


/* ============================================================
   10. ACCORDION / FAQ
   ============================================================ */

function initAccordions() {

    const triggers =
        document.querySelectorAll(
            JOTA_EFI.selectors.accordionTrigger
        );


    if (!triggers.length) {
        return;
    }


    triggers.forEach(trigger => {

        trigger.addEventListener(
            "click",
            () => {

                const item =
                    trigger.closest(
                        ".accordion__item"
                    );

                if (!item) {
                    return;
                }


                const content =
                    item.querySelector(
                        ".accordion__content"
                    );

                const isOpen =
                    item.classList.contains(
                        JOTA_EFI.classes.open
                    );


                /* Fecha outros itens */

                const accordion =
                    item.closest(".accordion");


                if (accordion) {

                    accordion
                        .querySelectorAll(
                            ".accordion__item.is-open"
                        )
                        .forEach(openItem => {

                            if (openItem !== item) {

                                openItem.classList.remove(
                                    JOTA_EFI.classes.open
                                );


                                const openContent =
                                    openItem.querySelector(
                                        ".accordion__content"
                                    );


                                if (openContent) {

                                    openContent.style.maxHeight =
                                        null;

                                }


                                const openTrigger =
                                    openItem.querySelector(
                                        ".accordion__trigger"
                                    );


                                if (openTrigger) {

                                    openTrigger.setAttribute(
                                        "aria-expanded",
                                        "false"
                                    );

                                }

                            }

                        });

                }


                if (isOpen) {

                    item.classList.remove(
                        JOTA_EFI.classes.open
                    );

                    trigger.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                    if (content) {
                        content.style.maxHeight = null;
                    }

                    return;

                }


                item.classList.add(
                    JOTA_EFI.classes.open
                );

                trigger.setAttribute(
                    "aria-expanded",
                    "true"
                );


                if (content) {

                    content.style.maxHeight =
                        content.scrollHeight + "px";

                }

            }
        );

    });

}


/* ============================================================
   11. MODAL SYSTEM
   ============================================================ */

function initModals() {

    const triggers =
        document.querySelectorAll(
            JOTA_EFI.selectors.modalTrigger
        );

    const modals =
        document.querySelectorAll(
            JOTA_EFI.selectors.modal
        );


    if (!triggers.length && !modals.length) {
        return;
    }


    const closeModal = modal => {

        modal.classList.remove(
            JOTA_EFI.classes.active
        );

        document.body.classList.remove(
            JOTA_EFI.classes.noScroll
        );

    };


    const openModal = modal => {

        modal.classList.add(
            JOTA_EFI.classes.active
        );

        document.body.classList.add(
            JOTA_EFI.classes.noScroll
        );

    };


    triggers.forEach(trigger => {

        trigger.addEventListener(
            "click",
            event => {

                event.preventDefault();


                const targetId =
                    trigger.getAttribute(
                        "data-modal-open"
                    );


                if (!targetId) {
                    return;
                }


                const modal =
                    document.getElementById(
                        targetId
                    );


                if (!modal) {
                    return;
                }


                openModal(modal);

            }
        );

    });


    modals.forEach(modal => {

        const closeButtons =
            modal.querySelectorAll(
                JOTA_EFI.selectors.modalClose
            );


        closeButtons.forEach(button => {

            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    closeModal(modal);

                }
            );

        });


        modal.addEventListener(
            "click",
            event => {

                if (
                    event.target === modal
                ) {

                    closeModal(modal);

                }

            }
        );

    });


    document.addEventListener("keydown", event => {

        if (event.key !== "Escape") {
            return;
        }


        modals.forEach(modal => {

            if (
                modal.classList.contains(
                    JOTA_EFI.classes.active
                )
            ) {

                closeModal(modal);

            }

        });

    });

}


/* ============================================================
   12. COUNTERS
   ============================================================ */

function initCounters() {

    const counters =
        document.querySelectorAll(
            JOTA_EFI.selectors.counter
        );


    if (!counters.length) {
        return;
    }


    const animateCounter = element => {

        const target =
            parseFloat(
                element.dataset.counter
            );


        if (Number.isNaN(target)) {
            return;
        }


        const prefix =
            element.dataset.counterPrefix || "";


        const suffix =
            element.dataset.counterSuffix || "";


        const decimals =
            parseInt(
                element.dataset.counterDecimals || "0",
                10
            );


        const start = 0;

        const duration =
            parseInt(
                element.dataset.counterDuration ||
                JOTA_EFI.config.counterDuration,
                10
            );


        const startTime =
            performance.now();


        const update = currentTime => {

            const elapsed =
                currentTime - startTime;


            const progress =
                Math.min(
                    elapsed / duration,
                    1
                );


            const eased =
                1 - Math.pow(
                    1 - progress,
                    3
                );


            const current =
                start +
                (target - start) * eased;


            element.textContent =
                prefix +
                current.toFixed(decimals) +
                suffix;


            if (progress < 1) {

                requestAnimationFrame(update);

            }

        };


        requestAnimationFrame(update);

    };


    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) {
                        return;
                    }


                    if (
                        entry.target.dataset.counterDone
                    ) {
                        return;
                    }


                    entry.target.dataset.counterDone =
                        "true";


                    animateCounter(
                        entry.target
                    );


                    observer.unobserve(
                        entry.target
                    );

                });

            },
            {
                threshold: 0.5
            }
        );


    counters.forEach(counter => {

        observer.observe(counter);

    });

}


/* ============================================================
   13. CUSTOM CURSOR
   ============================================================ */

function initCustomCursor() {

    if (!JOTA_EFI.config.cursorEnabled) {
        return;
    }


    if (
        window.matchMedia(
            "(hover: none) and (pointer: coarse)"
        ).matches
    ) {
        return;
    }


    const existingDot =
        document.querySelector(
            ".cursor-dot"
        );


    const existingRing =
        document.querySelector(
            ".cursor-ring"
        );


    if (!existingDot || !existingRing) {
        return;
    }


    document.body.classList.add(
        JOTA_EFI.classes.customCursor
    );


    let mouseX = -100;

    let mouseY = -100;

    let ringX = -100;

    let ringY = -100;


    document.addEventListener(
        "mousemove",
        event => {

            mouseX = event.clientX;

            mouseY = event.clientY;

        }
    );


    const animateCursor = () => {

        ringX +=
            (mouseX - ringX) * 0.15;


        ringY +=
            (mouseY - ringY) * 0.15;


        existingDot.style.left =
            `${mouseX}px`;


        existingDot.style.top =
            `${mouseY}px`;


        existingRing.style.left =
            `${ringX}px`;


        existingRing.style.top =
            `${ringY}px`;


        requestAnimationFrame(
            animateCursor
        );

    };


    animateCursor();


    const hoverElements =
        document.querySelectorAll(
            JOTA_EFI.selectors.cursorHover
        );


    hoverElements.forEach(element => {

        element.addEventListener(
            "mouseenter",
            () => {

                document.body.classList.add(
                    JOTA_EFI.classes.cursorHover
                );

            }
        );


        element.addEventListener(
            "mouseleave",
            () => {

                document.body.classList.remove(
                    JOTA_EFI.classes.cursorHover
                );

            }
        );

    });

}


/* ============================================================
   14. TOAST SYSTEM
   ============================================================ */

function initToastSystem() {

    const triggers =
        document.querySelectorAll(
            JOTA_EFI.selectors.toastTrigger
        );


    if (!triggers.length) {
        return;
    }


    let container =
        document.querySelector(
            ".toast-container"
        );


    if (!container) {

        container =
            document.createElement("div");

        container.className =
            "toast-container";

        document.body.appendChild(
            container
        );

    }


    triggers.forEach(trigger => {

        trigger.addEventListener(
            "click",
            event => {

                event.preventDefault();


                const title =
                    trigger.dataset.toastTitle ||
                    "JOTA EFI BEATZ";


                const message =
                    trigger.dataset.toastMessage ||
                    "Ação realizada com sucesso.";


                const type =
                    trigger.dataset.toastType ||
                    "success";


                showToast(
                    title,
                    message,
                    type
                );

            }
        );

    });


    window.JotaToast = showToast;


    function showToast(
        title,
        message,
        type = "success"
    ) {

        const toast =
            document.createElement("div");


        toast.className =
            "toast";


        const icon =
            getToastIcon(type);


        toast.innerHTML = `

            <div class="toast__icon">

                <i class="${icon}"></i>

            </div>

            <div class="toast__content">

                <div class="toast__title">
                    ${escapeHTML(title)}
                </div>

                <div class="toast__message">
                    ${escapeHTML(message)}
                </div>

            </div>

            <button
                type="button"
                class="toast__close"
                aria-label="Fechar"
            >
                <i class="bi bi-x-lg"></i>
            </button>

        `;


        container.appendChild(toast);


        requestAnimationFrame(() => {

            toast.classList.add(
                JOTA_EFI.classes.visible
            );

        });


        const close =
            () => {

                toast.classList.remove(
                    JOTA_EFI.classes.visible
                );


                setTimeout(() => {

                    toast.remove();

                }, 400);

            };


        const closeButton =
            toast.querySelector(
                ".toast__close"
            );


        if (closeButton) {

            closeButton.addEventListener(
                "click",
                close
            );

        }


        setTimeout(
            close,
            4500
        );

    }

}


/* ============================================================
   15. HEADER ON SCROLL
   ============================================================ */

function initHeaderScroll() {

    const header =
        document.querySelector(
            JOTA_EFI.selectors.header
        );


    if (!header) {
        return;
    }


    let ticking = false;


    const updateHeader =
        () => {

            const scrollY =
                window.scrollY;


            if (scrollY > 30) {

                header.classList.add(
                    "is-scrolled"
                );

            } else {

                header.classList.remove(
                    "is-scrolled"
                );

            }


            ticking = false;

        };


    window.addEventListener(
        "scroll",
        () => {

            if (!ticking) {

                window.requestAnimationFrame(
                    updateHeader
                );

                ticking = true;

            }

        },
        {
            passive: true
        }
    );


    updateHeader();

}


/* ============================================================
   16. LAZY IMAGES
   ============================================================ */

function initLazyImages() {

    const images =
        document.querySelectorAll(
            "img[data-src]"
        );


    if (!images.length) {
        return;
    }


    if (
        !("IntersectionObserver" in window)
    ) {

        images.forEach(image => {

            image.src =
                image.dataset.src;

            image.removeAttribute(
                "data-src"
            );

        });

        return;

    }


    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) {
                        return;
                    }


                    const image =
                        entry.target;


                    image.src =
                        image.dataset.src;


                    image.removeAttribute(
                        "data-src"
                    );


                    observer.unobserve(
                        image
                    );

                });

            },
            {
                rootMargin: "200px"
            }
        );


    images.forEach(image => {

        observer.observe(image);

    });

}


/* ============================================================
   17. EXTERNAL LINKS
   ============================================================ */

function initExternalLinks() {

    const links =
        document.querySelectorAll(
            'a[href^="http"]'
        );


    links.forEach(link => {

        try {

            const url =
                new URL(
                    link.href,
                    window.location.href
                );


            if (
                url.hostname !==
                window.location.hostname
            ) {

                link.setAttribute(
                    "target",
                    "_blank"
                );


                link.setAttribute(
                    "rel",
                    "noopener noreferrer"
                );

            }

        } catch (error) {

            console.warn(
                "Link inválido:",
                link.href
            );

        }

    });

}


/* ============================================================
   18. KEYBOARD CONTROLS
   ============================================================ */

function initKeyboardControls() {

    document.addEventListener(
        "keydown",
        event => {

            /*
             * "/" abre pesquisa quando
             * não estamos digitando em um campo.
             */

            if (
                event.key === "/" &&
                !isTypingTarget(
                    event.target
                )
            ) {

                const searchButton =
                    document.querySelector(
                        JOTA_EFI.selectors.searchTrigger
                    );


                if (searchButton) {

                    event.preventDefault();

                    searchButton.click();

                }

            }


            /*
             * ESC fecha elementos abertos.
             */

            if (event.key === "Escape") {

                document.body.classList.remove(
                    JOTA_EFI.classes.cursorHover
                );

            }

        }
    );

}


/* ============================================================
   19. MARQUEE
   ============================================================ */

function initMarquee() {

    const tracks =
        document.querySelectorAll(
            JOTA_EFI.selectors.marquee
        );


    tracks.forEach(track => {

        /*
         * Duplica o conteúdo para criar
         * um loop contínuo.
         */

        const children =
            Array.from(
                track.children
            );


        if (!children.length) {
            return;
        }


        const existingClone =
            track.querySelector(
                "[data-marquee-clone]"
            );


        if (existingClone) {
            return;
        }


        children.forEach(child => {

            const clone =
                child.cloneNode(true);


            clone.dataset.marqueeClone =
                "true";


            clone.setAttribute(
                "aria-hidden",
                "true"
            );


            track.appendChild(clone);

        });

    });

}


/* ============================================================
   20. ESCAPE HTML
   ============================================================ */

function escapeHTML(value) {

    const div =
        document.createElement("div");


    div.textContent =
        String(value);


    return div.innerHTML;

}


/* ============================================================
   21. TYPING TARGET
   ============================================================ */

function isTypingTarget(element) {

    if (!element) {
        return false;
    }


    const tag =
        element.tagName;


    return (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        element.isContentEditable
    );

}


/* ============================================================
   22. TOAST ICONS
   ============================================================ */

function getToastIcon(type) {

    const icons = {

        success:
            "bi bi-check-lg",

        error:
            "bi bi-x-lg",

        warning:
            "bi bi-exclamation-lg",

        info:
            "bi bi-info-lg"

    };


    return (
        icons[type] ||
        icons.info
    );

}


/* ============================================================
   23. PAGE VISIBILITY
   ============================================================ */

document.addEventListener(
    "visibilitychange",
    () => {

        if (
            document.hidden
        ) {

            document.body.classList.add(
                "page-hidden"
            );

        } else {

            document.body.classList.remove(
                "page-hidden"
            );

        }

    }
);


/* ============================================================
   24. ERROR HANDLING
   ============================================================ */

window.addEventListener(
    "error",
    event => {

        console.warn(
            "JOTA EFI — JavaScript:",
            event.message
        );

    }
);


/* ============================================================
   25. GLOBAL JOTA EFI API
   ============================================================ */

window.JotaEfi = {

    version: "1.0.0",

    config: JOTA_EFI.config,

    showToast:
        (...args) => {

            if (
                typeof window.JotaToast ===
                "function"
            ) {

                window.JotaToast(
                    ...args
                );

            }

        },


    scrollTo: selector => {

        const target =
            document.querySelector(
                selector
            );


        if (!target) {
            return;
        }


        const position =
            target.getBoundingClientRect().top +
            window.scrollY -
            JOTA_EFI.config.scrollOffset;


        window.scrollTo({

            top: position,

            behavior: "smooth"

        });

    }

};


/* ============================================================
   END OF MAIN.JS
   ============================================================ */