# SonarQube Setup Guide

## Overview

SonarQube is used for continuous code quality inspection and security analysis of the Safe Zone e-commerce platform. It integrates with Jenkins CI/CD pipeline to automatically analyze code on every commit.

---

## 🚀 Quick Start (Existing Setup)

### 1. Start SonarQube

```bash
cd sonarqube
docker compose up -d
```

Wait 2-3 minutes for SonarQube to start.

### 2. Access Dashboard

- **URL:** http://localhost:9000
- **Default credentials:**
  - Username: `admin`
  - Password: `admin`
- **⚠️ Important:** Change password on first login!

### 3. View Analysis Results

After Jenkins pipeline runs:

1. Go to http://localhost:9000
2. Click **"safe-zone"** project
3. View metrics:
   - 🐛 Bugs
   - 🔒 Vulnerabilities
   - ⚠️ Code Smells
   - 📊 Coverage
   - 📈 Technical Debt

---

## 🔧 Complete Setup (Fresh Installation)

Follow these steps when cloning the repository for the first time.

### Step 1: Start Docker Containers (5 min)

```bash
# Clone repository
git clone https://github.com/An1Su/safe-zone.git
cd safe-zone

# Start SonarQube
cd sonarqube
docker compose up -d
cd ..

# Start Jenkins
cd jenkins
docker compose up -d
cd ..

# Wait for containers to start
sleep 180
```

### Step 2: Configure SonarQube (3 min)

**A. Initial Login**

1. Open: http://localhost:9000
2. Login: `admin` / `admin`
3. Change password when prompted

**B. Create Project**

1. Click **"Create Project"** → **"Manually"**
2. Project key: `safe-zone`
3. Display name: `SafeZone E-commerce Platform`
4. Click **"Set Up"**

**C. Generate Token**

1. Select **"With Jenkins"**
2. Or: **User Menu** → **My Account** → **Security** → **Generate Token**
3. Token name: `jenkins-safe-zone`
4. **Copy the token** ⚠️ (save it, you won't see it again!)

**D. Configure Email Notifications (Optional)**

1. **Administration** → **Configuration** → **General Settings** → **Email**
2. Settings:
   ```
   SMTP host: smtp.gmail.com
   SMTP port: 587
   Security: STARTTLS
   Username: your-email@gmail.com
   Password: [Gmail App Password]
   From address: your-email@gmail.com
   ```
3. Test configuration

### Step 3: Configure Jenkins (5 min)

**A. Initial Setup**

1. Open: http://localhost:9090
2. Get admin password:
   ```bash
   docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
   ```
3. Install suggested plugins
4. Create admin user

**B. Add SonarQube Credentials**

1. **Manage Jenkins** → **Credentials** → **System** → **Global credentials**
2. Click **"Add Credentials"**
3. Configure:
   - **Kind:** Secret text
   - **Secret:** [Paste SonarQube token]
   - **ID:** `sonarqube-token` ⚠️ (exact match required!)
   - **Description:** SonarQube authentication token
4. Click **"Create"**

**C. Create Pipeline Job**

1. **New Item** → Name: `e-com-pipeline` → **Pipeline**
2. Under **Pipeline**:
   - **Definition:** Pipeline script from SCM
   - **SCM:** Git
   - **Repository URL:** `https://github.com/An1Su/safe-zone`
   - **Branch:** `*/main`
   - **Script Path:** `Jenkinsfile`
3. Under **Build Triggers**:
   - ☑ **GitHub hook trigger for GITScm polling**
4. **Save**

### Step 4: Setup ngrok Tunnel (2 min)

**Start ngrok:**

```bash
ngrok http 9090
```

**Copy the URL:**

```
Forwarding: https://abc123.ngrok-free.app -> http://localhost:9090
            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
            Copy this URL!
```

### Step 5: Configure GitHub Webhook (2 min)

1. Go to: https://github.com/An1Su/safe-zone/settings/hooks
2. Click **"Add webhook"**
3. Configure:
   - **Payload URL:** `https://abc123.ngrok-free.app/github-webhook/`
   - **Content type:** `application/json`
   - **Events:** Just the push event
   - **Active:** ☑
4. **Add webhook**

```

---

## 📊 Understanding SonarQube Results

### Quality Gate Status

**✅ Passed:** Code meets quality standards, merge allowed

**❌ Failed:** Code has issues, merge blocked

### Metrics Explained

| Metric              | Description                            | Good Target |
| ------------------- | -------------------------------------- | ----------- |
| **Bugs**            | Logic errors that could cause failures | 0           |
| **Vulnerabilities** | Security weaknesses                    | 0           |
| **Code Smells**     | Maintainability issues                 | < 5%        |
| **Coverage**        | % of code tested                       | > 80%       |
| **Duplications**    | Repeated code blocks                   | < 3%        |

### Issue Severity

- 🔴 **Blocker:** Must fix immediately
- 🟠 **Critical:** High priority
- 🟡 **Major:** Should fix soon
- 🔵 **Minor:** Nice to fix
- ⚪ **Info:** Informational

---

## 🔄 Daily Workflow

### Developer Flow

```

1. Write code
2. Commit and push
3. GitHub triggers Jenkins
4. Jenkins runs tests
5. Jenkins runs SonarQube analysis
6. SonarQube checks Quality Gate
7. If PASS ✅ → Deployment continues
8. If FAIL ❌ → Pipeline stops

````

### Fixing Issues

**In SonarQube UI:**

1. Click on the issue
2. View code location and description
3. Assign to developer (optional)
4. Fix in your IDE
5. Commit fix
6. Pipeline re-runs → Should pass!

---

## 🛠️ Configuration Files

### docker-compose.yml

Located in `/sonarqube/docker-compose.yml`

### Jenkinsfile Integration

Key stages in `/Jenkinsfile`:

```groovy
stage('SonarQube Analysis') {
    // Analyzes code and sends to SonarQube
}

stage('Quality Gate') {
    // Checks if quality standards are met
    // Fails pipeline if not
}
````

### Backend Maven Configuration

In `/backend/pom.xml`:

- SonarQube Maven Plugin: 3.10.0.2594
- JaCoCo (Coverage): 0.8.11

---

## 🐛 Troubleshooting

### SonarQube Won't Start

**Check if already running:**

```bash
docker ps | grep sonarqube
```

**Check port availability:**

```bash
lsof -i :9000
```

**View logs:**

```bash
docker logs sonarqube
```

**Restart:**

```bash
cd sonarqube
docker compose down
docker compose up -d
```

### Analysis Fails in Jenkins

**1. Verify SonarQube is accessible:**

```bash
curl http://localhost:9000/api/system/status
```

**2. Check credential ID:**

- Must be exactly: `sonarqube-token`
- Kind must be: Secret text (NOT username/password)

**3. Check Jenkins logs:**

- Pipeline console output for error messages

### Quality Gate Always Fails

**Check what failed:**

1. SonarQube → Project → Quality Gate tab
2. Review failed conditions
3. Click on issues to see details

**Common causes:**

- New code has bugs/vulnerabilities
- Coverage below 80%
- Code smells in new code

### Jenkins Not Triggering on Push

**Check ngrok is running:**

```bash
# Should show active tunnel
curl http://localhost:4040/api/tunnels
```

**Check GitHub webhook:**

- Settings → Webhooks → Recent Deliveries
- Should show green checkmark
- If red X, check URL format: `https://[ngrok-url]/github-webhook/`

**Update webhook URL if ngrok restarted:**

- ngrok generates new URL each time
- Update GitHub webhook with new URL

---

## 🔐 Security Notes

### Secrets to Keep Safe

- ✅ **SonarQube Token:** Never commit to Git
- ✅ **Gmail App Password:** Store securely
- ✅ **ngrok Auth Token:** Save for reuse

---

## 📦 Data Persistence

### Clearing Data

**To start fresh:**

```bash
cd sonarqube
docker compose down -v  # ⚠️ Deletes all data!
docker compose up -d
```

---

## 🔄 Maintenance

### Updating SonarQube

```bash
cd sonarqube
docker compose pull
docker compose down
docker compose up -d
```

### Stopping Services

```bash
# Stop SonarQube
cd sonarqube
docker compose down

# Stop Jenkins
cd ../jenkins
docker compose down

# Stop ngrok
# Press Ctrl+C in ngrok terminal
```

---

## 📚 Resources

### Documentation

- [SonarQube Official Docs](https://docs.sonarqube.org/latest/)
- [Maven Scanner](https://docs.sonarqube.org/latest/analyzing-source-code/scanners/sonarscanner-for-maven/)
- [Quality Gates](https://docs.sonarqube.org/latest/user-guide/quality-gates/)
- [ngrok Documentation](https://ngrok.com/docs)

### Project Links

- GitHub: https://github.com/An1Su/safe-zone
- SonarQube: http://localhost:9000
- Jenkins: http://localhost:9090
- ngrok Dashboard: https://dashboard.ngrok.com

---

## ✅ Setup Checklist

Use this when setting up from scratch:

```markdown
### Docker (5 min)

- [ ] cd sonarqube && docker compose up -d
- [ ] cd jenkins && docker compose up -d
- [ ] Wait 3 minutes

### SonarQube (3 min)

- [ ] Login: http://localhost:9000 (admin/admin)
- [ ] Change password
- [ ] Create project: safe-zone
- [ ] Generate token → Save it

### Jenkins (5 min)

- [ ] Login: http://localhost:9090
- [ ] Get password: docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
- [ ] Install plugins
- [ ] Create pipeline job: e-com-pipeline
- [ ] Add SonarQube credential (ID: sonarqube-token)
- [ ] Enable "GitHub hook trigger for GITScm polling"

### ngrok (2 min)

- [ ] Run: ngrok http 9090
- [ ] Copy URL: https://xxxxx.ngrok-free.app

### GitHub (2 min)

- [ ] Settings → Webhooks → Add webhook
- [ ] URL: https://[ngrok-url]/github-webhook/
- [ ] Test: Push a commit

### Verify (2 min)

- [ ] Push test commit
- [ ] Jenkins build triggered automatically
- [ ] SonarQube shows analysis results
- [ ] Quality Gate status visible

Total: ~20 minutes ✅
```

---

## 📧 Support

For issues or questions:

1. Check logs: `docker logs sonarqube`
2. Review Jenkins console output
3. Check this README's troubleshooting section
4. Verify all credentials and URLs are correct

---

**Last Updated:** January 2026
**SonarQube Version:** 26.1 (Community)
**Jenkins Version:** Latest LTS
