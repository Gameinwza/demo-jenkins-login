# 🚀 Demo Jenkins CI/CD Login App

> เว็บแอปพลิเคชัน Login แบบง่าย สาธิตการทำงานของ CI/CD Pipeline ด้วย Jenkins และ Docker  
> เมื่อ Push โค้ดขึ้น GitHub — Jenkins จะ Build, Test, Deploy และแจ้งเตือนผ่าน Email + Slack ให้โดยอัตโนมัติ

---

## ✨ คุณสมบัติ

| ฟีเจอร์ | เทคโนโลยี |
|---|---|
| หน้า Login (Frontend) | HTML |
| Backend Validation | Node.js + Express |
| Unit Testing | Jest |
| Containerization | Docker |
| CI/CD Pipeline | Jenkins |
| Public URL (Local Tunnel) | Cloudflare Tunnel |
| Notification Automation | n8n |
| แจ้งเตือน Email & Slack | n8n Workflow |

---

## 📁 โครงสร้างโปรเจกต์

```
demo-jenkins-login/
│
├── app.js
├── auth.js
├── auth.test.js
├── package.json
├── Dockerfile
├── Jenkinsfile
│
└── public/
    └── index.html
```

---

## 🗺️ Full CI/CD Flow

```
Developer
   ↓  git push
GitHub Repository
   ↓  webhook
Cloudflare Tunnel
   ↓
Jenkins (Docker Desktop)
   ├── Checkout Source Code
   ├── Install Dependencies
   ├── Run Unit Tests
   ├── Build Docker Image
   └── Deploy Container
         ↓
      n8n Webhook
         ├── 📧 Send Email
         └── 💬 Send Slack Notification
```

---

## 🛠️ การติดตั้งและรันโปรเจกต์

### 1. Clone Repository

```bash
git clone https://github.com/Gameinwza/demo-jenkins-login.git
cd demo-jenkins-login
```

### 2. ติดตั้ง Dependencies

```bash
npm install
```

### 3. รันโปรเจกต์

```bash
npm start
```

เปิดใช้งานผ่าน Browser → [http://localhost:3000](http://localhost:3000)

---

## 🧪 การทดสอบ

```bash
npm test
```

**ผลลัพธ์ที่คาดหวัง:**

```
PASS ./auth.test.js
  Login Validation
    ✓ valid email and password
    ✓ invalid email
    ✓ short password
    ✓ empty fields

Test Suites: 1 passed
Tests:       4 passed
```

---

## 🐳 การใช้งาน Docker

### Build Image

```bash
docker build -t demo-jenkins-login .
```

### Run Container

```bash
docker run -d \
  --name demo-app \
  -p 3000:3000 \
  demo-jenkins-login
```

เปิดใช้งานผ่าน Browser → [http://localhost:3000](http://localhost:3000)

---

## ⚙️ Jenkins CI/CD Setup

### ติดตั้ง Jenkins ด้วย Docker

> ⚠️ ต้อง Build Jenkins Image ใหม่ที่มี Docker ติดตั้งอยู่ด้วย เพราะ Jenkins Image ปกติไม่มี Docker ภายใน

```dockerfile
FROM jenkins/jenkins:lts
USER root
RUN apt-get update && apt-get install -y docker.io
RUN usermod -aG docker jenkins
USER jenkins
```

```bash
docker build -t jenkins-with-docker .

docker run -d \
  --name jenkins \
  -p 8080:8080 \
  -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  jenkins-with-docker
```

### เข้าสู่ระบบ Jenkins

เปิด Browser → [http://localhost:8080](http://localhost:8080)

ดึงรหัสผ่านเริ่มต้น:

```bash
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

### เชื่อม Jenkins กับ GitHub

1. สร้าง **Pipeline Project**
2. เลือก **Pipeline script from SCM**
3. เลือก **Git**
4. กำหนด Repository URL:
   ```
   https://github.com/Gameinwza/demo-jenkins-login.git
   ```
5. Branch: `*/main`
6. Script Path: `Jenkinsfile`
7. กด **Save**

---

## 🌐 Cloudflare Tunnel Setup

เนื่องจาก Jenkins รันอยู่บน Local จำเป็นต้องใช้ Cloudflare Tunnel เพื่อให้ GitHub Webhook ส่ง request มาได้

### ติดตั้งและรัน Tunnel

```bash
# ติดตั้ง cloudflared
brew install cloudflared

# Install service พร้อม token จาก Cloudflare Dashboard
sudo cloudflared service install <TOKEN>

# Start service
sudo launchctl start com.cloudflare.cloudflared
```

### แก้ปัญหา Cloudflare Block Bot

ไปที่ Cloudflare Dashboard → gameinwza.com → Rules → Configuration Rules

```
Expression  : (http.host eq "jenkins.yourdomain.com")
Actions     : Browser Integrity Check OFF
              Security Level → Essentially Off
              Bot Fight Mode OFF
```

### แก้ปัญหา Jenkins CSRF

```
Manage Jenkins → Security → Configure Global Security
→ CSRF Protection → Enable proxy compatibility ✅
```

---

## 🔄 Jenkins Pipeline

Pipeline ทำงาน 5 ขั้นตอนตามลำดับ:

```
Stage 1 → Checkout Source Code
Stage 2 → Install Dependencies  (npm install)
Stage 3 → Run Unit Tests        (npm test)
Stage 4 → Build Docker Image    (docker build)
Stage 5 → Deploy Container      (docker run)
```

### Jenkinsfile

```groovy
pipeline {
    agent any

    options {
        skipDefaultCheckout(true)
    }

    stages {

        stage('Checkout Source') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Unit Tests') {
            steps {
                sh 'npm test -- --watchAll=false'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t demo-jenkins-login:latest .'
            }
        }

        stage('Deploy Container') {
            steps {
                sh '''
                    docker rm -f demo-app || true
                    docker run -d \
                        --name demo-app \
                        -p 3000:3000 \
                        demo-jenkins-login:latest
                '''
            }
        }
    }

    post {
        success {
            sh """
                curl -X POST \
                http://host.docker.internal:5678/webhook/jenkins-finished \
                -H "Content-Type: application/json" \
                -d '{
                    "project":"demo-login",
                    "status":"SUCCESS",
                    "build":"${BUILD_NUMBER}",
                    "job":"${JOB_NAME}"
                }'
            """
        }
        failure {
            sh """
                curl -X POST \
                http://host.docker.internal:5678/webhook/jenkins-finished \
                -H "Content-Type: application/json" \
                -d '{
                    "project":"demo-login",
                    "status":"FAILED",
                    "build":"${BUILD_NUMBER}",
                    "job":"${JOB_NAME}"
                }'
            """
        }
    }
}
```

---

## 🔔 n8n Notification Setup

เมื่อ Pipeline เสร็จ Jenkins จะส่ง webhook ไปยัง n8n เพื่อแจ้งเตือนอัตโนมัติ

### ติดตั้ง n8n ด้วย Docker

```bash
docker run -d \
  --name n8n \
  -p 5678:5678 \
  n8nio/n8n
```

### n8n Workflow

```
Webhook (POST /jenkins-finished)
   ↓
Send Email
   ↓
Send Slack Message
```

### Slack Setup

1. ไปที่ [https://api.slack.com/apps](https://api.slack.com/apps) → Create New App
2. OAuth & Permissions → Bot Token Scopes เพิ่ม:
   - `chat:write`
   - `chat:write.public`
3. Install to Workspace → Copy **Bot User OAuth Token** (`xoxb-...`)
4. วาง Token ใน n8n Slack Credential

---

## 📋 สรุปผลลัพธ์

เมื่อ Push โค้ดขึ้น GitHub ทุกครั้ง ระบบจะทำสิ่งเหล่านี้อัตโนมัติ:

1. ✅ ดึงโค้ดล่าสุดจาก Repository
2. ✅ ติดตั้ง Dependencies
3. ✅ รัน Unit Test
4. ✅ สร้าง Docker Image ใหม่
5. ✅ ลบ Container เวอร์ชันเดิม
6. ✅ Deploy Container เวอร์ชันใหม่
7. 📧 ส่ง Email แจ้งผล Pipeline
8. 💬 ส่ง Slack แจ้งผล Pipeline

---

## 🧰 Tech Stack

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?style=flat&logo=jest&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)
![Jenkins](https://img.shields.io/badge/Jenkins-D24939?style=flat&logo=jenkins&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white)
![Cloudflare](https://img.shields.io/badge/Cloudflare-F38020?style=flat&logo=cloudflare&logoColor=white)
![n8n](https://img.shields.io/badge/n8n-EA4B71?style=flat&logo=n8n&logoColor=white)
![Slack](https://img.shields.io/badge/Slack-4A154B?style=flat&logo=slack&logoColor=white)