import './image-component.scss';

class ImageComponent extends GHComponent {
    constructor() {
        super();
    }
    
    async render() {
        
        if(this.environment === 'server') {
            this.src = this.getAttribute('src');
            this.alt = this.getAttribute('alt');
            this.title = this.getAttribute('title');
            this.dataSrc = this.getAttribute('data-src');
            this.dataUrl = this.getAttribute('data-url');
            this.lazyload = this.hasAttribute('lazyload');
            this.loadingPadding = this.getAttribute('loading-padding');
            this.width = this.hasAttribute('width') ? this.getAttribute('width') : false;
            this.height = this.hasAttribute('height') ? this.getAttribute('height') : false;
            this.externalImage = (this.hasAttribute('data-src') && this.hasAttribute('data-url')) ? true : false;
            if(this.dataSrc && this.dataUrl && this.environment === 'server') {
                await fetch(this.dataUrl + '?source=' + this.dataSrc + '&mode=ssr');
                this.src = this.dataUrl;
            }

            if(this.loadingPadding) {
                this.style.paddingBottom = this.loadingPadding;
            }

            if(this.src !== null) {
                this.innerHTML = `
                    <picture>
                        <img ${ this.width ? `width="${this.width}"` : '' } ${ this.height ? `height="${this.height}"` : '' } alt="${this.alt || ''}" title="${this.title || ''}" src="${this.src}${(this.environment === 'server' && this.externalImage === false) ? '?mode=ssr' : ''}" onerror="onImageNotFound.call(this)" />
                    </picture>
                `;
            }

            const image = this.querySelector('img');

            if(image) {

                await new Promise(async (resolve) => {
                    if(image.complete) {
                        await this.prepareSource();
                        resolve();
                    } else {
                        image.onload = async () => {
                            await this.prepareSource();
                            resolve();
                        }
                    }
                });

                if(this.lazyload) {
                    image.setAttribute('loading', 'lazy');
                }

            }

        }

    }

    async prepareSource() {
        const image = this.querySelector('img');
        const srcHasParams = image.getAttribute('src').indexOf('?') !== -1;
        let src = srcHasParams ? image.getAttribute('src').substring(0, image.getAttribute('src').indexOf('?')) : image.getAttribute('src');
        if(src.indexOf('&') !== -1) {
            src = src.substring(0, src.indexOf('&'))
        }
        const extension = src.substring(src.lastIndexOf('.'), src.length);
        const path = src.substring(0, src.length - extension.length);
        const picture = this.querySelector('picture');
        const imageWidth = image.naturalWidth;

        if(imageWidth > 600) {
            picture.innerHTML += `<source media="(max-width: 600px)" srcset="${path}-600${extension}.webp" type="image/webp">`;
        }
        if(imageWidth > 1200) {
            picture.innerHTML += `<source media="(max-width: 1200px)" srcset="${path}-1200${extension}.webp" type="image/webp">`;
            picture.innerHTML += `<source media="(min-width: 1200px)" srcset="${path}${extension}.webp" type="image/webp">`;
        }

        if(imageWidth > 600) {
            picture.innerHTML += `<source media="(max-width: 600px)" srcset="${path}-600${extension}" type="image/${extension.substring(1, extension.length)}">`;
        }

        if(imageWidth > 1200) {
            picture.innerHTML += `<source media="(max-width: 1200px)" srcset="${path}-1200${extension}" type="image/${extension.substring(1, extension.length)}">`;
            picture.innerHTML += `<source media="(min-width: 1200px)" srcset="${path}${extension}" type="image/${extension.substring(1, extension.length)}">`;
        }

        if(imageWidth <= 600) {
            picture.innerHTML += `
                <source srcset="${src}.webp" type="image/webp" />
                <source srcset="${src}" type="image/${src.split('.')[src.split('.').length - 1]}" />
            `;
        }

        const clonedImage = image.cloneNode();
        clonedImage.src = src;
        this.querySelector('img').remove();
        if(this.lazyload) {
            clonedImage.setAttribute('loading', 'lazy');
        }
        picture.append(clonedImage);
        picture.setAttribute('data-natural-width', imageWidth);

        return true;
    }

}

window.customElements.define('image-component', ImageComponent);