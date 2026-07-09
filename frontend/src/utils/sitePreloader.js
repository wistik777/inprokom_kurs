import { markSkipSitePreloader, shouldSkipSitePreloader } from './skipPreloader';

const MIN_VISIBLE_MS = 700;
const MAX_VISIBLE_MS = 4000;
const startedAt = performance.now();

function waitForWindowLoad() {
    if (document.readyState === 'complete') {
        return Promise.resolve();
    }

    return new Promise((resolve) => {
        window.addEventListener('load', resolve, { once: true });
    });
}

function waitForFonts() {
    if (document.fonts?.ready) {
        return document.fonts.ready.catch(() => undefined);
    }

    return Promise.resolve();
}

function finishPreloader(preloader) {
    markSkipSitePreloader();

    preloader.classList.add('site-preloader--done');

    requestAnimationFrame(() => {
        document.body.classList.remove('site-loading');
        document.body.classList.add('site-ready');
    });

    window.setTimeout(() => {
        preloader.classList.add('site-preloader--hide');
    }, 320);

    preloader.addEventListener(
        'transitionend',
        (event) => {
            if (event.target === preloader) {
                preloader.remove();
            }
        },
        { once: true }
    );
}

function dismissSkippedPreloader(preloader) {
    if (preloader) {
        preloader.remove();
    }

    document.body.classList.remove('site-loading');
    document.body.classList.add('site-ready');
    delete document.documentElement.dataset.skipPreloader;
}

export function initSitePreloader() {
    const preloader = document.getElementById('site-preloader');

    if (document.documentElement.dataset.skipPreloader === '1' || shouldSkipSitePreloader()) {
        dismissSkippedPreloader(preloader);
        return;
    }

    if (!preloader) {
        document.body.classList.remove('site-loading');
        document.body.classList.add('site-ready');
        return;
    }

    let finished = false;

    const safeFinish = () => {
        if (finished) {
            return;
        }

        finished = true;
        finishPreloader(preloader);
    };

    const maxTimer = window.setTimeout(safeFinish, MAX_VISIBLE_MS);

    Promise.all([waitForWindowLoad(), waitForFonts()]).then(() => {
        const elapsed = performance.now() - startedAt;
        const delay = Math.max(0, MIN_VISIBLE_MS - elapsed);

        window.setTimeout(() => {
            window.clearTimeout(maxTimer);
            safeFinish();
        }, delay);
    });
}
