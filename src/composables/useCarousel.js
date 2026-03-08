import { ref, onMounted, nextTick } from "vue";

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

  onMounted(async () => {
    await nextTick();

    const el = container.value;
    if (!el) return;

    updateScrollState();
    el.addEventListener("scroll", updateScrollState);
    window.addEventListener("resize", updateScrollState);
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