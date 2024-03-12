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
        this.currentItem = 0;
        this.root = this.createDivWithClass("pdb-carrousel");
        this.container = this.createDivWithClass("pdb-carrousel-container");
        this.root.appendChild(this.container);
        this.element.appendChild(this.root);
        this.items = children.map((child) => {
            let item = this.createDivWithClass('pdb-carrousel-item');
            item.appendChild(child);
            this.container.appendChild(item);
            return item;
        })
        this.setStyle();
        this.createNavigation();
    }

    /**
     * Applique les bonnnes dimensions aux elem du carrousel
     */
    setStyle() {
        let ratio = this.items.length / this.options.slidesVisible;
        this.container.style.width = (ratio * 100) + "%";
        this.items.forEach(item => item.style.width = ((100 / this.options.slidesVisible) / ratio) + "%");
    };

    createNavigation() {
        let navContainer = this.createDivWithClass("pdb-carrousel-nav-container");
        let nextButton = this.createDivWithClass("pdb-carrousel-next");
        let prevButton = this.createDivWithClass("pdb-carrousel-prev");
        navContainer.appendChild(prevButton);
        navContainer.appendChild(nextButton);
        this.root.appendChild(navContainer);
        nextButton.addEventListener('click', this.next.bind(this));
        prevButton.addEventListener('click', this.prev.bind(this))
    };

    next() {
        this.goToItem(this.currentItem + this.options.slidesToScroll);
    }

    prev() {
        this.goToItem(this.currentItem - this.options.slidesToScroll);
    }

    /**
     * déplace le carrousel vers l'élément ciblé
     * @param {number} index 
     */

    goToItem(index) {
        let translateX = index * 100 / this.items.length;
        this.container.style.transform = 'translate3d(' + translateX + '%, 0, 0)';
        this.currentItem = index;
    }

    /**
     * @param {string} className 
     * @returns {HTMLelement}
     * 
     */

    createDivWithClass(className) {
        let div = document.createElement('div');
        div.setAttribute('class', className);
        return div;
    }

}

document.addEventListener('DOMContentLoaded', function() {

    new Carrousel(document.getElementById("pdb-carrousel-video"));

});
