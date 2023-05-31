import html from './image-component.html';

class ImageComponent extends GHComponent {

    constructor() {
        super();
    }

    async onServerRender() {
        this.src = this.getAttribute('src');
        this.alt = this.getAttribute('alt');
        this.title = this.getAttribute('title');
        this.lazyload = this.hasAttribute('lazyload');
        this.dataSrc = this.getAttribute('data-src');
        this.dataUrl = this.getAttribute('data-url');
        
        this.width = this.hasAttribute('width') ? this.getAttribute('width') : false;
        this.height = this.hasAttribute('height') ? this.getAttribute('height') : false;
        
        await new Promise(async (resolve) => {
            if(this.dataSrc && this.dataUrl && !window.disableImagesRegeneration) {
                await fetch(this.dataSrc + '?source=' + this.dataUrl + '&mode=ssr');
                this.src = this.dataSrc;
                resolve();
            } else {
                if(this.src) {
                    await fetch(this.src + '?mode=ssr');
                    resolve();
                }
            }
        })
        
        await new Promise(async (resolve) => {
            this.image = new Image();
        
            this.image.addEventListener('load', () => {
                const srcHasParams = this.image.getAttribute('src').indexOf('?') !== -1;
                let src = srcHasParams ? this.image.getAttribute('src').substring(0, image.getAttribute('src').indexOf('?')) : this.image.getAttribute('src');
                if(src.indexOf('&') !== -1) {
                    src = src.substring(0, src.indexOf('&'))
                }
                this.extension = src.substring(src.lastIndexOf('.'), src.length);
                this.path = src.substring(0, src.length - this.extension.length);
                
                this.imageWidth = this.image.naturalWidth;
                resolve();
            });
        
            this.image.setAttribute('src', this.src);
        })
        super.render(html);
        
    }
}

if(!window.customElements.get('image-component')) {
    window.customElements.define('image-component', ImageComponent);
}