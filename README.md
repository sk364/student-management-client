# Student Management Client

## Installation For Developers

Clone the repository  
> cd student-managament-client  
> npm install  
> npm start

Your server is now up and running at `localhost:3000`

## Deployment

Clone the repository
> cd student-management-client  
> npm install  
> npm run build

Install nginx and point root to /path/to/project/build  
Also, add `try_files $uri index.html` in `location /` block.
