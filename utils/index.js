module.exports = {
    logger: require("./logger"),
    cleanIPAddress: function(ipAddress) {
        return /\:\:.*\:/.test(ipAddress) ? ipAddress.replace(/\:\:.*\:/, "") : ipAddress;
    },
    cleanSourcePath: function(source) {
        return source.endsWith("/") ? source.slice(0, -1) : source;
    },
    getFileName: function(source) {
        return source.match(/(?:.*\/)?(.*)/)[1];
    }
};
