const deriv = (coeff) => coeff.map((e, i) => (typeof e == "object" ? [e[0] * i, e[1]] : e * i)).slice(1)
const gcd = (a, b) => a%b==0?b:gcd(b,a%b)
const lcm = (a, b)=>a*b/gcd(a,b)
const add = (...operands) => operands.reduce((c1, c2) => {
    const obj = [c1, c2].filter(e=>typeof(e)=='object')
    const num = [c1, c2].filter(e=>typeof(e)=='number')
    if(obj.length==0)
        return c1+c2
    if(obj.length==1)
        return [obj[0][1]*num[0]+obj[0][0], obj[0][1]]
    if(obj.length==2)
    {
        const l = lcm(c1[1], c2[1])
        return [c1[0]*(l/c1[1])+c2[0]*(l/c2[1]), l]
    }
})
const reduce = (n) => {
    if(typeof(n)=='object'){
        if(n[0]==0) return 0;
        if(n[0]%n[1]==0) return n[0]/n[1];
        const g = gcd(n[0], n[1])
        return [n[0]/g, n[1]/g]
    }
    return n;
}
const multiply = (...operands) =>operands.reduce((c1, c2) =>{
    const obj = [c1, c2].filter(e=>typeof(e)=='object')
    const num = [c1, c2].filter(e=>typeof(e)=='number')
    if(obj.length==0)
        return c1*c2
    if(obj.length==1)
        return [obj[0][0]*num[0], obj[0][1]]
    if(obj.length==2)
        return [c1[0]*c2[0], c1[1]*c2[1]]
})
const multiplyPoly = (coeff1, coeff2) => {
    const l1 = coeff1.length
    const l2 = coeff2.length
    const mulCoeff = Array.from({length:l1+l2-1}, e=>e=0)
    for(let i=0; i<l1; i++){
        for(let j=0; j<l2; j++){
            mulCoeff[i+j]=add(mulCoeff[i+j], multiply(coeff1[i], coeff2[j]))
        }
    }
    return mulCoeff.map(e=>reduce(e))
}
const addPoly = (coeff1, coeff2) => {
    const res = coeff1.length >= coeff2.length ? coeff1 : coeff2;
    const minCoeff = coeff1.length < coeff2.length ? coeff1 : coeff2;
    for (let i = 0; i < minCoeff.length; i++) {
      res[i] =add(res[i], minCoeff[i]);
    }
    return res.map(e=>reduce(e));
};
const squarePoly = (coeff) => multiplyPoly(coeff, coeff);
const exp = (base, power) =>{
    if(typeof(base)=='object') return base.map(e=>Math.pow(e, power));
    return Math.pow(base, power);
}
const eval = (coeff, value) => coeff.map((e, i)=>multiply(e, exp(value, i))).reduce((a, c)=>add(a, c))
const countDigit = (n) => Math.floor(Math.log10(Math.abs(n)))+1
const sort = (arr) => {
    for(let i=0; i<arr.length-1; i++){
        for(let j=0; j<arr.length-i-1;j++){
            if (arr[j]>arr[j+1]){
                const temp = arr[j]
                arr[j] = arr[j+1]
                arr[j+1] = temp
            }
        }
    }
    return arr;
}
const isDuplicate = (arr) =>{
    const a = sort(arr)
    let duplicated = false
    for(let i=0; i<a.length-1;i++){
        if(a[i]==a[i+1]){
            duplicated = true
        }
    }
    return duplicated;
}
const isValid = (arr) =>{
    let valid = true
    for(let i=0; i<arr.length;i++){
        if (isNaN(arr[i])){
            valid = false
        }
    }
    return valid
}