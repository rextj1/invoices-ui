<template>
  <v-container>
    <v-card class="pa-4">
      <v-card-title>Upload Media Files</v-card-title>
      <v-card-text>
        <v-file-input
          v-model="selectedFiles"
          label="Select files"
          accept="image/*,video/*"
          prepend-icon="mdi-upload"
          show-size
          chips
          multiple
          @change="handleFileSelect"
          ref="fileInput"
        ></v-file-input>

        <v-row dense>
          <v-col v-for="(file, index) in previewFiles" :key="index" cols="4">
            <v-card outlined>
              <v-img v-if="isImage(file)" :src="file.preview" height="120px"></v-img>
              <video v-else-if="isVideo(file)" height="120px" controls>
                <source :src="file.preview" type="video/mp4" />
              </video>
              <v-card-actions>
                <v-btn color="red" icon @click="removeFile(index)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <v-btn :disabled="files.length === 0" color="primary" @click="uploadFiles">
          Upload Files
        </v-btn>

        <v-divider class="my-4"></v-divider>

        <v-card-title>Uploaded Files</v-card-title>
        <v-row dense>
          <v-col v-for="(file, index) in uploadedFiles" :key="'uploaded-' + index" cols="4">
            <v-card outlined>
              <v-img v-if="isImage(file)" :src="file.url" height="120px"></v-img>
              <video v-else-if="isVideo(file)" height="120px" controls>
                <source :src="file.url" type="video/mp4" />
              </video>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-snackbar v-model="snackbar" :timeout="3000" :color="snackbarColor">
      {{ snackbarMessage }}
    </v-snackbar>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      files: [],
      selectedFiles: null, // For resetting input
      previewFiles: [],
      uploadedFiles: [],
      snackbar: false,
      snackbarMessage: "",
      snackbarColor: "success",
    };
  },
  mounted() {
    this.fetchUploadedFiles(); // Fetch uploaded files on load
  },
  methods: {
    async fetchUploadedFiles() {
      try {
        const response = await this.$axios.get("/api/media");
        this.uploadedFiles = response.data.files.map((file) => ({
          id: file.id,
          original_name: file.original_name,
          url: file.url,
          created_at: file.created_at,
        }));
      } catch (error) {
        this.showSnackbar("Failed to fetch uploaded files.", "error");
        console.error("Error fetching uploaded files:", error.response?.data || error.message);
      }
    },

    handleFileSelect(selectedFiles) {
      if (!selectedFiles || selectedFiles.length === 0) return;

      this.files = selectedFiles;
      const previewList = [];
      selectedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          previewList.push({ file, preview: e.target.result, type: file.type });

          if (previewList.length === selectedFiles.length) {
            this.previewFiles = [...previewList]; // Ensure reactivity
          }
        };
        reader.readAsDataURL(file);
      });
    },

    isImage(file) {
      return file?.type?.startsWith("image/") || /\.(jpeg|jpg|png|gif)$/i.test(file?.url || "");
    },

    isVideo(file) {
      return file?.type?.startsWith("video/") || /\.(mp4|webm|ogg)$/i.test(file?.url || "");
    },

    removeFile(index) {
      this.files.splice(index, 1);
      this.previewFiles.splice(index, 1);
    },

    showSnackbar(message, type = "success") {
      this.snackbarMessage = message;
      this.snackbarColor = type === "error" ? "red" : "success";
      this.snackbar = true;
    },

    async uploadFiles() {
      if (this.files.length === 0) return;

      const formData = new FormData();
      this.files.forEach((file) => formData.append("files[]", file));

      try {
        await this.$axios.post("/api/uploadMedia", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        await this.fetchUploadedFiles();
        this.resetForm();
        this.showSnackbar("Upload successful!", "success");
      } catch (error) {
        console.error("Upload error:", error.response?.data || error.message);
        
        const errorMessage =
          error.response?.data?.message || "Upload failed. Please try again.";

        this.showSnackbar(errorMessage, "error");
      }
    },

    resetForm() {
      this.files = [];
      this.previewFiles = [];
      this.selectedFiles = null; // Reset file input
      this.$refs.fileInput.reset(); // Reset Vuetify file input
    },
  },
};
</script>

<style scoped>
.v-file-input {
  max-width: 500px;
}
</style>
