describe("Payments test (with setup and tear-down)", function() {
  beforeEach(function () {
    // initialization logic
    billAmtInput.value = 100;
    tipAmtInput.value = 15;

  });

  it("should return an object with amounts on createCurPayment()", () => {
    const payment = createCurPayment();

    expect(payment.billAmt).toEqual("100");
    expect(payment.tipAmt).toEqual("15");
    expect(payment.tipPercent).toEqual(15);
  })

  it("should append a new table row when calling appendPaymentTable()", () => {
    submitPaymentInfo();

    expect(paymentTbody.childElementCount).toBe(1);
  })

  it("should add a tr and fill it when calling updateSummary()", () => {
    submitPaymentInfo();

    expect(summaryTds[0].innerText).toEqual("$100")
    expect(summaryTds[1].innerText).toEqual("$15")
    expect(summaryTds[2].innerText).toEqual("15%")
  })

  it("should add a new payment to allPayments on submitPaymentInfo", () => {
    submitPaymentInfo();
  
    expect(Object.keys(allPayments).length).toEqual(1);
    expect(allPayments["payment" + paymentId].billAmt).toBe("100");
    expect(allPayments["payment" + paymentId].tipAmt).toBe("15");
    expect(allPayments["payment" + paymentId].tipPercent).toBe(15);
  })

  afterEach(function() {
    billAmtInput.value = "";
    tipAmtInput.value = "";
    allPayments = {};
    for (let td of summaryTds) {
      td.innerHTML = "";
    }
    paymentTbody.innerHTML = "";
    paymentId = 0;
  });
});
