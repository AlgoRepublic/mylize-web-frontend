# MongoDB Installation Guide

## 🔍 Check if MongoDB is Installed

```bash
which mongod
# OR
mongod --version
```

If you see a path or version number, MongoDB is already installed. Skip to "Start MongoDB" section.

---

## 📦 Installation Instructions

### macOS (Recommended: Homebrew)

```bash
# 1. Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 2. Install MongoDB
brew tap mongodb/brew
brew install mongodb-community@7.0

# 3. Start MongoDB
brew services start mongodb-community@7.0

# 4. Verify installation
mongosh --version
```

### Linux (Ubuntu/Debian)

```bash
# 1. Import MongoDB public GPG key
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg \
   --dearmor

# 2. Create list file
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# 3. Update package list
sudo apt-get update

# 4. Install MongoDB
sudo apt-get install -y mongodb-org

# 5. Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# 6. Verify installation
mongosh --version
```

### Linux (Fedora/RHEL/CentOS)

```bash
# 1. Create repository file
sudo cat > /etc/yum.repos.d/mongodb-org-7.0.repo << EOF
[mongodb-org-7.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/\$releasever/mongodb-org/7.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-7.0.asc
EOF

# 2. Install MongoDB
sudo yum install -y mongodb-org

# 3. Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# 4. Verify installation
mongosh --version
```

### Windows

**Option 1: MongoDB Installer (Recommended)**

1. Download MongoDB Community Server:
   https://www.mongodb.com/try/download/community

2. Run the installer (.msi file)

3. Choose "Complete" installation

4. Install MongoDB as a Windows Service (recommended)

5. Open Command Prompt and verify:
   ```cmd
   mongod --version
   ```

**Option 2: Chocolatey**

```powershell
# Install Chocolatey (if not installed)
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install MongoDB
choco install mongodb

# Verify installation
mongod --version
```

### Docker (All Platforms)

```bash
# Run MongoDB in Docker container
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -v mongodb_data:/data/db \
  mongo:7.0

# Verify it's running
docker ps | grep mongodb
```

---

## 🚀 Start MongoDB

### macOS
```bash
# Start as service
brew services start mongodb-community@7.0

# Or run in foreground
mongod --config /usr/local/etc/mongod.conf

# Check status
brew services list | grep mongodb
```

### Linux
```bash
# Start service
sudo systemctl start mongod

# Enable on boot
sudo systemctl enable mongod

# Check status
sudo systemctl status mongod
```

### Windows
```cmd
# If installed as service, it starts automatically
# Or start manually:
net start MongoDB

# Check status:
sc query MongoDB
```

### Docker
```bash
# Start container
docker start mongodb

# Check status
docker ps | grep mongodb
```

---

## 🔧 MongoDB Shell (mongosh)

```bash
# Connect to MongoDB
mongosh

# In MongoDB shell:
> show dbs                    # List databases
> use forex-analyst           # Switch to app database
> show collections            # List collections
> db.users.find()             # View users
> exit                        # Exit shell
```

---

## 🌐 MongoDB Atlas (Cloud Alternative)

If you don't want to install MongoDB locally, use **MongoDB Atlas** (free tier available):

1. **Sign up**: https://www.mongodb.com/cloud/atlas/register

2. **Create a cluster** (choose free M0 tier)

3. **Create database user**:
   - Security → Database Access → Add New User
   - Choose password authentication
   - Save username and password

4. **Whitelist IP**:
   - Security → Network Access → Add IP Address
   - Choose "Allow Access from Anywhere" (for development)

5. **Get connection string**:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your user password

6. **Update server/.env**:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/forex-analyst?retryWrites=true&w=majority
   ```

---

## ✅ Verify MongoDB is Working

```bash
# Test connection with mongosh
mongosh "mongodb://localhost:27017"

# Or check if port is listening
netstat -an | grep 27017

# Or with lsof (macOS/Linux)
lsof -i :27017
```

---

## 🐛 Troubleshooting

### "MongoDB not found" or "command not found"

**Solution**: Add MongoDB to your PATH

**macOS/Linux**:
```bash
# Add to ~/.zshrc or ~/.bashrc
export PATH="/usr/local/opt/mongodb-community@7.0/bin:$PATH"

# Reload shell
source ~/.zshrc  # or ~/.bashrc
```

**Windows**:
1. System Properties → Advanced → Environment Variables
2. Add to PATH: `C:\Program Files\MongoDB\Server\7.0\bin`

### "Connection refused" / "Failed to connect"

**Possible solutions**:

1. **MongoDB not running**:
   ```bash
   # macOS
   brew services start mongodb-community@7.0
   
   # Linux
   sudo systemctl start mongod
   ```

2. **Port 27017 in use**:
   ```bash
   # Find process using port
   lsof -i :27017
   
   # Kill it if needed
   kill -9 <PID>
   ```

3. **Permission issues** (Linux):
   ```bash
   sudo chown -R mongodb:mongodb /var/lib/mongodb
   sudo chown mongodb:mongodb /tmp/mongodb-27017.sock
   ```

### "Unclean shutdown" / "Data directory not found"

```bash
# Remove lock file
rm /data/db/mongod.lock  # or /usr/local/var/mongodb/mongod.lock

# Repair database
mongod --repair

# Restart MongoDB
brew services restart mongodb-community@7.0  # macOS
sudo systemctl restart mongod                # Linux
```

---

## 📚 Additional Resources

- **Official Documentation**: https://docs.mongodb.com/manual/installation/
- **MongoDB University**: https://university.mongodb.com/ (Free courses)
- **Community Forums**: https://www.mongodb.com/community/forums/

---

## 🎯 Next Steps

After MongoDB is installed and running:

1. ✅ Start MongoDB service
2. ✅ Verify connection with `mongosh`
3. ✅ Run the application: `npm start`
4. ✅ Register a new user at http://localhost:5173
5. ✅ Check database: `mongosh` → `use forex-analyst` → `db.users.find()`

**MongoDB is now ready for your Forex Analyst Dashboard!** 🚀
