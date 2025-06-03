# board-backend/Dockerfile
FROM node:21

WORKDIR /usr/src/app/

COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Install mysql2 package specifically for Sequelize
RUN npm install mysql8

# Copy the rest of the application code
COPY . .

# Expose ports your application uses (e.g., NestJS default is 3000)
EXPOSE 3000
EXPOSE 9254 

CMD [ "yarn", "run", "start:dev" ]

