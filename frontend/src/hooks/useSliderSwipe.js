import { useEffect, useRef, useState } from "react";

const SWIPE_THRESHOLD = 48;

export function useSliderSwipe({ onPrev, onNext, page, maxPage }) {
    const viewportRef = useRef(null);
    const touchStartRef = useRef(null);
    const dragRafRef = useRef(0);
    const pendingOffsetRef = useRef(0);
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

        const flushDragOffset = () => {
            dragRafRef.current = 0;
            setDragOffset(pendingOffsetRef.current);
        };

        const queueDragOffset = (value) => {
            pendingOffsetRef.current = value;
            if (!dragRafRef.current) {
                dragRafRef.current = requestAnimationFrame(flushDragOffset);
            }
        };

        const startDrag = (clientX, clientY) => {
            touchStartRef.current = { x: clientX, y: clientY };
            setIsDragging(true);
            pendingOffsetRef.current = 0;
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
                queueDragOffset(clampDrag(deltaX));
            }
        };

        const endDrag = (clientX, clientY) => {
            const start = touchStartRef.current;
            if (!start) {
                return;
            }

            if (dragRafRef.current) {
                cancelAnimationFrame(dragRafRef.current);
                dragRafRef.current = 0;
            }

            const deltaX = clientX - start.x;
            const deltaY = clientY - start.y;

            touchStartRef.current = null;
            setIsDragging(false);
            pendingOffsetRef.current = 0;
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
            if (dragRafRef.current) {
                cancelAnimationFrame(dragRafRef.current);
                dragRafRef.current = 0;
            }
            touchStartRef.current = null;
            setIsDragging(false);
            pendingOffsetRef.current = 0;
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
            if (dragRafRef.current) {
                cancelAnimationFrame(dragRafRef.current);
            }
            element.removeEventListener("touchstart", onTouchStart);
            element.removeEventListener("touchmove", onTouchMove);
            element.removeEventListener("touchend", onTouchEnd);
            element.removeEventListener("touchcancel", cancelDrag);
        };
    }, [maxPage, onNext, onPrev, page]);

    return { viewportRef, dragOffset, isDragging };
}
