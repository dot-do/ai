# TODO

## Implementation Plan for ai-directory

1. **Package Structure**
   - [x] Create basic package structure
   - [x] Set up TypeScript configuration
   - [x] Configure package.json with dependencies and scripts

2. **CLI Functionality**
   - [x] Implement CLI entry point
   - [x] Add command parsing for dev/build/start
   - [x] Set up Next.js command proxying

3. **Configuration Loading**
   - [x] Implement site.config.{ts|js} loader
   - [x] Add validation for configuration
   - [x] Set up default configuration values

4. **Next.js Configuration**
   - [x] Create default Next.js configuration
   - [x] Implement logic to merge with custom configuration
   - [x] Set up configuration resolution

5. **App Directory Handling**
   - [x] Create default app directory template
   - [x] Implement logic to resolve app directory path
   - [x] Set up support for custom app directories

6. **Data Source Abstraction**
   - [x] Implement data source abstraction layer
   - [x] Support database connections
   - [x] Support API endpoints
   - [x] Support local data

7. **Directory Components**
   - [x] Create DirectoryList component
   - [x] Create DirectoryItem component
   - [x] Create SearchBar component
   - [x] Create CategoryFilter component
   - [x] Create Pagination component
   - [x] Create ViewToggle component

8. **API Routes**
   - [x] Implement API route handlers
   - [x] Support listing and filtering
   - [x] Support item detail retrieval

9. **Testing**
   - [ ] Test CLI functionality
   - [x] Test configuration loading
   - [ ] Test data source abstraction
   - [ ] Test with example directory

10. **Documentation**
    - [ ] Complete README.md
    - [ ] Add usage examples
    - [ ] Document configuration options

11. **Publishing**
    - [ ] Prepare for npm publishing
    - [ ] Set up GitHub Actions for releases
