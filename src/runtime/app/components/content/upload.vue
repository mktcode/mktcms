<script setup lang="ts">
  import useAdminUpload from '../../composables/useAdminUpload';
  
  const { isUploading, fileInput, path, uploadFiles } = useAdminUpload()
  </script>
  
  <template>
    <div style="display: flex; gap: 8px; margin: 16px 0;">
      <input
        v-model="path"
        type="text"
        placeholder="Unterordner (z.B. 'Produkte')"
      />
      <button :disabled="isUploading">
        Neuer Inhalt
      </button>
      <button
        @click="fileInput?.click()"
        :disabled="isUploading"
      >
        Bild/Dokument hochladen
      </button>
      <input
        ref="fileInput"
        style="display: none"
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.gif,.svg,.webp,.md,.docx,.txt"
        @change="async (e) => { await uploadFiles(e); }"
      />
    </div>
  </template>