// ==UserScript==
// @name         FarmRPG Auto Fishing
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Very fast Auto Fishing for FarmRPG. He buys worms and sells fish himself. You need to open two pages with Farm Pond and Farmer's Market.
// @author       methamphetaminelab
// @match        https://farmrpg.com/*
// @grant        none
// @require      https://greasyfork.org/scripts/469666-farmrpg-helper/code/FarmRPG%20Helper.user.js
// ==/UserScript==

(function() {
    'use strict';

    let intervalIdCheckWorms;
    let intervalIdClickFish;
    let intervalIdReloadPage;
    let intervalIdRepeatActions;

    const wormsCheckInterval = 10;
    const pageReloadInterval = 30 * 1000;
    let wormsRemaining;

    function isElementPresent(selector) {
        return document.querySelector(selector) !== null;
    }

    function checkWorms() {
        if (!isElementPresent('.center.sliding')) {
            console.log('Element "Farm Pond" is not present. Stopping script.');
            clearIntervalAll();
            startRepeatActions();
            return;
        }

        var wormsElement = document.querySelector('.col-45');

        if (wormsElement) {
            const strongElement = wormsElement.querySelector('strong');
            const wormsText = strongElement ? strongElement.textContent.trim().replace(/[^\d]/g, '') : '';

            wormsRemaining = parseInt(wormsText);

            if (!isNaN(wormsRemaining) && wormsRemaining > 0) {
                console.log('Worms remaining:', wormsRemaining);
            } else {
                console.log('No more worms. Buying 200 worms.');
                buyWorms();
            }
        } else {
            console.log('Could not find worms element. Stopping script.');
            clearIntervalAll();
            startRepeatActions();
        }
    }

    function clickFishElements() {
        const fishElements = document.querySelectorAll('[class*="fish f"]');

        fishElements.forEach(element => {
            element.click();
        });

        const specificDiv = document.querySelector('.fishcaught.finalcatch2c[data-speed="2"][data-id="2"]');

        if (specificDiv) {
            specificDiv.click();
        }

        setTimeout(() => {
            checkWorms();
        }, 1000);
    }

    function buyWorms() {
        const allButtons = document.querySelectorAll('button');

        allButtons.forEach(button => {
            if (button.textContent.includes('BUY 200 WORMS')) {
                console.log('Buying 200 worms...');
                button.click();
            }
        });
    }

    function reloadPage() {
        console.log('Reloading page...');
        location.reload(true);
    }

    function clearIntervalAll() {
        clearInterval(intervalIdCheckWorms);
        clearInterval(intervalIdClickFish);
        clearInterval(intervalIdReloadPage);
        clearInterval(intervalIdRepeatActions);
    }

    function startRepeatActions() {
        intervalIdRepeatActions = setInterval(repeatActions, 1000);
    }

    function repeatActions() {
        const sellAllButton = document.querySelector('.button.btnorange.sellallbtn');
        if (sellAllButton) {
            console.log('Clicking "Sell Unlocked" button...');
            sellAllButton.click();

            setTimeout(() => {
                const actionsModalButton = document.querySelector('.actions-modal-button');
                if (actionsModalButton) {
                    console.log('Clicking "Yes" button...');
                    actionsModalButton.click();

                    setTimeout(() => {
                        const modalButton = document.querySelector('.modal-button.modal-button-bold');
                        if (modalButton) {
                            console.log('Clicking "OK" button...');
                            modalButton.click();
                        }
                    }, 500);
                }
            }, 500);
        } else {
            console.log('Sell Unlocked not found.');
        }
    }

    if (isElementPresent('.center.sliding')) {
        intervalIdCheckWorms = setInterval(checkWorms, wormsCheckInterval);

        intervalIdClickFish = setInterval(clickFishElements, 10);

        intervalIdReloadPage = setInterval(reloadPage, pageReloadInterval);
    } else {
        console.log('Element "Farm Pond" is not present. Stopping script.');
        startRepeatActions();
    }
})();
