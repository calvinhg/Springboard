describe("Servers test (with setup and tear-down)", function() {
  beforeEach(function () {
    // initialization logic
    serverNameInput.value = 'Alice';
    submitServerInfo();
  });

  // THESE NEED TO BE RUN IN ORDER OR THEY WILL FAIL
  it('should add a new server to allServers on submitServerInfo()', function () {
    expect(Object.keys(allServers).length).toEqual(1);
    expect(allServers['server' + serverId].serverName).toEqual('Alice');
  });

  it("should append a new table row when calling updateServerTable()", () => {

    expect(serverTbody.childElementCount).toBe(1);
  })

  afterEach(function() {
    allServers = {};
    serverId = 0;
    updateServerTable();
  });
});
