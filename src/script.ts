import './style.scss';
import { toggleArrayItem, checkMobileDevice } from './functions';

interface MySelectOptions {
  placeholder: string;
}

export default class MySelect {
  selector: string;

  private options: MySelectOptions;

  private $select: HTMLSelectElement;

  private $container: HTMLElement;

  private $dropdown: HTMLElement;

  private $input: HTMLElement;

  private eventChange: Event;

  private eventDestroy: Event;

  private isMobile: boolean;

  constructor(
    selector: string,
    options: MySelectOptions = { placeholder: 'Choose an options' }
  ) {
    this.selector = selector;
    this.options = options;
    this.$select = document.querySelector(this.selector);
    this.eventChange = new Event('change');
    this.eventDestroy = new Event('destroy');
    this.isMobile = checkMobileDevice();

    if (this.$select?.tagName.toLowerCase() === 'select') {
      this.init();
    } else {
      throw new Error('$element is not a <select>');
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

  setValue(value: string | Array<string>): void {
    this.$select
      .querySelectorAll('option')
      .forEach(($option: HTMLOptionElement) => {
        if (typeof value === 'string') {
          $option.selected = $option.value === value;
        } else {
          $option.selected = value.indexOf($option.value) !== -1;
        }
      });

    if (!this.isMobile) {
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
    }

    this.$input.textContent = this.getInputText();
    this.$select.dispatchEvent(this.eventChange);
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
    this.$select.removeEventListener('change', this.selectChangeHandler);
    this.$select.dispatchEvent(this.eventDestroy);
  }

  refresh(): void {
    if (this.$select.disabled) {
      this.$container.classList.add('-disabled');
    } else {
      this.$container.classList.remove('-disabled');
    }

    if (!this.isMobile) {
      this.$dropdown.innerHTML = this.getDropdownOptionsHtml();
    }

    this.$input.textContent = this.getInputText();
  }

  private init(): void {
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

  private selectChangeHandler = (): void => {
    this.$input.textContent = this.getInputText();
  };

  private getTemplate(): string {
    const classContainerDisabled: string = this.$select.disabled
      ? ' -disabled'
      : '';
    const classContainerMobile: string = this.isMobile ? ' -mobile' : '';
    const selectHtml: string = this.$select.outerHTML;
    const dropdownOptionsHtml = !this.isMobile
      ? this.getDropdownOptionsHtml()
      : '';
    const inputHtml = this.getInputHtml();

    return `
      <div class="mselect${classContainerDisabled}${classContainerMobile}" data-type="container">
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
    const selectedOptionsText = this.getInputText();
    return `<div class="mselect__input" data-type="input">${selectedOptionsText}</div>`;
  }

  private getInputText(): string {
    let inputText = '';
    this.$select
      .querySelectorAll('option')
      .forEach(($option: HTMLOptionElement) => {
        if ($option.selected) {
          inputText += inputText
            ? `, ${$option.textContent}`
            : $option.textContent;
        }
      });

    if (!inputText && this.$select.multiple) {
      inputText = this.options.placeholder;
    }

    return inputText;
  }
}
