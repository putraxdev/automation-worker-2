FROM node:18-alpine

# Install cron
RUN apk add --no-cache dcron

# Set timezone to Jakarta
RUN apk add --no-cache tzdata
ENV TZ=Asia/Jakarta

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application code
COPY . .

# Create cron directory
RUN mkdir -p /home/cron

# Make scripts executable
RUN chmod +x src/*.js

# Copy crontab file
COPY crontab /etc/cron.d/automation-cron
RUN chmod 0644 /etc/cron.d/automation-cron

# Apply cron job
RUN crontab /etc/cron.d/automation-cron

# Create log file
RUN touch /var/log/cron.log

# Expose port
EXPOSE 3000

# Start cron and the application
CMD ["sh", "-c", "crond && npm start"]
