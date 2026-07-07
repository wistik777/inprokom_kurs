import { useEffect, useRef, useState } from "react";

const SWIPE_THRESHOLD = 48;

export function useSliderSwipe({ onPrev, onNext, page, maxPage }) {
    const viewportRef = useRef(null);
    const touchStartRef = useRef(null);
    const [dragOffset, setDragOffset] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        const element = viewportRef.current;
        if (!element) {
            return undefined;
        }

        const clampDrag = (deltaX) => {
            if (page <= 0 && deltaX > 0) {
                return deltaX * 0.35;
            }

            if (page >= maxPage && deltaX < 0) {
                return deltaX * 0.35;
            }

            return deltaX;
        };

        const startDrag = (clientX, clientY) => {
            touchStartRef.current = { x: clientX, y: clientY };
            setIsDragging(true);
            setDragOffset(0);
        };

        const moveDrag = (clientX, clientY, preventDefault) => {
            const start = touchStartRef.current;
            if (!start) {
                return;
            }

            const deltaX = clientX - start.x;
            const deltaY = clientY - start.y;

            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 8) {
                preventDefault?.();
                setDragOffset(clampDrag(deltaX));
            }
        };

        const endDrag = (clientX, clientY) => {
            const start = touchStartRef.current;
            if (!start) {
                return;
            }

            const deltaX = clientX - start.x;
            const deltaY = clientY - start.y;

            touchStartRef.current = null;
            setIsDragging(false);
            setDragOffset(0);

            if (Math.abs(deltaX) < SWIPE_THRESHOLD || Math.abs(deltaX) <= Math.abs(deltaY)) {
                return;
            }

            if (deltaX < 0) {
                onNext();
                return;
            }

            onPrev();
        };

        const cancelDrag = () => {
            touchStartRef.current = null;
            setIsDragging(false);
            setDragOffset(0);
        };

        const onTouchStart = (event) => {
            if (event.touches.length !== 1) {
                return;
            }

            const touch = event.touches[0];
            startDrag(touch.clientX, touch.clientY);
        };

        const onTouchMove = (event) => {
            if (event.touches.length !== 1) {
                return;
            }

            const touch = event.touches[0];
            moveDrag(touch.clientX, touch.clientY, () => event.preventDefault());
        };

        const onTouchEnd = (event) => {
            const touch = event.changedTouches[0];
            endDrag(touch.clientX, touch.clientY);
        };

        element.addEventListener("touchstart", onTouchStart, { passive: true });
        element.addEventListener("touchmove", onTouchMove, { passive: false });
        element.addEventListener("touchend", onTouchEnd, { passive: true });
        element.addEventListener("touchcancel", cancelDrag, { passive: true });

        return () => {
            element.removeEventListener("touchstart", onTouchStart);
            element.removeEventListener("touchmove", onTouchMove);
            element.removeEventListener("touchend", onTouchEnd);
            element.removeEventListener("touchcancel", cancelDrag);
        };
    }, [maxPage, onNext, onPrev, page]);

    return { viewportRef, dragOffset, isDragging };
}
