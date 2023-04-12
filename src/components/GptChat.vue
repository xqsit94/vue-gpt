<script setup lang="ts">
import { Configuration, OpenAIApi } from "openai";
import { ref, Ref } from "vue";
import HighlightJs from "./HighlightJs.vue";
import LoadingText from "./LoadingText.vue";

/**
 * OpenAI API Key Configuration
 */
const configuration = new Configuration({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
});

/**
 * Variables
 */
const query: Ref<string> = ref("");
const responseContent: Ref<ContentData[]> = ref([]);
const isLoading: Ref<boolean> = ref(false);

/**
 * Handles the query and sends it to OpenAI
 * @returns {void}
 */
const handleQuery: () => void = async () => {
  if (query.value === "") {
    return;
  }
  isLoading.value = true;

  responseContent.value.push({
    question: query.value,
    role: Role.User,
    answer: "Loading...",
  });

  const openai: OpenAIApi = new OpenAIApi(configuration);

  await openai.createChatCompletion({
    model: import.meta.env.VITE_OPENAI_MODEL || "gpt-3.5-turbo",
    messages: [{ role: "user", content: query.value }],
  }).then((response) => {
    const content = response.data.choices[0].message as ResponseContentData;

    responseContent.value.splice(responseContent.value.length - 1, 1, {
      question: query.value,
      role: content.role,
      answer: content.content,
    });
  }).catch((error) => {
    const errorResponse = error.response.data as ErrorResponse;

    responseContent.value.splice(responseContent.value.length - 1, 1, {
      question: query.value,
      role: Role.Error,
      answer: errorResponse.error.message,
    });
  }).finally(() => {
    isLoading.value = false;
    query.value = "";
  });
};

/**
 * Splits content answer into paragraphs and ``` code blocks
 * uses highlight.js to highlight code blocks
 * @param content
 * @returns {string | CodeBlock}[]
 */
const splitContent: (content: string) => (string | CodeBlock)[] = (content) => {
  const paragraphs = content.split("\n\n");
  const codeBlocks = content.split("```");

  if (codeBlocks.length > 1) {
    return codeBlocks.map((codeBlock, i) => {
      if (i % 2 === 0) {
        return `${codeBlock}`;
      } else {
        return {
          codeBlock,
        };
      }
    });
  } else {
    return paragraphs.map((paragraph) => `${paragraph}`);
  }
};

const instanceOfCodeBlock = (object: any): object is CodeBlock => {
  return "codeBlock" in object;
};
</script>

<template>
  <div class="flex justify-center mt-4">
    <div class="w-1/2">
      <input
        v-model="query"
        type="text"
        class="w-full border-2 p-4 rounded-lg outline-none"
        placeholder="Ask me anything..."
        @keypress.enter="handleQuery"
      />
    </div>
  </div>

  <div class="flex justify-center mt-4">
    <div class="w-1/2">
      <div v-for="(content, i) in responseContent" :key="i">
        <div class="flex justify-end mt-2">
          <div class="bg-blue-500 text-white p-4 rounded-lg">
            {{ content.question }}
          </div>
        </div>
        <div class="flex justify-start mt-2">
          <div v-if="isLoading && (i + 1) === responseContent.length" class="bg-gray-500 text-white p-4 rounded-lg">
            <LoadingText />
          </div>
          <div v-else-if="content.role === Role.Error" class="bg-error text-white p-4 rounded-lg">
              {{ content.answer }}
          </div>
          <div v-else class="bg-gray-500 text-white p-4 rounded-lg prose">
            <template
              v-for="(block, index) in splitContent(content.answer)"
              :key="index"
            >
              <component
                v-if="instanceOfCodeBlock(block)"
                :is="HighlightJs"
                :code="block.codeBlock"
              />
              <p v-else>{{ block }}</p>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
