<template>
<div class="container">

    <h2>Forensic File Upload</h2>

    <!-- UPLOAD -->
    <input type="file" @change="onFile" />
    <button @click="upload">Upload</button>

    <hr />

    <!-- LIST -->
    <div v-for="item in files" :key="item.fileId" class="card">

        <h3>{{ item.originalName }}</h3>

        <p><b>MIME:</b> {{ item.mimeType }}</p>
        <p><b>Size:</b> {{ item.fileSize }} bytes</p>

        <!-- STATUS -->
        <p>
            <b>Status:</b>
            {{ item.verificationStatus || "NOT VERIFIED" }}
        </p>

        <!-- HMAC BUTTON -->
        <button @click="addHmac(item.fileId)">
            Add HMAC Key
        </button>

    </div>

</div>
</template>

<script>
import axios from "axios";

export default {
data() {
    return {
        file: null,     // selected file
        files: []       // uploaded list
    };
},

mounted() {
    this.loadFiles();
},

methods: {

    // SELECT FILE
    onFile(e) {
        this.file = e.target.files[0]; // ✅ FIXED
    },

    // UPLOAD FILE
    async upload() {

        if (!this.file) {
            alert("Select a file first");
            return;
        }

        const formData = new FormData();
        formData.append("file", this.file); // must match multer

        try {
            await axios.post(
                "http://localhost:5000/api/metadata/upload",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            alert("Upload Successful");

            this.file = null;

            this.loadFiles();

        } catch (err) {
            console.log(err);
            alert("Upload Failed");
        }
    },

    // LOAD ALL FILES
    async loadFiles() {

        try {
            const res = await axios.get(
                "http://localhost:5000/api/metadata/all"
            );

            this.files = res.data.data || [];

        } catch (err) {
            console.log(err);
        }
    },

    // ADD HMAC
    async addHmac(fileId) {

        try {
            await axios.post(
                "http://localhost:5000/api/metadata/hmac",
                { fileId }
            );

            alert("HMAC Added Successfully");
            this.loadFiles();

        } catch (err) {
            console.log(err);
            alert(err?.response?.data?.message || "HMAC Failed");
        }
    }
}
};
</script>

<style scoped>
.container {
    width: 800px;
    margin: auto;
}

.card {
    border: 1px solid #ddd;
    padding: 15px;
    margin: 10px 0;
    border-radius: 8px;
}
</style>