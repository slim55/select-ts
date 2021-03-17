import './style.scss';

export default class MySelect {
  selector: string;

  private $select: HTMLSelectElement;

  private $container: HTMLElement;

  constructor(selector: string) {
    this.selector = selector;
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
      this.$container.addEventListener('click', this.clickHandler.bind(this));
      document.addEventListener('click', this.documentClickHandler.bind(this));
    }
  }

  private clickHandler(event: Event): void {
    const $target = event.target as HTMLElement;
    if ($target.closest('[data-type="field"]')) {
      this.toggle();
    } else if ($target.closest('[data-type="option"]')) {
      const $option: HTMLElement = $target.closest('[data-type="option"]');
      if (!$option.classList.contains('-disabled')) {
        this.setValue($option.dataset.value);
        this.close();
      }
    }
  }

  private documentClickHandler(event: Event): void {
    const $target = event.target as HTMLElement;
    if ($target.closest('[data-type="container"]') !== this.$container) {
      this.close();
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
        if (!$option.disabled || idx !== 0) {
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
      .querySelectorAll('option')
      .forEach(($option: HTMLOptionElement) => {
        if ($option.selected) {
          selectedOptionsText += selectedOptionsText
            ? `, ${$option.textContent}`
            : $option.textContent;
        }
      });

    return `<div class="mselect__input" data-type="input">${selectedOptionsText}</div>`;
  }

  setValue(value: string | Array<string>): void {
    let selectedOptionsText = '';

    if (typeof value === 'string') {
      this.$select.value = value;
    } else {
      this.$select.value = value.join(',');
    }

    this.$container
      .querySelectorAll('[data-type="option"]')
      .forEach(($option: HTMLElement) => {
        $option.classList.remove('-selected');
        if (typeof value === 'string') {
          if ($option.dataset.value === value) {
            $option.classList.add('-selected');
            selectedOptionsText = $option.textContent;
          }
        } else if (value.indexOf($option.dataset.value) !== -1) {
          $option.classList.add('-selected');
          selectedOptionsText = selectedOptionsText
            ? `, ${$option.textContent}`
            : $option.textContent;
        }
      });

    this.$container.querySelector(
      '[data-type="input"]'
    ).textContent = selectedOptionsText;
  }

  getValue(): string | Array<string> {
    return this.$select.value;
  }
}
