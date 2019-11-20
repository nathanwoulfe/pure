(() => {

    angular.module('pure.components', []);

    angular.module('pure', [
        'pure.components'
    ]);

    angular.module('umbraco').requires.push('pure');

})(); 

(() => {

    function controller($timeout) {
        let active = false;
        let animating = false;

        let panels;
        let previousPanel;
        let container;

        const duration = 800;
        const offset = 10;
        const threshold = 1;

        const activeClass = 'active';
        const appContent = document.querySelector('.umb-app-content');

        const clearNav = () => appContent.removeChild(document.querySelector('.pure-anchors'));
        const deselectNav = () => document.querySelector('.pure-anchor.active').classList.remove(activeClass);
        const step = level => document.body.classList.toggle('pure-mode' + (level ? '--' + level : ''));

        const changeNav = entries => {
            for (let entry of entries) {

                const anchor = entry.target.dataset.appAnchor;
                const elm = document.querySelector(`[data-pure-target="${anchor}"]`);

                if (!elm)
                    continue;

                if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
                    elm.classList.add('is-visible');
                    previousPanel = anchor;
                } else {
                    elm.classList.remove('is-visible');
                }

                highlightActive();
            }
        };

        const highlightActive = () => {
            const firstVisible = document.querySelector('.is-visible');
            deselectNav();

            if (firstVisible) {
                firstVisible.classList.add(activeClass);
            }

            if (!firstVisible && previousPanel) {
                document.querySelector(`[data-pure-target="${previousPanel}"]`).classList.add(activeClass);
            }
        };

        const observer = new IntersectionObserver(changeNav, {
            threshold: threshold
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
                    if (!e.target.classList.contains(activeClass)) {
                        const target = document.getElementById(e.target.dataset.pureTarget);

                        deselectNav();
                        e.target.classList.add(activeClass);

                        container.scrollTo({
                            top: target.offsetTop - 20,
                            behavior: 'smooth'
                        });
                    }
                });

                list.appendChild(item);
            }

            list.firstElementChild.classList.add(activeClass);

            appContent.insertBefore(list, appContent.firstElementChild);
        };

        /*
         * Toggle pure mode on SHIFT+P
         */
        document.addEventListener('keydown', e => {

            if (e.shiftKey && e.keyCode === 80 && !animating) {

                const scope = angular.element(document.querySelector('form[name="contentForm"]')).scope();
                if (scope.app.alias !== 'umbContent')
                    return;

                animating = true;
                panels = document.querySelectorAll('[data-app-anchor]');

                for (let p of panels) {
                    p.setAttribute('id', p.dataset.appAnchor);
                    observer.observe(p);
                }
                
                container = document.querySelector('[data-element="editor-container"]');

                if (!active) {
                    step(0);
                    buildNav();

                    $timeout(() => step(1), offset);
                    $timeout(() => step(2), duration + offset);
                } else {
                    step(2);

                    $timeout(() => step(1), duration);

                    $timeout(() => { 
                        step(0);
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

    angular.module('pure.components').component('section', component);
})();