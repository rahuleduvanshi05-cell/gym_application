<template>

<div class="container">

    <!-- LOGIN SCREEN -->
    <div v-if="!isLoggedIn">

        <h1>
            Secure Folder Login
        </h1>

        <form @submit.prevent="loginUser">

            <input
                v-model="login.email"
                type="email"
                placeholder="Email"
                required
            />

            <input
                v-model="login.password"
                type="password"
                placeholder="Password"
                required
            />

            <button
                type="submit"
                :disabled="loading"
            >

                {{ loading ? "Logging..." : "Login" }}

            </button>

        </form>

    </div>



    <!-- FILE MANAGER -->
    <div v-else>

        <div class="topbar">

            <h1>
                Dynamic Folder & File Manager
            </h1>

            <button
                class="logout"
                @click="logout"
            >
                Logout
            </button>

        </div>


        <!-- CREATE FORM -->
        <form @submit.prevent="createStructure">

            <input
                v-model="form.folderName"
                type="text"
                placeholder="Folder Name"
                required
            />

            <input
                v-model="form.subFolderName"
                type="text"
                placeholder="Sub Folder Name"
            />

            <input
                v-model="form.fileName"
                type="text"
                placeholder="File Name"
                required
            />

            <input
                v-model="form.extension"
                type="text"
                placeholder="Extension"
                required
            />

            <textarea
                v-model="form.content"
                placeholder="File Content"
            ></textarea>

            <button
                type="submit"
                :disabled="loading"
            >

                {{ loading
                    ? "Creating..."
                    : "Create Structure"
                }}

            </button>

        </form>

        <hr />

        <!-- FILE LIST -->
        <h2>
            All Files
        </h2>

        <div
            class="card"
            v-for="file in files"
            :key="file._id"
        >

            <h3>
                {{ file.fileName }}.{{ file.extension }}
            </h3>

            <p>
                <strong>Folder:</strong>
                {{ file.folderName }}
            </p>

            <p v-if="file.subFolderName">

                <strong>Sub Folder:</strong>

                {{ file.subFolderName }}

            </p>

            <p>
                <strong>Path:</strong>
                {{ file.filePath }}
            </p>

            <pre>{{ file.content }}</pre>

        </div>

    </div>

</div>

</template>

<script>

import axios from "axios";

export default {

    name: "DynamicFileManager",

    data() {

        return {

            apiUrl:
            "http://127.0.0.1:5000/api/files",

            loading: false,

            isLoggedIn: false,

            token: "",

            files: [],


            // LOGIN DATA
            login: {

                email: "",

                password: ""
            },


            // FILE DATA
            form: {

                folderName: "",

                subFolderName: "",

                fileName: "",

                extension: "",

                content: ""
            }
        };
    },



    mounted() {

        // CHECK TOKEN
        const token =
        localStorage.getItem("token");

        if (token) {

            this.token = token;

            this.isLoggedIn = true;

            this.getAllFiles();
        }
    },



    methods: {

        // LOGIN USER
        async loginUser() {

            try {

                this.loading = true;

                const response =
                await axios.post(

                    `${this.apiUrl}/login`,

                    {

                        email:
                        this.login.email,

                        password:
                        this.login.password,

                        folderName:
                        "main-folder"
                    }
                );


                console.log(response.data);

                // SAVE TOKEN
                localStorage.setItem(

                    "token",

                    response.data.token
                );

                this.token =
                response.data.token;

                this.isLoggedIn = true;

                alert(
                    response.data.message
                );

                // LOAD FILES
                this.getAllFiles();

            } catch (error) {

                console.log(error);

                alert(

                    error.response?.data?.message ||

                    "Login Failed"
                );

            } finally {

                this.loading = false;
            }
        },



        // LOGOUT
        logout() {

            localStorage.removeItem(
                "token"
            );

            this.token = "";

            this.isLoggedIn = false;

            this.files = [];
        },



        // CREATE FILE/FOLDER
        async createStructure() {

            try {

                this.loading = true;

                const response =
                await axios.post(

                    `${this.apiUrl}/create`,

                    this.form,

                    {
                        headers: {

                            Authorization:
                            this.token,

                            "Content-Type":
                            "application/json"
                        }
                    }
                );

                alert(
                    response.data.message
                );

                // RESET
                this.form = {

                    folderName: "",

                    subFolderName: "",

                    fileName: "",

                    extension: "",

                    content: ""
                };

                // REFRESH
                this.getAllFiles();

            } catch (error) {

                console.log(error);

                alert(

                    error.response?.data?.message ||

                    "Create Failed"
                );

            } finally {

                this.loading = false;
            }
        },



        // GET FILES
        async getAllFiles() {

            try {

                const response =
                await axios.get(

                    `${this.apiUrl}/all`,

                    {
                        headers: {

                            Authorization:
                            this.token
                        }
                    }
                );

                this.files =
                response.data.data;

            } catch (error) {

                console.log(error);

                alert("Load Failed");
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

body{
    background: #f5f5f5;
}

.container{

    width: 900px;

    margin: auto;

    padding: 40px;
}

.topbar{

    display: flex;

    justify-content: space-between;

    align-items: center;

    margin-bottom: 20px;
}

h1{

    font-size: 32px;
}

form{

    display: flex;

    flex-direction: column;

    gap: 15px;

    margin-top: 20px;
}

input,
textarea{

    width: 100%;

    padding: 14px;

    border: 1px solid #ccc;

    border-radius: 8px;

    font-size: 15px;
}

textarea{

    height: 180px;

    resize: vertical;
}

button{

    padding: 15px;

    border: none;

    background: black;

    color: white;

    font-size: 16px;

    border-radius: 8px;

    cursor: pointer;
}

button:hover{

    opacity: 0.8;
}

button:disabled{

    opacity: 0.5;
}

.logout{

    background: red;
}

.card{

    background: white;

    border-radius: 10px;

    padding: 20px;

    margin-top: 20px;

    border: 1px solid #ddd;
}

pre{

    background: #f1f1f1;

    padding: 10px;

    margin-top: 10px;

    overflow-x: auto;
}

hr{

    margin: 40px 0;
}

</style>