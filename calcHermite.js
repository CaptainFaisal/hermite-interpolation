const deriv = (coeff) => coeff.map((c, i) => c * i).slice(1);
const multiplyPoly = (coeff1, coeff2) => {
  const res = Array.from(
    { length: coeff1.length + coeff2.length - 1 },
    (e) => (e = 0)
  );
  for (let i = 0; i < coeff1.length; i++) {
    for (let j = 0; j < coeff2.length; j++) {
      res[i + j] += coeff1[i] * coeff2[j];
    }
  }
  return res;
};
const addPoly = (coeff1, coeff2) => {
  const res = coeff1.length >= coeff2.length ? coeff1 : coeff2;
  const minCoeff = coeff1.length < coeff2.length ? coeff1 : coeff2;
  for (let i = 0; i < minCoeff.length; i++) {
    res[i] += minCoeff[i];
  }
  return res;
};
const squarePoly = (coeff) => multiplyPoly(coeff, coeff);
const eval = (coeff, value) =>
  coeff.map((e, i) => e * Math.pow(value, i)).reduce((a, c) => a + c);
const l = (k, x) => {
  const lst = x.filter((_, i) => i !== k);
  const n = lst.length;
  let coeff = Array.from({ length: n + 1 }, (e) => (e = 0));
  for (let i = 0; i < Math.pow(2, n); i++) {
    let comb = [];
    for (let j = 0; j < n; j++) {
      if (i & (1 << j)) comb.push(lst[j]);
    }
    if (comb.length > 0)
      coeff[n - comb.length] +=
        comb.reduce((a, c) => a * c) * Math.pow(-1, comb.length);
    else coeff[n] = 1;
  }
  const denom = lst.map((e) => x[k] - e).reduce((a, c) => a * c);
  return coeff.map((e) => e / denom);
};
const h = (k, x) => {
  const l_k = l(k, x);
  const l_k_prime = deriv(l_k);
  const l_k_square = squarePoly(l_k);
  return multiplyPoly(
    [1 + 2 * x[k] * eval(l_k_prime, x[k]), -2 * eval(l_k_prime, x[k])],
    l_k_square
  );
};
const h_hat = (k, x) => multiplyPoly([-x[k], 1], squarePoly(l(k, x)));
const hermite_poly = (x, y, y_prime) => {
  let poly = Array.from({ length: 2 * x.length - 1 }, (e) => (e = 0));
  console.log(poly);
  for (let k = 0; k < x.length; k++) {
    poly = addPoly(
      poly,
      addPoly(
        h(k, x).map((e) => e * y[k]),
        h_hat(k, x).map((e) => e * y_prime[k])
      )
    );
  }
  let j = poly.length - 1;
  while (poly[j] === 0) {
    poly = poly.slice(0, poly.length - 1);
    j -= 1;
  }
  return poly;
};
const isFraction = (n) => n - Math.floor(n) !== 0;
const gcd = (a, b) => !(a%b)? b : gcd(b, a%b)
const convertToFraction = (num, d) => {
  e = 0;
  while (isFraction(num)) {
    num *= 10;
    e += 1;
  }
  if (e > d) return num / Math.pow(10, e);
  else {
    let f = 1;
    if(num<0)
    {
      num*=-1
      f=-1
    }
    const g = gcd(num, Math.pow(10, e))
    return [f*num/g, Math.pow(10,e)/g]
  }
};