#Set base image
FROM node

#Create internal folder to save the project
WORKDIR /app

#Copying the content of the project into the directory created with WORKDIR command "/app"
COPY . .

#Run npm install to install the dependencies
RUN npm install

#Expose the port
EXPOSE 8080

#Run npm start to initialize the application
CMD ["npm","start"]
