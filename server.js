//import express 和 ws 套件
const express = require('express')
const SocketServer = require('ws').Server
const PORT = 3000 //指定 port
const Person = require("./schema/Person").Person

//創建 express 物件，綁定監聽  port , 設定開啟後在 console 中提示
const server = express().listen(PORT, () => {
    console.log(`Listening on ${PORT}`)
})
//將 express 交給 SocketServer 開啟 WebSocket 的服務
const wss = new SocketServer({ server })
//當有 client 連線成功時

let count = 0;
try{
    wss.on('connection', async ws => {

    const person = new Person()
    count += 1

    console.log(`Client ${count} connected`)
    // 當收到client消息時
    let clients = wss.clients
    ws.send("聊天室+1", await person.getName())
    ws.send(`請先取名子 user${count}`)
    let number = count
        

    ws.on('message', async data => {

        if( await person.getName()!= null){
            // 收回來是 Buffer 格式、需轉成字串
            data = data.toString()  
            console.log(data) // 可在 terminal 看收到的訊息

            /// 發送消息給client 
            // ws.send(data)

            /// 發送給所有client： 
            // let clients = wss.clients  //取得所有連接中的 client
            console.log('count:', count);
            data = `${ await person.getName()}: ${data}`
            clients.forEach(client => {
                client.send(data)  // 發送至每個 client
            })
        }

        // 收回來是 Buffer 格式、需轉成字串
        if( await person.getName()==null){
            data = data.toString()
            person.setName(data)
            clients.forEach( async client => {
                client.send( `user${number} ` + await person.getName() + "進入聊天室!")  // 發送至每個 client
            })
        }
        
    })
        ws.on('close', () => {
            console.log('Close connected')
        })
    })
} catch(e) {
    console.log(e.message);
}