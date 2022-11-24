const l = (k, x) => {
  const lst = x.filter((_, i) => i !== k);
  const n = lst.length;
  let coeff = Array.from({ length: n + 1 }, (c) => (c = 0));
  for (let i = 0; i < Math.pow(2, n); i++) {
    let comb = [];
    for (let j = 0; j < n; j++) {
      if (i & (1 << j)) comb.push(lst[j]);
    }
    if (comb.length > 0)
      coeff[n - comb.length] =add(coeff[n-comb.length], multiply(comb.reduce((a, c) => multiply(a, c)), Math.pow(-1, comb.length)));
    else coeff[n] = 1;
  }
  const denom = reduce(lst.map((e) => add(x[k], multiply(e, -1))).reduce((a, c) => multiply(a, c)));
  if(denom==0){
    console.warn("Denom is zero");
    return;
  }
  const dInv = typeof(denom)=='object'?[denom[1], denom[0]]:[1,denom]
  return coeff.map((e) => reduce(multiply(e, dInv)));
};
const h = (k, x) => {
  const l_k = l(k, x);
  const l_k_prime = deriv(l_k);
  const l_k_square = squarePoly(l_k);
  return multiplyPoly(
    [add(1,multiply(2, x[k], eval(l_k_prime, x[k]))), multiply(-2, eval(l_k_prime, x[k]))],
    l_k_square
  );
};
const h_hat = (k, x) => multiplyPoly([multiply(-1, x[k]), 1], squarePoly(l(k, x)));
const convertToFraction = (num) => {
    e = 0
    while (num-parseInt(num)!=0) {
        num *= 10;
        e+=1
    }
    let f = 1;
    if(num<0)
    {
        num*=-1
        f=-1
    }
    const g = gcd(num, Math.pow(10, e))
    return [f*num/g, Math.pow(10,e)/g]
};
const hermite_poly = (x, y, y_prime) => {
  x = x.map(e=>convertToFraction(e))
  y = y.map(e=>convertToFraction(e))
  y_prime = y_prime.map(e=>convertToFraction(e))
  let poly = Array.from({ length: 2 * x.length - 1 }, (e) => (e = 0));
  for (let k = 0; k < x.length; k++) {
    poly = addPoly(
      poly,
      addPoly(
        h(k, x).map((e) => multiply(e, y[k])),
        h_hat(k, x).map((e) => multiply(e, y_prime[k]))
      )
    );
  }
  poly = poly.map(e=>reduce(e))
  let j = poly.length - 1;
  while (poly[j] === 0) {
    poly = poly.slice(0, poly.length - 1);
    j -= 1;
  }
  return poly;
};
// console.log(hermite_poly([0,1,3], [2,4,5], [1,-1,-2]))
// console.log(hermite_poly([-1,1], [0, 1], [1, 0]))
// console.log(hermite_poly([0.1, 0.2], [-0.62, -0.283], [3.585, 3.14]))