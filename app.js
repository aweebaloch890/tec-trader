let categories=JSON.parse(localStorage.getItem("categories"))||[];
let products=JSON.parse(localStorage.getItem("products"))||[];
let cart=JSON.parse(localStorage.getItem("cart"))||[];
let users=JSON.parse(localStorage.getItem("users"))||[];
let orders=JSON.parse(localStorage.getItem("orders"))||[];
let currentUser=JSON.parse(localStorage.getItem("currentUser"))||null;

let currentProduct=null;
let qty=1;
let couponDiscount=0;
let ltcRate=0;

function saveDB(){
localStorage.setItem("categories",JSON.stringify(categories));
localStorage.setItem("products",JSON.stringify(products));
localStorage.setItem("cart",JSON.stringify(cart));
localStorage.setItem("users",JSON.stringify(users));
localStorage.setItem("orders",JSON.stringify(orders));
localStorage.setItem("currentUser",JSON.stringify(currentUser));
}

/* LTC LIVE */
fetch("https://api.coingecko.com/api/v3/simple/price?ids=litecoin&vs_currencies=usd")
.then(res=>res.json())
.then(data=>ltcRate=data.litecoin.usd);

/* THEME */
function toggleTheme(){
if(document.documentElement.style.getPropertyValue('--bg')=="#000"){
document.documentElement.style.setProperty('--bg','#fff');
document.documentElement.style.setProperty('--card','#eee');
document.documentElement.style.setProperty('--text','#000');
}else{
document.documentElement.style.setProperty('--bg','#000');
document.documentElement.style.setProperty('--card','#111');
document.documentElement.style.setProperty('--text','#fff');
}
}

/* ADMIN */
function adminLogin(){
let pass=prompt("Admin Password:");
if(pass==="admin123") showPage("adminPanel");
else alert("Wrong Password");
}

/* CATEGORY */
function addCategory(){
categories.push({name:catName.value,img:catImg.value});
saveDB();
renderCategories();
}

function renderCategories(){
categoryContainer.innerHTML="";
categories.forEach(cat=>{
categoryContainer.innerHTML+=`
<div class="card" onclick="openCategory('${cat.name}')">
<img src="${cat.img}">
<h3>${cat.name}</h3>
</div>`;
});
}
renderCategories();

/* PRODUCT */
function addProduct(){
products.push({
id:Date.now(),
title:pTitle.value,
category:pCategory.value,
price:parseFloat(pPrice.value),
img:pImg.value,
desc:pDesc.value
});
saveDB();
alert("Added");
}

function deleteProduct(){
let id=parseInt(deleteID.value);
products=products.filter(p=>p.id!==id);
saveDB();
alert("Deleted");
}

function openCategory(name){
showPage("products");
categoryTitle.innerText=name;
productContainer.innerHTML="";
products.filter(p=>p.category===name)
.forEach(p=>{
productContainer.innerHTML+=`
<div class="card">
<img src="${p.img}" onclick="openDetail(${p.id})">
<h3>${p.title}</h3>
<p>$${p.price}</p>
</div>`;
});
}

function openDetail(id){
currentProduct=products.find(p=>p.id===id);
qty=1;
showPage("detail");
detailImage.src=currentProduct.img;
detailTitle.innerText=currentProduct.title;
detailDesc.innerText=currentProduct.desc;
detailPrice.innerText="$"+currentProduct.price;
ltcPrice.innerText="≈ "+(currentProduct.price/ltcRate).toFixed(4)+" LTC";
}

/* COUPON */
function applyCoupon(){
if(couponInput.value==="TEC10"){
couponDiscount=0.10;
alert("10% Discount Applied");
}else alert("Invalid Coupon");
}

/* CART */
function addToCart(){
cart.push({...currentProduct,qty});
saveDB();
updateCartCount();
}

function updateCartCount(){
cartCount.innerText=cart.length;
}
updateCartCount();

/* CHECKOUT */
function checkout(){
showPage("checkoutPage");
let total=cart.reduce((a,b)=>a+(b.price*b.qty),0);
total=total-(total*couponDiscount);
checkoutSummary.innerHTML=`Total: $${total}`;
}

/* PAYMENT */
async function processPayment(){
let orderID="TEC-"+Date.now();
orders.push({id:orderID,status:"Pending",cart});
cart=[];
saveDB();
alert("Order ID: "+orderID);
showPage("home");
}

/* TRACK */
function trackOrder(){
let id=trackID.value;
let order=orders.find(o=>o.id===id);
trackResult.innerHTML=order? "Status: "+order.status:"Not Found";
}

/* ROUTER */
function showPage(id){
document.querySelectorAll("section").forEach(s=>s.classList.add("hidden"));
document.getElementById(id).classList.remove("hidden");
}
