
it('should calculate the monthly rate correctly', function () {
  expect(calculateMonthlyPayment([100000,10,5])).toEqual("1060.66");
  expect(calculateMonthlyPayment([1000000,10,5])).toEqual("10606.55");
  expect(calculateMonthlyPayment([0,10,5])).toEqual("0.00");
  expect(calculateMonthlyPayment([461258,25,7.5])).toEqual("3408.66");
});


it("should return a result with 2 decimal places", function() {
  expect(Number.isInteger(calculateMonthlyPayment([Math.random()*1000000,Math.random()*100,Math.random()*10]))).not.toBe(true);
});