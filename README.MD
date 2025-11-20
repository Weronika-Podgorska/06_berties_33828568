# Berties Books

Sample code for Dynamic Web Applications module.

Uses node.js with Express and EJS.

To install and run:

npm install
node index.js

set up mysql database
create a new database with the file create_db.sql
run the insert_test_data.sql script to insert data into the database

dotenv:

- I installed the module using the command - npm install dotenv
- Then i created a .env file where I put all my credentials into constants that I can use in my main code 
- I replaced the credentials in index.js with these constants and then put the .env file into the .gitignore file so that others would not have access to it 


audit:

- I created a new table to hold the audit data I will collect
- I add a log entry during the /loggedin route when the users credentials are being compared against the ones stored in the database 
- The table stores the username of anyone attempting to login, if they succeeded or failed and the reason, the time they attmempted a login
- I then created a new route /audit to display all the data in the table by rendering the audit.ejs file 