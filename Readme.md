# Image web component

## Basic example

```html
<image-component lazyload src="/assets/images/example.jpg" alt="Alternate" title="Title for image"></image-component>
```

## External download example

```html
<image-component data-src="https://gudhub.com/userdata/29883/968970.jpg" data-url="/assets/blog/developer-life-in-ukraine.jpg" alt="Alternate" title="Title for image"></image-component>
```

## Possible attributes

* **src** - path to your image from root of the website. Use only for simple image, not for external.
* **data-src** - url from which image should be downloaded. Use only for external images.
* **data-url** - url in which downloaded image should be saved. Use only for external images.
* **lazyload** - if exists, will add loading="lazy" attribute for generated <img> tag.
* **alt** - just add alt text for generated <img> tag.
* **title** - just add title text for generated <ing> tag.
* **width** - just add width attribute for generated <img> tag. Can be useful for Google Page Speed optimization.
* **height** - just add height attribute for generated <img> tag. Can be useful for Google Page Speed optimization.