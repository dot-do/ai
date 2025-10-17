import '@testing-library/jest-dom'

declare global {
  namespace Vi {
    interface Assertion {
      toBeInTheDocument(): void
      toHaveTextContent(text: string): void
      toBeVisible(): void
      toBeDisabled(): void
      toBeEnabled(): void
      toBeChecked(): void
      toBePartiallyChecked(): void
      toHaveAttribute(attr: string, value?: string): void
      toHaveClass(...classNames: string[]): void
      toHaveFocus(): void
      toHaveStyle(css: string): void
      toHaveValue(value: string | string[] | number): void
      toBeEmptyDOMElement(): void
      toBeInvalid(): void
      toBeRequired(): void
      toBeValid(): void
      toContainElement(element: HTMLElement | null): void
      toContainHTML(html: string): void
      toHaveAccessibleDescription(description?: string): void
      toHaveAccessibleName(name?: string): void
      toHaveDisplayValue(value: string | RegExp | Array<string | RegExp>): void
      toHaveFormValues(values: Record<string, any>): void
    }
  }
}
