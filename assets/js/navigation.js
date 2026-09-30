/* ============================================================
   JOTA EFI BEATZ
   NAVIGATION SYSTEM
   ------------------------------------------------------------
   Arquivo: assets/js/navigation.js
   Compatível com: index.html
   ============================================================ */

(function () {
    "use strict";

    /* ========================================================
       CONFIGURAÇÃO
       ======================================================== */

    const CONFIG = {
        mobileBreakpoint: 900,
        headerScrolledClass: "is-scrolled",
        mobileOpenClass: "is-open",
        dropdownOpenClass: "is-open",
        activeClass: "is-active",
        bodyMenuClass: "menu-is-open",
        scrollOffset: 20
    };


    /* ========================================================
       ELEMENTOS DO INDEX.HTML
       ======================================================== */

    let elements = {
        header: null,
        menuToggle: null,

        desktopNavigation: null,
        desktopList: null,
        desktopItems: [],
        desktopLinks: [],

        desktopDropdowns: [],
        desktopDropdownTriggers: [],
        desktopDropdownMenus: [],

        mobileNavigation: null,
        mobileInner: null,
        mobileList: null,
        mobileItems: [],
        mobileLinks: [],

        mobileDropdowns: [],
        mobileDropdownToggles: [],
        mobileSubmenus: [],
        mobileSubmenuLinks: []
    };


    /* ========================================================
       ESTADO
       ======================================================== */

    const state = {
        mobileMenuOpen: false,
        desktopDropdownOpen: null,
        mobileDropdownOpen: null,
        currentMode: null
    };


    /* ========================================================
       INICIALIZAÇÃO
       ======================================================== */

    document.addEventListener("DOMContentLoaded", function () {

        cacheElements();

        /*
         * Se o header principal não existir,
         * não tentamos executar o sistema.
         */
        if (!elements.header) {
            console.warn(
                "[Jota Efi Navigation] .site-header não foi encontrado."
            );
            return;
        }

        setupHeader();

        setupMenuToggle();

        setupMobileNavigation();

        setupDesktopNavigation();

        setupDesktopDropdowns();

        setupMobileDropdowns();

        setupOutsideClick();

        setupEscapeKey();

        setupScrollHeader();

        setupActivePage();

        setupResize();

        setupAccessibility();

        updateNavigationMode();

        exposeNavigationAPI();

    });


    /* ========================================================
       CACHE DOS ELEMENTOS
       ======================================================== */

    function cacheElements() {

        /* HEADER */

        elements.header = document.querySelector(
            ".site-header"
        );

        elements.menuToggle = document.querySelector(
            ".menu-toggle"
        );


        /* DESKTOP NAVIGATION */

        elements.desktopNavigation = document.querySelector(
            ".main-nav"
        );

        elements.desktopList = document.querySelector(
            ".main-nav .nav__list"
        );

        elements.desktopItems = Array.from(
            document.querySelectorAll(
                ".main-nav .nav__item"
            )
        );

        elements.desktopLinks = Array.from(
            document.querySelectorAll(
                ".main-nav .nav__link"
            )
        );


        /* DESKTOP DROPDOWNS */

        elements.desktopDropdowns = Array.from(
            document.querySelectorAll(
                ".main-nav .dropdown"
            )
        );

        elements.desktopDropdownTriggers = Array.from(
            document.querySelectorAll(
                ".main-nav .dropdown__trigger"
            )
        );

        elements.desktopDropdownMenus = Array.from(
            document.querySelectorAll(
                ".main-nav .dropdown__menu"
            )
        );


        /* MOBILE NAVIGATION */

        elements.mobileNavigation = document.querySelector(
            "#mobile-navigation"
        );

        elements.mobileInner = document.querySelector(
            "#mobile-navigation .mobile-nav__inner"
        );

        elements.mobileList = document.querySelector(
            "#mobile-navigation .mobile-nav__list"
        );

        elements.mobileItems = Array.from(
            document.querySelectorAll(
                "#mobile-navigation .mobile-nav__item"
            )
        );

        elements.mobileLinks = Array.from(
            document.querySelectorAll(
                "#mobile-navigation .mobile-nav__link"
            )
        );


        /* MOBILE DROPDOWNS */

        elements.mobileDropdowns = Array.from(
            document.querySelectorAll(
                "#mobile-navigation .mobile-nav__item--dropdown"
            )
        );

        elements.mobileDropdownToggles = Array.from(
            document.querySelectorAll(
                "#mobile-navigation .mobile-nav__dropdown-toggle"
            )
        );

        elements.mobileSubmenus = Array.from(
            document.querySelectorAll(
                "#mobile-navigation .mobile-nav__submenu"
            )
        );

        elements.mobileSubmenuLinks = Array.from(
            document.querySelectorAll(
                "#mobile-navigation .mobile-nav__submenu a"
            )
        );
    }


    /* ========================================================
       HEADER
       ======================================================== */

    function setupHeader() {

        if (!elements.header) {
            return;
        }

        elements.header.setAttribute(
            "data-navigation-ready",
            "true"
        );
    }


    /* ========================================================
       MENU TOGGLE
       ======================================================== */

    function setupMenuToggle() {

        if (!elements.menuToggle) {
            console.warn(
                "[Jota Efi Navigation] .menu-toggle não foi encontrado."
            );

            return;
        }

        elements.menuToggle.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                if (state.mobileMenuOpen) {
                    closeMobileNavigation();
                } else {
                    openMobileNavigation();
                }

            }
        );
    }


    /* ========================================================
       ABRIR MENU MOBILE
       ======================================================== */

    function openMobileNavigation() {

        if (!elements.mobileNavigation) {

            console.error(
                "[Jota Efi Navigation] #mobile-navigation não foi encontrado."
            );

            return;
        }


        state.mobileMenuOpen = true;


        /* Classe no body */

        document.body.classList.add(
            CONFIG.bodyMenuClass
        );


        /* Classe no menu */

        elements.mobileNavigation.classList.add(
            CONFIG.mobileOpenClass
        );


        /* Acessibilidade */

        elements.mobileNavigation.setAttribute(
            "aria-hidden",
            "false"
        );


        elements.menuToggle.setAttribute(
            "aria-expanded",
            "true"
        );


        elements.menuToggle.setAttribute(
            "aria-label",
            "Fechar menu"
        );


        /* Troca ícone */

        updateMenuIcon(true);


        /* Impede scroll */

        lockBodyScroll();


        /* Evento customizado */

        document.dispatchEvent(
            new CustomEvent(
                "jota:navigation-open"
            )
        );
    }


    /* ========================================================
       FECHAR MENU MOBILE
       ======================================================== */

    function closeMobileNavigation() {

        if (!elements.mobileNavigation) {
            return;
        }


        state.mobileMenuOpen = false;


        document.body.classList.remove(
            CONFIG.bodyMenuClass
        );


        elements.mobileNavigation.classList.remove(
            CONFIG.mobileOpenClass
        );


        elements.mobileNavigation.setAttribute(
            "aria-hidden",
            "true"
        );


        elements.menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );


        elements.menuToggle.setAttribute(
            "aria-label",
            "Abrir menu"
        );


        updateMenuIcon(false);


        unlockBodyScroll();


        /*
         * Fecha todos os dropdowns mobile
         */

        closeAllMobileDropdowns();


        document.dispatchEvent(
            new CustomEvent(
                "jota:navigation-close"
            )
        );
    }


    /* ========================================================
       ÍCONE DO HAMBURGUER
       ======================================================== */

    function updateMenuIcon(isOpen) {

        if (!elements.menuToggle) {
            return;
        }

        const icon =
            elements.menuToggle.querySelector("i");

        if (!icon) {
            return;
        }


        if (isOpen) {

            icon.classList.remove(
                "bi-list"
            );

            icon.classList.add(
                "bi-x-lg"
            );

        } else {

            icon.classList.remove(
                "bi-x-lg"
            );

            icon.classList.add(
                "bi-list"
            );
        }
    }


    /* ========================================================
       MOBILE NAVIGATION
       ======================================================== */

    function setupMobileNavigation() {

        if (!elements.mobileNavigation) {
            return;
        }


        /*
         * Todos os links normais do menu mobile
         */

        elements.mobileLinks.forEach(
            function (link) {

                link.addEventListener(
                    "click",
                    function () {

                        /*
                         * Se for link normal,
                         * fecha o menu.
                         */

                        if (
                            !link.classList.contains(
                                "mobile-nav__dropdown-toggle"
                            )
                        ) {
                            closeMobileNavigation();
                        }

                    }
                );

            }
        );


        /*
         * Links dentro dos submenus
         */

        elements.mobileSubmenuLinks.forEach(
            function (link) {

                link.addEventListener(
                    "click",
                    function () {

                        closeMobileNavigation();

                    }
                );

            }
        );
    }


    /* ========================================================
       DESKTOP NAVIGATION
       ======================================================== */

    function setupDesktopNavigation() {

        if (!elements.desktopNavigation) {
            return;
        }


        elements.desktopLinks.forEach(
            function (link) {

                link.addEventListener(
                    "click",
                    function () {

                        /*
                         * Se não for dropdown,
                         * fecha qualquer dropdown aberto.
                         */

                        if (
                            !link.classList.contains(
                                "dropdown__trigger"
                            )
                        ) {
                            closeAllDesktopDropdowns();
                        }

                    }
                );

            }
        );
    }


    /* ========================================================
       DESKTOP DROPDOWNS
       ======================================================== */

    function setupDesktopDropdowns() {

        if (
            !elements.desktopDropdowns.length
        ) {
            return;
        }


        elements.desktopDropdowns.forEach(
            function (dropdown, index) {

                const trigger =
                    dropdown.querySelector(
                        ".dropdown__trigger"
                    );

                const menu =
                    dropdown.querySelector(
                        ".dropdown__menu"
                    );


                if (!trigger) {
                    return;
                }


                /*
                 * Clique no dropdown
                 */

                trigger.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();

                        if (
                            dropdown.classList.contains(
                                CONFIG.dropdownOpenClass
                            )
                        ) {

                            closeDesktopDropdown(
                                dropdown
                            );

                        } else {

                            closeAllDesktopDropdowns();

                            openDesktopDropdown(
                                dropdown
                            );
                        }

                    }
                );


                /*
                 * Teclado
                 */

                trigger.addEventListener(
                    "keydown",
                    function (event) {

                        if (
                            event.key === "Enter" ||
                            event.key === " "
                        ) {

                            event.preventDefault();

                            trigger.click();

                        }


                        if (
                            event.key === "Escape"
                        ) {

                            closeDesktopDropdown(
                                dropdown
                            );

                            trigger.focus();

                        }

                    }
                );


                /*
                 * Hover desktop
                 */

                dropdown.addEventListener(
                    "mouseenter",
                    function () {

                        if (
                            window.innerWidth >
                            CONFIG.mobileBreakpoint
                        ) {

                            closeAllDesktopDropdowns();

                            openDesktopDropdown(
                                dropdown
                            );
                        }

                    }
                );


                dropdown.addEventListener(
                    "mouseleave",
                    function () {

                        if (
                            window.innerWidth >
                            CONFIG.mobileBreakpoint
                        ) {

                            closeDesktopDropdown(
                                dropdown
                            );
                        }

                    }
                );


                /*
                 * Acessibilidade
                 */

                trigger.setAttribute(
                    "aria-expanded",
                    "false"
                );


                if (menu) {

                    const menuId =
                        menu.id ||
                        "desktop-dropdown-" + index;

                    menu.id = menuId;

                    trigger.setAttribute(
                        "aria-controls",
                        menuId
                    );

                }

            }
        );
    }


    /* ========================================================
       ABRIR DROPDOWN DESKTOP
       ======================================================== */

    function openDesktopDropdown(dropdown) {

        if (!dropdown) {
            return;
        }


        dropdown.classList.add(
            CONFIG.dropdownOpenClass
        );


        const trigger =
            dropdown.querySelector(
                ".dropdown__trigger"
            );


        if (trigger) {

            trigger.setAttribute(
                "aria-expanded",
                "true"
            );

        }


        state.desktopDropdownOpen =
            dropdown;
    }


    /* ========================================================
       FECHAR DROPDOWN DESKTOP
       ======================================================== */

    function closeDesktopDropdown(dropdown) {

        if (!dropdown) {
            return;
        }


        dropdown.classList.remove(
            CONFIG.dropdownOpenClass
        );


        const trigger =
            dropdown.querySelector(
                ".dropdown__trigger"
            );


        if (trigger) {

            trigger.setAttribute(
                "aria-expanded",
                "false"
            );

        }


        if (
            state.desktopDropdownOpen ===
            dropdown
        ) {

            state.desktopDropdownOpen =
                null;
        }
    }


    /* ========================================================
       FECHAR TODOS OS DROPDOWNS DESKTOP
       ======================================================== */

    function closeAllDesktopDropdowns() {

        elements.desktopDropdowns.forEach(
            function (dropdown) {

                closeDesktopDropdown(
                    dropdown
                );

            }
        );

        state.desktopDropdownOpen = null;
    }


    /* ========================================================
       MOBILE DROPDOWNS
       ======================================================== */

    function setupMobileDropdowns() {

        elements.mobileDropdownToggles.forEach(
            function (toggle) {

                toggle.setAttribute(
                    "aria-expanded",
                    "false"
                );


                toggle.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();
                        event.stopPropagation();


                        const item =
                            toggle.closest(
                                ".mobile-nav__item--dropdown"
                            );


                        if (!item) {
                            return;
                        }


                        const submenu =
                            item.querySelector(
                                ".mobile-nav__submenu"
                            );


                        if (!submenu) {
                            return;
                        }


                        const isOpen =
                            item.classList.contains(
                                CONFIG.dropdownOpenClass
                            );


                        /*
                         * Fecha os outros
                         */

                        closeAllMobileDropdowns(
                            item
                        );


                        if (isOpen) {

                            closeMobileDropdown(
                                item
                            );

                        } else {

                            openMobileDropdown(
                                item,
                                submenu,
                                toggle
                            );

                        }

                    }
                );


                toggle.addEventListener(
                    "keydown",
                    function (event) {

                        if (
                            event.key === "Enter" ||
                            event.key === " "
                        ) {

                            event.preventDefault();

                            toggle.click();

                        }


                        if (
                            event.key === "Escape"
                        ) {

                            const item =
                                toggle.closest(
                                    ".mobile-nav__item--dropdown"
                                );

                            if (item) {

                                closeMobileDropdown(
                                    item
                                );

                                toggle.focus();

                            }

                        }

                    }
                );

            }
        );
    }


    /* ========================================================
       ABRIR DROPDOWN MOBILE
       ======================================================== */

    function openMobileDropdown(
        item,
        submenu,
        toggle
    ) {

        item.classList.add(
            CONFIG.dropdownOpenClass
        );


        toggle.setAttribute(
            "aria-expanded",
            "true"
        );


        submenu.setAttribute(
            "aria-hidden",
            "false"
        );


        state.mobileDropdownOpen =
            item;
    }


    /* ========================================================
       FECHAR DROPDOWN MOBILE
       ======================================================== */

    function closeMobileDropdown(item) {

        if (!item) {
            return;
        }


        item.classList.remove(
            CONFIG.dropdownOpenClass
        );


        const toggle =
            item.querySelector(
                ".mobile-nav__dropdown-toggle"
            );


        const submenu =
            item.querySelector(
                ".mobile-nav__submenu"
            );


        if (toggle) {

            toggle.setAttribute(
                "aria-expanded",
                "false"
            );

        }


        if (submenu) {

            submenu.setAttribute(
                "aria-hidden",
                "true"
            );

        }


        if (
            state.mobileDropdownOpen ===
            item
        ) {

            state.mobileDropdownOpen =
                null;
        }
    }


    /* ========================================================
       FECHAR TODOS OS DROPDOWNS MOBILE
       ======================================================== */

    function closeAllMobileDropdowns(
        except = null
    ) {

        elements.mobileDropdowns.forEach(
            function (item) {

                if (item !== except) {

                    closeMobileDropdown(
                        item
                    );

                }

            }
        );


        if (!except) {
            state.mobileDropdownOpen = null;
        }
    }


    /* ========================================================
       CLICK FORA
       ======================================================== */

    function setupOutsideClick() {

        document.addEventListener(
            "click",
            function (event) {

                /*
                 * Desktop dropdown
                 */

                if (
                    state.desktopDropdownOpen &&
                    !state.desktopDropdownOpen.contains(
                        event.target
                    )
                ) {

                    closeAllDesktopDropdowns();

                }


                /*
                 * Menu mobile
                 */

                if (
                    state.mobileMenuOpen &&
                    elements.mobileNavigation &&
                    !elements.mobileNavigation.contains(
                        event.target
                    ) &&
                    elements.menuToggle &&
                    !elements.menuToggle.contains(
                        event.target
                    )
                ) {

                    closeMobileNavigation();

                }

            }
        );
    }


    /* ========================================================
       ESCAPE
       ======================================================== */

    function setupEscapeKey() {

        document.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key !== "Escape"
                ) {
                    return;
                }


                /*
                 * Fecha menu mobile
                 */

                if (state.mobileMenuOpen) {

                    closeMobileNavigation();

                    if (elements.menuToggle) {
                        elements.menuToggle.focus();
                    }

                    return;
                }


                /*
                 * Fecha dropdown desktop
                 */

                if (
                    state.desktopDropdownOpen
                ) {

                    const dropdown =
                        state.desktopDropdownOpen;

                    closeDesktopDropdown(
                        dropdown
                    );


                    const trigger =
                        dropdown.querySelector(
                            ".dropdown__trigger"
                        );

                    if (trigger) {
                        trigger.focus();
                    }

                }

            }
        );
    }


    /* ========================================================
       HEADER AO FAZER SCROLL
       ======================================================== */

    function setupScrollHeader() {

        if (!elements.header) {
            return;
        }


        updateHeaderScroll();


        window.addEventListener(
            "scroll",
            updateHeaderScroll,
            {
                passive: true
            }
        );
    }


    function updateHeaderScroll() {

        if (!elements.header) {
            return;
        }


        if (
            window.scrollY >
            CONFIG.scrollOffset
        ) {

            elements.header.classList.add(
                CONFIG.headerScrolledClass
            );

        } else {

            elements.header.classList.remove(
                CONFIG.headerScrolledClass
            );

        }

    }


    /* ========================================================
       PÁGINA ATIVA
       ======================================================== */

    function setupActivePage() {

        const currentPath =
            normalizePath(
                window.location.pathname
            );


        /*
         * Links desktop
         */

        elements.desktopLinks.forEach(
            function (link) {

                const href =
                    link.getAttribute("href");


                if (!href) {
                    return;
                }


                /*
                 * Ignora links #
                 */

                if (
                    href === "#" ||
                    href.startsWith(
                        "javascript:"
                    )
                ) {
                    return;
                }


                const linkPath =
                    normalizePath(
                        getPathFromHref(
                            href
                        )
                    );


                if (
                    linkPath === currentPath
                ) {

                    link.classList.add(
                        CONFIG.activeClass
                    );


                    const parentDropdown =
                        link.closest(
                            ".dropdown"
                        );


                    if (parentDropdown) {

                        const trigger =
                            parentDropdown.querySelector(
                                ".dropdown__trigger"
                            );

                        if (trigger) {

                            trigger.classList.add(
                                CONFIG.activeClass
                            );

                        }
                    }

                }

            }
        );


        /*
         * Links mobile
         */

        elements.mobileLinks.forEach(
            function (link) {

                const href =
                    link.getAttribute("href");


                if (!href) {
                    return;
                }


                if (
                    href === "#" ||
                    href.startsWith(
                        "javascript:"
                    )
                ) {
                    return;
                }


                const linkPath =
                    normalizePath(
                        getPathFromHref(
                            href
                        )
                    );


                if (
                    linkPath === currentPath
                ) {

                    link.classList.add(
                        CONFIG.activeClass
                    );

                }

            }
        );
    }


    /* ========================================================
       NORMALIZAR PATH
       ======================================================== */

    function normalizePath(path) {

        if (!path) {
            return "/";
        }


        /*
         * Remove query string
         */

        path =
            path.split("?")[0];


        /*
         * Remove hash
         */

        path =
            path.split("#")[0];


        /*
         * Normaliza barras
         */

        path =
            path.replace(
                /\/+/g,
                "/"
            );


        /*
         * Remove barra final,
         * exceto raiz
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


        /*
         * Trata index.html
         */

        if (
            path.endsWith(
                "/index.html"
            )
        ) {

            path =
                path.replace(
                    "/index.html",
                    ""
                );

            if (!path) {
                path = "/";
            }
        }


        return path;
    }


    /* ========================================================
       OBTER PATH DE UM HREF
       ======================================================== */

    function getPathFromHref(href) {

        try {

            const url =
                new URL(
                    href,
                    window.location.href
                );

            return url.pathname;

        } catch (error) {

            return href;
        }
    }


    /* ========================================================
       RESPONSIVIDADE / RESIZE
       ======================================================== */

    function setupResize() {

        let resizeTimer;


        window.addEventListener(
            "resize",
            function () {

                clearTimeout(
                    resizeTimer
                );


                resizeTimer =
                    setTimeout(
                        function () {

                            updateNavigationMode();

                        },
                        150
                    );

            }
        );
    }


    /* ========================================================
       ATUALIZAR MODO DE NAVEGAÇÃO
       ======================================================== */

    function updateNavigationMode() {

        const isMobile =
            window.innerWidth <=
            CONFIG.mobileBreakpoint;


        const newMode =
            isMobile
                ? "mobile"
                : "desktop";


        if (
            state.currentMode ===
            newMode
        ) {
            return;
        }


        state.currentMode =
            newMode;


        /*
         * Entrou no desktop
         */

        if (
            newMode === "desktop"
        ) {

            closeMobileNavigation();

            closeAllMobileDropdowns();

            document.body.classList.remove(
                CONFIG.bodyMenuClass
            );

        }


        /*
         * Entrou no mobile
         */

        if (
            newMode === "mobile"
        ) {

            closeAllDesktopDropdowns();

        }
    }


    /* ========================================================
       ACESSIBILIDADE
       ======================================================== */

    function setupAccessibility() {

        /*
         * Menu mobile
         */

        if (
            elements.mobileNavigation
        ) {

            elements.mobileNavigation.setAttribute(
                "aria-hidden",
                "true"
            );

        }


        /*
         * Botão mobile
         */

        if (
            elements.menuToggle
        ) {

            elements.menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

            elements.menuToggle.setAttribute(
                "aria-controls",
                "mobile-navigation"
            );

            elements.menuToggle.setAttribute(
                "aria-label",
                "Abrir menu"
            );

            elements.menuToggle.setAttribute(
                "type",
                "button"
            );

        }


        /*
         * Submenus mobile
         */

        elements.mobileSubmenus.forEach(
            function (submenu) {

                submenu.setAttribute(
                    "aria-hidden",
                    "true"
                );

            }
        );
    }


    /* ========================================================
       BODY SCROLL LOCK
       ======================================================== */

    function lockBodyScroll() {

        document.body.style.overflow =
            "hidden";
    }


    function unlockBodyScroll() {

        /*
         * Só devolve o scroll se
         * nenhum menu estiver aberto.
         */

        if (
            !state.mobileMenuOpen
        ) {

            document.body.style.overflow =
                "";
        }
    }


    /* ========================================================
       API PÚBLICA
       ======================================================== */

    function exposeNavigationAPI() {

        window.JotaNavigation = {

            openMenu:
                openMobileNavigation,

            closeMenu:
                closeMobileNavigation,

            toggleMenu:
                function () {

                    if (
                        state.mobileMenuOpen
                    ) {

                        closeMobileNavigation();

                    } else {

                        openMobileNavigation();

                    }

                },

            closeDesktopDropdowns:
                closeAllDesktopDropdowns,

            closeMobileDropdowns:
                closeAllMobileDropdowns,

            refresh:
                function () {

                    cacheElements();

                    setupActivePage();

                    updateNavigationMode();

                    updateHeaderScroll();

                },

            getState:
                function () {

                    return {
                        mobileMenuOpen:
                            state.mobileMenuOpen,

                        desktopDropdownOpen:
                            !!state.desktopDropdownOpen,

                        mobileDropdownOpen:
                            !!state.mobileDropdownOpen,

                        mode:
                            state.currentMode
                    };

                }

        };
    }

})();