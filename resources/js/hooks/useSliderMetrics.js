const GAP = 32;

const DESKTOP = {
    activity: { width: 474, height: 559, perView: 3 },
    news: { width: 384.12, height: 453, perView: 4 },
};

/** Расчёт размеров по фактической ширине контейнера слайдера (без обрезки). */
export function computeSliderMetrics(variant, containerWidth) {
    const desktop = DESKTOP[variant];

    if (!containerWidth || containerWidth < 200) {
        return {
            cardWidth: desktop.width,
            cardHeight: desktop.height,
            perView: desktop.perView,
            gap: GAP,
        };
    }

    let perView = desktop.perView;

    if (containerWidth <= 425) {
        perView = 1;
    } else if (containerWidth <= 1024) {
        perView = Math.min(2, desktop.perView);
    }

    const available = containerWidth - (perView - 1) * GAP;
    const fittedWidth = Math.floor(available / perView);
    const cardWidth = Math.min(desktop.width, fittedWidth);
    const scale = cardWidth / desktop.width;
    const cardHeight = Math.round(desktop.height * scale);

    return {
        cardWidth,
        cardHeight,
        perView,
        gap: GAP,
    };
}

export { DESKTOP, GAP };
