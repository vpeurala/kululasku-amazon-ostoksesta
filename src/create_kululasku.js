"use strict";

const testcafe = require("testcafe/lib/api/exportable-lib");
const selector = testcafe.Selector;
const etasku_front_page_url = "https://www.etasku.fi/";

fixture("Create kululasku").page(etasku_front_page_url);

test("Happy path", async(t) => {
    await t.click(selector("a#navbar-login")).debug();
});
