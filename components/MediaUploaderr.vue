<template>
  <v-container>
    <v-card class="pa-4">
      <v-card-title>Upload Media Files</v-card-title>
      <v-card-text>
        <!-- File Input -->
        <v-file-input
          v-model="files"
          multiple
          label="Select files"
          accept="image/*,video/*"
          prepend-icon="mdi-upload"
          show-size
          chips
          @change="handleFileSelect"
        ></v-file-input>

        <!-- File Previews (Before Upload) -->
        <v-row dense>
          <v-col v-for="(file, index) in previewFiles" :key="index" cols="4">
            <v-card outlined>
              <v-img v-if="isImage(file)" :src="file.preview" height="120px"></v-img>
              <video v-else :src="file.preview" height="120px" controls></video>
              <v-card-actions>
                <v-btn color="red" icon @click="removeFile(index)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <!-- Upload Button -->
        <v-btn :disabled="!files.length" color="primary" @click="uploadFiles">
          Upload Files
        </v-btn>

        <!-- Uploaded Files Display -->
        <v-divider class="my-4"></v-divider>
        <v-card-title>Uploaded Files</v-card-title>
        <v-row dense>
          <v-col v-for="(file, index) in uploadedFiles" :key="'uploaded-' + index" cols="4">
            <v-card outlined>
              <v-img v-if="isImage(file)" :src="file.url" height="120px"></v-img>
              <video v-else :src="file.url" height="120px" controls></video>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Snackbar Notification -->
    <v-snackbar v-model="snackbar" :timeout="3000" color="success">
      {{ snackbarMessage }}
    </v-snackbar>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      files: [],
      previewFiles: [],
      uploadedFiles: [], // Stores successfully uploaded files
      snackbar: false,
      snackbarMessage: "",
    };
  },
  methods: {
    handleFileSelect(event) {
      this.previewFiles = [];
      Array.from(event).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.previewFiles.push({ file, preview: e.target.result });
        };
        reader.readAsDataURL(file);
      });
    },
    isImage(file) {
      return file.file ? file.file.type.startsWith("image/") : file.url.match(/\.(jpeg|jpg|png|gif)$/);
    },
    removeFile(index) {
      this.files.splice(index, 1);
      this.previewFiles.splice(index, 1);
    },
    async uploadFiles() {
      if (!this.files.length) return;

      const formData = new FormData();
      this.files.forEach((file) => {
        formData.append("files[]", file);
      });

      try {
        const response = await this.$axios.post("/api/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        // Update uploaded files with URLs from response
        this.uploadedFiles = response.data.files;

        // Reset form
        this.files = [];
        this.previewFiles = [];

        this.snackbarMessage = "Upload successful!";
        this.snackbar = true;
      } catch (error) {
        this.snackbarMessage = "Upload failed.";
        this.snackbar = true;
      }
    },
  },
};
</script>

<style scoped>
.v-file-input {
  max-width: 500px;
}
</style>
