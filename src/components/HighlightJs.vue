<script setup lang="ts">
import "highlight.js/lib/common";
import hljsVuePlugin from "@highlightjs/vue-plugin";
import { defineComponent } from "vue";

const HighlightJs = hljsVuePlugin.component;

defineComponent({
  components: {
    HighlightJs,
  },
})

defineProps({
  code: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <HighlightJs autodetect :code="code" />
</template>
