# Use Node.js to build the frontend
FROM node:20 as build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json files
COPY ./client/package.json . ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY ./client/ .

# Build the application
RUN npm run build

# Use Nginx to serve the built app
FROM nginx:alpine

# Copy built files from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

# Expose the port
EXPOSE 80

# Start Nginx
CMD /bin/sh -c "sleep 5 && nginx -g 'daemon off;'"