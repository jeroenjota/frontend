<template>
  <blockquote
    :id="`review-content-${reviewId}`"
    ref="text"
    class="my-4 whitespace-pre-wrap break-words text-base leading-6 text-gray-800"
    :class="{ 'line-clamp-3': !expanded }">
    {{ content }}
  </blockquote>
  <button
    v-if="truncated"
    type="button"
    :aria-expanded="expanded"
    :aria-controls="`review-content-${reviewId}`"
    class="mb-3 text-sm text-primary underline hover:no-underline"
    @click="expanded = !expanded">
    {{ expanded ? "Read Less" : "Read More" }}
  </button>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from "vue";

const props = defineProps({
  content: { type: String, required: true },
  reviewId: { type: Number, required: true },
});
const text = ref(null);
const expanded = ref(false);
const truncated = ref(false);
let observer;

function measure() {
  if (!expanded.value && text.value) {
    truncated.value = text.value.scrollHeight > text.value.clientHeight + 1;
  }
}

onMounted(() => {
  observer = new ResizeObserver(measure);
  observer.observe(text.value);
  measure();
});

watch(() => props.content, async () => {
  expanded.value = false;
  await nextTick();
  measure();
});
watch(expanded, async () => {
  await nextTick();
  measure();
});
onBeforeUnmount(() => observer?.disconnect());
</script>
