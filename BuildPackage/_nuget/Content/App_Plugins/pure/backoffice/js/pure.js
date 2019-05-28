(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

/*! stately - v0.1.0-build100 - 2019-05-29
 * Copyright (c) 2019 Nathan Woulfe;
 * Licensed MIT
 */

(function () {

    function hook($timeout) {

        var directive = {
            restrict: 'E',
            link: function link() {

                var active = false;
                var animating = false;
                var appContent = document.querySelector('.umb-app-content');

                var buildNav = function buildNav() {

                    var list = document.createElement('ul');
                    list.className = 'pure-anchors unstyled';
                    var panels = document.querySelectorAll('[data-app-anchor]');

                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                        for (var _iterator = panels[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            var p = _step.value;

                            var item = document.createElement('li');

                            item.className = 'pure-anchor';
                            item.setAttribute('data-pure-target', p.dataset.appAnchor);
                            item.innerText = p.querySelector('.umb-group-panel__header').innerText;

                            item.addEventListener('click', function (e) {

                                var anchors = document.querySelectorAll('.pure-anchor');
                                var _iteratorNormalCompletion2 = true;
                                var _didIteratorError2 = false;
                                var _iteratorError2 = undefined;

                                try {
                                    for (var _iterator2 = anchors[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                        var a = _step2.value;

                                        a.classList.remove('active');
                                    }
                                } catch (err) {
                                    _didIteratorError2 = true;
                                    _iteratorError2 = err;
                                } finally {
                                    try {
                                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                            _iterator2.return();
                                        }
                                    } finally {
                                        if (_didIteratorError2) {
                                            throw _iteratorError2;
                                        }
                                    }
                                }

                                e.target.classList.add('active');

                                var target = document.querySelector('[data-app-anchor="' + e.target.dataset.pureTarget + '"]');

                                document.querySelector('[data-element="editor-container"]').scrollTo({
                                    top: target.getBoundingClientRect().top - document.body.getBoundingClientRect().top - 20,
                                    behavior: 'smooth'
                                });
                            });

                            list.appendChild(item);
                        }
                    } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion && _iterator.return) {
                                _iterator.return();
                            }
                        } finally {
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                    }

                    list.firstElementChild.classList.add('active');

                    appContent.insertBefore(list, appContent.firstElementChild);
                };

                var clearNav = function clearNav() {
                    appContent.removeChild(document.querySelector('.pure-anchors'));
                };

                window.addEventListener('keydown', function (e) {
                    if (e.altKey && e.keyCode === 78 && !animating) {
                        animating = true;

                        if (!active) {

                            document.body.classList.toggle('pure-mode');
                            buildNav();

                            $timeout(function () {
                                document.body.classList.toggle('pure-mode--1');
                            }, 10);

                            $timeout(function () {
                                document.body.classList.toggle('pure-mode--2');
                            }, 1010);
                        } else {
                            document.body.classList.toggle('pure-mode--2');

                            $timeout(function () {
                                document.body.classList.toggle('pure-mode--1');
                            }, 1000);

                            $timeout(function () {
                                document.body.classList.toggle('pure-mode');
                                clearNav();
                            }, 2010);
                        }

                        $timeout(function () {
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
})();

},{}]},{},[1]);
