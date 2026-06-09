# Demo Jenkins CI/CD Login App

## รายละเอียดโครงการ

โปรเจกต์นี้เป็นเว็บแอปพลิเคชัน Login แบบง่าย พัฒนาด้วย Node.js และ Express เพื่อสาธิตการทำงานของ CI/CD Pipeline โดยใช้ Jenkins และ Docker

เมื่อมีการ Push โค้ดขึ้น GitHub Jenkins จะทำงานอัตโนมัติ โดยดึงโค้ดล่าสุดมาติดตั้ง Dependencies, รัน Unit Test, สร้าง Docker Image และ Deploy Container เวอร์ชันใหม่

---

## คุณสมบัติของระบบ

- หน้า Login ด้วย HTML
- Backend Validation ด้วย Node.js และ Express
- Unit Testing ด้วย Jest
- Containerization ด้วย Docker
- Continuous Integration และ Continuous Deployment ด้วย Jenkins

---

## โครงสร้างโปรเจกต์

text demo-jenkins-login/ │ ├── app.js ├── auth.js ├── auth.test.js ├── package.json ├── Dockerfile ├── Jenkinsfile │ └── public/     └── index.html 

---

## เทคโนโลยีที่ใช้

- Node.js
- Express.js
- Jest
- Docker
- Jenkins
- GitHub

---

# การติดตั้ง Jenkins ด้วย Docker

โปรเจกต์นี้ใช้ Jenkins ที่รันอยู่บน Docker Container เพื่อทำหน้าที่เป็น CI/CD Server

## สร้าง Jenkins Container

bash docker run -d \   --name jenkins \   -p 8080:8080 \   -p 50000:50000 \   -v jenkins_home:/var/jenkins_home \   -v /var/run/docker.sock:/var/run/docker.sock \   jenkins/jenkins:lts 

## เข้าสู่ระบบ Jenkins

เปิด Browser

text http://localhost:8080 

ดึงรหัสผ่านเริ่มต้น

bash docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword 

---

# การเชื่อม Jenkins กับ GitHub

1. สร้าง Pipeline Project
2. เลือก Pipeline script from SCM
3. เลือก Git
4. กำหนด Repository URL

text https://github.com/Gameinwza/demo-jenkins-login.git 

5. Branch

text */main 

6. Script Path

text Jenkinsfile 

7. กด Save

---

# การติดตั้งโปรเจกต์

## Clone Repository

bash git clone https://github.com/Gameinwza/demo-jenkins-login.git cd demo-jenkins-login 

## ติดตั้ง Dependencies

bash npm install 

## รันโปรเจกต์

bash npm start 

เปิดใช้งานผ่าน Browser

text http://localhost:3000 

---

# การทดสอบระบบ

รัน Unit Test

bash npm test 

ตัวอย่างผลลัพธ์

text PASS ./auth.test.js  Login Validation ✓ valid email and password ✓ invalid email ✓ short password ✓ empty fields  Test Suites: 1 passed Tests: 4 passed 

---

# การใช้งาน Docker

## Build Docker Image

bash docker build -t demo-jenkins-login . 

## Run Docker Container

bash docker run -d \   --name demo-app \   -p 3000:3000 \   demo-jenkins-login 

เปิดใช้งานผ่าน Browser

text http://localhost:3000 

---

# Jenkins Pipeline

Pipeline จะทำงานตามลำดับดังนี้

## Stage 1 : Checkout Source Code

ดึง Source Code เวอร์ชันล่าสุดจาก GitHub

## Stage 2 : Install Dependencies

bash npm install 

## Stage 3 : Run Unit Tests

bash npm test 

## Stage 4 : Build Docker Image

bash docker build -t demo-jenkins-login:latest . 

## Stage 5 : Deploy Container

bash docker rm -f demo-app || true  docker run -d \   --name demo-app \   -p 3000:3000 \   demo-jenkins-login:latest 

---

# Jenkinsfile

groovy pipeline {     agent any      options {         skipDefaultCheckout(true)     }      stages {          stage('Checkout Source') {             steps {                 checkout scm             }         }          stage('Install Dependencies') {             steps {                 sh 'npm install'             }         }          stage('Run Unit Tests') {             steps {                 sh 'npm test'             }         }          stage('Build Docker Image') {             steps {                 sh 'docker build -t demo-jenkins-login:latest .'             }         }          stage('Deploy Container') {             steps {                 sh '''                 docker rm -f demo-app || true                  docker run -d \                   --name demo-app \                   -p 3000:3000 \                   demo-jenkins-login:latest                 '''             }         }     } } 

---

# ลำดับการทำงานของ CI/CD

text Developer     ↓ Git Push     ↓ GitHub Repository     ↓ Jenkins Trigger     ↓ Checkout Source Code     ↓ Install Dependencies     ↓ Run Unit Tests     ↓ Build Docker Image     ↓ Deploy Container     ↓ Application Ready 

---

# ผลลัพธ์

เมื่อมีการแก้ไขโค้ดและ Push ขึ้น GitHub

1. Jenkins ดึงโค้ดล่าสุดจาก Repository
2. ติดตั้ง Dependencies อัตโนมัติ
3. รัน Unit Test
4. สร้าง Docker Image ใหม่
5. ลบ Container เวอร์ชันเดิม
6. Deploy Container เวอร์ชันใหม่
