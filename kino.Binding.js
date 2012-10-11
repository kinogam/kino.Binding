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

        var elements = rootElement.getElementsByTagName("*");
        for (var i = 0; i < elements.length; i++) {
            var element = elements[i];
            if (element.hasAttribute("data-bind")) {
                bindAttr(element.getAttribute("data-bind"), element, dataContext);
            }
        }
    };

    exports.as = function (dataContext) {
        ///<summary>
        /// dynamic binding object
        ///</summary>
        ///<param name="dataContext" type="Object">
        /// convert object
        ///</param>
        var bObj = {
            _isBO: true,
            bgData: dataContext,
            _changeMap: {},
            set: function (options) {
                for (var i in options) {
                    if (this.bgData[i] != options[i]) {
                        this.changed(this.bgData, i, options[i]);
                    }
                }
            },
            changed: function (obj, property, value) {
                obj[property] = value;
                var mobj = this._changeMap[property];
                if (mobj.changeHandle != undefined) {
                    mobj.changeHandle(value);
                }
            }
        };

        for (var i in dataContext) {
            bObj[i] = dataContext[i];
            bObj._changeMap[i] = {};
        }
        return bObj;
    }

    var bindAttr = function (dataBindAttr, element, dataContext) {
        var group;
        var r = new RegExp("([^;:\\s]+)\\s*:\\s*([^\\s;]+)", "g");
        while ((group = r.exec(dataBindAttr)) != null) {
            var domProperty = group[1];
            var objProperty = group[2];
            element[domProperty] = dataContext[objProperty];

            updateView(element, dataContext, domProperty, objProperty);
        }
    };

    var updateView = function (element, dataContext, domProperty, objProperty) {
        if (dataContext._isBO) {
            dataContext._changeMap[objProperty].changeHandle = function (value) {
                element[domProperty] = value;
            }
        }
    };

    window.kino || (window.kino = {});
    window.kino.Binding = exports;

})(window);