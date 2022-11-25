
// accepts 'tipAmt', 'billAmt', 'tipPercent' and sums total from allPayments objects
function sumPaymentTotal(type) {
  let total = 0;

  for (let key in allPayments) {
    let payment = allPayments[key];

    total += Number(payment[type]);
  }

  return total;
}

// converts the bill and tip amount into a tip percent
function calculateTipPercent(billAmt, tipAmt) {
  return Math.round(100 / (billAmt / tipAmt));
}

// expects a table row element, appends a newly created td element from the value
function appendTd(tr, value) {
  let newTd = document.createElement('td');
  newTd.innerText = value;

  tr.append(newTd);
}


function appendDeleteBtn(tr) {
  let newTd = document.createElement("td");
  newTd.innerText = "X";
  newTd.className = "deleteBtn";
  tr.append(newTd);

  newTd.addEventListener("click", (evt) => {
    // Check if button was on server table
    if (evt.path[2]==serverTbody) {
      delete allServers[evt.path[1].id]; // Remove server from allServers object
      updateServerTable(); // Clear the html and make new table
    }
    // Otherwise it's on the payment table
    else {
      delete allPayments[evt.path[1].id]; // Remove payment from allPayments
      evt.path[1].remove(); // Remove that table row
      updateSummary();
    }
  })
}