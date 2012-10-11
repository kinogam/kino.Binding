/// <reference path="qunit/qunit.js" />
/// <reference path="../kino.bind.js" />

module("process");

test("can process binding data", function () {
    var dom = document.createElement("div");
    dom.innerHTML = "<div data-bind='innerHTML: name'></div>";
    kino.Binding.process(dom, { name: 'kino' });
    equal(dom.getElementsByTagName("div")[0].innerHTML, "kino");
});

test("can process multi-attribute", function () {
    var dom = document.createElement("div");
    dom.innerHTML = "<div data-bind='innerHTML: name;title: title'></div>";
    kino.Binding.process(dom, { name: 'kino', title: 'my title' });

    var div = dom.getElementsByTagName("div")[0];
    equal(div.innerHTML, "kino");
    equal(div.getAttribute("title"), "my title");
});

module("as");

test("change dataContext property should update view", function () {
    var dom = document.createElement("div");
    dom.innerHTML = "<div data-bind='innerHTML: name;title: title'></div>";

    var bindingObj = kino.Binding.as({
        name: 'kino',
        title: 'my title'
    });

    kino.Binding.process(dom, bindingObj);

    var div = dom.getElementsByTagName("div")[0];
    equal(div.innerHTML, "kino");
    equal(div.getAttribute("title"), "my title");

    bindingObj.set({
        title: "mago",
        name: "changed name"
    });

    equal(div.innerHTML, "changed name");
    equal(div.getAttribute("title"), "mago");
});