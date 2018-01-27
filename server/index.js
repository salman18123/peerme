const io=require('socket.io')(3000)
const arrUserInfo=[]
io.on('connection',socket=>{
    socket.on('new_user',(username)=>{
        const isexist=arrUserInfo.some((e)=>{
            e.name===username.name
        })
        socket.peerId=username.peerId
        if(isexist){
            return socket.emit("already")
        }
        arrUserInfo.push(username)
        socket.emit('sendinginfo',arrUserInfo)
        socket.broadcast.emit('sending',username)
    })
    socket.on('disconnect',()=>{
        const index=arrUserInfo.findIndex(user=>{
            user.peerId===socket.peerId
        })
        
        arrUserInfo.splice(index,1)
        io.emit('all_done',socket.peerId)

    })
})