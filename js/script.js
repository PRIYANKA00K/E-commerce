async function addToCart(productId){
  try {
    const res = await fetch("/add-to-cart", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      credentials:"include",
      body: JSON.stringify({ productId })
    });
    if(res.ok) alert("Added to cart!");
    else throw new Error();
  } catch(e){
    alert("Login first!");
    window.location.href="/login.html";
  }
}
