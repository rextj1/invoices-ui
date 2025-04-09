<template>
    <MediaUploader/>
</template>

<script>
import MediaUploader from "@/components/MediaUploader.vue";
export default {
  middleware: "auth",
  name: "media",
}
</script>

<!-- <template>
  <FileUpload />
</template>

<script>
import FileUpload from '@/components/FileUpload.vue';

export default {
  components: { FileUpload }
};
</script> -->
