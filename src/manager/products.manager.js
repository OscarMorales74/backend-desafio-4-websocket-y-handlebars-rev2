import fs from 'fs';

export default class ProductManager{
    constructor(path){
        this.path = path;//antes `${path}/api/products.json`
    }

    async #getNextId(){
        let nextId = 0;
        const products = await this.getProduct();
        products.map((prod) =>{
            if (prod.pid > nextId) nextId = prod.pid;
        });
        return nextId;
    }

    async createProduct(obj){
        try {
            const product = {
                pid: await this.#getNextId() + 1,
                ...obj
            };
            const productsFile = await this.getProduct();
            productsFile.push(product);
            await fs.promises.writeFile(this.path, JSON.stringify(productsFile));
            return product;
        } catch (error) {
            console.log(error);
        }
    }

    async getProduct(){
        try {
            if (fs.existsSync(this.path)){
                const prods = await fs.promises.readFile(this.path, 'utf8');
                const prodsJS = JSON.parse(prods);
                return prodsJS;
            } else {
                return []
            }
        } catch (error) {
            console.log(error);
        }
    }
}