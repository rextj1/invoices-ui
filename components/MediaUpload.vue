<template>
  <v-container>
    <v-form ref="form" @submit.prevent="uploadFiles($axios)">
      <v-file-input
        v-model="files"
        multiple
        label="Select Media Files"
        accept="image/*,video/*,.pdf"
        :rules="fileRules"
        show-size
        counter
        prepend-icon="mdi-paperclip"
        @change="setFiles"
      ></v-file-input>

      <!-- File Previews -->
      <v-row v-if="previews.length" class="mt-4">
        <v-col v-for="(preview, index) in previews" :key="index" cols="12" sm="6" md="4">
          <v-card>
            <v-img
              v-if="preview.type.startsWith('image')"
              :src="preview.url"
              height="200"
              contain
            ></v-img>
            <video
              v-else-if="preview.type.startsWith('video')"
              :src="preview.url"
              controls
              height="200"
              width="100%"
            ></video>
            <iframe
              v-else-if="preview.type === 'application/pdf'"
              :src="preview.url"
              height="200"
              width="100%"
            ></iframe>
            <v-card-subtitle>{{ preview.name }}</v-card-subtitle>
            <v-btn color="error" small @click="removeFile(index)">
              Remove
            </v-btn>
          </v-card>
        </v-col>
      </v-row>

      <!-- Progress and Feedback -->
      <v-progress-linear
        v-if="uploading"
        :value="uploadProgress"
        color="primary"
        height="10"
        class="mt-4"
      ></v-progress-linear>

      <v-btn
        color="primary"
        :disabled="!files.length || uploading"
        type="submit"
        class="mt-4"
      >
        Upload Files
      </v-btn>

      <v-alert v-if="error" type="error" class="mt-4">
        {{ error }}
      </v-alert>
      <v-alert v-if="success" type="success" class="mt-4">
        Files uploaded successfully!
      </v-alert>
    </v-form>
  </v-container>
</template>

<script>
import { useMedia } from "~/composables/useMedia";

export default {
  setup() {
    const {
      files,
      previews,
      uploading,
      uploadProgress,
      error,
      success,
      setFiles,
      removeFile,
      uploadFiles,
    } = useMedia();

    const fileRules = [
      (files) =>
        !files ||
        files.every((file) => file.size < 10 * 1024 * 1024) ||
        "Each file must be less than 10MB!",
      (files) =>
        !files ||
        files.length <= 5 ||
        "You can upload a maximum of 5 files at a time!",
    ];

    return {
      files,
      previews,
      uploading,
      uploadProgress,
      error,
      success,
      setFiles,
      removeFile,
      uploadFiles,
      fileRules,
    };
  },
};
</script>