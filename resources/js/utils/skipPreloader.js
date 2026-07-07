export const SKIP_PRELOADER_KEY = 'inprokom.skipSitePreloader';

export function markSkipSitePreloader() {
    try {
        sessionStorage.setItem(SKIP_PRELOADER_KEY, '1');
    } catch {
        // sessionStorage may be unavailable
    }
}

export function shouldSkipSitePreloader() {
    try {
        return sessionStorage.getItem(SKIP_PRELOADER_KEY) === '1';
    } catch {
        return false;
    }
}

export function installSkipPreloaderOnFormSubmit() {
    document.addEventListener(
        'submit',
        (event) => {
            if (event.target instanceof HTMLFormElement) {
                markSkipSitePreloader();
            }
        },
        true
    );
}

export function installSkipPreloaderOnInternalNavigation() {
    document.addEventListener(
        'click',
        (event) => {
            const anchor = event.target instanceof Element ? event.target.closest('a[href]') : null;

            if (!(anchor instanceof HTMLAnchorElement)) {
                return;
            }

            const href = anchor.getAttribute('href');

            if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
                return;
            }

            if (anchor.target === '_blank' || anchor.hasAttribute('download')) {
                return;
            }

            try {
                const url = new URL(href, window.location.href);

                if (url.origin === window.location.origin) {
                    markSkipSitePreloader();
                }
            } catch {
                // ignore invalid URLs
            }
        },
        true
    );
}
