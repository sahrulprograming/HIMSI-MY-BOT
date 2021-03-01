function pesan1() {
    if (pesan.includes('hallo himsi') || pesan.includes('hello himsi') || pesan.includes('helo himsi') || pesan.includes('halo himsi') || pesan.includes('halo') ) {
    msg.reply(`Hai ${user.id.user}`);
    }else if (pesan.includes('visi himsi') || pesan.includes('visi dari himsi')) {
        msg.reply('Menjadikan HIMSI sebagai Himpunan yang kreatif, kompetitif, bertanggung jawab dan Berwawasan Global pada tahun 2024')
    }else if (pesan.includes('apa itu himsi')) {
        msg.reply('HIMSI adalah singkatan dari (Himpunan Mahasiswa Sistem Informasi) berdiri pada tahun 2018 \n \n yang semulanya bernama HIMMI (Himpunan Mahasiswa Management Informatika)')
    }
    else {
        null
    };
}




