# geneaga-backend
NodeJS server for Geneaga

### How to run the server

- Clone the repository from Github on your local machine
- Open the terminal in the correct folder
- Run `npm install`
- Create `.env` file in root folder and add the port variable
- Create `configs` folder in `src`
- Create `configPostgres.json` in the `configs` folder, following this structure and fill the values appropriately:
  ```
  {
    "dev": {
      "username": "",
      "password": "",
      "database": "",
      "host": "",
      "port": ,
      "dialect": "",
      "logging": 
    }
  }
  ```

- You will need a postgres instance runnning and a database called `geneaga` on your local machine
- Run `npm run dev`
