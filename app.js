const { Client } = require('whatsapp-web.js');
const express = require('express');
//const {body, validationResult} = require('express-validator');
const socketIO = require("socket.io");
const http = require('http')
const qrcode = require('qrcode');
const fs = require('fs');
//const { phoneNumberFormatter } = require('./helpers/formatter');
//const { response } = require('express');


const app = express();
const server = http.createServer(app);
const io = socketIO(server)

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const SESSION_FILE_PATH = './whatsapp-session.json';
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


client.on('message', msg => {
    console.log(msg)
    const pengirim = msg.author
    const pesan = msg.body.toLowerCase()
    console.log(pesan)
    if (pesan.includes('hallo himsi')) {
        msg.reply('hallo Juga '+pengirim);
    }else if (pesan.includes('visi himsi') == true) {
        msg.reply('Menjadikan HIMSI sebagai Himpunan yang kreatif, kompetitif, bertanggung jawab dan Berwawasan Global pada tahun 2024')
    }else if (pesan.includes('apa itu himsi')) {
        msg.reply('HIMSI adalah singkatan dari (Himpunan Mahasiswa Sistem Informasi) berdiri pada tahun 2018 yang semulanya \n \nbernama HIMMI (Himpunan Mahasiswa Management Informatika)')
    }
    else {
        null
    };
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
/**
// cek
const checkRegisteredNumber = async function(number) {
    const isRegistered = await client.isRegisteredUser(number);
    return isRegistered;
};

// Send Message
app.post('/send-message', [
    body('number').notEmpty(),
    body('message').notEmpty(),
], async (req, res) => {
    const errors = validationResult(req).formatWith(({ msg }) => {
        return msg;
    }); 
    if (!errors.isEmpty()) {
        return res.status(422).json({
            status: false,
            message: errors.mapped()
        })
    };
    const number = phoneNumberFormatter(req.body.number);
    const message = req.body.message;

    const isRegisteredNumber = await checkRegisteredNumber(number);

    if (!isRegisteredNumber) {
        return res.status(422).json({
            status: false,
            message: 'The Phone Number is Not registred'
        });
    };

    client.sendMessage(number, message).then(response => {
        res.status(200).json({
            status: true,
            response: response
        });
    }).catch(err => {
        res.status(200).json({
            status: false,
            response: err
        });
    });
});
**/

server.listen(8000, function(){
    console.log('App running on *: 8000');
});