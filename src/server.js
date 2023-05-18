import express from 'express';
import { __dirname } from './path.js';
import { Server } from 'socket.io';
import handlebars from 'express-handlebars';
import viewsRouter from './routes/views.router.js';
import ProductManager from './manager/products.manager.js';
const productManager = new ProductManager(__dirname+'/db/products.json')

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'));

app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set ('views', __dirname + '/views');

app.get('/realTimeProducts', (req, res) => {
    res.render('realTimeProducts')
});

app.get('/', viewsRouter);

const PORT = 8080;
const httpServer = app.listen(PORT, ()=>{
console.log(`server ok en puerto ${PORT}`);
});

const socketServer = new Server(httpServer);

socketServer.on('connection', async(socket) => {
    console.log('usuario conectado', socket.id );
    // socket.on('disconnect', () => {
    //     console.log('usuario desconectado');
    // });
    //emitir un mensaje que lo leera el front desde index.js 
    // socket.emit('saludoDesdeBack', 'Bienvenido a Websocket');
    // socket.on('respuestadesdeFront', (message) => {
    //     console.log(message);
    // });

    //con el evento newproduct escuchamos lo que emite el onsubmit de index,js. luego lo ahreha al array y von emit vuelve a emitir el array completo
    //con socketServer lo enviamos a todos los socket que se conecten
    //copiamos socketServer antes de escuchar con on para que al actualizar aparezcan los productos de una
    socketServer.emit('arrayProducts', await productManager.getProduct());
    socket.on('newProduct', async(prod) => {
        // arrayProducts.push(obj);
        await productManager.createProduct(prod);   
        socketServer.emit('arrayProducts', await productManager.getProduct(prod));
        //si quisieramos emitir el evento 'arrayProducts' solo al que envio el evento pondriamos:
        // socket.emit('arrayProducts', arrayProducts);
        //para emitir a todos menos al que envia en evento codeamos:
        // socket.broadcast.emit('arrayProducts', arrayProducts);
    })
})