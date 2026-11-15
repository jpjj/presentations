<script setup lang="ts">
// A live game in an iframe, with a picture as the placeholder.
// The picture shows in the overview, the presenter view, the PDF export,
// and whenever the game does not load. The game is drawn at `width`
// pixels wide and scaled down to fit, so it keeps its desktop layout.
import { computed, onMounted, onBeforeUnmount, ref } from 'vue'
import { useNav, useSlideContext } from '@slidev/client'

const props = withDefaults(defineProps<{
  src: string
  poster: string
  alt?: string
  width?: number
}>(), {
  alt: '',
  width: 1000,
})

const { $renderContext } = useSlideContext()
const { isPrintMode } = useNav()

const box = ref<HTMLElement>()
const size = ref({ w: 0, h: 0 })
const failed = ref(false)

const live = computed(() => $renderContext.value === 'slide' && !isPrintMode.value && !failed.value)
const scale = computed(() => (size.value.w ? size.value.w / props.width : 1))

let observer: ResizeObserver | undefined
onMounted(() => {
  observer = new ResizeObserver(() => {
    if (box.value)
      size.value = { w: box.value.clientWidth, h: box.value.clientHeight }
  })
  if (box.value)
    observer.observe(box.value)
})
onBeforeUnmount(() => observer?.disconnect())

// A missing file does not raise an error in an iframe: the dev server and
// Netlify answer with the deck's own index.html. Detect that and fall back.
function onLoad(e: Event) {
  try {
    const doc = (e.target as HTMLIFrameElement).contentDocument
    if (!doc || !doc.body?.children.length || doc.getElementById('app'))
      failed.value = true
  }
  catch {
    // another origin: cannot look inside, trust it
  }
}
</script>

<template>
  <div ref="box" class="game-embed">
    <img :src="poster" :alt="alt" class="poster">
    <iframe
      v-if="live && size.w"
      :src="src"
      :title="alt"
      class="game"
      :style="{
        width: `${width}px`,
        height: `${size.h / scale}px`,
        transform: `scale(${scale})`,
      }"
      @load="onLoad"
      @error="failed = true"
    />
  </div>
</template>

<style scoped>
.game-embed {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.poster {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.game {
  position: absolute;
  top: 0;
  left: 0;
  border: 0;
  transform-origin: top left;
  background: #0a0703;
}
</style>
