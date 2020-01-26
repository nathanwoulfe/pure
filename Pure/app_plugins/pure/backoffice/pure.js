(() => {

    angular.module('pure.directives', []);

    angular.module('pure', [
        'pure.directives'
    ]);

    angular.module('umbraco').requires.push('pure');

})();

(() => {
    function pure($rootScope, $timeout, editorState) {
        const directive = {
            link: (scope, element) => {
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

                /** */
                const clearNav = () => {
                    for (let p of panels) {
                        observer.unobserve(p.querySelector('.umb-group-panel__header'));
                    }

                    appContent.removeChild(document.querySelector('.pure-anchors'));
                };

                /** */
                const deselectNav = () => document.querySelector('.pure-anchor.active').classList.remove(activeClass);

                /**
                 * 
                 * @param {number} level
                 */
                const step = level => document.body.classList.toggle('pure-mode' + (level ? '--' + level : ''));

                /** Deactivate Pure */
                const close = () => {
                    step(2);

                    $timeout(() => step(1), duration);

                    $timeout(() => {
                        step(0);
                        clearNav();
                    }, duration * 2 + offset);
                };

                /** Activate Pure */
                const open = () => {
                    step(0);
                    buildNav();

                    $timeout(() => step(1), offset);
                    $timeout(() => step(2), duration + offset);
                };

                /**
                 * 
                 * @param {any} entries
                 */
                const changeNav = entries => {
                    for (let entry of entries) {

                        const anchor = entry.target.parentNode.dataset.appAnchor;
                        const elm = document.querySelector(`[data-pure-target="${anchor}"]`);

                        if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
                            elm.classList.add('is-visible');
                            previousPanel = anchor;
                        } else {
                            elm.classList.remove('is-visible');
                        }

                        highlightActive();
                    }
                };

                /** */
                const observer = new IntersectionObserver(changeNav, {
                    threshold: threshold,
                    rootMargin: '0px'
                });

                /** */
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

                /** */
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

                const togglePureState = () => {
                    const activeVariant = editorState.current.variants.find(x => x.active);
                    if (!activeVariant || activeVariant.apps.find(x => x.active).alias !== 'umbContent')
                        return;

                    animating = true;
                    panels = document.querySelectorAll('[data-app-anchor]');

                    for (let p of panels) {
                        p.setAttribute('id', p.dataset.appAnchor);
                        observer.observe(p.querySelector('.umb-group-panel__header'));
                    }

                    container = document.querySelector('[data-element="editor-container"]');

                    !active ? open() : close();

                    $timeout(() => animating = false, duration + offset);

                    active = !active;
                };

                /** */
                document.addEventListener('keydown', e => {
                    if (e.shiftKey && e.keyCode === 80 && !animating) {
                        togglePureState();
                    }
                });

                /** */
                document.addEventListener('mouseup', e => {
                    if (active && (e.button === 3 || e.button === 4)) {
                        close();

                        $timeout(() => animating = false, duration + offset);
                        active = !active;
                    }
                });

                const injectButton = () => {
                    if (editorState.current && !editorState.current.isContainer) {

                        // inject the button into the footer
                        const contentForm = angular.element(element.closest('[name="contentForm"]'));
                        const footerRight = angular.element(contentForm.find('.umb-editor-footer-content__right-side'));

                        let button = document.createElement('button');
                        button.type = 'button';
                        button.className = 'btn btn-action pure-button';
                        button.title = 'Toggle Pure mode | Shift + P';
                        button.innerHTML = '<i class="icon-eco"></i>';

                        button.addEventListener('click', () => togglePureState());

                        footerRight.prepend(button);
                    }
                };

                $rootScope.$on('$changeTitle', () => injectButton());
            }
        };

        return directive;
    }

    angular.module('pure.directives').directive('umbVariantContentEditors', ['$rootScope', '$timeout', 'editorState', pure]);
})();