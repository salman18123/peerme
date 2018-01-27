const socket= io('https://peerme.herokuapp.com/')
$("#div-chat").hide()
socket.on("already",()=>{
    alert("already exists")
})
socket.on('sendinginfo',(arrUserInfo)=>{
    $("#div-chat").show()
    $("#inps").hide()
    arrUserInfo.forEach((user)=>{
        const {name,peerId}=user
        $("#ulUser").append(`<li id="${peerId}">${name}</li>`)

    })

console.log("hello all")
socket.on('sending',(user)=>{
   
        const {name,peerId}=user
        $("#ulUser").append(`<li id="${peerId}">${name}</li>`)
        console.log("this is me")
    
})
console.log("im out")
socket.on('all_done',peerId=>{
    $(`#${peerId}`).remove()
})
})

function openStream(){
    const config={audio:false,video:true}
    return navigator.mediaDevices.getUserMedia(config)
}
function playstream(idvideotag,stream){
const video=document.getElementById(idvideotag)
video.srcObject=stream
video.play()

}
//openStream()
//.then((stream)=>{
  //  playstream('localStream',stream)
//})
const peer = new Peer({key: 'peerjs',host:'peerme.herokuapp.com',secure:true,port:443});

peer.on('open',(id)=>{
    console.log(id)
    $("#peerid").append(id)
    $("#btnSignUp").click(()=>{
        
            const username=$("#txtUsername").val()
            socket.emit('new_user',{name:username,peerId:id})
        })
})




//caller
$("#btnCall").click(()=>{
    const id=$("#remoteId").val()
    openStream()
    .then((stream)=>{
        playstream('localStream',stream)
        const call=peer.call(id,stream)
        call.on('stream',(remoteStream)=>{
            playstream('remoteStream',remoteStream)
        })
    })
})

peer.on('call',(call)=>{
    openStream()
    .then((stream)=>{
        call.answer(stream)
        playstream('localStream',stream)
        call.on('stream',remoteStream=>playstream('remoteStream',remoteStream))
    })
})

$("#ulUser").on('click','li',function(){
    const id=$(this).attr('id')
    openStream()
    .then((stream)=>{
        playstream('localStream',stream)
        const call=peer.call(id,stream)
        call.on('stream',(remoteStream)=>{
            playstream('remoteStream',remoteStream)
        })
    })
})
