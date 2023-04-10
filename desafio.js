import {promises as fs} from 'fs'

const RUTA_ARCHIVO = './info.txt'

class ProductManager {
  constructor(path) {
    this.path = path
    this.products = [];
  } 

  static incrementarID() {
    if (this.idIncrement) {
        this.idIncrement++
    } else {
        this.idIncrement = 1
    }
    return this.idIncrement
}

   async addProduct(product) {
    const products = await fs.readFile(this.path, 'utf-8')
    const prods = JSON.parse(products)
    product.id = ProductManager.incrementarID()
    prods.push(product)

    if (
      !product.code ||
      !product.price ||
      product.price <= 0 ||
      product.stock < 0
    ) {
      return "Producto inválido";
    } else if (
      this.products.find((producto) => producto.code == product.code)
    ) {
      return "Producto duplicado";}

      try {
        await fs.writeFile(this.path, JSON.stringify(prods));
      } catch (error) {
        console.log(error);
      }
      return "Producto agregado correctamente";
    }
  
  async getProducts() {
    try{
     const products = await fs.readFile(this.path, 'utf-8')
    const prods =  JSON.parse (products)
    return prods 
    }catch (error) {
      console.log(error);
      return [];
  }
}

  async getProductById(id) {
    const products = await fs.readFile(this.path, 'utf-8');
    const prods =JSON.parse(products)
   if (prods.some(prod=> prod.id === parseInt(id))) {
    return prods.find(prod => prod.id === parseInt(id))
  } else {
      return "Producto no encontrado"
  }
  }

async updateProduct(id, { title, description, price, thumbnail, code, stock }) {
  const products = await fs.readFile(this.path, 'utf-8')
  const prods = JSON.parse(products)
  if (prods.some(prod => prod.id === parseInt(id))) {
      let index = prods.findIndex(prod => prod.id === parseInt(id))
      prods[index].title = title
      prods[index].description = description
      prods[index].price = price
      prods[index].thumbnail = thumbnail
      prods[index].code = code
      prods[index].stock = stock
      await fs.writeFile(this.path, JSON.stringify(prods))
      return "Producto actualizado"
  } else {
      return "Producto no encontrado"
  }
}

async deleteProduct(id) {
  const products = await fs.readFile(this.path, 'utf-8')
  const prods = JSON.parse(products)
  if (prods.some(prod => prod.id === parseInt(id))) {
      const prodsFiltrados = prods.filter(prod => prod.id !== parseInt(id))
      await fs.writeFile(this.path, JSON.stringify(prodsFiltrados))
      return "Producto eliminado"
  } else {
      return "Producto no encontrado"
  }
}

}

class Product {
  constructor(
    title = "",
    description = "",
    price = 0,
    thumbnail = "",
    code = "",
    stock = 0
  ) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.thumbnail = thumbnail;
    this.code = code;
    this.stock = stock;
  }
}

//TERMINAL

const productManager = new ProductManager('./info.txt');

// muestra los productos

productManager.getProducts().then (prods => console.log(prods));

// Agregar Producto

// const newProduct = new Product(
//   "Uvas",
//   "Por Kilo",
//   10,
//   "",
//   "U001",
//   20
// );

// productManager.addProduct(newProduct).then((result) => {
//   console.log(result);
// });

// Borrar producto

// productManager.deleteProduct(1).then(result => console.log(result))
