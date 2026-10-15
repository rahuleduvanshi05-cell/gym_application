<template>

<div class="container">

    <h1>
        Select Existing Folder
    </h1>

    <!-- SELECT FOLDER -->
    <input
        type="file"
        webkitdirectory
        directory
        multiple
        @change="selectFolder"
    />

    <!-- SHOW SELECTED FOLDER -->
    <div
        v-if="folderName"
        class="folder-box"
    >

        <h3>
            Selected Folder:
        </h3>

        <p>
            {{ folderName }}
        </p>

        <p>
            Total Files:
            {{ files.length }}
        </p>

    </div>

    <!-- FILE LIST -->
    <div
        v-if="files.length"
        class="file-list"
    >

        <h3>
            Files
        </h3>

        <ul>

            <li
                v-for="(file, index) in files"
                :key="index"
            >

                {{ file.webkitRelativePath }}

            </li>

        </ul>

    </div>

    <!-- BUTTON -->
    <button
        @click="uploadFolder"
        :disabled="loading"
    >

        {{ loading ? "Uploading..." : "Upload Folder Metadata" }}

    </button>

</div>

</template>

<script>

import axios from "axios";

export default {

    name: "FolderUploader",

    data() {

        return {

            files: [],

            folderName: "",

            loading: false
        };
    },



    methods: {

        // =====================================
        // SELECT FOLDER
        // =====================================

        selectFolder(event) {

            this.files =
            Array.from(
                event.target.files
            );



            // GET ROOT FOLDER NAME
            if (this.files.length > 0) {

                const firstPath =
                this.files[0]
                .webkitRelativePath;

                this.folderName =
                firstPath.split("/")[0];
            }



            console.log(
                "Selected Files:",
                this.files
            );

            console.log(
                "Folder Name:",
                this.folderName
            );
        },



        // =====================================
        // UPLOAD FOLDER
        // =====================================

        async uploadFolder() {

            try {

                if (
                    this.files.length === 0
                ) {

                    return alert(
                        "Please select folder"
                    );
                }



                this.loading = true;



                const formData =
                new FormData();



                // SEND FOLDER NAME
                formData.append(

                    "folderName",

                    this.folderName
                );



                // SEND FILES
                this.files.forEach(file => {

                    formData.append(

                        "files",

                        file
                    );



                    // ORIGINAL PATH
                    formData.append(

                        "relativePaths",

                        file.webkitRelativePath
                    );
                });



                const response =
                await axios.post(

                    "http://localhost:5000/api/folders/upload-existing-folder",

                    formData,

                    {

                        headers: {

                            "Content-Type":
                            "multipart/form-data"
                        }
                    }
                );



                console.log(
                    response.data
                );



                alert(
                    response.data.message
                );

            } catch (error) {

                console.log(error);

                alert(
                    error.response?.data?.message ||

                    "Upload Failed"
                );

            } finally {

                this.loading = false;
            }
        }
    }
};

</script>

<style scoped>

*{

    margin: 0;

    padding: 0;

    box-sizing: border-box;
}

.container{

    width: 900px;

    margin: auto;

    padding: 40px;
}

h1{

    margin-bottom: 20px;
}

input{

    margin-bottom: 20px;
}

button{

    padding: 14px 20px;

    border: none;

    background: black;

    color: white;

    border-radius: 8px;

    cursor: pointer;

    margin-top: 20px;
}

button:disabled{

    opacity: 0.5;
}

.folder-box{

    background: #f5f5f5;

    padding: 20px;

    border-radius: 10px;

    margin-bottom: 20px;
}

.file-list{

    background: #fafafa;

    border: 1px solid #ddd;

    padding: 20px;

    border-radius: 10px;

    max-height: 300px;

    overflow-y: auto;
}

.file-list ul{

    margin-top: 10px;

    padding-left: 20px;
}

.file-list li{

    margin-bottom: 8px;

    word-break: break-all;
}

</style>