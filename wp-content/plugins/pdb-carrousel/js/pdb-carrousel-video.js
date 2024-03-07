class Carrousel {

    /**
     * 
     * @param {HTMLElement} element 
     * @param {Object} options 
     * @param {Object} options.slidesToScroll Nombre d'éléments à faire défiler
     * @param {Object} options.slidesToScroll Nombre d'éléments visibles dans le slide
     * 
     */

    constructor (element, options = {}) {
        this.element = element
        this.options = Object.assign({}, {
            slidesToScroll: 1,
            slidesVisible: 1
        }, options);
        let children = [].slice.call(element.children);
        let root = this.createDivWithClass("pdb-carrousel");
        this.container = this.createDivWithClass("pdb-carrousel-container");
        root.appendChild(this.container);
        this.element.appendChild(root);
        this.items = children.map((child) => {
            let item = this.createDivWithClass('pdb-carrousel-item');
            item.appendChild(child);
            this.container.appendChild(item);
            return item;
        })
        this.setStyle()
    }

    setStyle() {
        let ratio = this.items.length / this.options.slidesVisible;
        this.container.style.width = (ratio * 100) + "%";
        this.items.forEach(item => item.style.width = ((100 / this.options.slidesVisible) / ratio) + "%");
    }

    /**
     * 
     * @param {string} className 
     * @returns {HTMLelement}
     */

    createDivWithClass(className) {
        let div = document.createElement('div');
        div.setAttribute('class', className);
        return div;
    }

}

document.addEventListener('DOMContentLoaded', function() {

    new Carrousel(document.getElementById("pdb-carrousel-video"), {
        // slidesToScroll: 3,
        slidesVisible: 3
    })

});
