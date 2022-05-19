### Database Set up

1. Navigate to the project repository's `/server/schemas` folder.

2. Start postgres server: `sudo service postgresql start`

3. Start psql shell: `psql -U postgres`
  * Create database: `CREATE DATABASE <database-name-here>;`
  * Navigate to database: `\c <database>;`
  * Create tables with schema file by running this command: `\i schema.sql;`

4. Create a folder named `csvfiles` at the `/ice-climbers-qa-api` directory level and copy the questions.csv, answers.csv, answer_photos.csv files into the folder. Note: You may not have access to these csv files.  If you don't, you may stop here and continue to building your.env file.
4 thru 6.

5. Open the `ETL.sql` file for reference and open the `questions.csv ` file from the `csvfiles ` folder.

6. Change the 1st line of the `questions.csv` which are the column names to match the column names of the `questionscsv` table at the top of the `ETL.sql` file.  Repeat steps 5 and 6 until you have updated both `answers_photos.csv` and  `answers.csv` columns to match their respective columns in  `ETL.sql`.

7. In the psql shell, run: `\i ETL.sql;`. (This may take several minutes depending on the csv file size.)

The database and data is now ready for use!