# Frontend Style Guide

## Coding Conventions

### Naming Conventions

- Components: PascalCase (e.g., `RuneCard`, `SpreadSelector`)
- Hooks: camelCase with 'use' prefix (e.g., `useRuneCasting`, `useUserJwt`)
- Functions/Methods: camelCase (e.g., `handleSubmit()`, `fetchRunes()`)
- Variables: camelCase (e.g., `selectedRunes`, `isLoading`)
- Constants: UPPER_SNAKE_CASE (e.g., `MAX_RUNES_PER_SPREAD`)

### Indentation and Spacing

- Use 2 spaces for indentation
- Add blank lines between logical blocks
- No trailing whitespace
- One space after keywords and before braces

### Comments and Documentation

- Use JSDoc style comments for hooks and components
- Add inline comments for complex logic
- Keep comments current and meaningful

## Component Structure

### Functional Components

```jsx
import React from "react";
import PropTypes from "prop-types";

const ExampleComponent = ({ title, children }) => {
  // Component logic here

  return (
    <div className="example-component">
      <h2>{title}</h2>
      <div className="content">{children}</div>
    </div>
  );
};

ExampleComponent.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export default ExampleComponent;
```

### Custom Hooks

```javascript
import { useState, useEffect } from "react";

export const useExample = (initialValue) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    // Effect logic here
  }, [initialValue]);

  const updateValue = (newValue) => {
    setValue(newValue);
  };

  return {
    value,
    updateValue,
  };
};
```

## State Management

### Local State

- Use React's useState for component-specific state
- Use useReducer for complex state logic
- Keep state as close as possible to where it's used

### Global State

- Use Context API for shared state across components
- Consider custom hooks to access context (e.g., `useUserJwt`)
- Avoid prop drilling more than 2-3 levels deep

## Styling Approach

### CSS Organization

- Use CSS modules or styled-components for component-specific styles
- Follow BEM naming convention for class names
- Maintain a consistent color palette in a theme file

### Responsive Design

- Use relative units (rem, em, %) over fixed units (px)
- Implement mobile-first approach
- Use media queries for breakpoints

## Testing

### Testing with Vitest

- Use Vitest as the primary testing framework
- Leverage Vitest's built-in mocking capabilities with `vi.mock()` and `vi.fn()`
- Use `vi.waitFor()` for asynchronous testing
- Take advantage of Vitest's watch mode during development
- Structure test files with descriptive `describe` and `it` blocks
- Place test files in `__tests__` folders or use `.test.jsx`/`.spec.jsx` naming convention

```javascript
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useExample } from "../useExample";

// Mock dependencies
vi.mock("../someService", () => ({
  fetchData: vi.fn(),
}));

describe("useExample", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch data on mount", async () => {
    // Test implementation
    const { result } = renderHook(() => useExample());

    // Wait for async operations
    await vi.waitFor(() => expect(result.current.loading).toBe(false));

    // Assert results
    expect(result.current.data).toEqual(expectedData);
  });
});
```

## Performance Optimization

### Memoization

- Use React.memo for expensive component renders
- Use useMemo for expensive calculations
- Use useCallback for functions passed as props

### Code Splitting

- Implement lazy loading for routes
- Split large components into smaller, focused ones
- Use dynamic imports for heavy libraries

## Error Handling

### UI Error States

- Implement error boundaries for component-level errors
- Display user-friendly error messages
- Provide recovery options when possible

### API Error Handling

- Handle network errors gracefully
- Implement retry mechanisms where appropriate
- Log errors for debugging

## Accessibility

### Best Practices

- Use semantic HTML elements
- Ensure proper keyboard navigation
- Maintain sufficient color contrast
- Include ARIA attributes where needed
- Test with screen readers

## Development Workflow

### Version Control

- Feature branches from main
- Meaningful commit messages
- PR reviews for code quality

### Code Quality Tools

- Use ESLint for code linting
- Use Prettier for code formatting

## Maintenance

This style guide should be reviewed and updated quarterly. All team members can propose changes through pull requests.
