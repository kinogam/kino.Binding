(function (window) {
    //use observer for append event to object
    var observer = function (obj) {
        obj.observerEvents = {};
        obj.listen = _listen;
        obj.trigger = _trigger;
    };

    var _listen = function (eventName, fn) {
        if (this.observerEvents[eventName] == null) {
            this.observerEvents[eventName] = [];
        }
        this.observerEvents[eventName].push(fn);
    };

    var _trigger = function (eventName) {
        var eventList = this.observerEvents[eventName];
        for (var i = 0; i < eventList.length; i++) {
            eventList[i].call(this);
        }
    };
    window.observer = observer;
})(window);


(function (window) {
    "use strict";

    var exports = {};

    exports.process = function (rootElement, dataContext) {
        ///<summary>
        /// process elements binding
        ///</summary>
        ///<param name="rootElement" type="Element">
        /// element for bind
        ///</param>
        ///<param name="dataContext" type="Object">
        /// binding data
        ///</param>


        if (typeof dataContext.listen == 'function') {
            dataContext.listen("changed", function () {
                updateView(rootElement, dataContext.bgData);
            });
        }

        updateView(rootElement, dataContext.bgData || dataContext);
    };

    exports.as = function (dataContext) {
        ///<summary>
        /// dynamic binding object
        ///</summary>
        ///<param name="dataContext" type="Object">
        /// convert object
        ///</param>
        var bObj = {
            bgData: dataContext,
            set: function (options) {

                var hasChange = false;
                for (var i in options) {
                    if (this.bgData[i] != options[i]) {
                        this.bgData[i] = options[i];
                        hasChange = true;
                    }
                }
                if (hasChange) {
                    this.trigger("changed");
                }

            }
        };

        observer(bObj);

        return bObj;
    }

    var bindAttr = function (dataBindAttr, element, dataContext) {
        var group;
        var r = new RegExp("([^;:\\s]+)\\s*:\\s*([^\\s;]+)", "g");
        while ((group = r.exec(dataBindAttr)) != null) {
            var domProperty = group[1];
            var objProperty = group[2];
            element[domProperty] = dataContext[objProperty];
        }
    };

    var updateView = function (rootElement, dataContext) {
        var elements = rootElement.getElementsByTagName("*");
        for (var i = 0; i < elements.length; i++) {
            var element = elements[i];
            if (element.getAttribute("data-bind") != null) {
                bindAttr(element.getAttribute("data-bind"), element, dataContext);
            }
        }
    };

    window.kino || (window.kino = {});
    window.kino.Binding = exports;

})(window);