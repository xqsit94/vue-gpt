<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, Ref } from "vue";

const loadingText: Ref<string> = ref("Loading");
const interval: Ref<number> = ref(0);

onMounted(() => {
  const loadingTexts = [
    "Loading",
    "Loading.",
    "Loading..",
    "Loading...",
  ];
  let i = 0;
  interval.value = setInterval(() => {
    loadingText.value = loadingTexts[i];
    i = (i + 1) % loadingTexts.length;
  }, 500);
});

onBeforeUnmount(() => {
  clearInterval(interval.value);
});
</script>

<template>
  <div>{{ loadingText }}</div>
</template>