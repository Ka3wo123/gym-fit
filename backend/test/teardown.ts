
const teardown = async () => {
    await global.mariadb.stop();
};

export default teardown;