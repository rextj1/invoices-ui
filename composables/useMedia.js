import { reactive, toRefs } from "@nuxtjs/composition-api"; // Correct import

export function useMedia() {
  const state = reactive({
    files: [],
    previews: [],
    uploading: false,
    uploadProgress: 0,
    error: null,
    success: false,
  });

  const setFiles = (files) => {
    state.files = files || [];
    state.previews = state.files.map((file) => ({
      name: file.name,
      type: file.type,
      url: URL.createObjectURL(file),
    }));
    state.error = null;
    state.success = false;
  };

  const removeFile = (index) => {
    state.files = state.files.filter((_, i) => i !== index);
    state.previews = state.previews.filter((_, i) => i !== index);
  };

  const uploadFiles = async (axios) => {
    if (!state.files.length) return;

    state.uploading = true;
    state.uploadProgress = 0;
    state.error = null;
    state.success = false;

    const formData = new FormData();
    state.files.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });

    try {
      const response = await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          state.uploadProgress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
        },
      });
      state.success = true;
      state.files = [];
      state.previews = [];
      return response.data;
    } catch (error) {
      state.error = error.response?.data?.message || "Upload failed.";
    } finally {
      state.uploading = false;
    }
  };

  return {
    ...toRefs(state),
    setFiles,
    removeFile,
    uploadFiles,
  };
}