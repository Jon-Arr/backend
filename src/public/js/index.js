const socket = io();

const productList = document.getElementById('realTimeProductList')
const productForm = document.getElementById('productForm')
const titleInput = document.getElementById('title')
const priceInput = document.getElementById('price')
const delButton = document.getElementById('delProduct')


socket.on('productos', (products) => {
  productList.innerHTML = ''
  const templateSource = document.getElementById('realtimeTemplate').innerHTML
  const template = Handlebars.compile(templateSource)
  products.forEach((product) => {
    const html = template(product)
    productList.innerHTML += html
  })
})

productForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const title = titleInput.value
  const price = priceInput.value
  socket.emit('newProduct', { title, price })
})

delButton.addEventListener('click', () => {
  const idProducto = 
  socket.emit('delProduct', idProducto)
})