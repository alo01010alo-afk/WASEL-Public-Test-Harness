const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const fixturePath = path.join(__dirname, "..", "fixtures", "sample-merchant-delivery-order.json");
const sample = JSON.parse(fs.readFileSync(fixturePath, "utf8"));

const allowedCurrencyByMarket = { SY: "SYP", TR: "TRY" };
const allowedStatuses = new Set([
  "pending", "confirmed", "preparing", "ready", "completed", "cancelled"
]);

// Pure example contract validator. It checks only the supplied synthetic object;
// it does not call or represent the private WASEL application.
function validateOrder(order) {
  const errors = [];
  if (!order || typeof order !== "object" || Array.isArray(order)) {
    return ["order must be an object"];
  }
  if (order.example_only !== true) errors.push("fixture must be explicitly synthetic");
  if (order.order_type !== "merchant_delivery") errors.push("unsupported order type");
  if (!Object.hasOwn(allowedCurrencyByMarket, order.market)) {
    errors.push("unsupported market");
  } else if (order.currency !== allowedCurrencyByMarket[order.market]) {
    errors.push("market and currency do not match");
  }
  if (!allowedStatuses.has(order.status)) errors.push("unsupported order status");
  if (!Array.isArray(order.items) || order.items.length === 0) {
    errors.push("order must contain at least one item");
  } else {
    for (const [index, item] of order.items.entries()) {
      if (!item || typeof item !== "object") {
        errors.push(`item ${index} must be an object`);
        continue;
      }
      if (typeof item.product_ref !== "string" || item.product_ref.length === 0) {
        errors.push(`item ${index} has an invalid product reference`);
      }
      if (typeof item.name_snapshot !== "string" || item.name_snapshot.length === 0) {
        errors.push(`item ${index} has an invalid name snapshot`);
      }
      if (!Number.isSafeInteger(item.quantity) || item.quantity <= 0) {
        errors.push(`item ${index} has an invalid quantity`);
      }
      if (!Number.isSafeInteger(item.unit_price_minor) || item.unit_price_minor < 0) {
        errors.push(`item ${index} has an invalid unit price`);
      }
    }
  }
  if (!Number.isSafeInteger(order.delivery_fee_minor) || order.delivery_fee_minor < 0) {
    errors.push("delivery fee must be a non-negative safe integer");
  }
  if (!Number.isSafeInteger(order.total_minor) || order.total_minor < 0) {
    errors.push("total must be a non-negative safe integer");
  }
  if (Array.isArray(order.items) && order.items.length > 0 &&
      order.items.every(item => item && Number.isSafeInteger(item.quantity) &&
        item.quantity > 0 && Number.isSafeInteger(item.unit_price_minor) &&
        item.unit_price_minor >= 0) &&
      Number.isSafeInteger(order.delivery_fee_minor) && order.delivery_fee_minor >= 0 &&
      Number.isSafeInteger(order.total_minor) &&
      order.total_minor !== order.items.reduce(
        (sum, item) => sum + item.quantity * item.unit_price_minor, 0
      ) + order.delivery_fee_minor) {
    errors.push("total does not equal item subtotal plus delivery fee");
  }
  if (typeof order.idempotency_key !== "string" ||
      !order.idempotency_key.startsWith("sample-") ||
      !order.idempotency_key.includes("not-for-production")) {
    errors.push("idempotency key must be clearly non-production");
  }
  return errors;
}

function cloneSample() {
  return structuredClone(sample);
}

test("baseline synthetic merchant-delivery fixture satisfies the contract", () => {
  assert.deepEqual(validateOrder(sample), []);
});

test("fixture is explicitly synthetic", () => {
  const order = cloneSample();
  order.example_only = false;
  assert.ok(validateOrder(order).includes("fixture must be explicitly synthetic"));
});

test("market and currency must match", () => {
  const order = cloneSample();
  order.market = "TR";
  assert.ok(validateOrder(order).includes("market and currency do not match"));
});

test("unknown markets are rejected", () => {
  const order = cloneSample();
  order.market = "XX";
  assert.ok(validateOrder(order).includes("unsupported market"));
});

test("tampered totals are rejected", () => {
  const order = cloneSample();
  order.total_minor += 1;
  assert.ok(validateOrder(order).includes("total does not equal item subtotal plus delivery fee"));
});

test("negative delivery fees are rejected", () => {
  const order = cloneSample();
  order.delivery_fee_minor = -1;
  assert.ok(validateOrder(order).includes("delivery fee must be a non-negative safe integer"));
});

test("zero and fractional quantities are rejected", () => {
  for (const quantity of [0, 1.5]) {
    const order = cloneSample();
    order.items[0].quantity = quantity;
    assert.ok(validateOrder(order).some(error => error.includes("invalid quantity")));
  }
});

test("negative and unsafe unit prices are rejected", () => {
  for (const unitPrice of [-1, Number.MAX_SAFE_INTEGER + 1]) {
    const order = cloneSample();
    order.items[0].unit_price_minor = unitPrice;
    assert.ok(validateOrder(order).some(error => error.includes("invalid unit price")));
  }
});

test("empty item lists are rejected", () => {
  const order = cloneSample();
  order.items = [];
  assert.ok(validateOrder(order).includes("order must contain at least one item"));
});

test("missing item snapshots and product references are rejected", () => {
  const order = cloneSample();
  order.items[0].name_snapshot = "";
  order.items[0].product_ref = "";
  const errors = validateOrder(order);
  assert.ok(errors.some(error => error.includes("invalid name snapshot")));
  assert.ok(errors.some(error => error.includes("invalid product reference")));
});

test("unsupported order states are rejected", () => {
  const order = cloneSample();
  order.status = "paid-but-not-defined";
  assert.ok(validateOrder(order).includes("unsupported order status"));
});

test("cancelled is an explicitly recognized example status", () => {
  const order = cloneSample();
  order.status = "cancelled";
  assert.deepEqual(validateOrder(order), []);
});

test("production-looking idempotency keys are rejected in public fixtures", () => {
  const order = cloneSample();
  order.idempotency_key = "live-key-123";
  assert.ok(validateOrder(order).includes("idempotency key must be clearly non-production"));
});

test("non-object input is rejected safely", () => {
  assert.deepEqual(validateOrder(null), ["order must be an object"]);
});
