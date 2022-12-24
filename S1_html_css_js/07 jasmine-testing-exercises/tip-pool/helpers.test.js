describe("Helpers tests", () => {
  
  it("should calculate a percentage", () => {
    expect(calculateTipPercent(100, 15)).toBe(15);
    expect(calculateTipPercent(422, 22)).toBe(5);
    expect(calculateTipPercent(127, 31)).toBe(24);
  })

  it("should append new TDs", () => {
    let testTr = document.createElement("tr");
    appendTd(testTr, "hello");
    appendTd(testTr, "goodbye");

    expect(testTr.childElementCount).toBe(2);
    expect(testTr.children[0].innerText).toBe("hello");
    expect(testTr.children[1].innerText).toBe("goodbye");
  })

  it("should append delete buttons", () => {
    let testTr = document.createElement("tr");
    appendTd(testTr, "hello");
    appendDeleteBtn(testTr);

    expect(testTr.childElementCount).toBe(2);
    expect(testTr.children[1].innerText).toBe("X");
  })

  it("should calculate payment totals", () => {
    allPayments = {payment1: {billAmt: "101", tipAmt: "2", tipPercent: "2"},
                   payment2: {billAmt: "399", tipAmt: "2002", tipPercent: "502"},
                   payment3: {billAmt: "333", tipAmt: "30", tipPercent: "9"}}
    
    expect(sumPaymentTotal("billAmt")).toBe(833);
    expect(sumPaymentTotal("tipAmt")).toBe(2034);
    expect(sumPaymentTotal("tipPercent")).toBe(513);

    allPayments = {};
  })
})