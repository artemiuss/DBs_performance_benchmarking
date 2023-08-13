
#!/usr/bin/env python3

def setup_pg():
    """
    CREATE TABLE plants (
        id       SERIAL NOT NULL PRIMARY KEY,
        json_doc JSONB NOT NULL
    );
    """

def setup_mysql():
    """
    CREATE TABLE plants (
        id       INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
        json_doc JSON NOT NULL
    );
    """

def setup_mongo():
    pass

def main():
    setup_pg()
    setup_mysql()
    setup_mongo()

if __name__ == '__main__':
    main()