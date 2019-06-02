module.exports.description = {
    name:"notfeature",
    description:"Warn Sid against implementing an actual bad idea",
    usage: "`!notfeature"
}
module.exports.call = async(client,global,msg,args) => {
    return 'No, that is not a feature request';
}