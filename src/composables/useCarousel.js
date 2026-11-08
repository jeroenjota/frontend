import { ref, onMounted, onBeforeUnmount } from "vue";

export function useCarousel() {
  const container = ref(null);

  const canScrollLeft = ref(false);
  const canScrollRight = ref(false);

  const updateScrollState = () => {
    const el = container.value;
    if (!el) return;

    canScrollLeft.value = el.scrollLeft > 0;
    canScrollRight.value =
      el.scrollLeft + el.clientWidth < el.scrollWidth - 5;
  };

  const scrollLeft = () => {
    const el = container.value;
    if (!el) return;

    el.scrollBy({ left: -400, behavior: "smooth" });
  };

  const scrollRight = () => {
    const el = container.value;
    if (!el) return;

    el.scrollBy({ left: 400, behavior: "smooth" });
  };

  onMounted(() => {
    const el = container.value;
    if (!el) return;

    updateScrollState();
    el.addEventListener("scroll", updateScrollState);
    window.addEventListener("resize", updateScrollState);
  });

  onBeforeUnmount(() => {
    container.value?.removeEventListener("scroll", updateScrollState);
    window.removeEventListener("resize", updateScrollState);
  });

  return {
    container,
    canScrollLeft,
    canScrollRight,
    scrollLeft,
    scrollRight,
    updateScrollState,
  };
}