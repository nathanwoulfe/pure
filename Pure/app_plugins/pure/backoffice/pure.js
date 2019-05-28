(function () {

    function hook($timeout) {

        const directive = {
            restrict: 'E',
            link: () => {

                let active = false;
                let animating = false;
                const appContent = document.querySelector('.umb-app-content');

                const buildNav = () => {

                    let list = document.createElement('ul');
                    list.className = 'pure-anchors unstyled';
                    const panels = document.querySelectorAll('[data-app-anchor]');

                    for (let p of panels) {
                        let item = document.createElement('li');

                        item.className = 'pure-anchor';
                        item.setAttribute('data-pure-target', p.dataset.appAnchor);
                        item.innerText = p.querySelector('.umb-group-panel__header').innerText;

                        item.addEventListener('click', e => {

                            const anchors = document.querySelectorAll('.pure-anchor');
                            for (let a of anchors) {
                                a.classList.remove('active');
                            }

                            e.target.classList.add('active');

                            const target = document.querySelector(`[data-app-anchor="${e.target.dataset.pureTarget}"]`);

                            document.querySelector('[data-element="editor-container"]').scrollTo({
                                top: target.getBoundingClientRect().top - document.body.getBoundingClientRect().top - 20,
                                behavior: 'smooth'
                            });
                        });

                        list.appendChild(item);
                    }

                    list.firstElementChild.classList.add('active');

                    appContent.insertBefore(list, appContent.firstElementChild);
                };

                const clearNav = () => {
                    appContent.removeChild(document.querySelector('.pure-anchors'));
                };

                window.addEventListener('keydown', function (e) {
                    if (e.altKey && e.keyCode === 78 && !animating) {
                        animating = true;

                        if (!active) {

                            document.body.classList.toggle('pure-mode');
                            buildNav();

                            $timeout(() => {
                                document.body.classList.toggle('pure-mode--1');
                            }, 10);

                            $timeout(() => {
                                document.body.classList.toggle('pure-mode--2');
                            }, 1010);

                        } else {
                            document.body.classList.toggle('pure-mode--2');

                            $timeout(() => {
                                document.body.classList.toggle('pure-mode--1');
                            }, 1000);

                            $timeout(() => {
                                document.body.classList.toggle('pure-mode');
                                clearNav();

                            }, 2010);
                        }

                        $timeout(() => { 
                            animating = false;
                        }, 1010);

                        active = !active;
                    }
                });
            }
        };

        return directive;
    }

    angular.module('umbraco.directives').directive('section', ['$timeout', hook]);

}());