'use strict';

var MySelect = /** @class */ (function () {
    function MySelect(selector) {
        var _a;
        this.selector = selector;
        this.$select = document.querySelector(this.selector);
        if (((_a = this.$select) === null || _a === void 0 ? void 0 : _a.tagName.toLowerCase()) === 'select') {
            this.init();
        }
        else {
            throw new Error('$element is not a <select>');
        }
    }
    MySelect.prototype.init = function () {
        this.$select.outerHTML = this.getTemplate();
        this.$select = document.querySelector(this.selector);
        this.$container = this.$select.closest('[data-type="container"]');
        if (!this.$select.disabled) {
            this.$container.addEventListener('click', this.clickHandler.bind(this));
            document.addEventListener('click', this.documentClickHandler.bind(this));
        }
    };
    MySelect.prototype.clickHandler = function (event) {
        var $target = event.target;
        if ($target.closest('[data-type="field"]')) {
            this.toggle();
        }
        else if ($target.closest('[data-type="option"]')) {
            var $option = $target.closest('[data-type="option"]');
            if (!$option.classList.contains('-disabled')) {
                this.setValue($option.dataset.value);
                this.close();
            }
        }
    };
    MySelect.prototype.documentClickHandler = function (event) {
        var $target = event.target;
        if ($target.closest('[data-type="container"]') !== this.$container) {
            this.close();
        }
    };
    MySelect.prototype.open = function () {
        this.$container.classList.add('-open');
    };
    MySelect.prototype.close = function () {
        this.$container.classList.remove('-open');
    };
    MySelect.prototype.toggle = function () {
        this.$container.classList.toggle('-open');
    };
    MySelect.prototype.getTemplate = function () {
        var classContainerDisabled = this.$select.disabled
            ? ' -disabled'
            : '';
        var selectHtml = this.$select.outerHTML;
        var dropdownOptionsHtml = this.getDropdownOptionsHtml();
        var inputHtml = this.getInputHtml();
        return "\n      <div class=\"mselect" + classContainerDisabled + "\" data-type=\"container\">\n        <div class=\"mselect__field\" data-type=\"field\">\n          " + inputHtml + "\n          <div class=\"mselect__arrow\">\n            <svg xmlns=\"http://www.w3.org/2000/svg\" height=\"24\" viewBox=\"0 0 24 24\" width=\"24\">\n              <path d=\"M0 0h24v24H0V0z\" fill=\"none\"/>\n              <path d=\"M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z\"/>\n            </svg>\n          </div>\n        </div>\n        <div class=\"mselect__dropdown\" data-type=\"dropdown\">\n          " + dropdownOptionsHtml + "\n        </div>\n        " + selectHtml + "\n      </div>\n    ";
    };
    MySelect.prototype.getDropdownOptionsHtml = function () {
        var html = '';
        this.$select
            .querySelectorAll('option')
            .forEach(function ($option, idx) {
            if (!$option.disabled || idx !== 0) {
                var classOptionDisabled = $option.disabled ? ' -disabled' : '';
                var classOptionSelected = $option.selected ? ' -selected' : '';
                var addOptionClasses = classOptionDisabled + classOptionSelected;
                html += "<div\n            class=\"mselect__option" + addOptionClasses + "\"\n            data-type=\"option\"\n            data-value=\"" + $option.value + "\"\n          >\n            " + $option.textContent + "  \n          </div>";
            }
        });
        return html;
    };
    MySelect.prototype.getInputHtml = function () {
        var selectedOptionsText = '';
        this.$select
            .querySelectorAll('option')
            .forEach(function ($option) {
            if ($option.selected) {
                selectedOptionsText += selectedOptionsText
                    ? ", " + $option.textContent
                    : $option.textContent;
            }
        });
        return "<div class=\"mselect__input\" data-type=\"input\">" + selectedOptionsText + "</div>";
    };
    MySelect.prototype.setValue = function (value) {
        var selectedOptionsText = '';
        if (typeof value === 'string') {
            this.$select.value = value;
        }
        else {
            this.$select.value = value.join(',');
        }
        this.$container
            .querySelectorAll('[data-type="option"]')
            .forEach(function ($option) {
            $option.classList.remove('-selected');
            if (typeof value === 'string') {
                if ($option.dataset.value === value) {
                    $option.classList.add('-selected');
                    selectedOptionsText = $option.textContent;
                }
            }
            else if (value.indexOf($option.dataset.value) !== -1) {
                $option.classList.add('-selected');
                selectedOptionsText = selectedOptionsText
                    ? ", " + $option.textContent
                    : $option.textContent;
            }
        });
        this.$container.querySelector('[data-type="input"]').textContent = selectedOptionsText;
    };
    MySelect.prototype.getValue = function () {
        return this.$select.value;
    };
    return MySelect;
}());

module.exports = MySelect;
