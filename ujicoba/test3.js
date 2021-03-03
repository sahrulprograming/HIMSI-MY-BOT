exports.balas = (pesan) => {
    if (pesan.includes('hallo') == true || pesan.includes('hello') == true){
        let pesan = 'Sucses'
        return pesan
    } else {
        return 'gagal'
    }
}