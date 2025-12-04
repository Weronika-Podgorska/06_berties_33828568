# Berties Books

Sample code for Dynamic Web Applications module.

Uses node.js with Express and EJS.

To install and run:

npm install
node index.js

set up mysql database
create a new database with the file create_db.sql
run the insert_test_data.sql script to insert data into the database

create a .env file locally as it in not available in the github repository 
add the following lines exactly:
BB_USER=berties_books_app
BB_PASSWORD=qwertyuiop
BB_DATABASE=berties_books
BB_HOST=localhost

then add another line: BASE_PATH=
finish the assignment by either leaving it blank or typing /usr/440 if on the virtual machine 



dotenv:

- I installed the module using the command - npm install dotenv
- Then i created a .env file where I put all my credentials into constants that I can use in my main code 
- I replaced the credentials in index.js with these constants and then put the .env file into the .gitignore file so that others would not have access to it 


audit:

- I created a new table to hold the audit data I will collect
- I add a log entry during the /loggedin route when the users credentials are being compared against the ones stored in the database 
- The table stores the username of anyone attempting to login, if they succeeded or failed and the reason, the time they attmempted a login
- I then created a new route /audit to display all the data in the table by rendering the audit.ejs file 


restricted access:

- I restricted access to the /logout route as stated in the document as the user has to be logged in first to logout
- I restricted access to the /list route because it reveals information about users accounts so I do not want random people looking at it 
- I restricted access to the /audit route for the same reasons as /list 
- I restricted access to the /addbook route because I only want trusted users to be able to add data into my database 


validation:

- I added validation to all fields of the register form
- I added validation to the addbook form so that the users could only add valid books into the database
- I added validation to the search feature which helps to find books when there are spaces added at the ends of words by using .trim() and prevents someone from submitting a large input which could slow down the server 
- I added validation to the login form to limit the amount of text you can enter and to trim the input to account for users possible mistakes 


sanitisation:

- I sanitised all inputs except for password in the register form to prevent from XSS attacks (the password is not sanitised as it is needed for hashing so it has to be left plain) 
- I sanitised all other inputs that are used for querying the database or being displayed to the user 


API:

I have made an API that can display the books in my apps database depending on what the user searches.
- There is a base query of GET /api/books which returns all of the books in a JSON format 
- There is a search query (example: GET /api/books?search=world) which allows the user to filter books by their titles
- There is a price range filter which allows you to define the minimum price (example: GET /api/books?minprice=20) and a maximmu price (example: GET /api/books?maxprice=30) which can be used together for the full range as well (example: GET /api/books?minprice=20&maxprice=30 )
- There is a sort parameter which allows the user to sort the books by title in alphabetical order (A-Z) (example: GET /api/books?sort=name) or by the price in ascending order (example: GET /api/books?sort=price)
