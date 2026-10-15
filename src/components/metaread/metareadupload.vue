<template>
  <div class="container">
    <div class="header-decoration">
      <h1>📄 File Metadata Upload System</h1>
      <p class="subhead">Secure fingerprint & integrity tracking — every file gets SHA256 + security key</p>
    </div>

    <!-- UPLOAD SECTION -->
    <div class="upload-card">
      <form class="upload-form" @submit.prevent="uploadFile">
        <div class="file-input-wrapper">
          <label for="fileInput" class="custom-file-label">
            <span class="file-label-icon">📂</span>
            <span class="file-label-text">{{ selectedFile ? selectedFile.name : 'Choose a file...' }}</span>
          </label>
          <input 
            id="fileInput"
            type="file" 
            @change="handleFile"
            accept="*/*"
          />
        </div>
        <button 
          type="submit" 
          class="upload-btn"
          :disabled="loading"
        >
          <span v-if="loading" class="btn-spinner"></span>
          <span v-else>⬆️ Upload File</span>
          <span v-if="loading">Uploading...</span>
        </button>
      </form>

      <!-- FILE PREVIEW -->
      <div v-if="selectedFile" class="preview-box">
        <div class="preview-header">
          <h3>📎 Selected File</h3>
          <span class="preview-badge">Ready to upload</span>
        </div>
        <div class="file-detail-grid">
          <div class="detail-item">
            <span class="detail-label">Name:</span>
            <span class="detail-value">{{ selectedFile.name }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Size:</span>
            <span class="detail-value">{{ formatBytes(selectedFile.size) }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Type:</span>
            <span class="detail-value">{{ selectedFile.type || 'application/octet-stream' }}</span>
          </div>
        </div>
      </div>
    </div>

    <hr class="section-divider" />

    <!-- HISTORY SECTION - Full width list showing all details vertically -->
    <div class="history-section">
      <div class="history-header">
        <h2>📋 Upload History</h2>
        <span class="history-count" v-if="history.length">{{ history.length }} item(s)</span>
        <span class="history-count" v-else>No records yet</span>
      </div>

      <div v-if="history.length === 0 && !loading" class="empty-history">
        <div class="empty-icon">🗄️</div>
        <p>No files uploaded yet. Start by selecting a file above.</p>
      </div>

      <!-- HISTORY LIST - Each file as a full card with all details -->
      <div class="history-list">
        <div 
          class="history-card" 
          v-for="item in history" 
          :key="item._id || item.fileId"
        >
          <!-- File Header -->
          <div class="card-header">
            <div class="file-title">
              <span class="file-icon">📄</span>
              <h3>{{ item.originalName || 'Unnamed file' }}</h3>
              <span class="file-badge">{{ item.extension || (item.originalName?.split('.').pop() || 'file') }}</span>
            </div>
            <div class="file-id">
              <span class="id-label">File ID:</span>
              <code class="id-code">{{ item.fileId }}</code>
            </div>
          </div>

          <!-- Basic Info Grid -->
          <div class="info-section">
            <div class="info-row">
              <div class="info-item">
                <span class="info-icon">📇</span>
                <span class="info-label">MIME Type:</span>
                <span class="info-value">{{ item.mimeType || 'unknown' }}</span>
              </div>
              <div class="info-item">
                <span class="info-icon">💾</span>
                <span class="info-label">File Size:</span>
                <span class="info-value">{{ formatBytes(item.fileSize) }}</span>
              </div>
              <div class="info-item">
                <span class="info-icon">⏱️</span>
                <span class="info-label">Uploaded:</span>
                <span class="info-value">{{ formatDate(item.uploadedAt) }}</span>
              </div>
            </div>
          </div>

          <!-- Security Hashes Section -->
          <div class="security-section">
            <div class="security-block">
              <div class="security-header">
                <span class="security-icon">🔐</span>
                <strong>SHA256 Hash</strong>
              </div>
              <div class="hash-display">
                <code class="hash-value">{{ item.sha256 || '—' }}</code>
                <button class="copy-btn" @click="copyToClipboard(item.sha256)" title="Copy SHA256">📋</button>
              </div>
            </div>

            <div class="security-block">
              <div class="security-header">
                <span class="security-icon">🗝️</span>
                <strong>Security Key</strong>
              </div>
              <div class="hash-display">
                <code class="hash-value">{{ item.securityKey || '—' }}</code>
                <button class="copy-btn" @click="copyToClipboard(item.securityKey)" title="Copy Security Key">📋</button>
              </div>
            </div>
          </div>

          <!-- Metadata Section -->
          <details class="metadata-toggle">
            <summary>
              <span class="summary-icon">📑</span>
              View Extended Metadata
              <span class="summary-arrow">▼</span>
            </summary>
            <div class="metadata-content">
              <pre class="metadata-json">{{ prettyMetadata(item.metadata) }}</pre>
            </div>
          </details>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "MetadataUploader",
  
  data() {
    return {
      file: null,
      selectedFile: null,
      history: [],
      loading: false
    };
  },

  mounted() {
    this.getHistory();
  },

  methods: {
    // HANDLE FILE
    handleFile(e) {
      const files = e.target.files;
      if (files && files.length) {
        this.file = files[0];
        this.selectedFile = files[0];
      } else {
        this.file = null;
        this.selectedFile = null;
      }
    },

    // UPLOAD FILE
    async uploadFile() {
      try {
        if (!this.file) {
          alert("📁 Please select a file before uploading.");
          return;
        }
        
        this.loading = true;
        const formData = new FormData();
        formData.append("file", this.file);
        
        const response = await axios.post(
          "http://localhost:5000/api/files/upload",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        
        alert(response.data.message || "✅ Upload successful!");
        
        // Reset form
        this.file = null;
        this.selectedFile = null;
        const fileInput = document.getElementById('fileInput');
        if (fileInput) fileInput.value = '';
        
        await this.getHistory();
      } catch (error) {
        console.error(error);
        const msg = error.response?.data?.message || "❌ Upload failed. Make sure backend server is running on port 5000.";
        alert(msg);
      } finally {
        this.loading = false;
      }
    },

    // GET HISTORY
    async getHistory() {
      try {
        const response = await axios.get("http://localhost:5000/api/files/history");
        if (response.data && response.data.data) {
          this.history = response.data.data;
        } else {
          this.history = [];
        }
      } catch (error) {
        console.error("History fetch error:", error);
        this.history = [];
      }
    },

    // COPY TO CLIPBOARD
    copyToClipboard(text) {
      if (!text || text === '—') return;
      navigator.clipboard.writeText(text).then(() => {
        alert('Copied to clipboard!');
      }).catch(() => {
        alert('Failed to copy');
      });
    },

    // FORMAT SIZE
    formatBytes(bytes) {
      if (!bytes && bytes !== 0) return "0 Bytes";
      if (bytes === 0) return "0 Bytes";
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(1024));
      const val = bytes / Math.pow(1024, i);
      return `${val.toFixed(2)} ${sizes[i]}`;
    },

    // FORMAT DATE
    formatDate(date) {
      if (!date) return "Unknown";
      return new Date(date).toLocaleString(undefined, { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      });
    },

    // PRETTY METADATA
    prettyMetadata(metadata) {
      if (!metadata) return "{}";
      try {
        if (typeof metadata === 'string') {
          const parsed = JSON.parse(metadata);
          return JSON.stringify(parsed, null, 2);
        }
        return JSON.stringify(metadata, null, 2);
      } catch(e) {
        return String(metadata);
      }
    }
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: linear-gradient(135deg, #f5f7fa 0%, #f0f2f5 100%);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.5;
}

.container {
  max-width: 1300px;
  width: 92%;
  margin: 0 auto;
  padding: 32px 20px;
}

/* Header Styles */
.header-decoration {
  text-align: center;
  margin-bottom: 40px;
}

h1 {
  font-size: 36px;
  font-weight: 800;
  background: linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  letter-spacing: -0.5px;
  margin-bottom: 12px;
}

.subhead {
  color: #5a6e7c;
  font-size: 0.95rem;
  border-top: 2px solid #e0e7ed;
  display: inline-block;
  padding-top: 10px;
  font-weight: 500;
}

/* Upload Card */
.upload-card {
  background: white;
  border-radius: 28px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
  padding: 32px 36px;
  border: 1px solid rgba(203, 213, 225, 0.4);
  transition: transform 0.2s, box-shadow 0.2s;
}

.upload-card:hover {
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.12);
}

.upload-form {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: flex-end;
}

.file-input-wrapper {
  flex: 2;
  min-width: 250px;
  position: relative;
}

.file-input-wrapper input[type="file"] {
  position: absolute;
  opacity: 0;
  width: 0.1px;
  height: 0.1px;
  z-index: -1;
}

.custom-file-label {
  display: flex;
  align-items: center;
  gap: 14px;
  background: #f8fafd;
  border: 2px solid #e2e8f0;
  border-radius: 60px;
  padding: 14px 24px;
  cursor: pointer;
  transition: all 0.25s;
  font-weight: 600;
  color: #1e293b;
  width: 100%;
}

.custom-file-label:hover {
  background: #f1f5f9;
  border-color: #94a3b8;
  transform: translateY(-1px);
}

.file-label-icon {
  font-size: 1.4rem;
}

.file-label-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.95rem;
}

.upload-btn {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  border: none;
  padding: 14px 32px;
  border-radius: 60px;
  font-weight: 700;
  font-size: 1rem;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: white;
  cursor: pointer;
  transition: all 0.25s;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.upload-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
}

.upload-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255,255,255,0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.7s linear infinite;
  display: inline-block;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Preview Box */
.preview-box {
  margin-top: 28px;
  background: linear-gradient(135deg, #fefefe 0%, #f9fbfd 100%);
  border-radius: 20px;
  border: 1px solid #e9edf2;
  padding: 20px 28px;
}

.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
  flex-wrap: wrap;
}

.preview-header h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
}

.preview-badge {
  background: linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%);
  color: #1e40af;
  padding: 5px 14px;
  border-radius: 30px;
  font-size: 0.75rem;
  font-weight: 700;
}

.file-detail-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.detail-item {
  display: flex;
  gap: 10px;
  font-size: 0.9rem;
  background: white;
  padding: 8px 18px;
  border-radius: 40px;
  border: 1px solid #eef2f8;
}

.detail-label {
  font-weight: 700;
  color: #475569;
}

.detail-value {
  color: #0f172a;
  font-weight: 500;
  word-break: break-word;
}

/* Divider */
.section-divider {
  margin: 48px 0 32px;
  border: 0;
  height: 2px;
  background: linear-gradient(to right, #e2e8f0, #cbd5e1, #e2e8f0);
}

/* History Section */
.history-section {
  margin-top: 8px;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  flex-wrap: wrap;
  margin-bottom: 28px;
  padding-bottom: 12px;
  border-bottom: 3px solid #e2e8f0;
}

.history-header h2 {
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.3px;
  color: #0f172a;
}

.history-count {
  background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
  padding: 6px 16px;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 700;
  color: #1e3a8a;
}

/* Empty State */
.empty-history {
  text-align: center;
  padding: 64px 32px;
  background: white;
  border-radius: 32px;
  border: 2px dashed #cbd5e1;
  margin-top: 20px;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-history p {
  color: #64748b;
  font-size: 1rem;
}

/* History List - Each card shows ALL details vertically */
.history-list {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.history-card {
  background: white;
  border-radius: 28px;
  border: 1px solid #eef2f8;
  padding: 28px 32px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

.history-card:hover {
  border-color: #cbd5e1;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

/* Card Header */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f1f5f9;
}

.file-title {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.file-icon {
  font-size: 1.8rem;
}

.file-title h3 {
  font-weight: 800;
  font-size: 1.35rem;
  color: #0f172a;
  letter-spacing: -0.2px;
}

.file-badge {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  color: white;
  padding: 5px 14px;
  border-radius: 30px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.file-id {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f8fafc;
  padding: 6px 14px;
  border-radius: 40px;
}

.id-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #475569;
}

.id-code {
  font-family: 'SF Mono', 'Fira Code', monospace;
  font-size: 0.7rem;
  color: #0f172a;
  background: white;
  padding: 3px 8px;
  border-radius: 20px;
}

/* Info Section */
.info-section {
  margin-bottom: 24px;
}

.info-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fafcff;
  padding: 12px 18px;
  border-radius: 60px;
  border: 1px solid #eef2f8;
}

.info-icon {
  font-size: 1.1rem;
}

.info-label {
  font-weight: 700;
  color: #475569;
  font-size: 0.85rem;
}

.info-value {
  color: #0f172a;
  font-weight: 600;
  font-size: 0.9rem;
  margin-left: auto;
}

/* Security Section */
.security-section {
  background: linear-gradient(135deg, #f9fbfe 0%, #f5f8fc 100%);
  border-radius: 24px;
  padding: 20px 24px;
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.security-block {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.security-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
}

.security-icon {
  font-size: 1.1rem;
}

.security-header strong {
  color: #1e293b;
}

.hash-display {
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
  border-radius: 16px;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
}

.hash-value {
  flex: 1;
  font-family: 'SF Mono', 'Fira Code', monospace;
  font-size: 0.75rem;
  color: #1e293b;
  word-break: break-all;
  line-height: 1.4;
}

.copy-btn {
  background: #f1f5f9;
  border: none;
  padding: 6px 12px;
  border-radius: 40px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
  opacity: 0.7;
}

.copy-btn:hover {
  background: #e2e8f0;
  opacity: 1;
  transform: scale(1.05);
}

/* Metadata Toggle */
.metadata-toggle {
  margin-top: 8px;
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid #eef2f8;
  transition: all 0.2s;
}

.metadata-toggle summary {
  cursor: pointer;
  font-weight: 700;
  padding: 16px 20px;
  color: #1e2f44;
  display: flex;
  align-items: center;
  gap: 8px;
  user-select: none;
  border-radius: 20px;
}

.metadata-toggle summary:hover {
  background: #fafcff;
}

.summary-icon {
  font-size: 1rem;
}

.summary-arrow {
  margin-left: auto;
  font-size: 0.7rem;
  transition: transform 0.2s;
}

.metadata-toggle[open] .summary-arrow {
  transform: rotate(180deg);
}

.metadata-content {
  padding: 20px;
  border-top: 1px solid #eef2f8;
  background: #fafcff;
  border-radius: 0 0 20px 20px;
}

.metadata-json {
  background: #0f172a;
  color: #e2e8f0;
  padding: 20px;
  border-radius: 16px;
  overflow-x: auto;
  font-size: 0.75rem;
  font-family: 'SF Mono', 'Fira Code', monospace;
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.5;
}

/* Responsive */
@media (max-width: 768px) {
  .container {
    width: 95%;
    padding: 20px 12px;
  }
  
  .upload-card {
    padding: 24px 20px;
  }
  
  .upload-form {
    flex-direction: column;
    align-items: stretch;
  }
  
  .upload-btn {
    justify-content: center;
  }
  
  .history-card {
    padding: 20px;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .info-row {
    grid-template-columns: 1fr;
  }
  
  .info-item {
    flex-wrap: wrap;
  }
  
  .info-value {
    margin-left: 0;
    width: 100%;
  }
  
  .hash-display {
    flex-direction: column;
    align-items: stretch;
  }
  
  .copy-btn {
    align-self: flex-end;
  }
  
  h1 {
    font-size: 28px;
  }
  
  .history-header h2 {
    font-size: 24px;
  }
}
</style>