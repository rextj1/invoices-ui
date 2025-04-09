<template>
  <v-container>
    <v-card class="pa-4">
      <v-card-title>Upload Media Files</v-card-title>
      <v-card-text>
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

    <v-snackbar v-model="snackbar" :timeout="3000" color="success">
      {{ snackbarMessage }}
    </v-snackbar>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      files: [],
      previewFiles: [],
      uploadedFiles: [],
      snackbar: false,
      snackbarMessage: "",
    };
  },
  // created() {
  //   this.fetchUploadedFiles();
  // },
  methods: {
    async fetchUploadedFiles() {
      try {
        const response = await this.$axios.get("/api/media");
        this.uploadedFiles = response.data.files.map((file) => ({
          id: file.id,
          original_name: file.original_name,
          url: file.url, // ✅ Corrected to use backend URL
          created_at: file.created_at,
        }));
      } catch (error) {
        console.error("Error fetching uploaded files:", error);
      }
     },
    handleFileSelect(event) {
      this.files = event;
      this.previewFiles = [];
      this.files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.previewFiles.push({
            file,
            preview: e.target.result,
            type: file.type,
          });
        };
        reader.readAsDataURL(file);
      });
    },
    isImage(file) {
      return file.url ? /\.(jpeg|jpg|png|gif)$/i.test(file.url) : file.type?.startsWith("image/");
    },
    isVideo(file) {
      return file.url ? /\.(mp4|webm|ogg)$/i.test(file.url) : file.type?.startsWith("video/");
    },
    removeFile(index) {
      this.files.splice(index, 1);
      this.previewFiles.splice(index, 1);
    },
    async uploadFiles() {
  if (this.files.length === 0) return;

  // ✅ Prevent duplicate uploads by checking name & size
  const filteredFiles = this.files.filter((file) => {
    return !this.uploadedFiles.some(
      (uploaded) =>
        uploaded.original_name === file.name &&
        uploaded.size === file.size
    );
  });

  if (filteredFiles.length === 0) {
    this.snackbarMessage = "These files are already uploaded.";
    this.snackbar = true;
    return;
  }

  const formData = new FormData();
  filteredFiles.forEach((file) => {
    formData.append("files[]", file);
  });

  try {
    await this.$axios.post("/api/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    await this.fetchUploadedFiles();

    this.files = [];
    this.previewFiles = [];
    this.snackbarMessage = "Upload successful!";
    this.snackbar = true;
  } catch (error) {
    this.snackbarMessage = "Upload failed.";
    this.snackbar = true;
  }
}

  },
};
</script>

<style scoped>
.v-file-input {
  max-width: 500px;
}
</style>
