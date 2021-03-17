import './style.scss';
import { toggleArrayItem } from './functions';

interface MySelectOptions {
  placeholder: string;
}

export default class MySelect {
  selector: string;

  private options: MySelectOptions;

  private $select: HTMLSelectElement;

  private $container: HTMLElement;

  constructor(
    selector: string,
    options: MySelectOptions = { placeholder: 'Choose an options' }
  ) {
    this.selector = selector;
    this.options = options;
    this.$select = document.querySelector(this.selector);
    if (this.$select?.tagName.toLowerCase() === 'select') {
      this.init();
    } else {
      throw new Error('$element is not a <select>');
    }
  }

  private init(): void {
    this.$select.outerHTML = this.getTemplate();
    this.$select = document.querySelector(this.selector);
    this.$container = this.$select.closest('[data-type="container"]');

    if (!this.$select.disabled) {
      this.$container.addEventListener('click', this.clickHandler);
      document.addEventListener('click', this.documentClickHandler);
    }
  }

  private clickHandler = (event: Event): void => {
    const $target = event.target as HTMLElement;
    if ($target.closest('[data-type="field"]')) {
      this.toggle();
    } else if ($target.closest('[data-type="option"]')) {
      this.optionClickHandler($target.closest('[data-type="option"]'));
    }
  };

  private documentClickHandler = (event: Event): void => {
    const $target = event.target as HTMLElement;
    if ($target.closest('[data-type="container"]') !== this.$container) {
      this.close();
    }
  };

  private optionClickHandler($option: HTMLOptionElement) {
    if (!$option.classList.contains('-disabled')) {
      const currentValue = this.getValue();
      if (this.$select.multiple && Array.isArray(currentValue)) {
        this.setValue(toggleArrayItem(currentValue, $option.dataset.value));
      } else {
        this.setValue($option.dataset.value);
        this.close();
      }
    }
  }

  open(): void {
    this.$container.classList.add('-open');
  }

  close(): void {
    this.$container.classList.remove('-open');
  }

  toggle(): void {
    this.$container.classList.toggle('-open');
  }

  private getTemplate(): string {
    const classContainerDisabled: string = this.$select.disabled
      ? ' -disabled'
      : '';
    const selectHtml: string = this.$select.outerHTML;
    const dropdownOptionsHtml = this.getDropdownOptionsHtml();
    const inputHtml = this.getInputHtml();

    return `
      <div class="mselect${classContainerDisabled}" data-type="container">
        <div class="mselect__field" data-type="field">
          ${inputHtml}
          <div class="mselect__arrow">
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
              <path d="M0 0h24v24H0V0z" fill="none"/>
              <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
            </svg>
          </div>
        </div>
        <div class="mselect__dropdown" data-type="dropdown">
          ${dropdownOptionsHtml}
        </div>
        ${selectHtml}
      </div>
    `;
  }

  private getDropdownOptionsHtml(): string {
    let html = '';
    this.$select
      .querySelectorAll('option')
      .forEach(($option: HTMLOptionElement, idx) => {
        if (!$option.disabled || idx !== 0 || this.$select.multiple) {
          const classOptionDisabled = $option.disabled ? ' -disabled' : '';
          const classOptionSelected = $option.selected ? ' -selected' : '';
          const addOptionClasses = classOptionDisabled + classOptionSelected;

          html += `<div
            class="mselect__option${addOptionClasses}"
            data-type="option"
            data-value="${$option.value}"
          >
            ${$option.textContent}  
          </div>`;
        }
      });

    return html;
  }

  private getInputHtml(): string {
    let selectedOptionsText = '';

    this.$select
      .querySelectorAll('option[selected]')
      .forEach(($option: HTMLOptionElement) => {
        selectedOptionsText += selectedOptionsText
          ? `, ${$option.textContent}`
          : $option.textContent;
      });

    if (!selectedOptionsText) {
      selectedOptionsText = this.options.placeholder;
    }

    return `<div class="mselect__input" data-type="input">${selectedOptionsText}</div>`;
  }

  setValue(value: string | Array<string>): void {
    let inputText = '';

    this.$select
      .querySelectorAll('option')
      .forEach(($option: HTMLOptionElement) => {
        if (typeof value === 'string') {
          $option.selected = $option.value === value;
          if ($option.value === value) {
            inputText = $option.textContent;
          }
        } else {
          $option.selected = value.indexOf($option.value) !== -1;
          if (value.indexOf($option.value) !== -1) {
            inputText += inputText
              ? `, ${$option.textContent}`
              : $option.textContent;
          }
        }
      });

    this.$container
      .querySelectorAll('[data-type="option"]')
      .forEach(($option: HTMLElement) => {
        if (typeof value === 'string') {
          if ($option.dataset.value === value) {
            $option.classList.add('-selected');
          } else {
            $option.classList.remove('-selected');
          }
        } else if (value.indexOf($option.dataset.value) !== -1) {
          $option.classList.add('-selected');
        } else {
          $option.classList.remove('-selected');
        }
      });

    if (!inputText) {
      inputText = this.options.placeholder;
    }

    this.$container.querySelector(
      '[data-type="input"]'
    ).textContent = inputText;
  }

  getValue(): string | Array<string> {
    if (this.$select.multiple) {
      const selectValue: Array<string> = [];
      this.$container
        .querySelectorAll('option')
        .forEach(($option: HTMLOptionElement) => {
          if ($option.selected) {
            selectValue.push($option.value);
          }
        });
      return selectValue;
    }
    return this.$select.value;
  }

  destroy(): void {
    this.$container.outerHTML = this.$select.outerHTML;
    this.$container.removeEventListener('click', this.clickHandler);
    document.removeEventListener('click', this.documentClickHandler);
  }
}

const select = new MySelect('#select');
