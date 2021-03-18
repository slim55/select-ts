var MySelect = (function () {
    'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __spreadArray(to, from) {
        for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
            to[j] = from[i];
        return to;
    }

    var toggleArrayItem = function (arr, item) {
        return arr.includes(item)
            ? arr.filter(function (elem) { return elem !== item; })
            : __spreadArray(__spreadArray([], arr), [item]);
    };
    var checkMobileDevice = function () {
        return !!/Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/.exec(window.navigator.userAgent);
    };

    var MySelect = /** @class */ (function () {
        function MySelect(selector, options) {
            var _this = this;
            if (options === void 0) { options = { placeholder: 'Choose an options' }; }
            var _a;
            this.clickHandler = function (event) {
                var $target = event.target;
                if ($target.closest('[data-type="field"]')) {
                    _this.toggle();
                }
                else if ($target.closest('[data-type="option"]')) {
                    _this.optionClickHandler($target.closest('[data-type="option"]'));
                }
            };
            this.documentClickHandler = function (event) {
                var $target = event.target;
                if ($target.closest('[data-type="container"]') !== _this.$container) {
                    _this.close();
                }
            };
            this.selectChangeHandler = function () {
                _this.$input.textContent = _this.getInputText();
            };
            this.selector = selector;
            this.options = options;
            this.$select = document.querySelector(this.selector);
            this.eventChange = new Event('change');
            this.eventDestroy = new Event('destroy');
            this.isMobile = checkMobileDevice();
            if (((_a = this.$select) === null || _a === void 0 ? void 0 : _a.tagName.toLowerCase()) === 'select') {
                this.init();
            }
            else {
                throw new Error('$element is not a <select>');
            }
        }
        MySelect.prototype.open = function () {
            this.$container.classList.add('-open');
        };
        MySelect.prototype.close = function () {
            this.$container.classList.remove('-open');
        };
        MySelect.prototype.toggle = function () {
            this.$container.classList.toggle('-open');
        };
        MySelect.prototype.setValue = function (value) {
            this.$select
                .querySelectorAll('option')
                .forEach(function ($option) {
                if (typeof value === 'string') {
                    $option.selected = $option.value === value;
                }
                else {
                    $option.selected = value.indexOf($option.value) !== -1;
                }
            });
            if (!this.isMobile) {
                this.$container
                    .querySelectorAll('[data-type="option"]')
                    .forEach(function ($option) {
                    if (typeof value === 'string') {
                        if ($option.dataset.value === value) {
                            $option.classList.add('-selected');
                        }
                        else {
                            $option.classList.remove('-selected');
                        }
                    }
                    else if (value.indexOf($option.dataset.value) !== -1) {
                        $option.classList.add('-selected');
                    }
                    else {
                        $option.classList.remove('-selected');
                    }
                });
            }
            this.$input.textContent = this.getInputText();
            this.$select.dispatchEvent(this.eventChange);
        };
        MySelect.prototype.getValue = function () {
            if (this.$select.multiple) {
                var selectValue_1 = [];
                this.$container
                    .querySelectorAll('option')
                    .forEach(function ($option) {
                    if ($option.selected) {
                        selectValue_1.push($option.value);
                    }
                });
                return selectValue_1;
            }
            return this.$select.value;
        };
        MySelect.prototype.destroy = function () {
            this.$container.outerHTML = this.$select.outerHTML;
            this.$container.removeEventListener('click', this.clickHandler);
            document.removeEventListener('click', this.documentClickHandler);
            this.$select.removeEventListener('change', this.selectChangeHandler);
            this.$select.dispatchEvent(this.eventDestroy);
        };
        MySelect.prototype.refresh = function () {
            if (this.$select.disabled) {
                this.$container.classList.add('-disabled');
            }
            else {
                this.$container.classList.remove('-disabled');
            }
            if (!this.isMobile) {
                this.$dropdown.innerHTML = this.getDropdownOptionsHtml();
            }
            this.$input.textContent = this.getInputText();
        };
        MySelect.prototype.init = function () {
            this.$select.outerHTML = this.getTemplate();
            this.$select = document.querySelector(this.selector);
            this.$container = this.$select.closest('[data-type="container"]');
            this.$input = this.$container.querySelector('[data-type="input"]');
            this.$dropdown = this.$container.querySelector('[data-type="dropdown"]');
            if (!this.$select.disabled) {
                this.$container.addEventListener('click', this.clickHandler);
                document.addEventListener('click', this.documentClickHandler);
                this.$select.addEventListener('change', this.selectChangeHandler);
            }
        };
        MySelect.prototype.optionClickHandler = function ($option) {
            if (!$option.classList.contains('-disabled')) {
                var currentValue = this.getValue();
                if (this.$select.multiple && Array.isArray(currentValue)) {
                    this.setValue(toggleArrayItem(currentValue, $option.dataset.value));
                }
                else {
                    this.setValue($option.dataset.value);
                    this.close();
                }
            }
        };
        MySelect.prototype.getTemplate = function () {
            var classContainerDisabled = this.$select.disabled
                ? ' -disabled'
                : '';
            var classContainerMobile = this.isMobile ? ' -mobile' : '';
            var selectHtml = this.$select.outerHTML;
            var dropdownOptionsHtml = !this.isMobile
                ? this.getDropdownOptionsHtml()
                : '';
            var inputHtml = this.getInputHtml();
            return "\n      <div class=\"mselect" + classContainerDisabled + classContainerMobile + "\" data-type=\"container\">\n        <div class=\"mselect__field\" data-type=\"field\">\n          " + inputHtml + "\n          <div class=\"mselect__arrow\">\n            <svg xmlns=\"http://www.w3.org/2000/svg\" height=\"24\" viewBox=\"0 0 24 24\" width=\"24\">\n              <path d=\"M0 0h24v24H0V0z\" fill=\"none\"/>\n              <path d=\"M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z\"/>\n            </svg>\n          </div>\n        </div>\n        <div class=\"mselect__dropdown\" data-type=\"dropdown\">\n          " + dropdownOptionsHtml + "\n        </div>\n        " + selectHtml + "\n      </div>\n    ";
        };
        MySelect.prototype.getDropdownOptionsHtml = function () {
            var _this = this;
            var html = '';
            this.$select
                .querySelectorAll('option')
                .forEach(function ($option, idx) {
                if (!$option.disabled || idx !== 0 || _this.$select.multiple) {
                    var classOptionDisabled = $option.disabled ? ' -disabled' : '';
                    var classOptionSelected = $option.selected ? ' -selected' : '';
                    var addOptionClasses = classOptionDisabled + classOptionSelected;
                    html += "<div\n            class=\"mselect__option" + addOptionClasses + "\"\n            data-type=\"option\"\n            data-value=\"" + $option.value + "\"\n          >\n            " + $option.textContent + "  \n          </div>";
                }
            });
            return html;
        };
        MySelect.prototype.getInputHtml = function () {
            var selectedOptionsText = this.getInputText();
            return "<div class=\"mselect__input\" data-type=\"input\">" + selectedOptionsText + "</div>";
        };
        MySelect.prototype.getInputText = function () {
            var inputText = '';
            this.$select
                .querySelectorAll('option')
                .forEach(function ($option) {
                if ($option.selected) {
                    inputText += inputText
                        ? ", " + $option.textContent
                        : $option.textContent;
                }
            });
            if (!inputText && this.$select.multiple) {
                inputText = this.options.placeholder;
            }
            return inputText;
        };
        return MySelect;
    }());

    return MySelect;

}());
