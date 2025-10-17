# TODO

## Implementation Plan for ai-site

1. **Package Structure**
   - [x] Create basic package structure
   - [ ] Set up TypeScript configuration
   - [ ] Configure package.json with dependencies and scripts

2. **CLI Functionality**
   - [ ] Implement CLI entry point
   - [ ] Add command parsing for dev/build/start
   - [ ] Set up Next.js command proxying

3. **Configuration Loading**
   - [ ] Implement site.config.{ts|js} loader
   - [ ] Add validation for configuration
   - [ ] Set up default configuration values

4. **Next.js Configuration**
   - [ ] Create default Next.js configuration
   - [ ] Implement logic to merge with custom configuration
   - [ ] Set up configuration resolution

5. **App Directory Handling**
   - [ ] Create default app directory template
   - [ ] Implement logic to resolve app directory path
   - [ ] Set up support for custom app directories

6. **Integration with AI Packages**
   - [ ] Integrate with ai-functions
   - [ ] Integrate with ai-props
   - [ ] Set up zero-config integration

7. **Testing**
   - [ ] Test CLI functionality
   - [x] Test configuration loading
   - [x] Test Next.js integration
   - [ ] Test with example site

   **Known Issues:**
   - PostCSS configuration error when running tests locally:
     ```
     Failed to load PostCSS config: Failed to load PostCSS config (searchPath: /home/ubuntu/repos/primitives.org.ai/packages/ai-site): [TypeError] Invalid PostCSS Plugin found at: plugins[0]
     ```
     This is due to an invalid plugin in the root postcss.config.mjs file.

8. **Documentation**
   - [ ] Complete README.md
   - [ ] Add usage examples
   - [ ] Document configuration options

9. **Publishing**
   - [ ] Prepare for npm publishing
   - [ ] Set up GitHub Actions for releases
