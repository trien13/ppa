# Welcome to tinymb

Tinymb is a self maintaining message board system. 
Each topic page contains a "shoutbox" and a "threads" section.

Stack: 
 - HTML, CSS, EJS
 - Express, Node
 - PostgreSQL

Notes: 
- The self maintaining mechanism of Tinymb was implemented with a short Javascript script, located at the end of `home.js` file. This was originally a Cron job, though I couldn't get it to run correctly on the school's server. 
- Server Side Event may not works on school's server (server config problems that I can't change). Website still run, just no the real-time update mechanism. 
 
 # Setup

To run Tinymb on your local machine

 1. Pull this repo
 2. Install necessary packages `npm update`
 3. Install and setup PostgresSQL
 4. Restore db `sql -U postgres 123 -W -d hemb f /ppa/backup_prod.sql`
 5. Run `npx nodemon`

# Troublefix

 - Beware of incidental duplication in the database
 - Edit `.env` file accordingly to prevent conflicts
 - Routing may works on VM but not on local, and vise versa


