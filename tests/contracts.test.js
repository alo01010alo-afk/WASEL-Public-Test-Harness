const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const fixturePath = path.join(__dirname, "..", "fixtures", "sample-merchant-delivery-order.json");
const sample = JSON.parse(fs.readFileSync(fixturePath, "utf8"));

test("fixture is explicitly synthetic and uses the first-release order type", () => {
  assert.equal(sample.example_only, true);
  assert.equal(sample.order_type, "merchant_delivery");
});

test("market and currency are paired without cross-market mixing", () => {
  const allowedCurrencyByMarket = { SY: "SYP", TR: "TRY" };
  assert.ok(Object.hasOwn(allowedCurrencyByMarket, sample.market));
  assert.equal(sample.currency, allowedCurrencyByMarket[sample.market]);
});

test("item quantities and unit prices are valid safe integers", () => {
  assert.ok(Array.isArray(sample.items) && sample.items.length > 0);
  for (const item of sample.items) {
    assert.ok(Number.isSafeInteger(item.quantity) && item.quantity > 0);
    assert.ok(Number.isSafeInteger(item.unit_price_minor) && item.unit_price_minor >= 0);
    assert.equal(typeof item.name_snapshot, "string");
    assert.ok(item.name_snapshot.length > 0);
  }
});

test("order total equals item subtotal plus delivery fee", () => {
  const subtotal = sample.items.reduce((sum, item) => sum + item.quantity * item.unit_price_minor, 0);
  assert.ok(Number.isSafeInteger(sample.delivery_fee_minor) && sample.delivery_fee_minor >= 0);
  assert.equal(sample.total_minor, subtotal + sample.delivery_fee_minor);
});

test("sample idempotency key is clearly non-production", () => {
  assert.equal(typeof sample.idempotency_key, "string");
  assert.ok(sample.idempotency_key.startsWith("sample-"));
  assert.ok(sample.idempotency_key.includes("not-for-production"));
});
