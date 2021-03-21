const express = require('express')
const cors = require('cors');
const epaycoSDK = require('epayco-sdk-node');
const epayco = epaycoSDK({
	apiKey: '6545ca1b478f87cb5104d4547cd1ab21',
	privateKey: '96b5c6fb3d7e3c2e40a31202e7e5bfa0',
	lang:'ES',
	test:true
})

const port = 3000;
const app = express();

app.use(express.json())
app.use(cors())

const products = [
	{ id:1, name: 'Memoria USB Kinston 64GB', unitPrice: 56000, units: 12, img: 'http://flamingo.vteximg.com.br/arquivos/ids/191919/image-f3120067ab7d4cb1935673e96ef02bab.jpg?v=637351244791500000' },
	{ id:2, name: 'Memoria SD Kingston 32GB', unitPrice: 48000, units: 10, img: 'https://media.aws.alkosto.com/media/catalog/product/cache/6/image/69ace863370f34bdf190e4e164b6e123/7/4/740617246063.jpeg' },
	{ id:3, name: 'Adaptador SD to USB', unitPrice: 12000, units: 11, img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-DYwCdVVN6fNNmb3XyNIHS3XtUCIULRLMKA&usqp=CAU' }
];

app.post('/card', (req, res)=>{
	console.log('POST CARD')
	epayco.token.create({
		"card[number]": req.body.number,
	    "card[exp_year]": req.body.exp_year,
	    "card[exp_month]": req.body.exp_month,
	    "card[cvc]": req.body.cvc
	})
	.then(token => res.send(token))
	.catch(err => res.send(err))
})

app.post('/customer', (req, res)=>{
	console.log('POST CUSTOMER')
	epayco.customers.create(req.body)
    .then((customer) => res.send(customer))
    .catch((err) => res.send(err));
})

app.post('/payments/card', (req, res) => {
	console.log('POST PAYMENT CARD')
	let customer = req.body;
	customer.bill = "AFCR-Test-01";
    customer.dues= "1";
    customer.tax= "0";
    customer.tax_base= "0";
    customer.currency= "COP";
    customer.url_response= "https://AFelipeCR.github.io/payments";
    customer.url_confirmation= "https://AFelipeCR.github.io/payments/confirmation";
    customer.method_confirmation= "GET";

	epayco.charge.create(customer)
    .then(charge => res.send(charge))
	.catch(err => res.send(err))
})

app.get('/payments/:ID', (req, res)=>{
	console.log('GET PAYMENT')
	epayco.charge.get(req.params.ID)
    .then((charge) => res.send(charge))
    .catch((err) => res.send(err));
})


app.get('/products', (req, res)=>{
	console.log('GET PRODUCTS')
	res.send(products)
})


app.get('/products/:ID', (req, res)=>{
	console.log('GET PRODUCT')
	res.send(products.find(pp => pp.id == req.params.ID))
})


app.listen(port, () => {
	console.log(`Encendido en puerto ${port}`)
});