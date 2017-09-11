const disconnect = (client) => {
    client.end()
        .then(()=> console.log("successfully disconnected from psql"))
        .catch(e => console.log("problem disconnecting\n "+e.stack));
}

module.exports = disconnect;
