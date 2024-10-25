# Use the official Node.js image as a base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application files
COPY . .

# Expose the port your app runs on (replace with your actual port)
EXPOSE 7000

# Command to run your app (replace `server.js` with your entry file)
CMD ["node", "server.js"]
