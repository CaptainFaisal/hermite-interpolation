var $TABLE = $("#table");
var $BTN = $("#calculate-btn");
var $BTN2 = $("sd-btn");
var $EXPORT = $("#export");

$(".table-add").click(function () {
  var $clone = $TABLE
    .find("tr.hide")
    .clone(true)
    .removeClass("hide table-line");
  $TABLE.find("table").append($clone);
  selectText($clone.children()[0]);
});

$(".table-remove").click(function () {
  $(this).parents("tr").detach();
});

$(".table-up").click(function () {
  var $row = $(this).parents("tr");
  if ($row.index() === 1) return; // Don't go above the header
  $row.prev().before($row.get(0));
});

$(".table-down").click(function () {
  var $row = $(this).parents("tr");
  $row.next().after($row.get(0));
});
function selectText(node) {
  if (document.body.createTextRange) {
    const range = document.body.createTextRange();
    range.moveToElementText(node);
    range.select();
  } else if (window.getSelection) {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(node);
    selection.removeAllRanges();
    selection.addRange(range);
  } else {
    console.warn("Could not select text in node: Unsupported browser.");
  }
}

$("td").focus(function () {
  selectText(this);
});
// A few jQuery helpers for exporting only
jQuery.fn.pop = [].pop;
jQuery.fn.shift = [].shift;
const showOutput = (result, nodeId) => {
  let latex = "";
  for(let t=0; t<result.length;t++){
    if(result[t]==0){
      continue
    }
    if(typeof(result[t])=='object')
    {
      sign=result[t][0]*result[t][1]>=0?'+':'-'
      latex+=`${sign}\\frac{${Math.abs(result[t][0])}}{${Math.abs(result[t][1])}}${t!=0?'x':''}${t>1?'^{'+t+'}':''}`
    }
    else
    {
      sign=result[t]>=0?'+':'-'
      latex+=`${sign}${Math.abs(result[t])!=1?Math.abs(result[t]):''}${t!=0?'x':''}${t>1?'^{'+t+'}':''}`
    }
  }
  document.getElementById(nodeId).innerHTML = `\\[p_{${result.length-1}}(x) = ${latex[0]=='-'?latex:latex.slice(1)}\\]`
  MathJax.typeset();
}

$BTN.click(function () {
  var $rows = $TABLE.find("tr:not(:hidden)");
  var headers = [];
  var data = [];

  // Get the headers (add special header logic here)
  $($rows.shift())
    .find("th:not(:empty)")
    .each(function () {
      headers.push($(this).text().toLowerCase());
    });

  // Turn all existing rows into a loopable array
  $rows.each(function () {
    var $td = $(this).find("td");
    var h = {};

    // Use the headers from earlier to name our hash keys
    headers.forEach(function (header, i) {
      h[header] = $td.eq(i).text();
    });

    data.push(h);
  });

  // Output the result
  const x = data.map((dt) => parseFloat(dt["x"]));
  const y = data.map((dt) => parseFloat(dt["f(x)"]));
  const y_prime = data.map((dt) => parseFloat(dt["f'(x)"]));
  const x_dup = x.slice()
  if(isDuplicate(x_dup)){
    alert("x data cannot be duplicated");
    return
  }
  if(!isValid(x)||!isValid(y)||!isValid(y_prime)){
    alert("Incorrect data given");
    return
  }
  const h_poly = hermite_poly(x, y, y_prime);
  const result = h_poly
  const result2 = h_poly.map(n  => {
    if(typeof(n)=='object'){
      if (countDigit(n[0]) || countDigit(n[1])){
        return (n[0]/n[1]).toPrecision(5)
      }
      return n;
    }
    return n;
  })
  showOutput(result, 'calc-result');
  document.getElementById('sd-btn').addEventListener('click', ()=>showOutput(result2, 'calc-result2'))
});