### PostgresQL Database setup

### So first
go into the `psql` CLI by typing:
```bash
sudo -u postgres psql
```

### Then in the CLI
Create a Database user
```sql
CREATE ROLE test LOGIN PASSWORD 'pswd123';
```

and then create the database
```sql
CREATE DATABASE socialnetworktest OWNER test;
```

(There may be some extra steps you need to do if this doesn't work, but you have google for that)

and then exit by typing `\q`
