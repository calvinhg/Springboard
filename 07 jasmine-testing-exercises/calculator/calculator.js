window.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById("calc-form");
  if (form) {
    setupIntialValues(form);
    form.addEventListener("submit", function(e) {
      e.preventDefault();
      update(form);
    });
  }
});

// function getCurrentUIValues() {
//   return {
//     amount: +(document.getElementById("loan-amount").value),
//     years: +(document.getElementById("loan-years").value),
//     rate: +(document.getElementById("loan-rate").value),
//   }
// }

// Get the inputs from the DOM.
// Put some default values in the inputs
// Call a function to calculate the current monthly payment
function setupIntialValues(form) {
  // Get form elements
  const amount = form.children[0].children[0];
  const years = form.children[1].children[0];
  const rate = form.children[2].children[0];
  // Fill form
  amount.value = 100000;
  years.value = 10;
  rate.value = 5;

  const monthlyP = calculateMonthlyPayment([amount.value, years.value, rate.value]);
  updateMonthly(monthlyP);
}

// Get the current values from the UI
// Update the monthly payment
function update(form) {
  // Get form elements
  const amount = form.children[0].children[0].value;
  const years = form.children[1].children[0].value;
  const rate = form.children[2].children[0].value;
  
  const monthlyP = calculateMonthlyPayment([amount, years, rate]);
  updateMonthly(monthlyP);
}

// Given an object of values (a value has amount, years and rate ),
// calculate the monthly payment.  The output should be a string
// that always has 2 decimal places.
function calculateMonthlyPayment(values) {
  const P = values[0];
  const n = values[1]*12; // Multiply by 12 for total payments
  const i = values[2]/12/100; // Divide by 12 for monthly rate, then by 100 to get real percentage

  const monthlyP = (P * i) / (1 - (1 + i)**(-n));

  // return Math.round(monthlyP * 100) / 100;
  return monthlyP.toFixed(2); // Always two decimals (even .00)
}

// Given a string representing the monthly payment value,
// update the UI to show the value.
function updateMonthly(monthlyP) {
  const result = document.querySelector("#monthly-payment");
  result.innerText = `$${monthlyP}`;
}
