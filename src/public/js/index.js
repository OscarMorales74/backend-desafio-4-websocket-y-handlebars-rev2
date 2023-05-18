const socketClient = io();

// socketClient.on('saludoDesdeBack', (message) => {
//     console.log('el servidor envio este mensaje', message);
// });
// socketClient.emit('respuestadesdeFront', 'Se agradece');

//seleccionamos los elementos del html en websockets.handlebars
const form = document.getElementById('form');
const inputName = document.getElementById('name');
const inputPrice = document.getElementById('price');
const products = document.getElementById('products');//products se conecta con la etiqueta p en websockets.handlebars por su id

//con onsubmit enviamos el evento newProduct que sera escuchado en el server, en socket.on
//prevent...para que el evento onsubmit no refresque la pagina
//con emit emitimos el evento newProduct con sus dos parametros que seran escuchados en socketServer en server.js
form.onsubmit = (e) => {
    e.preventDefault();
    const name = inputName.value;
    const price = inputPrice.value;
    socketClient.emit('newProduct', { name, price });
}

//recibimos el evento arrayProducts con metodo on
//array es nombre cualquiera que representa el array recibido
//rellenamos la etiqueta p que esta vacia por medio de products
socketClient.on('arrayProducts', (array) => {
    let infoProducts = '';
    array.forEach(p => {
        infoProducts += `${p.name} - ${p.price} <br>`        
    });
    products.innerHTML = infoProducts;
})