const { Client, MessageMedia } = require('whatsapp-web.js');
const express = require('express');
const socketIO = require("socket.io");
const http = require('http')
const qrcode = require('qrcode');
const fs = require('fs');
const { count } = require('console');
const port = process.env.PORT || 8000

const app = express();
const server = http.createServer(app);
const io = socketIO(server)

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const SESSION_FILE_PATH = '../../whatsapp-session.json';
let sessionCfg;
if (fs.existsSync(SESSION_FILE_PATH)) {
    sessionCfg = require(SESSION_FILE_PATH);
}

app.get('/', (req, res) => {
    res.sendFile('index.html', {root: __dirname});
})

const client = new Client({
    puppeteer: {
        headless: true,
        args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-frist-run',
        '--no-zygote',
        '--disable-gpu'
    ],
    }, 
        session: sessionCfg
});


client.on('message', async msg => {
    const himsi = require('../model/HIMSI/tentang_himsi')
    const dpcckg = require('../model/HIMSI/DPC-Cengkareng/linkgroup') 
    console.log(msg)
    const pesan = msg.body.toLowerCase()
    console.log(pesan)
    let chat = await msg.getChat();
    if (chat.isGroup) {
        if (pesan.startsWith('#')) {
            if (pesan.includes('hallo himsi') || pesan.includes('hello himsi') || pesan.includes('helo himsi') || pesan.includes('halo himsi') || pesan.includes('halo') || pesan.includes('hallo') || pesan.includes('hello'))  {
                const user = await msg.getContact();
                msg.reply(` Hai ${user.pushname}`);
            }else if (pesan.includes('visi himsi') || pesan.includes('visi dari himsi') || pesan.includes('visi')) {
                msg.reply(himsi.visi())
            }else if (pesan.includes('misi himsi') || pesan.includes('misi dari himsi') || pesan.includes('misi')) {
                msg.reply(himsi.misi())
            }else if (pesan.includes('apa itu himsi')) {
                msg.reply(himsi.pengertian())
            }else if (pesan.includes('info group')) {
                if (chat.isGroup) {
                    msg.reply(
                    `*Group Details* \nNama : ${chat.name} \nDescription : \n${chat.description} \n \ndibuat pada: ${chat.createdAt.toString()} \ndibuat oleh: ${chat.owner.user} \nJumlah anggota group : ${chat.participants.length} anggota`);
                } else {
                    msg.reply('This command can only be used in a group!');
                }
            }else if (pesan.includes('arti logo himsi') || pesan.includes('arti lambang himsi') || pesan.includes('arti dari logo himsi') || pesan.includes('arti dari lambang himsi') || pesan.includes('makna lambang himsi') || pesan.includes('makna dari lambang himsi')) {
                const media = MessageMedia.fromFilePath('HIMSI/img/lambang_himsi.jpg');
                chat.sendMessage(media);
                chat.sendMessage(himsi.lambang())
            }else if (msg.from.includes('-1601305154@g.us')) {
                if (pesan.includes('pendidikan')) {
                    msg.reply(dpcckg.pendidikan())
                }else if (pesan.includes('koor')) {
                    msg.reply(dpcckg.groupbphkoor())
                }else if (pesan.includes('kom')) {
                    msg.reply(dpcckg.kominfo())
                }else if (pesan.includes('rsdm')) {
                    msg.reply(dpcckg.grouprsdm())
                }
                else{
                    msg.reply('Maaf Belum Tersedia');
                }
            }
            else {
                msg.reply('Maaf Belum Tersedia');
            };
        }else {
            null
        }
    }else{
        if (pesan.includes('hallo himsi') || pesan.includes('hello himsi') || pesan.includes('helo himsi') || pesan.includes('halo himsi') || pesan.includes('halo') || pesan.includes('hallo') || pesan.includes('hello'))  {
                const user = await msg.getContact();
                msg.reply(` Hai ${user.pushname}`);
            }else if (pesan.includes('visi himsi') || pesan.includes('visi dari himsi') || pesan.includes('visi')) {
                msg.reply(himsi.visi())
            }else if (pesan.includes('misi himsi') || pesan.includes('misi dari himsi') || pesan.includes('misi')) {
                msg.reply(himsi.misi())
            }else if (pesan.includes('apa itu himsi')) {
                msg.reply(himsi.pengertian())
            }else if (pesan.includes('info group')) {
                if (chat.isGroup) {
                    msg.reply(
                    `*Group Details* \nNama : ${chat.name} \nDescription : \n${chat.description} \n \ndibuat pada: ${chat.createdAt.toString()} \ndibuat oleh: ${chat.owner.user} \nJumlah anggota group : ${chat.participants.length} anggota`);
                } else {
                    msg.reply('This command can only be used in a group!');
                }
            }else if (pesan.includes('arti logo himsi') || pesan.includes('arti lambang himsi') || pesan.includes('arti dari logo himsi') || pesan.includes('arti dari lambang himsi') || pesan.includes('makna lambang himsi') || pesan.includes('makna dari lambang himsi')) {
                const media = MessageMedia.fromFilePath('HIMSI/img/lambang_himsi.jpg');
                chat.sendMessage(media);
                chat.sendMessage(himsi.lambang())
            }
            else {
                msg.reply('Maaf Belum Tersedia');
            };
    }
});

client.initialize();

// Socket IO
io.on('connection', function(socket){
    socket.emit('message', 'Connection...' );
    client.on('qr', (qr) => {
        // Generate and scan this code with your phone
        console.log('QR RECEIVED', qr);
        qrcode.toDataURL(qr, (err, url) => {
            socket.emit('qr', url);
            socket.emit('message', 'QR Code received, scan please!');
        });    
    });
    client.on('ready', () => {
        socket.emit('ready', 'Whatsapp Bot is Ready');
        socket.emit('message', 'Whatsapp Bot is Ready...');
    });
    client.on('authenticated', (session) => {
        socket.emit('authenticated', 'Whatsapp Bot is authenticated');
        socket.emit('message', 'Whatsapp Bot is authenticated');
        console.log('AUTHENTICATED', session);
        sessionCfg = session;
        fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
            if (err) {
                console.error(err);
            }
        });
    });
});

server.listen(port, function(){
    console.log('App running on *:' + port);
});

module.exports = {app}