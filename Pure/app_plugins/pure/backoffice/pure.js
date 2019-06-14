(function () {

    function controller($timeout) {

        let active = false;
        let animating = false;

        let panels;
        let container;

        const duration = 1000;
        const offset = 10;
        const appContent = document.querySelector('.umb-app-content');

        /*
         * 
         */
        const clearNav = () => appContent.removeChild(document.querySelector('.pure-anchors'));

        /*
         * 
         */
        const toggle = className => document.body.classList.toggle(className);

        const changeNav = entries => {
            console.log(entries);
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio >= 0.55) {
                    console.log(entry);
                    document.querySelector('.pure-anchor.active').classList.remove('active');
                    const id = entry.target.dataset.appAnchor;
                    document.querySelector(`[data-pure-target="${id}"]`).classList.add('active');
                }
            });
        };

        const observer = new IntersectionObserver(changeNav, {
            threshold: 0.55,
            root: appContent
        });

        /*
         *
         */
        const buildNav = () => {

            let list = document.createElement('ul');
            list.className = 'pure-anchors unstyled';

            for (let p of panels) {
                let item = document.createElement('li');

                item.className = 'pure-anchor';
                item.setAttribute('data-pure-target', p.dataset.appAnchor);
                item.innerText = p.querySelector('.umb-group-panel__header').innerText;

                item.addEventListener('click', e => {
                    if (!e.target.classList.contains('active')) {
                        const target = document.getElementById(e.target.dataset.pureTarget);

                        document.querySelector('.pure-anchor.active').classList.remove('active');
                        e.target.classList.add('active');

                        container.scrollTo({
                            top: target.offsetTop - 20,
                            behavior: 'smooth'
                        });
                    }
                });

                list.appendChild(item);
            }

            list.firstElementChild.classList.add('active');

            appContent.insertBefore(list, appContent.firstElementChild);
        };

        /*
         * Toggle pure mode on ALT+N
         */
        window.addEventListener('keydown', e => {
            if (e.altKey && e.keyCode === 78 && !animating) {
                animating = true;

                panels = document.querySelectorAll('[data-app-anchor]');
                panels.forEach(p => {
                    p.setAttribute('id', p.dataset.appAnchor);
                    observer.observe(p);
                });
                
                container = document.querySelector('[data-element="editor-container"]');

                if (!active) {
                    toggle('pure-mode');
                    buildNav();

                    $timeout(() => toggle('pure-mode--1'), offset);
                    $timeout(() => toggle('pure-mode--2'), duration + offset);
                } else {
                    toggle('pure-mode--2');

                    $timeout(() => toggle('pure-mode--1'), duration);

                    $timeout(() => {
                        toggle('pure-mode');
                        clearNav();
                    }, duration * 2 + offset);
                }

                $timeout(() => animating = false, duration + offset);

                active = !active;
            }
        });
    }

    const component = {
        controller: controller
    };

    controller.$inject = ['$timeout'];

    angular.module('umbraco').component('section', component);

}());