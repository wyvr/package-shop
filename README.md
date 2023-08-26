# Shop Package

Package for [wyvr](https://wyvr.dev) which provides a basic headless ecommerce implementation.

This package does not contain the implementation to the specific ecommerce backend, only the basic interface.

## **WARNING: This software is currently under heavy development. It is not considered stable and there may be bugs, incomplete features, or changes without prior notice. Use at your own risk.**


## Install

### Install dependency
Add it to your Node.js Dependencies with 
```bash
pnpm install @wyvr/package-shop
```
### Add package
Add the package to your `wyvr.js` file

```javascript
export default {
    packages: [
        {
            name: 'Shop',
            path: '@wyvr/package-shop',
        },
    ],
};
```

## Release Notes

see [Release Notes](RELEASE_NOTES.md)


## Contributing Guidelines

TBD


## License

[MIT](LICENSE.md)
