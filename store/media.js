// import { defineStore } from "pinia";

// export const useMediaStore = defineStore("media", {
//   state: () => ({
//     files: [],
//     previews: [],
//     uploading: false,
//     uploadProgress: 0,
//     error: null,
//     success: false,
//   }),
//   actions: {
//     setFiles(files) {
//       this.files = files || [];
//       this.previews = this.files.map((file) => ({
//         name: file.name,
//         type: file.type,
//         url: URL.createObjectURL(file),
//       }));
//       this.error = null;
//       this.success = false;
//     },
//     removeFile(index) {
//       this.files = this.files.filter((_, i) => i !== index);
//       this.previews = this.previews.filter((_, i) => i !== index);
//     },
//     async uploadFiles(axios) {
//       if (!this.files.length) return;

//       this.uploading = true;
//       this.uploadProgress = 0;
//       this.error = null;
//       this.success = false;

//       const formData = new FormData();
//       this.files.forEach((file, index) => {
//         formData.append(`files[${index}]`, file);
//       });

//       try {
//         const response = await this.$axios.post("/api/upload-media", formData, {
//           headers: { "Content-Type": "multipart/form-data" },
//           onUploadProgress: (progressEvent) => {
//             this.uploadProgress = Math.round(
//               (progressEvent.loaded * 100) / progressEvent.total
//             );
//           },
//         });
//         this.success = true;
//         this.files = [];
//         this.previews = [];
//         return response.data;
//       } catch (error) {
//         this.error = error.response?.data?.message || "Upload failed.";
//       } finally {
//         this.uploading = false;
//       }
//     },
//   },
// });