import { MariaDbContainer } from '@testcontainers/mariadb'

const init = async () => {
    await Promise.all([
        initMariadb()
    ])
}

const initMariadb = async () => {
    const mariadb = await new MariaDbContainer("mariadb:latest")
        .withDatabase('gym-fitness')
        .withUser('root')
        .start();

    global.mariadb = mariadb;
    
    process.env.DB_HOST = mariadb.getHost();
    process.env.DB_PORT = mariadb.getPort().toString();
    process.env.DB_USERNAME = mariadb.getUsername();
    process.env.DB_PASSWORD = mariadb.getRootPassword();
    process.env.DB_NAME = mariadb.getDatabase();

}

export default init;
